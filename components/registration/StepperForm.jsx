"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowCounterClockwise,
  Buildings,
  Calendar,
  CaretLeft,
  CaretRight,
  Check,
  Confetti,
  CreditCard,
  Envelope,
  FileText,
  GenderFemaleIcon,
  GenderIntersexIcon,
  GenderMaleIcon,
  Heartbeat,
  Info,
  Lock,
  MapPin,
  Percent,
  Phone,
  SealCheck,
  ShieldCheck,
  Sparkle,
  Tag,
  Ticket,
  Trophy,
  User,
  Warning,
  X,
} from "@phosphor-icons/react";
import { RainbowButton } from "@/components/animation/rainbowButton";
import { ConfettiSideCannons } from "@/components/animation/confetti-side-cannons";
import { Button } from "@/components/ui/button";
import PaymentStep from "@/components/registration/PaymentStep";
import { cn } from "@/lib/utils";
import { calculateAge } from "@/lib/utils";
import { HeartIcon } from "@animateicons/react/huge";
import { PersonalDetails } from "./RegistrationStep";
import { HealthDeclaration } from "./HealthDeclaration";
import { EventDetails } from "./EventDetails";
import { ReviewDetails } from "./ReviewDetails";
import { CATEGORIES, TEAM_SIZES } from "./datas/data";
import { usePincodeLookup } from "./PincodeContext";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  createRegistration,
  setCreateRegistrationSnapshot,
} from "@/store/slices/registration/createRegistrationSlice";
import { getMasterData } from "@/store/slices/masters/getMasterSlice";
import { createPaymentOrder } from "@/store/slices/payment/createPaymentOrderSlice";
import {
  clearRegistrationDraft,
  saveRegistrationDraft,
} from "@/store/slices/registration/registrationDraftSlice";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const STEPS = [
  {
    label: "Your details",
    description: "Tell us who is taking part",
    icon: User,
  },
  {
    label: "Race & gear",
    description: "Find your pace, pick your race, gear up",
    icon: MapPin,
  },
  {
    label: "Run Safe, Run Strong",
    description: "Your well-being comes first, always!",
    icon: HeartIcon,
  },
  // {
  //   label: "Exclusive Gifts",
  //   description: "Discover your race-day gifts and rewards",
  //   icon: Gift,
  // },
  {
    label: "Complete Your Entry",
    description: "Check everything before finishing,  Your race journey awaits",
    icon: SealCheck,
  },
  {
    label: "Ready, Set, Pay",
    description: "Check your fee & payment status",
    icon: CreditCard,
  },
];

const DELIVERY_FIELDS = [
  "delivery_address_line1",
  "delivery_address_line2",
  "delivery_city",
  "delivery_taulk",
  "delivery_district",
  "delivery_pincode",
  "delivery_state",
];

const STEP_FIELDS = {
  individual: [
    [
      "first_name",
      "last_name",
      // "email", // Temporary: do not block step progression on email
      "mobile_number",
      "date_of_birth",
      "gender",
      "resident_address_line1",
      "resident_address_line2",
      "resident_city",
      "resident_state",
      "resident_taulk",
      "resident_district",
      "resident_pincode",
      // "height",
      // "weight",
      // "bloodGroup",
    ],
    [
      "runner_category_id",
      "tshirt_size_id",
      "emergency_contact_name",
      "emergency_contact_mobile",
      "emergency_contact_relationship",
      // "delivery_address_line1",
      // "delivery_address_line2",
      // "delivery_city",
      // "delivery_taulk",
      // "delivery_district",
      // "delivery_pincode",
      // "delivery_state",
    ],
    [
      "medical_fitness_declaration",
      "physical_exertion_acknowledgement",
      "event_rules_acceptance",
      "event_communication_consent",
      "anonymized_impact_reporting_consent",
    ],
    [],
    [],
  ],
  corporate: [
    ["companyName", "contactName", "workEmail", "companyPhone", "teamSize"],
    [
      "runner_category_id",
      "tshirt_size_id",
      "emergency_contact_name",
      "emergency_contact_mobile",
      "emergency_contact_relationship",
      // "delivery_address_line1",
      // "delivery_address_line2",
      // "delivery_city",
      // "delivery_taulk",
      // "delivery_district",
      // "delivery_pincode",
      // "delivery_state",
    ],
    [
      "medical_fitness_declaration",
      "physical_exertion_acknowledgement",
      "event_rules_acceptance",
      "event_communication_consent",
      "anonymized_impact_reporting_consent",
    ],
    [],
    [],
  ],
};

const REGISTRATION_TYPE_IDS = {
  individual: 1,
  corporate: 2,
  sponsored: 3,
};

function toBooleanOrDefault(value, fallback = false) {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["true", "1", "yes", "y"].includes(normalized)) return true;
    if (["false", "0", "no", "n"].includes(normalized)) return false;
  }
  return fallback;
}

function mapRegistrationToForm(registerData, identifier) {
  if (!registerData || typeof registerData !== "object") {
    return {};
  }

  const runner = registerData?.runner || {};
  const details = runner?.details || {};
  const normalizedIdentifier = String(identifier || "").trim();
  const isIdentifierEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    normalizedIdentifier,
  );

  const emergency =
    details?.emergency_contact || registerData?.emergency_contact || {};
  const emergencyName =
    details?.emergency_contact_name ||
    details?.emergencyName ||
    runner?.emergencyName ||
    runner?.emergency_contact_name ||
    emergency?.name ||
    registerData?.emergencyName ||
    registerData?.emergency_contact_name ||
    "";
  const emergencyPhone =
    details?.emergency_contact_mobile ||
    details?.emergencyPhone ||
    details?.emergency_contact_phone ||
    runner?.emergencyPhone ||
    runner?.emergency_contact_mobile ||
    runner?.emergency_contact_phone ||
    emergency?.mobile ||
    emergency?.phone ||
    registerData?.emergencyPhone ||
    registerData?.emergency_contact_mobile ||
    registerData?.emergency_contact_phone ||
    "";
  const emergencyRelation =
    details?.emergency_contact_relationship ||
    details?.emergencyRelation ||
    details?.emergency_contact_relation ||
    runner?.emergencyRelation ||
    runner?.emergency_contact_relationship ||
    runner?.emergency_contact_relation ||
    emergency?.relationship ||
    emergency?.relation ||
    registerData?.emergencyRelation ||
    registerData?.emergency_contact_relationship ||
    registerData?.emergency_contact_relation ||
    "";

  return {
    first_name: runner?.first_name || "",
    last_name: runner?.last_name || "",
    // email: isIdentifierEmail
    //   ? normalizedIdentifier
    //   : runner?.email || normalizedIdentifier || "",
    mobile_number: isIdentifierEmail
      ? details?.mobile_number || ""
      : normalizedIdentifier || details?.mobile_number || "",
    date_of_birth: details?.date_of_birth || "",
    gender: details?.gender || "",
    height: details?.height || "",
    weight: details?.weight || "",
    bloodGroup: details?.blood_group || "",
    resident_address_line1: details?.resident_address_line1 || "",
    resident_address_line2: details?.resident_address_line2 || "",
    resident_city: details?.resident_city || "",
    resident_state: details?.resident_state || "",
    resident_taulk: details?.resident_taulk || "",
    resident_district: details?.resident_district || "",
    resident_pincode: details?.resident_pincode || "",
    has_diabetes: toBooleanOrDefault(
      details?.has_diabetes ?? registerData?.has_diabetes,
    ),
    cardiac_condition: toBooleanOrDefault(
      details?.cardiac_condition ?? registerData?.cardiac_condition,
    ),
    hypertension: toBooleanOrDefault(
      details?.hypertension ?? registerData?.hypertension,
    ),
    allergies: details?.allergies || "",
    other_medical_conditions: registerData?.other_medical_conditions || "",
    emergency_contact_name: emergencyName,
    emergency_contact_mobile: emergencyPhone,
    emergency_contact_relationship: emergencyRelation,
    emergencyName,
    emergencyPhone,
    emergencyRelation,
    previous_marathon_participation: toBooleanOrDefault(
      details?.previous_marathon_participation ??
        registerData?.previous_marathon_participation,
    ),
    participant_reference:
      registerData?.participant_reference ||
      registerData?.participantReference ||
      registerData?.reference ||
      registerData?.id ||
      "",
    medical_fitness_declaration: toBooleanOrDefault(
      registerData?.medical_fitness_declaration,
    ),
    physical_exertion_acknowledgement: toBooleanOrDefault(
      registerData?.physical_exertion_acknowledgement,
    ),
    event_rules_acceptance: toBooleanOrDefault(
      registerData?.event_rules_acceptance,
    ),
    event_communication_consent: toBooleanOrDefault(
      registerData?.event_communication_consent,
    ),
    anonymized_impact_reporting_consent: toBooleanOrDefault(
      registerData?.anonymized_impact_reporting_consent,
    ),
    runner_category_id:
      registerData?.runner_category_id || registerData?.category_id || "",
    tshirt_size_id: registerData?.tshirt_size || "",
  };
}

function createInitialForm(identifier, getRegistrationType, registerData) {
  const mappedRegistrationData = mapRegistrationToForm(
    registerData,
    identifier,
  );
  const mirroredTermsConsent = toBooleanOrDefault(
    registerData?.terms ?? mappedRegistrationData?.event_rules_acceptance,
    true,
  );
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier || "");
  const registrationTypes = Array.isArray(getRegistrationType)
    ? getRegistrationType
    : [];
  const individualTypeId =
    registrationTypes.find(
      (item) => String(item?.value || "").toLowerCase() === "individual",
    )?.id ?? REGISTRATION_TYPE_IDS.individual;

  return {
    entryType: "individual",
    registration_type_id: individualTypeId,

    first_name: "",
    // email: isEmail ? identifier : "",
    mobile_number: isEmail ? "" : identifier || "",
    alternatePhone: "",
    date_of_birth: "",
    // age: "",
    gender: "",
    height: "",
    weight: "",
    bloodGroup: "",
    last_name: "",
    companyName: "",
    contactName: "",
    workEmail: "",
    companyPhone: "",
    teamSize: "",
    tshirt_size_id: "",
    emergency_contact_name: "",
    emergency_contact_mobile: "",
    emergency_contact_relationship: "",
    // useNominee: false,
    // useResidentAddress: false,
    has_diabetes: false,
    runner_category_id: "",
    // beneficiary_name: "",
    // beneficiary_mobile: "",
    // beneficiary_email: "",
    // beneficiary_address: "",
    resident_address_line1: "",
    resident_address_line2: "",
    resident_city: "",
    resident_state: "",
    resident_taulk: "",
    resident_district: "",
    resident_pincode: "",
    // delivery_address_line1: "",
    // delivery_address_line2: "",
    // delivery_city: "",
    // delivery_state: "",
    // delivery_taulk: "",
    // delivery_district: "",
    // delivery_pincode: "",
    medical_fitness_declaration: false,
    previous_marathon_participation: false,
    cardiac_condition: false,
    hypertension: false,
    allergies: "",
    other_medical_conditions: "",
    physical_exertion_acknowledgement: false,
    event_rules_acceptance: true, // new
    event_communication_consent: false, // new
    anonymized_impact_reporting_consent: false, // new
    eventUpdates: false,
    dataPrivacy: false,
    terms: mirroredTermsConsent,
    // promoCode: "",
    // promoApplied: null,
    // paymentReported: false,
    ...mappedRegistrationData,
  };
}

function validateField(name, value) {
  const trimmedValue = typeof value === "string" ? value.trim() : value;

  switch (name) {
    case "first_name":
      return trimmedValue ? "" : "Please enter your first name.";
    case "last_name":
      return trimmedValue ? "" : "Please enter your last name.";
    // case "email":
    //   if (!trimmedValue) return "Please enter your email address.";
    //   return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue)
    //     ? ""
    //     : "Enter a valid email address.";
    case "mobile_number": {
      if (!trimmedValue) return "Please enter your mobile number.";
      const digits = trimmedValue.replace(/\D/g, "");
      return digits.length >= 7 && digits.length <= 15
        ? ""
        : "Enter a phone number with 7-15 digits.";
    }
    case "alternatePhone": {
      if (!trimmedValue) return "Please enter your alternate phone number.";
      const digits = trimmedValue.replace(/\D/g, "");
      return digits.length >= 7 && digits.length <= 15
        ? ""
        : "Enter a phone number with 7-15 digits.";
    }

    // case "height":
    //   return trimmedValue ? "" : "Please enter your height.";
    // case "weight":
    //   return trimmedValue ? "" : "Please enter your weight.";
    // case "bloodGroup":
    //   return trimmedValue ? "" : "Please enter your blood group.";
    case "resident_address_line1":
      return trimmedValue ? "" : "Please enter your residential address.";
    case "resident_address_line2":
      return "";
    case "resident_city":
      return trimmedValue ? "" : "Please enter your city.";
    case "resident_state":
      return trimmedValue ? "" : "Please enter your state.";
    case "resident_taulk":
    case "resident_district":
      return "";
    case "resident_pincode":
      return trimmedValue ? "" : "Please enter your pincode.";
    case "date_of_birth": {
      if (!trimmedValue) {
        return "Please enter your date of birth.";
      }
      const dob = new Date(`${trimmedValue}T00:00:00`);
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      if (Number.isNaN(dob.getTime())) {
        return "Please enter a valid date of birth.";
      }

      if (dob > today) {
        return "Date of birth cannot be in the future.";
      }

      let age = today.getFullYear() - dob.getFullYear();

      const hasHadBirthdayThisYear =
        today.getMonth() > dob.getMonth() ||
        (today.getMonth() === dob.getMonth() &&
          today.getDate() >= dob.getDate());

      if (!hasHadBirthdayThisYear) {
        age--;
      }

      if (age < 6) {
        return "You must be at least 6 years old to register.";
      }

      if (age > 80) {
        return "Participants must be 80 years old or younger.";
      }
      return "";
    }

    case "age": {
      if (!trimmedValue) return "";
      const age = Number(trimmedValue);
      if (Number.isNaN(age)) return "";
      if (age < 6) return "You must be at least 6 years old to register.";
      if (age > 80) return "Participants must be 80 years old or younger.";
      return "";
    }

    case "gender":
      return trimmedValue ? "" : "Please choose an option.";
    case "companyName":
      return trimmedValue ? "" : "Please enter your company name.";
    case "contactName":
      return trimmedValue ? "" : "Please enter the contact person's name.";
    case "workEmail":
      if (!trimmedValue) return "Please enter your work email address.";
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue)
        ? ""
        : "Enter a valid work email address.";
    case "companyPhone": {
      if (!trimmedValue) return "Please enter your company phone number.";
      const digits = trimmedValue.replace(/\D/g, "");
      return digits.length >= 7 && digits.length <= 15
        ? ""
        : "Enter a phone number with 7-15 digits.";
    }
    case "teamSize":
      return trimmedValue ? "" : "Please choose your team size.";
    case "runner_category_id":
      return trimmedValue ? "" : "Choose an event to continue.";
    case "tshirt_size_id":
      return trimmedValue ? "" : "Choose a T-shirt size.";
    case "emergency_contact_name":
      return trimmedValue ? "" : "Enter your emergency contact's name.";
    case "emergency_contact_mobile": {
      if (!trimmedValue) return "Enter your contact's phone.";
      const digits = trimmedValue.replace(/\D/g, "");
      return digits.length >= 7 && digits.length <= 15
        ? ""
        : "Enter a phone number with 7-15 digits.";
    }
    case "emergency_contact_relationship":
      return trimmedValue ? "" : "Enter your contact's relation.";
    case "beneficiary_name":
      return trimmedValue ? "" : "Enter your nominee's name.";
    case "beneficiary_mobile": {
      if (!trimmedValue) return "Enter your nominee's phone.";
      const digits = trimmedValue.replace(/\D/g, "");
      return digits.length >= 7 && digits.length <= 15
        ? ""
        : "Enter a phone number with 7-15 digits.";
    }
    case "beneficiary_email":
      if (!trimmedValue) return "Enter your nominee's email.";
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue)
        ? ""
        : "Enter a valid email address.";
    // case "beneficiary_address":
    //   return trimmedValue ? "" : "Enter your nominee's address.";
    case "medical_fitness_declaration":
      return value
        ? ""
        : "Please confirm you are medically fit to participate.";
    case "physical_exertion_acknowledgement":
      return value ? "" : "Please acknowledge the physical activity involved.";
    case "event_rules_acceptance":
      return value ? "" : "Please accept the event rules to continue.";
    case "event_communication_consent":
      return value
        ? ""
        : "Please consent to communication regarding event updates.";
    case "anonymized_impact_reporting_consent":
      return value ? "" : "Please consent to anonymized impact reporting.";
    case "eventUpdates":
      return value ? "" : "Please consent to receive event updates.";
    case "dataPrivacy":
      return value ? "" : "Please authorize data use for wellness reporting.";
    case "terms":
      return value ? "" : "Please accept the event rules to continue.";
    default:
      return "";
  }
}

function normalizePhoneForApi(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  const digits = raw.replace(/\D/g, "");
  return digits ? `+${digits}` : "";
}

function StepProgress({ activeIndex, onSelect }) {
  return (
    <nav aria-label="Registration progress" className="relative">
      <div
        aria-hidden="true"
        className="absolute left-[10%] right-[10%] top-5 h-0.5 bg-border"
      />
      <motion.div
        aria-hidden="true"
        className="absolute left-[10%] top-5 h-0.5 bg-accent"
        initial={false}
        animate={{ width: `${(activeIndex / (STEPS.length - 1)) * 80}%` }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      />
      <ol className="relative grid grid-cols-3 sm:grid-cols-5 py-2">
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          const complete = index < activeIndex;
          const active = index === activeIndex;
          const canVisit = index <= activeIndex;

          return (
            <li key={step.label} className="flex min-w-0 justify-center">
              <button
                type="button"
                onClick={() => canVisit && onSelect(index)}
                disabled={!canVisit}
                aria-current={active ? "step" : undefined}
                className={cn(
                  "group flex min-w-0 flex-col items-center gap-2 text-center outline-none",
                  !canVisit && "cursor-not-allowed ",
                )}
              >
                <span
                  className={cn(
                    "relative z-10 grid h-10 w-10 place-items-center rounded-full border-2 bg-muted transition-all duration-300",
                    active &&
                      "scale-110 border-accent  text-current shadow-[0_0_0_5px_color-mix(in_srgb,var(--accent)_18%,transparent)]",
                    complete &&
                      "border-success bg-success text-success-foreground",
                    !active &&
                      !complete &&
                      "border-border text-ink-soft bg-muted group-hover:border-accent/50 group-hover:bg-accent/10",
                    "group-focus-visible:ring-4 group-focus-visible:ring-accent/20",
                  )}
                >
                  {complete ? (
                    <Check size={18} weight="bold" color="white" />
                  ) : (
                    <Icon size={18} color="currentColor" />
                  )}
                </span>
                <span
                  className={cn(
                    "max-w-full text-[10px] font-bold leading-tight sm:text-xs",
                    active
                      ? "text-foreground"
                      : complete
                        ? "text-success"
                        : "text-ink-soft",
                  )}
                >
                  {step.label}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function StepIntro({ stepIndex }) {
  const Icon = STEPS[stepIndex].icon;

  return (
    <div className="mb-7 flex items-start gap-4">
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-accent/10 text-accent">
        <Icon size={24} weight="duotone" />
      </span>
      <div>
        <h2
          id="registration-step-heading"
          tabIndex={-1}
          className="font-serif text-2xl font-bold tracking-tight text-foreground outline-none sm:text-3xl"
        >
          {STEPS[stepIndex].label}
        </h2>
        <p className="mt-1 text-sm text-ink-soft">
          {STEPS[stepIndex].description}
        </p>
      </div>
    </div>
  );
}

function StepperFormContent({ identifier, setIdentifier, step, registerData }) {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const draft = useAppSelector((state) => state.registrationDraft);

  const createRegistrationMutation = useMutation({
    mutationFn: async (payload) => {
      return await dispatch(createRegistration(payload)).unwrap();
    },
  });

  const loading = createRegistrationMutation.isPending;
  const success = createRegistrationMutation.isSuccess;
  const data = createRegistrationMutation.data ?? null;
  console.log({ data });

  const registrationResult =
    data?.data || data?.result || data?.registration || data || null;

  const participantReference =
    registrationResult?.participant_reference ||
    registrationResult?.participantReference ||
    registrationResult?.reference ||
    registrationResult?.id ||
    "";
  const registrationStatus =
    registrationResult?.status ||
    registrationResult?.registration_status ||
    registrationResult?.payment_status;
  const payableAmount =
    registrationResult?.payable_amount ||
    registrationResult?.amount_payable ||
    registrationResult?.amount;
  const hasRequestedPaymentOrderRef = useRef(false);
  const resolveRegistrationError = (errorLike) => {
    if (!errorLike) return null;
    if (typeof errorLike === "string") return errorLike;

    const data = errorLike?.response?.data;
    const status = errorLike?.response?.status;

    // Detect raw HTML responses (server error pages)
    const htmlError =
      typeof data === "string" &&
      (/^<(!DOCTYPE|html|head|body|br\s*\/?|img\s*\/?)/i.test(data.trim()) ||
        (status === 404 && /<!DOCTYPE|<html|<body/i.test(data.trim())));

    if (htmlError) {
      if (status === 404) {
        return "The registration page is not available. Please try again later.";
      }
      return "Something went wrong. Please try saving your registration again.";
    }

    return (
      data?.message ||
      data?.error ||
      data?.detail ||
      errorLike?.message ||
      "Unable to save registration. Please try again."
    );
  };

  const error = resolveRegistrationError(createRegistrationMutation.error);

  const safeDraftStep =
    typeof draft?.stepIndex === "number"
      ? Math.min(Math.max(draft.stepIndex, 0), STEPS.length - 1)
      : 0;
  const isFixedStepFlow =
    step !== undefined && step !== null && String(step).trim() !== "";

  // const [stepIndex, setStepIndex] = useState(4);
  const [stepIndex, setStepIndex] = useState(
    step ? parseInt(step, 10) : safeDraftStep,
  );
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const { data: masterData = null, refetch: refetchMasterData } = useQuery({
    queryKey: ["master-data"],
    queryFn: async () => await dispatch(getMasterData()).unwrap(),
    staleTime: 5 * 60 * 1000,
  });
  // console.log(masterData,"masterData");
  
  const [isSavingRegistration, setIsSavingRegistration] = useState(false);
  const [isRegisterSubmitting, setIsRegisterSubmitting] = useState(false);

  // Check whether auth credentials are actually available. On app load,
  // hydration from localStorage takes a few ms; the save button must not
  // fire before that completes, otherwise the API receives no token.
  const authAccessToken = useAppSelector(
    (state) => state.userRefreshToken?.accessToken || null
  );
  const authReady =
    !!authAccessToken || window.localStorage.getItem("auth.accessToken");
  const [isRegistrationSuccessModalOpen, setIsRegistrationSuccessModalOpen] =
    useState(false);
  const [isRegistrationErrorModalOpen, setIsRegistrationErrorModalOpen] =
    useState(false);
  const [registrationErrorMessage, setRegistrationErrorMessage] = useState("");
  const registrationErrorLines = String(registrationErrorMessage || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const [registrationSuccessConfettiKey, setRegistrationSuccessConfettiKey] =
    useState(0);
  const getRegistrationType = masterData?.registration_type ?? [];
  const hasRegisterData =
    !!registerData &&
    typeof registerData === "object" &&
    Object.keys(registerData).length > 0;
  const seededForm = createInitialForm(
    identifier,
    getRegistrationType,
    registerData,
  );
  // console.log(registerData, "hasRegisterData");

  const initialForm = draft?.form
    ? hasRegisterData
      ? { ...draft.form, ...seededForm }
      : { ...seededForm, ...draft.form }
    : seededForm;

  const [form, setForm] = useState(initialForm);
  const normalizedIdentifier = String(identifier || "").trim();
  const lockedIdentifierField = normalizedIdentifier
    ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedIdentifier)
      ? "email"
      : "mobile_number"
    : null;

  const calculatedAge = form.date_of_birth
    ? String(calculateAge(form.date_of_birth))
    : "";

  useEffect(() => {
    if (stepIndex > 0) {
      document
        .getElementById("registration-step-heading")
        ?.focus({ preventScroll: true });
    }
  }, [stepIndex]);

  const { options } = usePincodeLookup(form.resident_pincode);

  useEffect(() => {
    if (success) {
      dispatch(clearRegistrationDraft());
      return;
    }

    dispatch(
      saveRegistrationDraft({
        stepIndex,
        form,
      }),
    );
  }, [dispatch, form, stepIndex, success]);

  useEffect(() => {
    console.log(
      participantReference,
      success,
      registrationStatus,
      payableAmount,
    );

    if (
      !success ||
      !participantReference ||
      hasRequestedPaymentOrderRef.current
    )
      return;

    dispatch(
      createPaymentOrder({
        participant_reference: participantReference,
        registration_status: registrationStatus,
        payable_amount: payableAmount,
      }),
    )
      .unwrap()
      .then((order) => {
        queryClient.setQueryData(["payment-order"], order ?? null);
        queryClient.setQueryData(
          ["payment-order", participantReference],
          order ?? null,
        );
      })
      .catch(() => {
        queryClient.setQueryData(["payment-order"], null);
        queryClient.setQueryData(["payment-order", participantReference], null);
      });

    hasRequestedPaymentOrderRef.current = true;
  }, [
    dispatch,
    participantReference,
    payableAmount,
    queryClient,
    registrationStatus,
    success,
  ]);

  const isGettingDetails = Array.isArray(options) && options.length > 0;

  // Memoized so the location option lists below are referentially stable
  // across renders (they only recompute when the underlying master data
  // changes). This keeps `SelectField`'s auto-select effect from running on
  // every render.
  const getOptions = useCallback(
    (key) => {
      if (!isGettingDetails) return [];

      return [
        ...new Set(options.map((option) => option[key]).filter(Boolean)),
      ].map((value) => ({
        value,
        label: value,
      }));
    },
    [options, isGettingDetails],
  );

  const cities = useMemo(() => getOptions("city"), [getOptions]);
  const states = useMemo(() => getOptions("state"), [getOptions]);
  const districts = useMemo(() => getOptions("district"), [getOptions]);
  const taluks = useMemo(() => getOptions("taluk"), [getOptions]);

  const hasCities = cities.length > 0;
  const hasStates = states.length > 0;
  const hasDistricts = districts.length > 0;
  const hasTaulks = taluks.length > 0;

  const withResidentAddress = (current) => {
    if (!current.useResidentAddress) return current;
    return {
      ...current,
      delivery_address_line1: current.resident_address_line1,
      delivery_address_line2: current.resident_address_line2,
      delivery_city: current.resident_city,
      delivery_taulk: current.resident_taulk,
      delivery_district: current.resident_district,
      delivery_state: current.resident_state,
      delivery_pincode: current.resident_pincode,
    };
  };

  const updateField = (name, value) => {
    if (isSavingRegistration) {
      setIsSavingRegistration(false);
    }

    setForm((current) => {
      if (current[name] === value) {
        return current;
      }

      const next = { ...current, [name]: value };
      return withResidentAddress(next);
    });

    // Turning on the resident-address switch supersedes the delivery fields.
    if (name === "useResidentAddress" && value) {
      setErrors((current) => {
        const next = { ...current };
        DELIVERY_FIELDS.forEach((field) => delete next[field]);
        return next;
      });
    }

    if (touched[name] || errors[name]) {
      const message = validateField(name, value);
      setErrors((current) => {
        const next = { ...current };
        if (message) next[name] = message;
        else delete next[name];
        return next;
      });
    }
  };

  const clearTabErrors = (entryType) => {
    // Clearing the fields of the type we are leaving (the other tab).
    const otherFields =
      entryType === "corporate"
        ? STEP_FIELDS.individual[0]
        : STEP_FIELDS.corporate[0];
    setErrors((current) => {
      const next = { ...current };
      otherFields.forEach((field) => delete next[field]);
      return next;
    });
    setTouched((current) => {
      const next = { ...current };
      otherFields.forEach((field) => delete next[field]);
      return next;
    });
  };

  const selectEntryType = (entryType) => {
    if (form.entryType === entryType) return;
    setForm((current) => {
      const next = {
        ...current,
        entryType,
        registration_type_id:
          REGISTRATION_TYPE_IDS[entryType] ?? REGISTRATION_TYPE_IDS.individual,
      };
      // Corporate entries have no residential address to mirror.
      if (entryType === "corporate") next.useResidentAddress = false;
      return next;
    });
    clearTabErrors(entryType);
  };

  const handleDetailsChange = (name, value) => {
    if (name === "entryType") {
      selectEntryType(value);
      return;
    }
    updateField(name, value);
  };

  const validateFields = (fields) => {
    const nextErrors = { ...errors };
    const nextTouched = { ...touched };
    let firstInvalid = null;

    fields.forEach((field) => {
      const message = validateField(field, form[field]);
      nextTouched[field] = true;
      if (message) {
        nextErrors[field] = message;
        firstInvalid ??= field;
      } else {
        delete nextErrors[field];
      }
    });

    setErrors(nextErrors);
    setTouched(nextTouched);

    if (firstInvalid) {
      window.requestAnimationFrame(() => {
        const targetId =
          firstInvalid === "runner_category_id"
            ? document
                .querySelector('input[name="runner_category_id"]')
                ?.getAttribute("id")
            : firstInvalid === "tshirt_size_id"
              ? "shirt-xs"
              : firstInvalid === "teamSize"
                ? "teamsize-1-10"
                : firstInvalid === "gender"
                  ? "gender-male"
                  : firstInvalid;
        if (targetId) {
          document.getElementById(targetId)?.focus();
        }
      });
      return false;
    }

    return true;
  };

  const handleContinue = (event) => {
    event.preventDefault();
    const fields = STEP_FIELDS[form.entryType][stepIndex];
    if (!fields) return;

    const fieldsToValidate = form.useResidentAddress
      ? fields.filter((field) => !DELIVERY_FIELDS.includes(field))
      : fields;

    if (!validateFields(fieldsToValidate)) return;
    setStepIndex((current) => Math.min(current + 1, STEPS.length - 1));
  };

  const handleSubmitRegistration = async (event) => {

    event.preventDefault();
    if (isRegisterSubmitting) return;
    // if (form.paymentReported !== true) return;
    hasRequestedPaymentOrderRef.current = false;
    queryClient.setQueryData(["payment-order"], null);
    setIsRegistrationErrorModalOpen(false);
    setRegistrationErrorMessage("");
    // setIsRegisterSubmitting(true);

    const {
      companyName,
      contactName,
      workEmail,
      companyPhone,
      teamSize,
      ...basePayload
    } = form;

    const payload =
      (form.entryType ?? "individual") === "individual"
        ? {
            ...basePayload,
            registration_type_id:
              Number(form.registration_type_id) ||
              REGISTRATION_TYPE_IDS.individual,
            event_id: 1,
          }
        : {
            ...basePayload,
            registration_type_id:
              Number(form.registration_type_id) ||
              REGISTRATION_TYPE_IDS.corporate,
            event_id: 1,
            companyName,
            contactName,
            workEmail,
            companyPhone,
            teamSize,
          };
    payload.terms = toBooleanOrDefault(
      payload.event_rules_acceptance ?? payload.terms,
      false,
    );
    payload.mobile_number = normalizePhoneForApi(payload.mobile_number);
    payload.alternatePhone = normalizePhoneForApi(payload.alternatePhone);
    payload.emergency_contact_mobile = normalizePhoneForApi(
      payload.emergency_contact_mobile,
    );
    payload.beneficiary_mobile = normalizePhoneForApi(
      payload.beneficiary_mobile,
    );
    payload.companyPhone = normalizePhoneForApi(payload.companyPhone);
    // console.log("payload", payload);

    try {
      const registrationResponse =
        await createRegistrationMutation.mutateAsync(payload);
      const savedRegistration =
        registrationResponse?.data ||
        registrationResponse?.result ||
        registrationResponse?.registration ||
        registrationResponse ||
        null;
      const savedParticipantReference =
        savedRegistration?.participant_reference ||
        savedRegistration?.participantReference ||
        savedRegistration?.reference ||
        savedRegistration?.id ||
        "";

      if (savedParticipantReference) {
        setForm((current) => ({
          ...current,
          participant_reference: savedParticipantReference,
          participantReference: savedParticipantReference,
          reference: savedParticipantReference,
        }));
      }

      dispatch(
        setCreateRegistrationSnapshot({
          requestPayload: payload,
          response: registrationResponse,
          data: registrationResponse,
        }),
      );

      setRegistrationSuccessConfettiKey((current) => current + 1);
      setIsSavingRegistration(true);
      setIsRegistrationSuccessModalOpen(true);
    } catch (caughtError) {
      const saveErrorMessage = resolveRegistrationError(caughtError);
      setRegistrationErrorMessage(
        saveErrorMessage || "Unable to save registration. Please try again.",
      );
      setIsRegistrationErrorModalOpen(true);
      setIsSavingRegistration(false);
    } finally {
      setIsRegisterSubmitting(false);
    }
  };

  const fetchMasterData = useCallback(async () => {
    try {
      const result = await refetchMasterData();
      return result.data ?? null;
    } catch {
      return null;
    }
  }, [refetchMasterData]);

  const primaryCtaLabel =
    stepIndex === 0
      ? "Continue to race details"
      : stepIndex === 1
        ? "Continue to health declaration"
        : stepIndex === 2
          ? "Review registration"
          : isRegisterSubmitting
            ? "Saving registration..."
            : isSavingRegistration
              ? "Continue to payment"
              : "Save registration";

  const isSaveRegistrationCta = stepIndex === STEPS.length - 2;

  return (
    <section
      id="registration-flow"
      aria-label="Marathon registration"
      className="mx-auto w-full max-w-4xl scroll-mt-6"
    >
      <>
        <header className="mx-auto mb-8 max-w-3xl text-center sm:mb-10">
          <h1 className="mt-4 font-serif text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
            Your next <span className="text-accent">great stride </span>starts
            here.
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-ink-soft sm:text-base">
            Complete four quick steps, then review the payment summary. Your
            details are not saved or submitted from this page.
          </p>
        </header>

        <div className="mb-5 rounded-2xl border border-border bg-surface/90 p-4 shadow-sm backdrop-blur sm:mb-6 sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <span className="text-xs font-semibold text-ink-soft">
              Step {stepIndex + 1} <span className="text-ink-soft/50">of</span>{" "}
              {STEPS.length}
            </span>
            <span className="text-right text-xs font-semibold text-accent sm:text-sm">
              {STEPS[stepIndex].description}
            </span>
          </div>
          <StepProgress
            activeIndex={stepIndex}
            onSelect={(index) => setStepIndex(index)}
          />
        </div>

        <motion.div
          key={stepIndex}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="rounded-3xl border border-border bg-surface p-5 shadow-xl shadow-primary/5 sm:p-8"
        >
          <form
            noValidate
            onSubmit={(event) => {
              if (stepIndex === STEPS.length - 2) {
                if (isSavingRegistration) {
                  handleContinue(event);
                } else {
                  handleSubmitRegistration(event);
                }
              } else {
                handleContinue(event);
              }
            }}
          >
            <StepIntro stepIndex={stepIndex} />
            {stepIndex === 0 && (
              <PersonalDetails
                form={form}
                errors={errors}
                onChange={handleDetailsChange}
                lockedIdentifierField={lockedIdentifierField}
                age={calculatedAge}
                hasCities={hasCities}
                hasStates={hasStates}
                hasDistricts={hasDistricts}
                hasTaulks={hasTaulks}
                cities={cities}
                states={states}
                districts={districts}
                taluks={taluks}
              />
            )}
            {stepIndex === 1 && (
              <EventDetails
                form={form}
                errors={errors}
                onChange={updateField}
                masterData={masterData}
                fetchMasterData={fetchMasterData}
              />
            )}
            {stepIndex === 2 && (
              <HealthDeclaration
                form={form}
                errors={errors}
                onChange={updateField}
                hasCities={hasCities}
              />
            )}
            {/* {stepIndex === 3 && (
                <GiftDetails
                  form={form}
                  errors={errors}
                  onChange={updateField}
                />
              )} */}
            {stepIndex === 3 && (
              <ReviewDetails
                form={form}
                onEdit={(index) => setStepIndex(index)}
              />
            )}
            {stepIndex === 4 && (
              <PaymentStep
                form={form}
                step={step}
                registerData={registerData}
                category={CATEGORIES.find(
                  (item) => item.value === form.category,
                )}
                teamSize={TEAM_SIZES.find(
                  (item) => item.value === form.teamSize,
                )}
                onChange={updateField}
                participantReferenceNo={
                  registrationResult?.participant_reference ||
                  registrationResult?.participantReference ||
                  registrationResult?.reference ||
                  registrationResult?.id ||
                  form?.participant_reference ||
                  form?.participantReference ||
                  form?.reference ||
                  registerData?.participant_reference ||
                  registerData?.participantReference ||
                  registerData?.reference ||
                  ""
                }
              />
            )}

            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-border/70 pt-5 sm:flex-row sm:items-center sm:justify-between">
              {!isFixedStepFlow && stepIndex > 0 ? (
                <button
                  type="button"
                  onClick={() => setStepIndex((current) => current - 1)}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-border px-5 text-sm font-semibold text-foreground transition hover:border-accent/50 hover:bg-background focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/15"
                >
                  <CaretLeft size={17} weight="bold" />
                  Back
                </button>
              ) : (
                <p className="text-center text-xs text-ink-soft sm:text-left">
                  <span className="text-accent">*</span> Required fields
                </p>
              )}

              {stepIndex < STEPS.length - 1 ? (
                isSaveRegistrationCta ? (
                  <div className="flex flex-col items-end gap-2">
                    <ConfettiSideCannons
                      type={isSavingRegistration ? "button" : "submit"}
                      onClick={
                        isSavingRegistration
                          ? () => setStepIndex(STEPS.length - 1)
                          : undefined
                      }
                      disabled={isRegisterSubmitting}
                      fireOnClick={false}
                      triggerKey={registrationSuccessConfettiKey}
                      className="min-h-12 w-full rounded-xl border-0 bg-accent px-6 text-sm font-bold text-accent-foreground shadow-md hover:brightness-105 sm:w-auto"
                    >
                      {isRegisterSubmitting ? (
                        <ArrowCounterClockwise
                          size={18}
                          className="animate-spin"
                        />
                      ) : null}
                      {isRegisterSubmitting
                        ? "Saving registration..."
                        : isSavingRegistration
                          ? "Continue to payment"
                          : "Save registration"}
                      <CaretRight size={18} weight="bold" />
                    </ConfettiSideCannons>
                    {error ? (
                      <p
                        role="alert"
                        className="max-w-2/3 text-right text-xs font-medium text-destructive"
                      >
                        {error}
                      </p>
                    ) : null}
                  </div>
                ) : (
                  <RainbowButton
                    type="submit"
                    variant="accent"
                    size="lg"
                    className="min-h-12 w-full px-6 sm:w-auto"
                    disabled={isRegisterSubmitting}
                  >
                    {isRegisterSubmitting && stepIndex === STEPS.length - 2 ? (
                      <ArrowCounterClockwise
                        size={18}
                        className="animate-spin"
                      />
                    ) : null}
                    {primaryCtaLabel}
                    <CaretRight size={18} weight="bold" />
                  </RainbowButton>
                )
              ) : (
                <div className="text-center text-xs leading-relaxed text-ink-soft sm:max-w-xs sm:text-right">
                  {success ? (
                    <>
                      <p className="mb-2 text-success font-semibold">
                        Registration submitted successfully.
                      </p>
                      {data && (
                        <p className="text-ink-soft/80">
                          Reference:{" "}
                          {String(
                            registrationResult?.participant_reference ??
                              registrationResult?.reference ??
                              registrationResult?.id ??
                              "",
                          )}
                        </p>
                      )}
                    </>
                  ) : error ? (
                    <p className="text-destructive font-semibold">{error}</p>
                  ) : form.paymentReported !== true ? (
                    <>
                      <p className="mb-2">
                        Use the Razorpay button above to open secure checkout in
                        a new tab. Payment is not confirmed here.
                      </p>
                      <RainbowButton
                        type="submit"
                        disabled={loading}
                        variant="accent"
                        size="lg"
                        className="min-h-12 w-full px-6 sm:w-auto mt-4"
                      >
                        {loading
                          ? "Submitting..."
                          : "Confirm & submit registration"}
                        <CaretRight size={18} weight="bold" />
                      </RainbowButton>
                    </>
                  ) : (
                    <RainbowButton
                      type="submit"
                      disabled={loading}
                      variant="accent"
                      size="lg"
                      className="min-h-12 w-full px-6 sm:w-auto mt-4"
                    >
                      {loading ? "Submitting..." : "Submit registration"}
                      <CaretRight size={18} weight="bold" />
                    </RainbowButton>
                  )}
                </div>
              )}
            </div>
          </form>
        </motion.div>
        <p className="mx-auto mt-4 flex max-w-xl items-center justify-center gap-2 px-3 text-center text-xs leading-relaxed text-ink-soft">
          <ShieldCheck size={15} className="shrink-0 text-primary" />
          Your details are submitted securely to the event organizers.
        </p>

        <Dialog
          open={isRegistrationSuccessModalOpen}
          onOpenChange={setIsRegistrationSuccessModalOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registration Saved Successfully</DialogTitle>
              <DialogDescription>
                Your registration details were saved. You can now continue to
                payment.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <RainbowButton
                loading={loading}
                size="sm"
                variant="accent"
                onClick={() => {
                  setIsRegistrationSuccessModalOpen(false);
                  setStepIndex(STEPS.length - 1);
                }}
                className="min-w-28"
              >
                Continue to payment
              </RainbowButton>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog
          open={isRegistrationErrorModalOpen}
          onOpenChange={setIsRegistrationErrorModalOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Unable to Save Registration</DialogTitle>
              {registrationErrorLines.length > 1 ? (
                <div className="space-y-2 text-sm text-foreground">
                  <p>
                    Please fix the following issues and try again:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    {registrationErrorLines.map((line, index) => (
                      <li key={`registration-error-${index}`}>{line}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <DialogDescription>
                  {registrationErrorMessage ||
                    "Something went wrong while saving your registration. Please try again."}
                </DialogDescription>
              )}
            </DialogHeader>
            <DialogFooter>
              <RainbowButton
                size="sm"
                variant="accent"
                onClick={() => setIsRegistrationErrorModalOpen(false)}
                className="min-w-28"
              >
                OK
              </RainbowButton>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    </section>
  );
}

export default function StepperForm({
  identifier,
  setIdentifier,
  step,
  registerData,
}) {
  return (
    <StepperFormContent
      identifier={identifier}
      setIdentifier={setIdentifier}
      step={step}
      registerData={registerData}
    />
  );
}
