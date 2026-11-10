import EventRegistrationModule from "./EventRegistrationModule";
import { getUserRegistrationServer } from "@/lib/server/getUserRegistration";

export default async function UserEventsPage({ params }) {
  const userId = String(params?.userId || "").trim();
  const registration = await getUserRegistrationServer(userId);

  return (
    <div className="space-y-6">
      <EventRegistrationModule userId={userId} registration={registration} />
    </div>
  );
}