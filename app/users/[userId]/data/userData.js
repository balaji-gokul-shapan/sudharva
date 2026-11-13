const pick = (...values) => {
  for (const value of values) {
    if (value === undefined || value === null) continue;
    const text = String(value).trim();
    if (text) return text;
  }
  return "";
};

export const getUserData = (userId, regData) => {
  const registration = regData && typeof regData === "object" ? regData : {};
  const runner =
    registration?.runner && typeof registration.runner === "object"
      ? registration.runner
      : {};
  const details =
    runner?.details && typeof runner.details === "object" ? runner.details : {};

  const firstName = pick(
    runner?.first_name,
    details?.first_name,
    registration?.first_name,
  );
  const lastName = pick(
    runner?.last_name,
    details?.last_name,
    registration?.last_name,
  );
  const fullName = pick(
    `${firstName} ${lastName}`.trim(),
    registration?.full_name,
    registration?.runner_name,
    registration?.participant_name,
    registration?.name,
  );

  const username = pick(runner?.username, registration?.username, fullName, userId);
  const email = pick(details?.email, runner?.email, registration?.email);
  const mobile = pick(
    details?.mobile_number,
    details?.phone,
    runner?.mobile_number,
    registration?.mobile_number,
    registration?.phone,
  );

  return {
    userId: pick(userId, registration?.auth_user_id, registration?.user_id),
    username,
    firstName,
    lastName,
    fullName,
    displayName: pick(fullName, username),
    email,
    mobile,
    alternateMobile: pick(
      details?.alternate_mobile_number,
      registration?.alternate_mobile_number,
    ),
    participantReference: pick(
      registration?.participant_reference,
      registration?.participantReference,
      registration?.reference,
      registration?.id,
    ),
    registrationId: pick(registration?.registration_id, registration?.id),
    registrationStatus: pick(
      registration?.registration_status,
      registration?.status,
      registration?.payment_status,
    ),
    category: pick(
      registration?.category,
      registration?.category_name,
      registration?.event_category,
    ),
    eventName: pick(registration?.event, registration?.event_name),
    city: pick(
      details?.resident_city,
      details?.resident_taulk,
      details?.resident_district,
    ),
    state: pick(details?.resident_state),
    profileImage: pick(runner?.profile_image, registration?.profile_image),
    raw: registration,
  };
};