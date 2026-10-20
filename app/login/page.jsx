import LoginForm from "@/components/auth/LoginForm";

export const metadata = {
  title: "Login — Sudharva Marathon",
  description:
    "Sign-in preview for the Sudharva Marathon. Email and phone authentication will be available when the sign-in service is connected.",
};

export default function LoginPage() {
  return (
    <section className="relative py-10 sm:py-16">
      <div className="container-page">
        <LoginForm />
      </div>
    </section>
  );
}
