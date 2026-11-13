import EventRegistrationModule from "./EventRegistrationModule";
import { getUserRegistrationServer } from "@/lib/server/getUserRegistration";
import ReceiptPrinter from "@/components/animation/receipt-printer";

const pick = (...values) => {
  for (const value of values) {
    if (value === undefined || value === null) continue;
    const text = String(value).trim();
    if (text) return text;
  }
  return "";
};

const normalizeStatus = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_");

const isSuccessfulPayment = (registration) => {
  const normalized = normalizeStatus(
    pick(
      registration?.registration_status,
      registration?.payment_status,
      registration?.paymentStatus,
      registration?.status,
    ),
  );

  if (!normalized) return false;
  if (/pending|fail|cancel|refund|unpaid/.test(normalized)) return false;
  return /success|confirm|complete|paid|captured|verified/.test(normalized);
};

const toAmount = (...values) => {
  const normalizeNumeric = (input) => {
    if (typeof input === "number") return Number.isFinite(input) ? input : NaN;
    if (typeof input !== "string") return NaN;

    const cleaned = input.replace(/[^0-9.,-]/g, "").trim();
    if (!cleaned) return NaN;

    // Handles values like "1,499.00" and "1499".
    const normalized = cleaned.includes(".")
      ? cleaned.replace(/,/g, "")
      : cleaned.replace(/,/g, "");
    return Number(normalized);
  };

  for (const value of values) {
    if (value === undefined || value === null || value === "") continue;
    const parsed = normalizeNumeric(value);
    if (Number.isFinite(parsed) && parsed >= 0) return parsed;
  }
  return 0;
};

const toAmountFromPaise = (...values) => {
  for (const value of values) {
    if (value === undefined || value === null || value === "") continue;
    const parsed = Number(value);
    if (Number.isFinite(parsed) && parsed >= 0) {
      return parsed / 100;
    }
  }
  return 0;
};

export default async function UserEventsPage({ params }) {
  const resolvedParams = await params;
  const userId = String(resolvedParams?.userId || "").trim();
  const registration = await getUserRegistrationServer(userId);
  const showReceipt =
    Boolean(registration) && isSuccessfulPayment(registration);

  const details = registration?.runner?.details || registration?.details || {};
  const participantName = pick(
    registration?.runner?.full_name,
    registration?.runner?.name,
    [registration?.runner?.first_name, registration?.runner?.last_name]
      .filter(Boolean)
      .join(" "),
    registration?.full_name,
    registration?.name,
  );
  const participantPhone = pick(
    details?.mobile_number,
    registration?.runner?.mobile_number,
    registration?.mobile_number,
  );
  const participantCategory = pick(
    registration?.category_name,
    registration?.event_category,
    registration?.category,
  );
  const eventName =
    pick(
      registration?.event_name,
      registration?.event,
      registration?.event_title,
    ) || "Event Registration";
  const amount = toAmount(
    registration?.payable_amount,
    registration?.amount_payable,
    registration?.amount,
    registration?.paid_amount,
    registration?.payment_amount,
    registration?.fee,
    toAmountFromPaise(
      registration?.amount_paise,
      registration?.payment_amount_paise,
      registration?.paid_amount_paise,
    ),
  );

  const receiptItems = [
    {
      name: `${eventName}${participantCategory ? ` - ${participantCategory}` : ""}`,
      quantity: 1,
      price: amount,
    },
  ];
  const receiptOrder =
    pick(
      registration?.participant_reference,
      registration?.payment_reference,
      registration?.order_id,
      registration?.id,
    ) || "#CONFIRMED";
  const baseAmt = toAmount(
    registration?.base_fee,
    registration?.base_amount,
    registration?.amount,
    registration?.payment_amount,
    registration?.fee,
    toAmountFromPaise(
      registration?.amount_paise,
      registration?.payment_amount_paise,
    ),
  );
  const totalAmount = toAmount(
    registration?.payable_amount,
    registration?.amount_payable,
    registration?.paid_amount,
    registration?.payment_amount,
    registration?.amount,
    registration?.fee,
    toAmountFromPaise(
      registration?.paid_amount_paise,
      registration?.payment_amount_paise,
      registration?.amount_paise,
    ),
  );
  const isPremiumMember = Boolean(registration?.premium_bib_number_status);
  const paymentDate = pick(
    registration?.payment_completed_timestamp,
    registration?.payment_confirmed_at,
    registration?.confirmed_at,
    registration?.paid_at,
    registration?.created_at,
  );

  return (
    <div className="space-y-6">
      <EventRegistrationModule userId={userId} registration={registration} />

      {showReceipt ? (
        <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-7">
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">
              Payment Receipt
            </p>
            <h2 className="mt-1 text-lg font-bold text-foreground">
              Download Your Receipt
            </h2>
          </div>

          <ReceiptPrinter
            merchant="Sudharva Marathon"
            order={receiptOrder}
            date={new Date().toLocaleString("en-IN")}
            items={receiptItems}
            tax={0}
            currency="INR "
            participantName={participantName}
            participantPhone={participantPhone}
            participantCategory={participantCategory}
            baseAmt={baseAmt}
            totalAmount={totalAmount}
            autoPrint={true}
            downloadOnly={true}
            actionLabel="Download"
            isPremiumMember={isPremiumMember}
            paymentDate={paymentDate}
            referenceCode={receiptOrder}
            className="mx-auto"
          />
        </section>
      ) : null}
    </div>
  );
}
