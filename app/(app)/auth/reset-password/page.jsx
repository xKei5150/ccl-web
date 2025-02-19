import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata = {
    title: "Reset Password | CCL",
    description: "Barangay Manaagement System",
  };

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <ResetPasswordForm />
    </div>
  );
}