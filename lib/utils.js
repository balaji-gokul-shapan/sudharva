export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function calculateAge(dobString) {
  if (!dobString) return null;

  const dob = new Date(`${dobString}T00:00:00`);
  if (Number.isNaN(dob.getTime())) return null;

  const today = new Date();
  const todayDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  let age = todayDate.getFullYear() - dob.getFullYear();

  const hasHadBirthdayThisYear =
    todayDate.getMonth() > dob.getMonth() ||
    (todayDate.getMonth() === dob.getMonth() &&
      todayDate.getDate() >= dob.getDate());

  if (!hasHadBirthdayThisYear) {
    age--;
  }

  return age;
}

export const formatDate = (value) => {
  if (!value) return "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export function formatDateTime(value) {
  if (!value) return "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}