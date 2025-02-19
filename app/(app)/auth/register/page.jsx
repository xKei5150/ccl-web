import { RegisterForm } from "@/components/auth/register-form";

export const metadata = {
  title: "Register | CCL",
  description: "Barangay Management System Authentication",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <RegisterForm />
    </div>
  );
}