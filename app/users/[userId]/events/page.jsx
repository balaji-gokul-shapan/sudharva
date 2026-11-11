import EventRegistrationModule from "./EventRegistrationModule";
import { getUserRegistrationServer } from "@/lib/server/getUserRegistration";

export default async function UserEventsPage({ params }) {
  const resolvedParams = await params;
  const userId = String(resolvedParams?.userId || "").trim();
  const registration = await getUserRegistrationServer(userId);

  return (
    <div className="space-y-6">
      <EventRegistrationModule userId={userId} registration={registration} />
    </div>
  );
}