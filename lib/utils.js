export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Calculate age from a date-of-birth string (YYYY-MM-DD).
 * Returns the age in completed years, or null if invalid.
 */
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
