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

  const groups = [
    {
      title: isCorporate ? "Company" : "Participant",
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
        ["Medical fitness", form.medical_fitness_declaration ? "Confirmed" : "Not confirmed"],
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
          "Physical activity",
          form.physical_exertion_acknowledgement ? "Acknowledged" : "Not acknowledged",
        ],
        ["Event updates", form.eventUpdates ? "Consented" : "Not consented"],
        ["Event terms", form.terms ? "Accepted" : "Not accepted"],
        [
          "Wellness data use",
          form.dataPrivacy ? "Authorized" : "Not authorized",
        ],
        [
          "Payment",
          form.paymentReported
            ? "Reported by participant — awaiting organizer verification"
            : "Not reported",
        ],
      ],
    },
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-accent/20 bg-accent/5 p-4 sm:p-5">
        <div className="flex items-start gap-3">
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
                className="rounded-lg px-3 py-1.5 text-xs font-bold text-accent transition hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
              >
                Edit
              </button>
            </div>
            <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
              {group.details.map(([label, value]) => (
                <div key={label} className="min-w-0">
                  <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink-soft">
                    {label}
                  </dt>
                  <dd className="mt-1 break-words text-sm font-medium text-foreground">
                    {value || "-"}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
    </div>
  );
}