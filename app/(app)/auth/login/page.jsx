import { LoginForm } from "@/components/auth/login-form";

export const metadata = {
    title: "Login | CCL",
    description: "Barangay Manaagement System",
  };

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <LoginForm />
    </div>
  );
}
