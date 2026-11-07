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

export const isRegistrationRecord = (value) => {
  if (!value || typeof value !== "object") return false;

  return REGISTRATION_KEYS.some((key) => value[key] !== undefined && value[key] !== null);
};

export const pickUserRegistration = (payload) => {
  if (!payload) return null;

  if (Array.isArray(payload)) {
    const fromArray = payload.find((entry) => isRegistrationRecord(entry));
    return fromArray ?? null;
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
      if (fromArray) return fromArray;
      continue;
    }

    if (isRegistrationRecord(candidate)) {
      return candidate;
    }
  }

  return null;
};
