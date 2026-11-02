"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Script from "next/script";
import { useSearchParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { confirmPaymentOrder } from "@/store/slices/payment/paymentOrderConfirmationSlice";
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

export default function RazorpayPopupPage() {
  const params = useSearchParams();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const registrationDataFromStore = useAppSelector(selectCreateRegistrationData);
  const registrationRequestPayloadFromStore = useAppSelector(
    selectCreateRegistrationRequestPayload,
  );
  const masterData = useAppSelector((state) => state.master.data);
  const registrationData = registrationDataFromStore || null;
  
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
          params.get("reference") || registrationReference || "",
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
  const shouldHideHelper = autoMode && !status.message && !hasResult;
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

  const show = (type, message) => {
    setStatus({ type, message });
  };

  const copyField = async (value) => {
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);
      show("success", "Copied to clipboard.");
    } catch {
      show("error", "Unable to copy automatically. Please copy manually.");
    }
  };

  const openPaymentPopup = useCallback(() => {
    const key = rzpKey.trim();
    const id = orderId.trim();
    const amount = amountPaise.trim();

    if (!sdkLoaded || !window.Razorpay) {
      show("error", "Razorpay SDK is still loading. Try again in a moment.");
      return;
    }

    if (!key || !id || !amount) {
      show("error", "Fill Razorpay Key, Order ID and Amount.");
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
          show("dismiss", "Popup closed without completing payment.");
        },
      },
      prefill: { name: "", email: "", contact: "" },
      theme: { color: "#3399cc" },
    };

    const rzp = new window.Razorpay(options);

    rzp.on("payment.failed", function (response) {
      show(
        "error",
        "Payment failed: " +
          (response.error?.description || "unknown") +
          " [" +
          (response.error?.code || "") +
          " / " +
          (response.error?.reason || "") +
          "]",
      );
    });

    rzp.open();
  }, [amountPaise, dispatch, orderId, rzpKey, sdkLoaded]);

  useEffect(() => {
    const key = rzpKey.trim();
    const id = orderId.trim();
    const amount = amountPaise.trim();

    if (hasAutoOpenedRef.current) return;
    if (!sdkLoaded) return;
    if (!key || !id || !amount) return;

    hasAutoOpenedRef.current = true;
    const timerId = window.setTimeout(() => {
      openPaymentPopup();
    }, 0);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [amountPaise, openPaymentPopup, orderId, rzpKey, sdkLoaded]);

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
              <div style={resultWrapStyle}>
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

              <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={() => window.close()}
                  style={{
                    ...buttonStyle,
                    marginTop: 0,
                    background: "#1f8b4e",
                  }}
                >
                  Close Window
                </button>
                <button
                  type="button"
                  onClick={() =>
                    copyField(
                      JSON.stringify(
                        {
                          razorpay_order_id: result.razorpay_order_id,
                          razorpay_payment_id: result.razorpay_payment_id,
                          razorpay_signature: result.razorpay_signature,
                        },
                        null,
                        2,
                      ),
                    )
                  }
                  style={{
                    ...buttonStyle,
                    marginTop: 0,
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
