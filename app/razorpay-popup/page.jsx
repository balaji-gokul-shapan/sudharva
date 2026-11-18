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
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  confirmPaymentOrder as confirmPaymentOrderAction,
  selectPaymentConfirmationResponse,
  selectPaymentOrderConfirmation,
} from "@/store/slices/payment/paymentOrderConfirmationSlice";
import {
  createPaymentOrder,
  selectCreatePaymentOrder,
  selectCreatePaymentOrderLoading,
  selectRazorpayOrderConfig,
} from "@/store/slices/payment/createPaymentOrderSlice";
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

const toRupees = (...values) => {
  for (const value of values) {
    if (value === undefined || value === null || value === "") continue;
    const parsed = Number(String(value).replace(/[^0-9.-]/g, ""));
    if (Number.isFinite(parsed) && parsed >= 0) return parsed;
  }
  return 0;
};

function RazorpayPopupContent() {
  const params = useSearchParams();
  const dispatch = useAppDispatch();
  const registrationDataFromStore = useAppSelector(
    selectCreateRegistrationData,
  );
  const registrationRequestPayloadFromStore = useAppSelector(
    selectCreateRegistrationRequestPayload,
  );
  const paymentConfirmation = useAppSelector(selectPaymentConfirmationResponse);
  // console.log(paymentConfirmation, "paymentConfirmation");
  const paymentOrderConfirmation = useAppSelector(
    selectPaymentOrderConfirmation,
  );
  // console.log(paymentOrderConfirmation, "paymentOrderConfirmation");

  const authAccessToken = useAppSelector(
    (state) => state.userRefreshToken?.accessToken || "",
  );
  const isLoggedIn = Boolean(
    authAccessToken ||
      (typeof window !== "undefined" &&
        window.localStorage.getItem("auth.accessToken")),
  );

  const masterData = useAppSelector((state) => state.master.data);
  const registrationData = registrationDataFromStore || null;
  const orderFetchAttemptedRef = useRef(false);
  const receiptExportRef = useRef(null);
  const {
    key: reduxRzpKey,
    orderId: reduxOrderId,
    amountPaise: reduxAmount,
    totalAmountPaise: reduxTotalAmountPaise,
    currency: reduxCurrency,
    notes: reduxOrderNotes,
    registrationAmount: reduxRegistrationAmount,
    premiumBibFee: reduxPremiumBibFee,
    premiumBibNumber: reduxPremiumBibNumber,
    isPremium: reduxIsPremium,
  } = useAppSelector(selectRazorpayOrderConfig);
  const isOrderLoading = useAppSelector(selectCreatePaymentOrderLoading);
  const getPaymentOrder = useAppSelector(selectCreatePaymentOrder);
  console.log(selectRazorpayOrderConfig, "selectRazorpayOrderConfig");

  const [sdkLoaded, setSdkLoaded] = useState(false);
  const hasAutoOpenedRef = useRef(false);
  const autoMode = params.get("auto") !== "0";
  const [isPaymentInitiated, setIsPaymentInitiated] = useState(false);
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


  const registrationAmountRupees =
    Number(
      registrationData?.payable_amount ||
        registrationData?.amount_payable ||
        registrationData?.amount ||
        0,
    ) || 0;
  const rzpKey = String(params.get("key") || reduxRzpKey || "");
  const orderId = String(params.get("orderId") || reduxOrderId || "");
  const amountPaise = String(
    params.get("amount") ||
      reduxAmount ||
      (registrationAmountRupees > 0
        ? Math.round(registrationAmountRupees * 100)
        : ""),
  );
  const totalAmountPaise = String(
    reduxTotalAmountPaise || params.get("total_amount_paise") || amountPaise,
  );
  const orderCurrency = String(
    params.get("currency") || reduxCurrency || "INR",
  );
  const orderNotes = useMemo(
    () =>
      reduxOrderNotes && typeof reduxOrderNotes === "object"
        ? reduxOrderNotes
        : {},
    [reduxOrderNotes],
  );
  const hasOrderNotes = Object.keys(orderNotes).length > 0;
  const paymentOrderData =
    getPaymentOrder?.order && typeof getPaymentOrder.order === "object"
      ? getPaymentOrder.order
      : {};
  const premiumBibNumber =
    String(reduxPremiumBibNumber || orderNotes?.premium_bib_number || "") || "";
  const premiumBibFee =
    String(reduxPremiumBibFee || orderNotes?.premium_bib_fee || "") || "";
  const registrationAmountFromOrder =
    String(reduxRegistrationAmount || orderNotes?.registration_amount || "") ||
    "";
  const registrationAmountFromOrderRupees =
    Number(registrationAmountFromOrder || 0) / 100;

  const premiumBibFeeRupees =
    Number(reduxPremiumBibFee || orderNotes?.premium_bib_fee || 0) / 100;

  // console.log(
  //   {
  //     totalAmountPaise,
  //     premiumBibFeeRupees,
  //     registrationAmountFromOrderRupees,
  //     amountPaise,
  //     premiumBibNumber,
  //     premiumBibFee,
  //     registrationAmountFromOrder,
  //   },
  //   "dsdsdssdsd",
  // );

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
  const isPreparingCheckout =
    !hasResult &&
    (isOrderLoading || (autoMode && hasRequiredCheckoutData && !sdkLoaded));
  const receiptAmountRupees = Math.max(0, Number(totalAmountPaise || 0) / 100);
  const baseAmt = toRupees(
    registrationAmountFromOrder,
    registrationData?.base_fee,
    registrationData?.base_amount,
    registrationData?.amount,
    registrationData?.payment_amount,
    registrationData?.fee,
    receiptAmountRupees,
  );
  const totalAmount = toRupees(
    Number(totalAmountPaise || 0) / 100,
    registrationData?.payable_amount,
    registrationData?.amount_payable,
    registrationData?.paid_amount,
    registrationData?.payment_amount,
    registrationData?.amount,
    registrationData?.fee,
    receiptAmountRupees,
  );
  // console.log(registrationData, "registrationData");
  const isPremiumMember =
    Boolean(reduxIsPremium) ||
    Boolean(paymentConfirmation?.premium_bib_number_status) ||
    Boolean(premiumBibNumber);
  // console.log(isPremiumMember, "isPremiumMember");
  const referenceCode =
    registrationData?.participant_reference ||
    registrationRequestPayloadFromStore?.reference_code ||
    "";

  const participantName =
    orderNotes?.participant_name ||
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
  const participantContactForPrefill =
    normalizeRazorpayContact(participantPhone);
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
      registrationData?.auth_user_id ||
      registrationData?.user_id ||
      registrationData?.userId ||
      registrationData?.runner?.id ||
      registrationRequestPayloadFromStore?.user_id ||
      "";

    return userId ? `/users/${encodeURIComponent(String(userId))}` : "/users";
  }, [params, registrationData, registrationRequestPayloadFromStore]);

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
      fontFamily: "var(--font-sans), ui-sans-serif, system-ui, sans-serif",
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
    if (!effectiveReference) return;
    if (orderFetchAttemptedRef.current) return;

    // Even if key/order/amount are already passed via URL, fetch order once
    // to hydrate notes and payment metadata for receipt and checkout notes.
    const shouldHydrateOrderMeta =
      !hasRequiredCheckoutData ||
      !hasOrderNotes ||
      !paymentOrderData?.payment_status ||
      !paymentOrderData?.registration_status;

    if (!shouldHydrateOrderMeta) return;

    orderFetchAttemptedRef.current = true;

    const fetchOrder = async () => {
      try {
        const response = await dispatch(
          createPaymentOrder({
            participant_reference: effectiveReference,
            ...(payableFromParams > 0
              ? { payable_amount: payableFromParams }
              : {}),
          }),
        ).unwrap();
        console.log(response,"response");
        return response;
      } catch (error) {
        show(
          "error",
          typeof error === "string"
            ? error
            : error?.message ||
                "Unable to fetch payment details. Please retry from registration.",
        );
      }
    };

    fetchOrder();
  }, [
    dispatch,
    effectiveReference,
    hasOrderNotes,
    hasRequiredCheckoutData,
    payableFromParams,
    paymentOrderData?.payment_status,
    paymentOrderData?.registration_status,
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
      reference_code: referenceCode || "",
    }),
    [
      participantCategory,
      participantName,
      participantPhone,
      receiptAmountRupees,
      referenceCode,
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

      const receiptOnlyNode =
        receiptExportRef.current.querySelector(
          '[data-receipt-export-content="true"]',
        ) || receiptExportRef.current;

      const htmlToImageModule = await import("html-to-image");
      const dataUrl = await htmlToImageModule.toPng(receiptOnlyNode, {
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
  }, [
    copyField,
    receiptAmountRupees,
    receiptText,
    result.razorpay_order_id,
    result.razorpay_payment_id,
  ]);

  const handleCloseWindow = useCallback(() => {
    // Browsers may block closing if the tab was not script-opened.
    window.close();

    // If close is blocked, return user to registration route.
    window.setTimeout(() => {
      if (!window.closed) {
        window.location.replace("/");
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

  const handleBackToDashboard = useCallback(() => {
    let openerRedirected = false;

    try {
      if (window.opener && !window.opener.closed) {
        window.opener.location.replace(userRedirectPath);
        openerRedirected = true;
      }
    } catch {
      // The current popup can still navigate to the dashboard below.
    }

    if (openerRedirected) {
      window.close();
      return;
    }

    window.location.replace(userRedirectPath);
  }, [userRedirectPath]);

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
      currency: orderCurrency,
      order_id: id,
      name: String(orderNotes?.event_name || "Sudharva Marathon"),
      description: "Registration Payment",
      notes: {
        ...orderNotes,
        is_premium: reduxIsPremium,
        premium_bib_fee: premiumBibFee,
        total_amount_paise: Number(totalAmountPaise || amount || 0),
        registration_amount: registrationAmountFromOrder,
        premium_bib_number: premiumBibNumber,
      },
      handler: async function (response) {
        setResult({
          razorpay_order_id: response.razorpay_order_id || "",
          razorpay_payment_id: response.razorpay_payment_id || "",
          razorpay_signature: response.razorpay_signature || "",
        });

        try {
          await dispatch(
            confirmPaymentOrderAction({
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
                total_amount_paise: Number(totalAmountPaise || amount || 0),
                registration_amount: registrationAmountFromOrder,
                premium_bib_fee: premiumBibFee,
                premium_bib_number: premiumBibNumber,
                is_premium: Boolean(reduxIsPremium),
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
    orderCurrency,
    orderNotes,
    premiumBibFee,
    premiumBibNumber,
    registrationAmountFromOrder,
    reduxIsPremium,
    totalAmountPaise,
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

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
        onLoad={() => setSdkLoaded(true)}
      />

      <main style={containerStyle}>
        {/* {hasOrderNotes ? (
          <section
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: 12,
              padding: 16,
              background: "#ffffff",
              marginBottom: 12,
            }}
          >
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>
              Order Summary
            </h2>
            <p style={{ ...mutedStyle, marginTop: 6 }}>
              Participant: {String(orderNotes?.participant_reference || "-")} | Amount: {" "}
              {String(orderNotes?.currency || orderCurrency || "INR")} {" "}
              {String(orderNotes?.final_amount || "0.00")}
            </p>
            <div style={{ ...mutedStyle, marginTop: 8, lineHeight: 1.7 }}>
              <div>Coupon: {String(orderNotes?.coupon_code || "Not Applied")}</div>
              <div>
                Discount: {String(orderNotes?.currency || orderCurrency || "INR")} {" "}
                {String(orderNotes?.coupon_discount || "0.00")}
              </div>
              <div>
                Original: {String(orderNotes?.currency || orderCurrency || "INR")} {" "}
                {String(orderNotes?.registration_amount || "0.00")}
              </div>
              <div>
                Premium Bib Fee: {String(orderNotes?.currency || orderCurrency || "INR")} {" "}
                {String(orderNotes?.premium_bib_fee || "0.00")}
              </div>
              <div>
                Final: {String(orderNotes?.currency || orderCurrency || "INR")} {" "}
                {String(orderNotes?.final_amount || "0.00")}
              </div>
              <div>
                Registration Status: {String(paymentOrderData?.registration_status || "-")}
              </div>
              <div>Payment Status: {String(paymentOrderData?.payment_status || "-")}</div>
            </div>
          </section>
        ) : null} */}

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
                  hasRequiredCheckoutData && !isPaymentAlreadyCompleted
                    ? 1
                    : 0.6,
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
          readOnly
          readOnly
          placeholder="rzp_test_..."
          style={baseFieldStyle}
        />

        <label style={labelStyle}>Order ID</label>
        <input
          value={orderId}
          readOnly
          readOnly
          placeholder="order_..."
          style={baseFieldStyle}
        />

        <label style={labelStyle}>Amount in Paise (must equal order amount)</label>
        <input
          value={amountPaise}
          readOnly
          readOnly
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
        {isPaymentInitiated && hasResult ? (
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
                  baseAmt={baseAmt}
                  totalAmount={totalAmount}
                  isPremiumMember={isPremiumMember}
                  className="mx-auto"
                  referenceCode={referenceCode}
                  hasOrderNotes={hasOrderNotes}
                  orderNotes={orderNotes}
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
                {isLoggedIn && (
                  <button
                    type="button"
                    onClick={handleBackToDashboard}
                    style={{
                      ...actionButtonStyle,
                      background: "#14532d",
                    }}
                  >
                    Back to Dashboard
                  </button>
                )}
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
                  onClick={() => copyField(receiptText)}
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
        ) : (
          <h6>Please wait... Your request is being processed.!</h6>
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
