const REGISTRATION_KEYS = [
  "registration_id",
  "participant_reference",
  "status",
  "registration_status",
  "runner",
  "event",
  "category",
  "payable_amount",
  "created_at",
];

const pickText = (...values) => {
  for (const value of values) {
    if (value === undefined || value === null) continue;
    const text = String(value).trim();
    if (text) return text;
  }
  return "";
};

const normalizeRunner = (runner) => {
  if (!runner || typeof runner !== "object") return null;

  const profile =
    runner.profile && typeof runner.profile === "object"
      ? runner.profile
      : {};
  const address =
    runner.address && typeof runner.address === "object"
      ? runner.address
      : {};
  const emergencyContact =
    runner.emergency_contact && typeof runner.emergency_contact === "object"
      ? runner.emergency_contact
      : {};

  return {
    ...runner,
    name: pickText(
      runner.name,
      [runner.first_name, runner.last_name].filter(Boolean).join(" "),
      runner.username,
    ),
    full_name: pickText(
      runner.full_name,
      [runner.first_name, runner.last_name].filter(Boolean).join(" "),
      runner.name,
    ),
    first_name: pickText(runner.first_name),
    last_name: pickText(runner.last_name),
    mobile_number: pickText(profile.mobile_number, runner.mobile_number),
    details: {
      ...profile,
      ...address,
      emergency_contact_name: emergencyContact.name,
      emergency_contact_relationship: emergencyContact.relationship,
      emergency_contact_mobile_number: emergencyContact.mobile_number,
    },
    profile,
    address,
    emergency_contact: emergencyContact,
  };
};

const normalizeRegistrationRecord = (record, parentRunner) => {
  if (!record || typeof record !== "object") return null;

  const normalizedRunner =
    normalizeRunner(record.runner) || normalizeRunner(parentRunner);
  const eventObj =
    record.event && typeof record.event === "object" ? record.event : {};
  const categoryObj =
    record.category && typeof record.category === "object" ? record.category : {};
  const tshirtObj =
    record.tshirt_size && typeof record.tshirt_size === "object"
      ? record.tshirt_size
      : {};
  const paymentObj =
    record.payment && typeof record.payment === "object" ? record.payment : {};
  const timeObj =
    record.timestamps && typeof record.timestamps === "object"
      ? record.timestamps
      : {};
  const bibObj = record.bib && typeof record.bib === "object" ? record.bib : {};
  const orderNotes = {
    event_name: pickText(record?.event_name, eventObj.name),
    participant_reference: pickText(record?.participant_reference, record?.reference),
    race_category: pickText(record?.category_name, categoryObj.name),
    t_shirt_size: pickText(record?.tshirt_size_name, tshirtObj.name),
    coupon_code: pickText(record?.coupon_code, paymentObj?.coupon_code),
    coupon_discount: pickText(
      record?.coupon_discount_amount,
      paymentObj?.coupon_discount_amount,
      "0.00",
    ),
    final_amount: pickText(record?.payable_amount, paymentObj?.payable_amount),
    currency: pickText(eventObj?.currency, "INR"),
    premium_bib_number: pickText(record?.bib_number, bibObj?.bib_number),
    premium_bib_fee: pickText(record?.premium_bib_fee, "500.00"),
    registration_amount: pickText(record?.base_fee, paymentObj?.base_fee),
    total_amount_paise: pickText(
      record?.amount_paise,
      record?.payment_amount_paise,
      record?.paid_amount_paise,
    ),
  };

  const registrationStatus = pickText(
    record.registration_status,
    record.status,
    record.payment_status,
  );

  return {
    ...record,
    id: record.id ?? record.registration_id,
    registration_id: record.registration_id ?? record.id,
    participant_reference: pickText(
      record.participant_reference,
      record.reference,
      record.participantReference,
    ),
    registration_status: registrationStatus,
    payment_status: pickText(record.payment_status, record.status),
    status: pickText(record.status, record.registration_status),
    event_name: pickText(record.event_name, eventObj.name),
    event_title: pickText(record.event_title, eventObj.name),
    event_category: pickText(record.event_category, categoryObj.name),
    category_name: pickText(record.category_name, categoryObj.name),
    tshirt_size_name: pickText(record.tshirt_size_name, tshirtObj.name),
    payable_amount: pickText(record.payable_amount, paymentObj.payable_amount),
    amount_payable: pickText(record.amount_payable, paymentObj.payable_amount),
    paid_amount: pickText(record.paid_amount, paymentObj.amount_paid),
    payment_amount: pickText(record.payment_amount, paymentObj.amount_paid),
    base_fee: pickText(record.base_fee, paymentObj.base_fee),
    tax_amount: pickText(record.tax_amount, paymentObj.tax_amount),
    coupon_code: pickText(record.coupon_code, paymentObj.coupon_code),
    coupon_discount_amount: pickText(
      record.coupon_discount_amount,
      paymentObj.coupon_discount_amount,
    ),
    premium_bib_number_status:
      record.premium_bib_number_status ?? bibObj.premium_bib_number_status,
    bib_number: pickText(record.bib_number, bibObj.bib_number),
    payment_completed_timestamp: pickText(
      record.payment_completed_timestamp,
      timeObj.payment_completed_at,
      record.paid_at,
    ),
    created_at: pickText(record.created_at, timeObj.registered_at),
    order_notes: orderNotes,
    notes: orderNotes,
    runner: normalizedRunner,
  };
};

export const isRegistrationRecord = (value) => {
  if (!value || typeof value !== "object") return false;

  return REGISTRATION_KEYS.some((key) => value[key] !== undefined && value[key] !== null);
};

export const pickUserRegistration = (payload) => {
  if (!payload) return null;
  console.log(payload,"payload");
  
  const parentRunner =
    payload?.runner && typeof payload.runner === "object" ? payload.runner : null;

  if (
    Array.isArray(payload?.registrations) &&
    payload.registrations.length > 0
  ) {
    const candidate = payload.registrations.find((entry) =>
      isRegistrationRecord(entry),
    );
    if (candidate) {
      return normalizeRegistrationRecord(candidate, parentRunner);
    }
  }

  if (Array.isArray(payload)) {
    const fromArray = payload.find((entry) => isRegistrationRecord(entry));
    return normalizeRegistrationRecord(fromArray, parentRunner);
  }

  const candidates = [
    payload?.data,
    payload?.registrations,
    payload?.results,
    payload?.data?.registrations,
    payload?.data?.results,
    payload?.result,
    payload,
  ];

  for (const candidate of candidates) {
    if (!candidate) continue;

    if (Array.isArray(candidate)) {
      const fromArray = candidate.find((entry) => isRegistrationRecord(entry));
      if (fromArray) return normalizeRegistrationRecord(fromArray, parentRunner);
      continue;
    }

    if (isRegistrationRecord(candidate)) {
      return normalizeRegistrationRecord(candidate, parentRunner);
    }
  }

  return null;
};
