import { Suspense } from "react";
import { getUserRegistrationServer } from "@/lib/server/getUserRegistration";
import { calculateAge, formatDate } from "@/lib/utils";
import HealthSnapshotCard from "./components/HealthSnapshotCard";
import SafetyReachabilityCard from "./components/SafetyReachabilityCard";
import BloodGroupValue from "./components/BloodGroupValue";
import PersonalDetailsCard from "./components/personalDetailsCard";
import {
  Crown,
  Ruler,
  Sparkle,
  UserCircle,
} from "@phosphor-icons/react/dist/ssr";

const MISSING = "Not available";

const getValue = (source, keys, fallback = MISSING) => {
  for (const key of keys) {
    const value = source?.[key];
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      return value;
    }
  }
  return fallback;
};

const getRegistrationValue = (registration, keys, fallback = MISSING) => {
  const sources = [
    registration?.runner?.details,
    registration?.runner?.profile,
    registration?.details,
    registration?.medical,
    registration?.payment,
    registration?.bib,
    registration?.consents,
    registration?.timestamps,
    registration?.runner,
    registration,
  ];

  for (const source of sources) {
    const value = getValue(source, keys, null);
    if (value !== null) return value;
  }

  return fallback;
};

const toDisplayText = (value, fallback = MISSING) => {
  if (value === undefined || value === null) return fallback;

  if (typeof value === "object") {
    const objectValue = [
      value?.name,
      value?.category_name,
      value?.title,
      value?.label,
      value?.distance,
      value?.value,
    ].find((item) => item !== undefined && item !== null && String(item).trim() !== "");

    if (objectValue !== undefined) return String(objectValue).trim();
    return fallback;
  }

  const text = String(value).trim();
  return text || fallback;
};

const getDistance = (category) => {
  if (!category) return MISSING;
  const raw = String(category).trim();
  const normalized = raw
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[()]/g, "")
    .trim();

  const directMapping = {
    "5k": "5 Kilometers",
    "5k run": "5 Kilometers",
    "5k walk": "5 Kilometers",
    "10k": "10 Kilometers",
    "10k challenge run": "10 Kilometers",
    "10k chanellge run": "10 Kilometers",
    "10k challange run": "10 Kilometers",
    "half marathon": "21.097 Kilometers",
    // marathon: "42.195 Kilometers",
  };

  if (directMapping[normalized]) {
    return directMapping[normalized];
  }

  if (/\b5\s*km\s*walk\b|\b5k\s*walk\b|\bwalk\s*5\s*k(m)?\b/.test(normalized)) {
    return "5 Kilometers";
  }
  if (/\b5\s*km\s*run\b|\b5k\s*run\b|\brun\s*5\s*k(m)?\b/.test(normalized)) {
    return "5 Kilometers";
  }
  if (/\b5\s*km\b|\b5k\b/.test(normalized)) return "5 Kilometers";

  if (
    /\b10\s*km\s*cha(l|n)+ge\s*run\b|\b10k\s*cha(l|n)+ge\s*run\b/.test(
      normalized,
    )
  ) {
    return "10 Kilometers";
  }
  if (/\b10\s*km\b|\b10k\b/.test(normalized)) return "10 Kilometers";
  if (/\bhalf\s*marathon\b|\b21(\.0?97)?\s*km\b/.test(normalized)) {
    return "21.097 Kilometers";
  }
  // if (/\bfull\s*marathon\b|\b42(\.1?95)?\s*km\b|\bmarathon\b/.test(normalized)) {
  //   return "42.195 Kilometers";
  // }

  return raw;
};

const getFullName = (registration) => {
  const nestedFirst = registration?.runner?.first_name;
  const nestedLast = registration?.runner?.last_name;
  const nestedName = `${nestedFirst ?? ""} ${nestedLast ?? ""}`.trim();

  if (nestedName) return nestedName;

  return getValue(registration, [
    "full_name",
    "runner_name",
    "participant_name",
    "name",
  ]);
};

const formatStatus = (value) => {
  const raw = String(value || "Pending").trim();
  if (!raw) return "Pending";
  return raw
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
};

const isConfirmedStatus = (status) => {
  const normalized = String(status || "").toLowerCase();
  return normalized.includes("confirm") || normalized.includes("success");
};

const statusTone = (status) => {
  if (isConfirmedStatus(status)) {
    return "border-environment/35 bg-environment/12 text-environment";
  }
  const normalized = String(status || "").toLowerCase();
  if (normalized.includes("pending") || normalized.includes("hold")) {
    return "border-warning/35 bg-warning/12 text-warning";
  }
  return "border-primary/30 bg-primary/10 text-primary";
};

const asHealthFlag = (value) => {
  if (value === true) return "Yes";
  if (value === false) return "No";
  if (value === 1 || value === "1") return "Yes";
  if (value === 0 || value === "0") return "No";
  if (value === null || value === undefined || value === "") return MISSING;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["true", "yes"].includes(normalized)) return "Yes";
    if (["false", "no"].includes(normalized)) return "No";
  }
  return String(value);
};

const toBoolean = (...values) => {
  for (const value of values) {
    if (value === undefined || value === null || value === "") continue;
    if (typeof value === "boolean") return value;
    if (typeof value === "number") return value === 1;

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

    const existingDetails =
      resolvedRunner.details && typeof resolvedRunner.details === "object"
        ? resolvedRunner.details
        : {};
    const normalizedRunnerDetails = {
      ...runnerProfile,
      ...existingDetails,
      resident_address_line1:
        existingDetails.resident_address_line1 ?? runnerAddress.line1,
      resident_address_line2:
        existingDetails.resident_address_line2 ?? runnerAddress.line2,
      resident_city: existingDetails.resident_city ?? runnerAddress.city,
      resident_state: existingDetails.resident_state ?? runnerAddress.state,
      resident_taulk: existingDetails.resident_taulk ?? runnerAddress.taulk,
      resident_district:
        existingDetails.resident_district ?? runnerAddress.district,
      resident_pincode:
        existingDetails.resident_pincode ?? runnerAddress.pincode,
      emergency_contact_name:
        existingDetails.emergency_contact_name ?? runnerEmergency.name,
      emergency_contact_relationship:
        existingDetails.emergency_contact_relationship ??
        runnerEmergency.relationship,
      emergency_contact_mobile:
        existingDetails.emergency_contact_mobile ?? runnerEmergency.mobile_number,
      emergency_contact_mobile_number:
        existingDetails.emergency_contact_mobile_number ??
        runnerEmergency.mobile_number,
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

export function StatCard({ label, value }) {
  return (
    <article className="rounded-2xl border border-border/80 bg-background/75 p-4">
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-soft">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold text-foreground wrap-break-word">
        {value}
      </p>
    </article>
  );
}

function ProfileDataSection({ title, description, items }) {
  return (
    <section className="rounded-3xl border border-border/80 bg-background/80 p-5 shadow-sm sm:p-6">
      <div className="mb-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary">
          Registration Data
        </p>
        <h2 className="mt-1 text-lg font-bold text-foreground">{title}</h2>
        {description ? (
          <p className="mt-1 text-xs text-ink-soft">{description}</p>
        ) : null}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {items.map(({ label, value }) => (
          <StatCard key={label} label={label} value={value} />
        ))}
      </div>
    </section>
  );
}

function CompletionOrb({ completion, hoverText }) {
  return (
    <details className="group relative">
      <summary
        className="relative isolate grid h-40 w-40 cursor-pointer place-items-center overflow-hidden rounded-full list-none outline-none [&::-webkit-details-marker]:hidden"
        aria-label="Readiness details"
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `conic-gradient(color-mix(in srgb, var(--accent) 72%, var(--primary)) ${completion * 3.6}deg, color-mix(in srgb, var(--border) 82%, var(--background)) 0deg)`,
          }}
        />
        <div className="absolute inset-2.5 rounded-full bg-background" />
        <div className="relative text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink-soft">
            Readiness
          </p>
          <p className="mt-1 text-3xl font-black text-foreground">
            {completion}%
          </p>
        </div>
      </summary>
      <span className="pointer-events-none absolute left-1/2 top-[calc(100%+10px)] z-20 hidden w-max max-w-72 -translate-x-1/2 rounded-lg border border-border bg-background/95 px-3 py-2 text-[10px] font-medium normal-case tracking-normal text-foreground shadow-xl group-hover:block group-focus-within:block group-open:block">
        {hoverText}
      </span>
    </details>
  );
}

async function ProfileContent({ params }) {
  const { userId } = await params;
  const registrationPayload = await getUserRegistrationServer(userId, {
    redirectPath: `/users/${userId}/profile`,
  });
  const registration = getPrimaryRegistrationRecord(registrationPayload);

  const details = {
    ...(registration?.details || {}),
    ...(registration?.runner?.details || {}),
  };

  const fullName = getFullName(registration);
  const status = formatStatus(
    getValue(registration, ["registration_status", "status"], "Pending"),
  );
  const confirmedOnSource =
    registration?.payment_completed_timestamp ||
    registration?.timestamps?.payment_completed_at ||
    registration?.confirmed_at ||
    registration?.payment_confirmed_at ||
    registration?.approved_at ||
    registration?.verified_at ||
    registration?.timestamps?.registered_at ||
    "";
  const confirmedOn = formatDate(confirmedOnSource) || MISSING;
  const showConfirmedDate =
    isConfirmedStatus(status) && confirmedOn !== MISSING;
  const joinedOn =
    formatDate(
      registration?.registration_completed_timestamp ||
        registration?.timestamps?.registered_at ||
        "",
    ) || MISSING;
  const runnerAge = calculateAge(details?.date_of_birth) || MISSING;
  const firstName = getValue(
    registration?.runner,
    ["first_name"],
    getValue(details, ["first_name"], getValue(registration, ["first_name"])),
  );
  const lastName = getValue(
    registration?.runner,
    ["last_name"],
    getValue(details, ["last_name"], getValue(registration, ["last_name"])),
  );
  const runnerEmail =
    details?.email ||
    registration?.runner?.email ||
    registration?.email ||
    MISSING;
  const personalMobile = details?.mobile_number || MISSING;
  const alternateMobile = getRegistrationValue(registration, [
    "alternate_mobile_number",
    "alternate_mobile",
    "alternative_mobile_number",
    "alternative_mobile",
    "alternatePhone",
    "alternate_phone_number",
    "alternate_phone",
    "alternate_contact",
    "alternate_contact_number",
    "alternative_contact",
    "alternative_contact_number",
    "secondary_mobile",
    "secondary_mobile_number",
  ]);
  console.log(alternateMobile, "alternateMobile");
  

  const categoryRaw = getValue(registration, [
    "category",
    "category_name",
    "event_category",
  ]);
  const category = toDisplayText(categoryRaw);
  // console.log(categoryRaw,"categoryRaw");
  
  const distance = getDistance(category);
  const participantRef = getValue(registration, ["participant_reference"]);
  const premiumBibNumber =
    getValue(
      registration,
      ["bib_number", "premium_bib_number"],
      getValue(registration?.bib, ["bib_number"], ""),
    ) || MISSING;
  const isPremiumMember =
    toBoolean(
      registration?.premium_bib_number_status,
      registration?.bib?.premium_bib_number_status,
      registration?.order_notes?.is_premium,
      registration?.notes?.is_premium,
    ) || premiumBibNumber !== MISSING;


  const paymentStatus = String(
    getValue(
      registration,
      ["status", "registration_status", "payment_status", "paymentStatus"],
      "",
    ),
  )
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
  const hasRegistration = Boolean(registration);
  const isPendingPayment =
    hasRegistration && paymentStatus === "pending_payment";
  const isPaymentPaid = hasRegistration && !isPendingPayment;
  console.log(isPaymentPaid, isPremiumMember, "dsdsdsdsd");
  
  const city =
    details?.resident_city ||
    details?.city ||
    details?.resident_taulk ||
    details?.taulk ||
    details?.district ||
    MISSING;
  const addressParts = [
    details?.resident_address_line1 ?? details?.line1,
    details?.resident_address_line2 ?? details?.line2,
    details?.resident_city ?? details?.city,
    details?.resident_taulk ?? details?.taulk,
    details?.resident_district ?? details?.district,
    details?.resident_state ?? details?.state,
    details?.resident_pincode ?? details?.pincode,
  ]
    .map((part) => String(part ?? "").trim())
    .filter(Boolean)
    .filter(
      (part, index, values) =>
        values.findIndex(
          (value) => value.toLowerCase() === part.toLowerCase(),
        ) === index,
    );
  const address = addressParts.join(", ") || MISSING;
  const dateOfBirth = formatDate(details?.date_of_birth) || MISSING;
  const emergencyContactName =
    details?.emergency_contact_name ||
    details?.emergencyName ||
    registration?.runner?.emergency_contact?.name ||
    registration?.emergency_contact?.name ||
    MISSING;
  const emergencyContactMobile =
    details?.emergency_contact_mobile ||
    details?.emergency_contact_mobile_number ||
    details?.emergencyMobile ||
    registration?.runner?.emergency_contact?.mobile_number ||
    registration?.emergency_contact?.mobile_number ||
    MISSING;
  const bloodGroup = getRegistrationValue(registration, [
    "blood_group",
    "blood_group_id",
    "bloodGroup",
  ]);
  

  const cardiacCondition = asHealthFlag(
    getRegistrationValue(registration, ["cardiac_condition"], null),
  );
  const allergies = getRegistrationValue(registration, ["allergies"]);
  const height = details?.height || MISSING;
  const weight = details?.weight || MISSING;
  const diabetes = asHealthFlag(
    getRegistrationValue(registration, ["has_diabetes"], null),
  );
  const hypertension = asHealthFlag(
    getRegistrationValue(registration, ["hypertension"], null),
  );
  const previousMarathonParticipation = asHealthFlag(
    getRegistrationValue(
      registration,
      ["previous_marathon_participation"],
      null,
    ),
  );
  const otherMedical = getRegistrationValue(registration, [
    "other_medical_conditions",
  ]);
  const username = toDisplayText(registration?.runner?.username);
  const gender = toDisplayText(details?.gender);
  const emergencyContactRelationship = toDisplayText(
    details?.emergency_contact_relationship,
  );
  const eventRecord = registration?.event || {};
  const registrationType = registration?.registration_type || {};
  const categoryRecord = registration?.category || {};
  const tshirtRecord = registration?.tshirt_size || {};
  const paymentRecord = registration?.payment || {};
  const medicalRecord = registration?.medical || {};
  const consentRecord = registration?.consents || {};
  const currency = toDisplayText(eventRecord?.currency, "INR");
  const formatMoney = (value) =>
    value === null || value === undefined || value === ""
      ? MISSING
      : `${currency} ${String(value)}`;
  const formatTimestamp = (value) => {
    if (!value) return MISSING;
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? String(value)
      : date.toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "short",
        });
  };
  
  const completionFieldEntries = [
    { label: "Full Name", value: fullName },
    { label: "Category", value: category },
    // { label: "Distance", value: distance },
    { label: "City", value: city },
    { label: "Primary Mobile", value: personalMobile },
    { label: "Emergency Mobile", value: emergencyContactMobile },
    {label: "Alternate Mobile", value: alternateMobile },
  ];
  const completionFields = completionFieldEntries.map((entry) => entry.value);
  const missingFields = completionFieldEntries
    .filter((entry) => !entry.value || entry.value === MISSING)
    .map((entry) => entry.label);
  const missingDetailsText =
    missingFields.length > 0
      ? `Missing: ${missingFields.join(", ")}`
      : "All key profile details are complete.";
  const completeCount = completionFields.filter(
    (value) => value && value !== MISSING,
  ).length;
  const completion = Math.round(
    (completeCount / completionFields.length) * 100,
  );
  const readiness =
    completion >= 85
      ? "Race-Ready"
      : completion >= 55
        ? "Nearly Ready"
        : "Setup Needed";

  return (
    <main className="relative min-h-screen overflow-hidden  py-6 ">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.2]"
        style={{
          backgroundImage:
            "linear-gradient(to right, color-mix(in srgb, var(--border) 58%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in srgb, var(--border) 58%, transparent) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage:
            "radial-gradient(circle at center, black 18%, rgba(0,0,0,0.58) 58%, transparent 86%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-6xl space-y-5">
        <section className="relative overflow-hidden rounded-[2rem] border border-border/80 bg-linear-to-br from-background/95 via-background/86 to-primary/5 p-5 shadow-[0_22px_60px_-36px_color-mix(in_srgb,var(--primary)_45%,transparent)] backdrop-blur sm:p-7 lg:p-8">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-16 -top-16 h-52 w-52 rounded-full bg-primary/20 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 top-8 h-56 w-56 rounded-full bg-accent/20 blur-3xl"
          />

          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:gap-8">
            <div className="space-y-5">
              <span className="inline-flex items-center gap-2 rounded-full border border-accent/35 bg-accent/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
                <Sparkle size={13} weight="fill" />
                Runner Control Deck
              </span>

              <div className="flex items-start gap-4">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-primary/25 bg-primary/10 text-primary sm:h-16 sm:w-16">
                  <UserCircle size={34} weight="duotone" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-soft">
                    Runner Profile
                  </p>
                  <h1 className="mt-1 font-serif text-2xl font-bold tracking-tight text-foreground sm:text-4xl">
                    {fullName}
                  </h1>
                  <p className="mt-1 text-sm text-ink-soft">
                    Joined on {joinedOn}
                  </p>
                </div>
              </div>

              <p className="max-w-xl text-sm leading-relaxed text-ink-soft sm:text-base">
                Your profile is now a live mission board: identity, health, and
                race logistics flowing together in one cinematic view.
              </p>

              <div className="flex flex-wrap gap-2">
                <span
                  className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.13em] ${statusTone(status)}`}
                >
                  {status}
                </span>
                <span
                  className="group relative rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.13em] text-primary"
                  title={missingDetailsText}
                >
                  Completion {completion}%
                  <span className="pointer-events-none absolute left-1/2 top-[calc(100%+8px)] z-20 hidden w-max max-w-70 -translate-x-1/2 rounded-lg border border-border bg-background/95 px-3 py-2 text-[10px] font-medium normal-case tracking-normal text-foreground shadow-xl group-hover:block group-focus-within:block">
                    {missingDetailsText}
                  </span>
                </span>
                {isPaymentPaid && participantRef !== MISSING ? (
                  <span className="rounded-full border border-border/70 bg-background/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.13em] text-ink-soft">
                    Ref {participantRef}
                  </span>
                ) : null}
                {isPaymentPaid ? (
                  <span className="rounded-full border border-success/35 bg-success/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.13em] text-success">
                    Paid
                  </span>
                ) : null}
                <span className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.13em] text-accent">
                  {readiness}
                </span>
                {showConfirmedDate ? (
                  <span className="rounded-full border border-environment/35 bg-environment/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.13em] text-environment">
                    Confirmed on {confirmedOn}
                  </span>
                ) : null}
                {(isPremiumMember && isPaymentPaid) ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/45 bg-amber-300/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.13em] text-amber-800">
                    <Crown size={12} weight="fill" />
                    Premium Member
                  </span>
                ) : null}
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-2xl border border-border/80 bg-background/70 p-4">
                <div className="flex flex-col xl:flex-row items-center justify-between gap-4">
                  <CompletionOrb
                    completion={completion}
                    hoverText={missingDetailsText}
                  />
                  <div className="flex-1 space-y-2">
                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-soft">
                      Profile Signal
                    </p>
                    <p className="text-sm text-ink-soft">
                      Keep core identity and emergency blocks complete to reach
                      full race-readiness.
                    </p>
                    <div className="h-2 overflow-hidden rounded-full bg-border/80">
                      <div
                        className="h-full rounded-full bg-linear-to-r from-accent to-primary"
                        style={{ width: `${completion}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <StatCard label="Age" value={runnerAge} />
                <StatCard label="Email Address" value={runnerEmail} />
                <StatCard label="City" value={city} />
                <StatCard
                  label="Emergency Contact"
                  value={`${emergencyContactName} - ${emergencyContactMobile}`}
                />
              </div>
            </div>
          </div>
        </section>

        {(isPremiumMember && isPaymentPaid) ? (
          <section className="relative overflow-hidden rounded-[1.7rem] border border-amber-400/35 bg-linear-to-br from-amber-100/55 via-background to-amber-50/40 p-5 shadow-[0_18px_46px_-30px_rgba(161,98,7,0.45)]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full bg-amber-300/30 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-16 bottom-2 h-32 w-32 rounded-full bg-yellow-300/20 blur-3xl"
            />

            <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-200/35 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-amber-900">
                  <Crown size={12} weight="fill" />
                  Premium Runner Access
                </p>
                <h3 className="mt-2 text-xl font-black tracking-tight text-amber-900 sm:text-2xl">
                  Your Premium Bib Is Active
                </h3>
                <p className="mt-1 text-sm text-amber-900/80">
                  You are in the premium lane for this registration. Keep this
                  bib reference handy for race-day support.
                </p>
              </div>

              <div className="rounded-2xl border border-amber-500/35 bg-amber-100/45 px-4 py-3 text-right">
                <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-amber-900/80">
                  Premium Bib
                </p>
                <p className="mt-1 text-2xl font-black tracking-widest text-amber-900">
                  {premiumBibNumber}
                </p>
              </div>
            </div>
          </section>
        ) : null}

        <section className="grid gap-4 xl:grid-cols-[1fr_1fr_0.9fr]">
          <HealthSnapshotCard
            bloodGroup={bloodGroup}
            cardiacCondition={cardiacCondition}
            allergies={allergies}
            diabetes={diabetes}
            height={height}
            weight={weight}
            otherMedical={otherMedical}
          />

          <SafetyReachabilityCard
            personalMobile={personalMobile}
            city={city}
            emergencyContactName={emergencyContactName}
            emergencyContactMobile={emergencyContactMobile}
            category={category}
            distance={distance}
            alternateMobile={alternateMobile}
          />

          <PersonalDetailsCard
            firstName={firstName}
            lastName={lastName}
            runnerAge={runnerAge}
            dateOfBirth={dateOfBirth}
            personalMobile={personalMobile}
            bloodGroup={bloodGroup}
            height={height}
            weight={weight}
            address={address}
            alternateMobile={alternateMobile}
          />
        </section>
      </div>
    </main>
  );
}

function ProfileLoading() {
  return (
    <main
      className="relative min-h-screen overflow-hidden py-6"
      aria-busy="true"
      aria-label="Loading runner profile"
    >
      <div className="mx-auto w-full max-w-6xl space-y-5">
        <div className="h-64 animate-pulse rounded-[2rem] border border-border/80 bg-background/70" />
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="h-72 animate-pulse rounded-3xl border border-border/80 bg-background/70" />
          <div className="h-72 animate-pulse rounded-3xl border border-border/80 bg-background/70" />
        </div>
      </div>
    </main>
  );
}

export default function Page({ params }) {
  return (
    <Suspense fallback={<ProfileLoading />}>
      <ProfileContent params={params} />
    </Suspense>
  );
}
