import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata = {
    title: "Forgot Password | CCL",
    description: "Barangay Manaagement System",
  };

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <ForgotPasswordForm />
    </div>
  );
}