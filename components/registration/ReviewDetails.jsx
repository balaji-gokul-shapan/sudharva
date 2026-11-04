import { InformationCircle } from "@animateicons/react/huge";
import { CATEGORIES, GENDERS, TEAM_SIZES } from "./datas/data";
import { useAppSelector } from "@/store/hooks";

export const ReviewDetails = ({ form, onEdit }) => {
  const masterData = useAppSelector((state) => state.master.data);
  const registrationCategories = masterData?.registration_category ?? [];
  const tshirtSizes = masterData?.tshirt_size ?? [];

  const categoryById = registrationCategories.find(
    (item) => String(item.id) === String(form.runner_category_id),
  );
  const categoryByValue = CATEGORIES.find(
    (item) => String(item.value) === String(form.runner_category_id),
  );
  const category =
    categoryById ||
    categoryByValue ||
    CATEGORIES.find((item) => item.value === form.category);

  const tshirt = tshirtSizes.find(
    (item) => String(item.id) === String(form.tshirt_size_id),
  );

  const gender = GENDERS.find((item) => item.value === form.gender);
  const teamSize = TEAM_SIZES.find((item) => item.value === form.teamSize);
  const isCorporate = form.entryType === "corporate";
  const showNominee = Boolean(form.useNominee);

  const getBoolTone = (value) =>
    value
      ? "border-emerald-300/50 bg-emerald-500/10 text-emerald-700"
      : "border-rose-300/60 bg-rose-500/10 text-rose-700";

  const getBoolLabel = (value, yes = "Yes", no = "No") => (value ? yes : no);

  const requiredConsentChecks = [
    {
      label: "Medical fitness declaration",
      value: !!form.medical_fitness_declaration,
      yesLabel: "Confirmed",
      noLabel: "Missing",
    },
    {
      label: "Physical exertion acknowledgement",
      value: !!form.physical_exertion_acknowledgement,
      yesLabel: "Acknowledged",
      noLabel: "Missing",
    },
    {
      label: "Event rules acceptance",
      value: !!form.event_rules_acceptance,
      yesLabel: "Accepted",
      noLabel: "Missing",
    },
    {
      label: "Event communication consent",
      value: !!form.event_communication_consent,
      yesLabel: "Consented",
      noLabel: "Missing",
    },
    {
      label: "Anonymized impact reporting consent",
      value: !!form.anonymized_impact_reporting_consent,
      yesLabel: "Consented",
      noLabel: "Missing",
    },
  ];

  const requiredCompleted = requiredConsentChecks.filter((item) => item.value).length;
  const completionPercent = Math.round(
    (requiredCompleted / requiredConsentChecks.length) * 100,
  );

  const groups = [
    {
      title: isCorporate ? "Company Details" : "Participant Details",
      editStep: 0,
      details: isCorporate
        ? [
            ["Company", form.companyName],
            ["Contact person", form.contactName],
            ["Work email", form.workEmail],
            ["Company phone", form.companyPhone],
            ["Team size", teamSize?.label],
          ]
        : [
            [
              "Full name",
              [form.first_name, form.last_name].filter(Boolean).join(" "),
            ],
            ["Email", form.email],
            ["Mobile", form.mobile_number],
            ["Date of birth", form.date_of_birth],
            ["Gender", gender?.label],
            [
              "Residential address",
              [
                form.resident_address_line1,
                form.resident_address_line2,
                form.resident_city,
                form.resident_state,
                form.resident_pincode,
              ]
                .filter(Boolean)
                .join(", "),
            ],
          ],
    },
    {
      title: "Event & race day",
      editStep: 1,
      details: [
        ["Event", category?.label || category?.name],
        ["Distance / role", category?.distance],
        [
          "T-shirt",
          tshirt?.value || tshirt?.name || tshirt?.label || form.tshirt_size_id,
        ],
        ["Emergency contact", form.emergencyName],
        ["Emergency phone", form.emergencyPhone],
        // [
        //   "Delivery address",
        //   [
        //     form.delivery_address_line1,
        //     form.delivery_address_line2,
        //     form.delivery_city,
        //     form.delivery_taulk,
        //     form.delivery_district,
        //     form.delivery_state,
        //     form.delivery_pincode,
        //   ]
        //     .filter(Boolean)
        //     .join(", "),
        // ],
      ],
    },
    {
      title: "Nominee contact",
      editStep: 3,
      details: [
        ["Nominee name", form.beneficiary_name],
        ["Nominee phone", form.beneficiary_mobile],
        ["Nominee email", form.beneficiary_email],
        ["Nominee address", form.beneficiary_address],
      ],
    },
    {
      title: "Health & consent",
      editStep: 2,
      details: [
        [
          "Medical fitness declaration",
          getBoolLabel(form.medical_fitness_declaration, "Confirmed", "Not confirmed"),
        ],
        [
          "Previous marathon participation",
          form.previous_marathon_participation ? "Yes" : "No",
        ],
        ["Cardiac condition", form.cardiac_condition ? "Yes" : "No"],
        ["Hypertension", form.hypertension ? "Yes" : "No"],
        ["Diabetes", form.has_diabetes ? "Yes" : "No"],
        ["Allergies", form.allergies || "None provided"],
        [
          "Other medical conditions",
          form.other_medical_conditions || "None provided",
        ],
        [
          "Physical exertion acknowledgement",
          getBoolLabel(
            form.physical_exertion_acknowledgement,
            "Acknowledged",
            "Not acknowledged",
          ),
        ],
        [
          "Event communication consent",
          getBoolLabel(form.event_communication_consent, "Consented", "Not consented"),
        ],
        [
          "Event rules acceptance",
          getBoolLabel(form.event_rules_acceptance, "Accepted", "Not accepted"),
        ],
        [
          "Anonymized impact reporting consent",
          getBoolLabel(
            form.anonymized_impact_reporting_consent,
            "Consented",
            "Not consented",
          ),
        ],
      ],
    },
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-accent/20 bg-accent/5 p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent">
            <InformationCircle size={19} weight="duotone" />
          </span>
          <p className="text-sm leading-relaxed text-ink-soft">
            Take a moment to check your details. You can go back to either
            section to make changes before finishing.
          </p>
        </div>
      </div>
      {groups
        .filter((group) => group.title !== "Nominee contact" || showNominee)
        .map((group) => (
          <section
            key={group.title}
            className="rounded-2xl border border-border bg-background p-4 sm:p-5"
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="font-semibold text-foreground">{group.title}</h3>
              <button
                type="button"
                onClick={() => onEdit(group.editStep)}
                className="rounded-lg px-3 py-1.5 text-xs font-bold text-accent transition hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-accent/40"
              >
                Edit
              </button>
            </div>
            {group.title === "Health & consent" ? (
              <div className="space-y-5">
                <div className="rounded-2xl border border-border bg-linear-to-br from-accent/10 via-background to-emerald-500/10 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-soft">
                      Required compliance
                    </p>
                    <span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold text-foreground">
                      {requiredCompleted}/{requiredConsentChecks.length} completed
                    </span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-border">
                    <div
                      className="h-full rounded-full bg-accent transition-all duration-300"
                      style={{ width: `${completionPercent}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-ink-soft">
                    Complete all required declarations and consents before submission.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {requiredConsentChecks.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-xl border border-border bg-background/70 p-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-foreground">{item.label}</p>
                        <span className="rounded-full border border-amber-300/50 bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-amber-700">
                          Required
                        </span>
                      </div>
                      <span
                        className={`mt-3 inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getBoolTone(
                          item.value,
                        )}`}
                      >
                        {getBoolLabel(item.value, item.yesLabel, item.noLabel)}
                      </span>
                    </div>
                  ))}
                </div>

                <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
                  {group.details.map(([label, value]) => (
                    <div key={label} className="min-w-0">
                      <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink-soft">
                        {label}
                      </dt>
                      <dd className="mt-1 wrap-break-word text-sm font-medium text-foreground">
                        {value || "-"}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : (
              <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
                {group.details.map(([label, value]) => (
                  <div key={label} className="min-w-0">
                    <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink-soft">
                      {label}
                    </dt>
                    <dd className="mt-1 wrap-break-word text-sm font-medium text-foreground">
                      {value || "-"}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </section>
        ))}
    </div>
  );
}