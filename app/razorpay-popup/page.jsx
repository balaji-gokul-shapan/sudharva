"use client";

import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Script from "next/script";
import { useSearchParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { confirmPaymentOrder } from "@/store/slices/payment/paymentOrderConfirmationSlice";
import { createPaymentOrder } from "@/store/slices/payment/createPaymentOrderSlice";
import { getMasterData } from "@/store/slices/masters/getMasterSlice";
import {
  selectCreateRegistrationData,
  selectCreateRegistrationRequestPayload,
} from "@/store/slices/registration/createRegistrationSlice";
import ReceiptPrinter from "@/components/animation/receipt-printer";

const baseFieldStyle = {
  width: "100%",
  padding: "8px 10px",
  border: "1px solid #ccc",
  borderRadius: 6,
  fontSize: 14,
  boxSizing: "border-box",
};

const buttonStyle = {
  marginTop: 16,
  background: "#3399cc",
  color: "#fff",
  border: "none",
  padding: "10px 18px",
  borderRadius: 8,
  fontWeight: 700,
  cursor: "pointer",
  fontSize: 14,
};

const statusBase = {
  marginTop: 20,
  padding: 12,
  borderRadius: 8,
};

const statusStyles = {
  success: {
    ...statusBase,
    background: "#e5ffe5",
    border: "1px solid #99dd99",
  },
  error: {
    ...statusBase,
    background: "#ffe5e5",
    border: "1px solid #ffaaaa",
  },
  dismiss: {
    ...statusBase,
    background: "#fff6e0",
    border: "1px solid #f0c36d",
  },
};

const normalizeRazorpayContact = (value) => {
  const digits = String(value || "").replace(/\D/g, "");
  if (!digits) return "";

  // Razorpay checkout works best with a 10-digit local mobile number.
  if (digits.length === 10) return digits;
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(-10);
  if (digits.length > 10) return digits.slice(-10);

  return "";
};

function RazorpayPopupContent() {
  const params = useSearchParams();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const registrationDataFromStore = useAppSelector(selectCreateRegistrationData);
  const registrationRequestPayloadFromStore = useAppSelector(
    selectCreateRegistrationRequestPayload,
  );
  const masterData = useAppSelector((state) => state.master.data);
  const registrationData = registrationDataFromStore || null;
  const orderFetchAttemptedRef = useRef(false);
  const receiptExportRef = useRef(null);
  
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const hasAutoOpenedRef = useRef(false);
  const autoMode = params.get("auto") !== "0";
  const [isPaymentInitiated, setIsPaymentInitiated] = useState(false);
  const [isOrderLoading, setIsOrderLoading] = useState(false);
  const registrationReference =
    registrationData?.participant_reference ||
    registrationData?.participantReference ||
    registrationData?.reference ||
    registrationData?.id ||
    "";
  const referenceFromParams = params.get("reference") || "";
  const effectiveReference = referenceFromParams || registrationReference;
  const paymentCompletionKey = effectiveReference
    ? `payment.completed.${effectiveReference}`
    : "";
  const payableFromParams = Number(params.get("payable") || 0) || 0;
  const isPaymentAlreadyCompleted = useMemo(() => {
    if (typeof window === "undefined") return false;
    if (!paymentCompletionKey) return false;
    return Boolean(window.localStorage.getItem(paymentCompletionKey));
  }, [paymentCompletionKey]);

  useEffect(() => {
    if (masterData) return;
    dispatch(getMasterData());
  }, [dispatch, masterData]);
    
  const { data: paymentOrder = null } = useQuery({
    queryKey: ["payment-order", "popup"],
    queryFn: async () => {
      return (
        queryClient.getQueryData(["payment-order"]) ??
        queryClient.getQueryData([
          "payment-order",
          effectiveReference || "",
        ]) ??
        null
      );
    },
    staleTime: Infinity,
  });
  const keyFromStore =
    paymentOrder?.rzpKey ||
    paymentOrder?.key ||
    paymentOrder?.key_id ||
    paymentOrder?.razorpay_key ||
    "";
  const orderIdFromStore =
    paymentOrder?.order_id || paymentOrder?.orderId || paymentOrder?.id || "";
  const registrationAmountRupees =
    Number(
      registrationData?.payable_amount ||
        registrationData?.amount_payable ||
        registrationData?.amount ||
        0,
    ) || 0;
  const amountFromStore =
    paymentOrder?.amount ||
    paymentOrder?.amount_paise ||
    (registrationAmountRupees > 0 ? Math.round(registrationAmountRupees * 100) : "");

  const [rzpKey, setRzpKey] = useState(
    () => params.get("key") || String(keyFromStore || ""),
  );
  const [orderId, setOrderId] = useState(
    () => params.get("orderId") || String(orderIdFromStore || ""),
  );
  const [amountPaise, setAmountPaise] = useState(
    () => params.get("amount") || String(amountFromStore || ""),
  );

  const [status, setStatus] = useState({ type: "", message: "" });
  const [result, setResult] = useState({
    razorpay_order_id: "",
    razorpay_payment_id: "",
    razorpay_signature: "",
  });

  const hasResult = Boolean(
    result.razorpay_order_id ||
      result.razorpay_payment_id ||
      result.razorpay_signature,
  );
  const hasRequiredCheckoutData =
    Boolean(rzpKey.trim()) &&
    Boolean(orderId.trim()) &&
    Boolean(amountPaise.trim());
  const shouldHideHelper =
    autoMode && hasRequiredCheckoutData && !status.message && !hasResult;
  const isPreparingCheckout =
    !hasResult &&
    (isOrderLoading ||
      (autoMode && hasRequiredCheckoutData && !sdkLoaded));
  const receiptAmountRupees = Math.max(
    0,
    Number(amountPaise || 0) / 100,
  );

  const participantName =
    registrationData?.full_name ||
    registrationRequestPayloadFromStore?.full_name ||
    registrationRequestPayloadFromStore?.contactName ||
    [registrationData?.first_name, registrationData?.last_name]
      .filter(Boolean)
      .join(" ") ||
    [
      registrationRequestPayloadFromStore?.first_name,
      registrationRequestPayloadFromStore?.last_name,
    ]
      .filter(Boolean)
      .join(" ") ||
    registrationData?.name ||
    "";
  const participantPhone =
    registrationData?.mobile_number ||
    registrationRequestPayloadFromStore?.mobile_number ||
    registrationRequestPayloadFromStore?.companyPhone ||
    registrationRequestPayloadFromStore?.contact ||
    registrationData?.phone_number ||
    registrationData?.phone ||
    registrationData?.contact ||
    "";
  const participantEmail =
    registrationData?.email ||
    registrationRequestPayloadFromStore?.email ||
    registrationData?.contact_email ||
    registrationRequestPayloadFromStore?.contact_email ||
    "";
  const participantContactForPrefill = normalizeRazorpayContact(
    participantPhone,
  );
  const categorySourceValue =
    registrationData?.runner_category_id ||
    registrationRequestPayloadFromStore?.runner_category_id ||
    registrationData?.category ||
    registrationData?.category_name ||
    registrationData?.registration_category ||
    "";
  const registrationCategories = masterData?.registration_category ?? [];
  const matchedCategory = registrationCategories.find(
    (item) =>
      String(item?.id) === String(categorySourceValue) ||
      String(item?.value) === String(categorySourceValue),
  );
  const participantCategory =
    matchedCategory?.label ||
    matchedCategory?.name ||
    String(categorySourceValue || "");

  const userRedirectPath = useMemo(() => {
    const userId =
      params.get("userId") ||
      registrationData?.user_id ||
      registrationData?.userId ||
      registrationData?.runner?.id ||
      "";

    return userId ? `/users/${userId}` : "/";
  }, [params, registrationData]);

  
  const receiptItems = useMemo(
    () => [
      {
        name: "Marathon Registration",
        quantity: 1,
        price: receiptAmountRupees,
        category: participantCategory,
      },
    ],
    [participantCategory, receiptAmountRupees],
  );
  
  const containerStyle = useMemo(
    () => ({
      fontFamily: "-apple-system, Segoe UI, Roboto, sans-serif",
      maxWidth: 560,
      margin: "40px auto",
      padding: "0 16px",
      color: "#222",
    }),
    [],
  );

  const mutedStyle = useMemo(() => ({ color: "#666", fontSize: 13 }), []);

  const labelStyle = useMemo(
    () => ({
      display: "block",
      fontSize: 13,
      fontWeight: 600,
      margin: "12px 0 4px",
      color: "#444",
    }),
    [],
  );

  const resultWrapStyle = useMemo(
    () => ({
      marginTop: 20,
      border: "1px solid #eee",
      borderRadius: 10,
      padding: 16,
    }),
    [],
  );

  const rowStyle = useMemo(() => ({ display: "flex", gap: 8 }), []);

  const readonlyStyle = useMemo(
    () => ({
      ...baseFieldStyle,
      background: "#f2f2f2",
      fontFamily: "Consolas, monospace",
      fontSize: 12,
    }),
    [],
  );

  const copyButtonStyle = useMemo(
    () => ({
      ...buttonStyle,
      marginTop: 0,
      padding: "8px 12px",
      whiteSpace: "nowrap",
    }),
    [],
  );

  const actionWrapStyle = useMemo(
    () => ({
      marginTop: 14,
      display: "grid",
      gap: 10,
      gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
      width: "100%",
    }),
    [],
  );

  const actionButtonStyle = useMemo(
    () => ({
      ...buttonStyle,
      marginTop: 0,
      width: "100%",
      minHeight: 44,
      padding: "10px 12px",
      textAlign: "center",
    }),
    [],
  );

  const show = (type, message) => {
    setStatus({ type, message });
  };

  useEffect(() => {
    if (hasRequiredCheckoutData) return;
    if (!effectiveReference) return;
    if (orderFetchAttemptedRef.current) return;

    orderFetchAttemptedRef.current = true;

    const fetchOrder = async () => {
      setIsOrderLoading(true);
      try {
        const response = await dispatch(
          createPaymentOrder({
            participant_reference: effectiveReference,
            ...(payableFromParams > 0
              ? { payable_amount: payableFromParams }
              : {}),
          }),
        ).unwrap();

        const latestOrder =
          response?.order || response?.data || response?.result || response || {};
        const latestKey =
          latestOrder?.rzpKey ||
          latestOrder?.key ||
          latestOrder?.key_id ||
          latestOrder?.razorpay_key ||
          "";
        const latestOrderId =
          latestOrder?.order_id || latestOrder?.orderId || latestOrder?.id || "";
        const latestAmount =
          latestOrder?.amount ||
          latestOrder?.amount_paise ||
          (payableFromParams > 0 ? Math.round(payableFromParams * 100) : "");

        if (latestKey) setRzpKey(String(latestKey));
        if (latestOrderId) setOrderId(String(latestOrderId));
        if (latestAmount) setAmountPaise(String(latestAmount));
      } catch (error) {
        show(
          "error",
          typeof error === "string"
            ? error
            : error?.message ||
                "Unable to fetch payment details. Please retry from registration.",
        );
      } finally {
        setIsOrderLoading(false);
      }
    };

    fetchOrder();
  }, [
    dispatch,
    effectiveReference,
    hasRequiredCheckoutData,
    payableFromParams,
  ]);

  const copyField = useCallback(async (value) => {
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);
      show("success", "Copied to clipboard.");
    } catch {
      show("error", "Unable to copy automatically. Please copy manually.");
    }
  }, []);

  const receiptPayload = useMemo(
    () => ({
      merchant: "Sudharva Marathon",
      status: "Payment Confirmed",
      participant_name: participantName || "",
      participant_phone: participantPhone || "",
      participant_category: participantCategory || "",
      amount_inr: Number(receiptAmountRupees || 0),
      razorpay_order_id: result.razorpay_order_id || "",
      razorpay_payment_id: result.razorpay_payment_id || "",
      razorpay_signature: result.razorpay_signature || "",
      paid_at: new Date().toLocaleString("en-IN"),
    }),
    [
      participantCategory,
      participantName,
      participantPhone,
      receiptAmountRupees,
      result.razorpay_order_id,
      result.razorpay_payment_id,
      result.razorpay_signature,
    ],
  );

  const receiptText = useMemo(
    () => JSON.stringify(receiptPayload, null, 2),
    [receiptPayload],
  );

  const handleDownloadReceipt = useCallback(async () => {
    try {
      if (!receiptExportRef.current) {
        show("error", "Receipt preview is not ready yet. Please try again.");
        return;
      }

      const htmlToImageModule = await import("html-to-image");
      const dataUrl = await htmlToImageModule.toPng(receiptExportRef.current, {
        backgroundColor: "#ffffff",
        pixelRatio: 2,
        cacheBust: true,
      });

      const anchor = document.createElement("a");
      anchor.href = dataUrl;
      anchor.download = `sudharva-receipt-${
        result.razorpay_order_id || "payment"
      }.png`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      show("success", "Receipt downloaded as PNG.");
    } catch {
      show("error", "Unable to download receipt PNG. Please try again.");
    }
  }, [result.razorpay_order_id]);

  const handleShareReceipt = useCallback(async () => {
    const shareText = `Sudharva Marathon Payment Receipt\nOrder: ${
      result.razorpay_order_id || "NA"
    }\nPayment: ${result.razorpay_payment_id || "NA"}\nAmount: INR ${Number(
      receiptAmountRupees || 0,
    ).toFixed(2)}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Sudharva Marathon Receipt",
          text: shareText,
        });
        show("success", "Receipt shared successfully.");
        return;
      }

      await copyField(receiptText);
      show("success", "Share is not supported. Receipt copied instead.");
    } catch {
      show("error", "Unable to share receipt right now.");
    }
  }, [copyField, receiptAmountRupees, receiptText, result.razorpay_order_id, result.razorpay_payment_id]);

  const handleCloseWindow = useCallback(() => {
    // Browsers may block closing if the tab was not script-opened.
    window.close();

    // If close is blocked, return user to registration route.
    window.setTimeout(() => {
      if (!window.closed) {
        window.location.replace("/register");
      }
    }, 120);
  }, []);

  const handleGoToLogin = useCallback(() => {
    try {
      if (window.opener && !window.opener.closed) {
        window.opener.location.href = "/login";
      }
    } catch {
      // Ignore cross-window access issues and fallback to current window navigation.
    }

    window.location.replace("/login");
  }, []);

  const openPaymentPopup = useCallback(() => {
    if (isPaymentAlreadyCompleted) {
      show(
        "success",
        "Payment is already completed for this registration. No need to open checkout again.",
      );
      return;
    }

    const key = rzpKey.trim();
    const id = orderId.trim();
    const amount = amountPaise.trim();

    if (!sdkLoaded || !window.Razorpay) {
      show(
        "error",
        "Secure payment is still loading. Please wait a moment and try again.",
      );
      return;
    }

    if (!key || !id || !amount) {
      show(
        "error",
        "Payment details are incomplete. Refresh this page and try again.",
      );
      return;
    }

    const options = {
      key,
      amount: Number(amount),
      currency: "INR",
      order_id: id,
      name: "Sudharva Marathon",
      description: "Registration Payment",
      handler: async function (response) {
        setResult({
          razorpay_order_id: response.razorpay_order_id || "",
          razorpay_payment_id: response.razorpay_payment_id || "",
          razorpay_signature: response.razorpay_signature || "",
        });

        try {
          await dispatch(
            confirmPaymentOrder({
              razorpay_order_id: response.razorpay_order_id || "",
              razorpay_payment_id: response.razorpay_payment_id || "",
              razorpay_signature: response.razorpay_signature || "",
            }),
          ).unwrap();

          if (typeof window !== "undefined" && paymentCompletionKey) {
            window.localStorage.setItem(
              paymentCompletionKey,
              JSON.stringify({
                paid: true,
                payment_id: response.razorpay_payment_id || "",
                order_id: response.razorpay_order_id || "",
                at: Date.now(),
              }),
            );
          }

          show("success", "Payment verified and completed successfully.");
          setIsPaymentInitiated(true);
        } catch (error) {
          show(
            "error",
            `Payment done, but verification failed: ${String(
              error || "unknown error",
            )}`,
          );
        }

      },
      modal: {
        escape: false,
        confirm_close: true,
        ondismiss: function () {
          show(
            "dismiss",
            "Payment window closed before completion. You can retry payment now.",
          );
        },
      },
      prefill: {
        name: String(participantName || "").trim(),
        email: String(participantEmail || "").trim(),
        contact: participantContactForPrefill,
      },
      readonly: {
        contact: Boolean(participantContactForPrefill),
        email: Boolean(String(participantEmail || "").trim()),
      },
      theme: { color: "#3399cc" },
    };

    const rzp = new window.Razorpay(options);

    rzp.on("payment.failed", function (response) {
      show(
        "error",
        "Payment was not completed: " +
          (response.error?.description || "unknown") +
          " [" +
          (response.error?.code || "") +
          " / " +
          (response.error?.reason || "") +
          "]",
      );
    });

    rzp.open();
  }, [
    amountPaise,
    dispatch,
    isPaymentAlreadyCompleted,
    orderId,
    paymentCompletionKey,
    participantContactForPrefill,
    participantEmail,
    participantName,
    rzpKey,
    sdkLoaded,
  ]);

  useEffect(() => {
    const key = rzpKey.trim();
    const id = orderId.trim();
    const amount = amountPaise.trim();

    if (hasAutoOpenedRef.current) return;
    if (isPaymentAlreadyCompleted) return;
    if (!sdkLoaded) return;
    if (!key || !id || !amount) return;

    hasAutoOpenedRef.current = true;
    const timerId = window.setTimeout(() => {
      openPaymentPopup();
    }, 0);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [
    amountPaise,
    isPaymentAlreadyCompleted,
    openPaymentPopup,
    orderId,
    rzpKey,
    sdkLoaded,
  ]);

  if (shouldHideHelper) {
    return (
      <>
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="afterInteractive"
          onLoad={() => setSdkLoaded(true)}
        />
        <main aria-hidden="true" style={{ minHeight: "100vh" }} />
      </>
    );
  }

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
        onLoad={() => setSdkLoaded(true)}
      />

      <main style={containerStyle}>
        {isPreparingCheckout ? (
          <section
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: 12,
              padding: 16,
              background: "#ffffff",
            }}
          >
            <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
              Preparing secure checkout
            </h1>
            <p style={{ ...mutedStyle, marginTop: 8 }}>
              Please wait while we load your payment details.
            </p>
          </section>
        ) : null}

        {!hasResult ? (
          <section
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: 12,
              padding: 16,
              background: "#ffffff",
              display: isPreparingCheckout ? "none" : "block",
            }}
          >
            <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
              Razorpay Checkout
            </h1>
            <p style={{ ...mutedStyle, marginTop: 8 }}>
              {isPaymentAlreadyCompleted
                ? "Payment already completed for this registration. You can close this window."
                : hasRequiredCheckoutData
                ? "Opening checkout automatically. If it does not open, use the button below."
                : "Unable to auto-open checkout. Required payment details are missing (key/order/amount)."}
            </p>

            <button
              type="button"
              onClick={openPaymentPopup}
              style={{
                ...buttonStyle,
                marginTop: 12,
                opacity:
                  hasRequiredCheckoutData && !isPaymentAlreadyCompleted ? 1 : 0.6,
                cursor:
                  hasRequiredCheckoutData && !isPaymentAlreadyCompleted
                    ? "pointer"
                    : "not-allowed",
              }}
              disabled={!hasRequiredCheckoutData || isPaymentAlreadyCompleted}
            >
              Open Payment Popup
            </button>

            {status.message ? (
              <div style={statusStyles[status.type] || statusStyles.error}>
                {status.message}
              </div>
            ) : null}
          </section>
        ) : null}

        {/* <h1 style={{ fontSize: 20 }}>Razorpay Popup Helper</h1>
        <p style={mutedStyle}>
          Key, Order ID and Amount are auto-filled when available. Verify before
          opening checkout.
        </p>

        <label style={labelStyle}>Razorpay Key</label>
        <input
          value={rzpKey}
          onChange={(event) => setRzpKey(event.target.value)}
          placeholder="rzp_test_..."
          style={baseFieldStyle}
        />

        <label style={labelStyle}>Order ID</label>
        <input
          value={orderId}
          onChange={(event) => setOrderId(event.target.value)}
          placeholder="order_..."
          style={baseFieldStyle}
        />

        <label style={labelStyle}>Amount in Paise (must equal order amount)</label>
        <input
          value={amountPaise}
          onChange={(event) => setAmountPaise(event.target.value)}
          placeholder="8250"
          type="number"
          style={baseFieldStyle}
        />

        <button type="button" onClick={openPaymentPopup} style={buttonStyle}>
          Open Payment Popup
        </button>

        {status.message ? (
          <div style={statusStyles[status.type] || statusStyles.error}>
            {status.message}
          </div>
        ) : null} */}

        {/* {hasResult ? (
          <section style={resultWrapStyle}>
            <strong>Razorpay Payment Response</strong>

            <div>
              <label style={labelStyle}>razorpay_order_id</label>
              <div style={rowStyle}>
                <input
                  readOnly
                  value={result.razorpay_order_id}
                  style={readonlyStyle}
                />
                <button
                  type="button"
                  onClick={() => copyField(result.razorpay_order_id)}
                  style={copyButtonStyle}
                >
                  Copy
                </button>
              </div>
            </div>

            <div>
              <label style={labelStyle}>razorpay_payment_id</label>
              <div style={rowStyle}>
                <input
                  readOnly
                  value={result.razorpay_payment_id}
                  style={readonlyStyle}
                />
                <button
                  type="button"
                  onClick={() => copyField(result.razorpay_payment_id)}
                  style={copyButtonStyle}
                >
                  Copy
                </button>
              </div>
            </div>

            <div>
              <label style={labelStyle}>razorpay_signature</label>
              <div style={rowStyle}>
                <input
                  readOnly
                  value={result.razorpay_signature}
                  style={readonlyStyle}
                />
                <button
                  type="button"
                  onClick={() => copyField(result.razorpay_signature)}
                  style={copyButtonStyle}
                >
                  Copy
                </button>
              </div>
            </div>
          </section>
        ) : null} */}
        {isPaymentInitiated && hasResult && (
          <section
            style={{
              marginTop: 8,
              borderRadius: 20,
              overflow: "hidden",
              border: "1px solid #d7f0dd",
              background:
                "radial-gradient(120% 120% at 0% 0%, #ecfff1 0%, #f7fffa 45%, #ffffff 100%)",
              boxShadow: "0 24px 60px -28px rgba(34, 139, 82, 0.35)",
            }}
          >
            <div
              style={{
                padding: "18px 18px 16px",
                borderBottom: "1px dashed #b9e6c6",
                background:
                  "linear-gradient(120deg, rgba(46,174,96,0.15), rgba(122,225,164,0.06))",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#1f8b4e",
                }}
              >
                Payment Confirmed
              </p>
              <h2
                style={{
                  margin: "6px 0 0",
                  fontSize: 24,
                  lineHeight: 1.2,
                  color: "#135b32",
                }}
              >
                You are officially race-ready.
              </h2>
              <p style={{ margin: "8px 0 0", fontSize: 13, color: "#3f5f4c" }}>
                Your Razorpay payment was completed and verified successfully.
              </p>
            </div>

            <div style={{ padding: 16 }}>
              <div ref={receiptExportRef} style={resultWrapStyle}>
                <ReceiptPrinter
                  merchant="Sudharva Marathon"
                  order={result.razorpay_order_id || "#CONFIRMED"}
                  date={new Date().toLocaleString("en-IN")}
                  items={receiptItems}
                  tax={0}
                  currency="INR "
                  participantName={participantName}
                  participantPhone={participantPhone}
                  participantCategory={participantCategory}
                  autoPrint={true}
                  className="mx-auto"
                />

                {/* <div style={{ marginTop: 12 }}>
                  <label style={labelStyle}>razorpay_payment_id</label>
                  <div style={rowStyle}>
                    <input
                      readOnly
                      value={result.razorpay_payment_id}
                      style={readonlyStyle}
                    />
                    <button
                      type="button"
                      onClick={() => copyField(result.razorpay_payment_id)}
                      style={copyButtonStyle}
                    >
                      Copy
                    </button>
                  </div>
                </div> */}

                {/* <div>
                  <label style={labelStyle}>razorpay_signature</label>
                  <div style={rowStyle}>
                    <input
                      readOnly
                      value={result.razorpay_signature}
                      style={readonlyStyle}
                    />
                    <button
                      type="button"
                      onClick={() => copyField(result.razorpay_signature)}
                      style={copyButtonStyle}
                    >
                      Copy
                    </button>
                  </div>
                </div> */}
              </div>

              <div style={actionWrapStyle}>
                <button
                  type="button"
                  onClick={handleGoToLogin}
                  style={{
                    ...actionButtonStyle,
                    background: "#14532d",
                  }}
                >
                  Go to Login
                </button>
                <button
                  type="button"
                  onClick={handleCloseWindow}
                  style={{
                    ...actionButtonStyle,
                    background: "#1f8b4e",
                  }}
                >
                  Close Window
                </button>
                <button
                  type="button"
                  onClick={handleShareReceipt}
                  style={{
                    ...actionButtonStyle,
                    background: "#6b21a8",
                  }}
                >
                  Share Receipt
                </button>
                <button
                  type="button"
                  onClick={handleDownloadReceipt}
                  style={{
                    ...actionButtonStyle,
                    background: "#0f766e",
                  }}
                >
                  Download Receipt
                </button>
                <button
                  type="button"
                  onClick={() =>
                    copyField(receiptText)
                  }
                  style={{
                    ...actionButtonStyle,
                    background: "#2f5ea8",
                  }}
                >
                  Copy Full Receipt
                </button>
              </div>
            </div>
          </section>
        )}
      </main>
    </>
  );
}

export default function RazorpayPopupPage() {
  return (
    <Suspense
      fallback={<main aria-busy="true" style={{ minHeight: "100vh" }} />}
    >
      <RazorpayPopupContent />
    </Suspense>
  );
}
