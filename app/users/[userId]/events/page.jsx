import EventRegistrationModule from "./EventRegistrationModule";
import { getUserRegistrationServer } from "@/lib/server/getUserRegistration";
import ReceiptPrinter from "@/components/animation/receipt-printer";

const pick = (...values) => {
  for (const value of values) {
    if (value === undefined || value === null) continue;
    if (typeof value === "object") continue;
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

const toBoolean = (...values) => {
  for (const value of values) {
    if (value === undefined || value === null || value === "") continue;

    if (typeof value === "boolean") return value;

    if (typeof value === "number") {
      if (value === 1) return true;
      if (value === 0) return false;
      continue;
    }

    const normalized = String(value).trim().toLowerCase();
    if (["true", "1", "yes", "y"].includes(normalized)) return true;
    if (["false", "0", "no", "n"].includes(normalized)) return false;
  }

  return false;
};

const getPrimaryRegistrationRecord = (payload) => {
  if (!payload) return null;

  const mergeParentRunner = (record, parentRunner) => {
    if (!record || typeof record !== "object") return null;

    const resolvedRunner =
      (record.runner && typeof record.runner === "object" ? record.runner : null) ||
      (parentRunner && typeof parentRunner === "object" ? parentRunner : null);

    if (!resolvedRunner) return record;

    const runnerProfile =
      resolvedRunner.profile && typeof resolvedRunner.profile === "object"
        ? resolvedRunner.profile
        : {};
    const runnerAddress =
      resolvedRunner.address && typeof resolvedRunner.address === "object"
        ? resolvedRunner.address
        : {};
    const runnerEmergency =
      resolvedRunner.emergency_contact &&
      typeof resolvedRunner.emergency_contact === "object"
        ? resolvedRunner.emergency_contact
        : {};

    const normalizedRunnerDetails =
      resolvedRunner.details && typeof resolvedRunner.details === "object"
        ? resolvedRunner.details
        : {
            ...runnerProfile,
            resident_address_line1: runnerAddress.line1,
            resident_address_line2: runnerAddress.line2,
            resident_city: runnerAddress.city,
            resident_state: runnerAddress.state,
            resident_taulk: runnerAddress.taulk,
            resident_district: runnerAddress.district,
            resident_pincode: runnerAddress.pincode,
            emergency_contact_name: runnerEmergency.name,
            emergency_contact_relationship: runnerEmergency.relationship,
            emergency_contact_mobile: runnerEmergency.mobile_number,
            emergency_contact_mobile_number: runnerEmergency.mobile_number,
          };

    return {
      ...record,
      runner: {
        ...resolvedRunner,
        details: normalizedRunnerDetails,
      },
    };
  };

  if (Array.isArray(payload)) {
    return mergeParentRunner(payload[0] || null, null);
  }

  if (Array.isArray(payload?.registrations)) {
    return mergeParentRunner(payload.registrations[0] || null, payload?.runner);
  }

  if (Array.isArray(payload?.data?.registrations)) {
    return mergeParentRunner(
      payload.data.registrations[0] || null,
      payload?.data?.runner || payload?.runner,
    );
  }

  return mergeParentRunner(payload, payload?.runner);
};

export default async function UserEventsPage({ params }) {
  const resolvedParams = await params;
  const userId = String(resolvedParams?.userId || "").trim();
  const registrationPayload = await getUserRegistrationServer(userId);
  const registration = getPrimaryRegistrationRecord(registrationPayload);
  const showReceipt =
    Boolean(registration) && isSuccessfulPayment(registration);

  const orderNotes = {
    event_name: pick(
      registration?.order_notes?.event_name,
      registration?.notes?.event_name,
      registration?.event_name,
      registration?.event?.name,
      "Sudharva Marathon",
    ),
    participant_reference: pick(
      registration?.order_notes?.participant_reference,
      registration?.notes?.participant_reference,
      registration?.participant_reference,
    ),
    race_category: pick(
      registration?.order_notes?.race_category,
      registration?.notes?.race_category,
      registration?.category_name,
      registration?.event_category,
      registration?.category?.name,
    ),
    t_shirt_size: pick(
      registration?.order_notes?.t_shirt_size,
      registration?.notes?.t_shirt_size,
      registration?.tshirt_size_name,
      registration?.tshirt_size?.name,
    ),
    coupon_code: pick(
      registration?.order_notes?.coupon_code,
      registration?.notes?.coupon_code,
      registration?.coupon_code,
      registration?.payment?.coupon_code,
    ),
    coupon_discount: pick(
      registration?.order_notes?.coupon_discount,
      registration?.notes?.coupon_discount,
      registration?.coupon_discount_amount,
      registration?.payment?.coupon_discount_amount,
      "0.00",
    ),
    final_amount: pick(
      registration?.order_notes?.final_amount,
      registration?.notes?.final_amount,
      registration?.payable_amount,
      registration?.amount_payable,
      registration?.payment?.payable_amount,
      "0.00",
    ),
    currency: pick(
      registration?.order_notes?.currency,
      registration?.notes?.currency,
      registration?.event?.currency,
      "INR",
    ),
    premium_bib_number: pick(
      registration?.order_notes?.premium_bib_number,
      registration?.notes?.premium_bib_number,
      registration?.bib_number,
      registration?.bib?.bib_number,
    ),
    premium_bib_fee: pick(
      registration?.order_notes?.premium_bib_fee,
      registration?.notes?.premium_bib_fee,
      "500.00",
    ),
    registration_amount: pick(
      registration?.order_notes?.registration_amount,
      registration?.notes?.registration_amount,
      registration?.base_fee,
      registration?.payment?.base_fee,
      registration?.amount,
      "0.00",
    ),
    total_amount_paise: pick(
      registration?.order_notes?.total_amount_paise,
      registration?.notes?.total_amount_paise,
      registration?.amount_paise,
      registration?.payment_amount_paise,
      registration?.paid_amount_paise,
    ),
  };
  const hasOrderNotes = Object.values(orderNotes).some(
    (value) => String(value || "").trim() !== "",
  );
  
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
    registration?.category?.name,
    registration?.category,
  );
  const eventName =
    pick(
      registration?.event_name,
      registration?.event?.name,
      registration?.event,
      registration?.event_title,
    ) || "Event Registration";
  const amount = toAmount(
    orderNotes?.final_amount,
    toAmountFromPaise(orderNotes?.total_amount_paise),
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
    orderNotes?.registration_amount,
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
    orderNotes?.final_amount,
    toAmountFromPaise(orderNotes?.total_amount_paise),
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
  const isPremiumMember =
    toBoolean(
      registration?.premium_bib_number_status,
      registration?.bib?.premium_bib_number_status,
      registration?.order_notes?.is_premium,
      registration?.notes?.is_premium,
    ) ||
    Boolean(
      pick(
        registration?.bib_number,
        registration?.bib?.bib_number,
        orderNotes?.premium_bib_number,
      ),
    );
  const paymentDate = pick(
    registration?.payment_completed_timestamp,
    registration?.timestamps?.payment_completed_at,
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
            hasOrderNotes={hasOrderNotes}
            orderNotes={orderNotes}
            className="mx-auto"
          />
        </section>
      ) : null}
    </div>
  );
}
