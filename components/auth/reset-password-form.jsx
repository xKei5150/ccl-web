"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { KeyRound, ArrowLeft } from "lucide-react";
import { resetPassword } from "@/app/(app)/auth/actions";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export function ResetPasswordForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  async function handleSubmit(formData) {
    try {
      setIsLoading(true);
      
      if (!token) {
        toast({
          variant: "destructive",
          title: "Invalid token",
          description: "Password reset token is missing or invalid",
        });
        return;
      }

      const password = formData.get("password");
      const confirmPassword = formData.get("confirmPassword");

      if (password !== confirmPassword) {
        toast({
          variant: "destructive",
          title: "Passwords don't match",
          description: "Please ensure both passwords match",
        });
        return;
      }

      const result = await resetPassword({
        password,
        token,
      });

      if (result.success) {
        setIsSubmitted(true);
        toast({
          title: "Password reset successful",
          description: "Your password has been updated",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Reset failed",
          description: result.error,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (isSubmitted) {
    return (
      <div className="text-center">
        <h2 className="text-base font-medium mb-2">Password Reset Complete</h2>
        <p className="text-xs text-muted-foreground mb-4">
          Your password has been successfully reset.
        </p>
        <Link 
          href="/auth/login" 
          className="text-sm text-primary hover:underline flex items-center justify-center"
        >
          <ArrowLeft className="mr-1 h-3 w-3" />
          Return to Login
        </Link>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="text-center">
        <h2 className="text-base font-medium mb-2">Invalid Request</h2>
        <p className="text-xs text-muted-foreground mb-4">
          The password reset link is invalid or expired.
        </p>
        <Link 
          href="/auth/forgot-password" 
          className="text-sm text-primary hover:underline flex items-center justify-center"
        >
          <ArrowLeft className="mr-1 h-3 w-3" />
          Request New Link
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-base font-medium mb-1">Reset Password</h2>
      <p className="text-xs text-muted-foreground mb-3">
        Enter your new password below
      </p>
      
      <form action={handleSubmit} className="space-y-3">
        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-sm">New Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            className="h-9 text-sm"
          />
        </div>
        
        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword" className="text-sm">Confirm Password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            className="h-9 text-sm"
          />
        </div>
        
        <Button type="submit" className="w-full h-9 text-sm mt-4" disabled={isLoading}>
          <KeyRound className="mr-2 h-4 w-4" />
          {isLoading ? "Resetting..." : "Reset Password"}
        </Button>
        
        <div className="text-center">
          <Link 
            href="/auth/login" 
            className="text-xs text-primary hover:underline inline-flex items-center"
          >
            <ArrowLeft className="mr-1 h-3 w-3" />
            Back to Login
          </Link>
        </div>
      </form>
    </div>
  );
}