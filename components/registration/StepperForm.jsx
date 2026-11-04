"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
      "email",
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
      "category",
      "tshirt_size_id",
      "emergencyName",
      "emergencyPhone",
      "emergencyRelation",
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
      "category",
      "tshirt_size_id",
      "emergencyName",
      "emergencyPhone",
      "emergencyRelation",
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

function createInitialForm(identifier, getRegistrationType) {
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
    email: isEmail ? identifier : "",
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
    emergencyName: "",
    emergencyPhone: "",
    emergencyRelation: "",
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
    terms: false,
    // promoCode: "",
    // promoApplied: null,
    // paymentReported: false,
  };
}

function validateField(name, value) {
  const trimmedValue = typeof value === "string" ? value.trim() : value;

  switch (name) {
    case "first_name":
      return trimmedValue ? "" : "Please enter your first name.";
    case "last_name":
      return trimmedValue ? "" : "Please enter your last name.";
    case "email":
      if (!trimmedValue) return "Please enter your email address.";
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue)
        ? ""
        : "Enter a valid email address.";
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
    case "emergencyName":
      return trimmedValue ? "" : "Enter your emergency contact's name.";
    case "emergencyPhone": {
      if (!trimmedValue) return "Enter your contact's phone.";
      const digits = trimmedValue.replace(/\D/g, "");
      return digits.length >= 7 && digits.length <= 15
        ? ""
        : "Enter a phone number with 7-15 digits.";
    }
    case "emergencyRelation":
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

function StepperFormContent({ identifier, setIdentifier }) {
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
  const error =
    createRegistrationMutation.error?.response?.data?.message ||
    createRegistrationMutation.error?.message ||
    null;

  const safeDraftStep =
    typeof draft?.stepIndex === "number"
      ? Math.min(Math.max(draft.stepIndex, 0), STEPS.length - 1)
      : 0;

  const [stepIndex, setStepIndex] = useState(safeDraftStep);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const { data: masterData = null, refetch: refetchMasterData } = useQuery({
    queryKey: ["master-data"],
    queryFn: async () => await dispatch(getMasterData()).unwrap(),
    staleTime: 5 * 60 * 1000,
  });
  const [isSavingRegistration, setIsSavingRegistration] = useState(false);
  const [isRegisterSubmitting, setIsRegisterSubmitting] = useState(false);
  const [isRegistrationSuccessModalOpen, setIsRegistrationSuccessModalOpen] =
    useState(false);
  const [registrationSuccessConfettiKey, setRegistrationSuccessConfettiKey] =
    useState(0);
  const getRegistrationType = masterData?.registration_type ?? [];
  console.log(getRegistrationType, "getRegistrationType");
  const initialForm = draft?.form
    ? { ...createInitialForm(identifier, getRegistrationType), ...draft.form }
    : createInitialForm(identifier, getRegistrationType);
  const [form, setForm] = useState(initialForm);

  const calculatedAge = form.date_of_birth
    ? String(calculateAge(form.date_of_birth))
    : "";

  useEffect(() => {
    if (stepIndex > 0) {
      document
        .getElementById("registration-step-heading")
        ?.focus({ preventScroll: true });
      document
        .getElementById("registration-flow")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
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
    console.log(participantReference, success, registrationStatus, payableAmount);

    if (!success || !participantReference || hasRequestedPaymentOrderRef.current)
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

  const getOptions = (key) => {
    if (!isGettingDetails) return [];

    return [
      ...new Set(options.map((option) => option[key]).filter(Boolean)),
    ].map((value) => ({
      value,
      label: value,
    }));
  };

  const cities = getOptions("city");
  const states = getOptions("state");
  const districts = getOptions("district");
  const taluks = getOptions("taluk");

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

    if (touched[name]) {
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
          firstInvalid === "category"
            ? "category-5k"
            : firstInvalid === "tshirt_size_id"
              ? "shirt-xs"
              : firstInvalid === "teamSize"
                ? "teamsize-1-10"
                : firstInvalid === "gender"
                  ? "gender-male"
                  : firstInvalid;
        document.getElementById(targetId)?.focus();
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
    console.log("ewewew");

    event.preventDefault();
    if (isRegisterSubmitting) return;
    // if (form.paymentReported !== true) return;
    hasRequestedPaymentOrderRef.current = false;
    queryClient.setQueryData(["payment-order"], null);
    setIsRegisterSubmitting(true);

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
    console.log("payload", payload);

    try {
      const registrationResponse = await createRegistrationMutation.mutateAsync(payload);
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
    } catch {
      // Error state is handled by createRegistrationMutation.error.
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

  const isSaveRegistrationCta =
    stepIndex === STEPS.length - 2;

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
                category={CATEGORIES.find(
                  (item) => item.value === form.category,
                )}
                teamSize={TEAM_SIZES.find(
                  (item) => item.value === form.teamSize,
                )}
                onChange={updateField}
              />
            )}

            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-border/70 pt-5 sm:flex-row sm:items-center sm:justify-between">
              {stepIndex > 0 ? (
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
                      type="submit"
                      disabled={isRegisterSubmitting || isSavingRegistration}
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
                        className="max-w-sm text-right text-sm font-medium text-destructive"
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
                      <ArrowCounterClockwise size={18} className="animate-spin" />
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
                          Reference: {String(
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
      </>
    </section>
  );
}

export default function StepperForm({ identifier, setIdentifier }) {
  return (
    <StepperFormContent identifier={identifier} setIdentifier={setIdentifier} />
  );
}
