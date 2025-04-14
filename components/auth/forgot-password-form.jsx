"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, ArrowLeft } from "lucide-react";
import { resetPassword } from "@/app/(app)/auth/actions";
import Link from "next/link";

export function ForgotPasswordForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  async function handleSubmit(formData) {
    try {
      setIsLoading(true);
      const result = await resetPassword(formData);

      if (result.success) {
        setIsSubmitted(true);
        toast({
          title: "Check your email",
          description: "We've sent you instructions to reset your password.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Request failed",
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
        <h2 className="text-base font-medium mb-2">Check Your Email</h2>
        <p className="text-xs text-muted-foreground mb-4">
          We've sent password reset instructions to your email address.
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

  return (
    <div>
      <h2 className="text-base font-medium mb-1">Forgot Password</h2>
      <p className="text-xs text-muted-foreground mb-3">
        Enter your email to receive a password reset link
      </p>
      
      <form action={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            required
            className="h-9 text-sm"
          />
        </div>
        
        <Button type="submit" className="w-full h-9 text-sm" disabled={isLoading}>
          <Mail className="mr-2 h-4 w-4" />
          {isLoading ? "Sending..." : "Send Reset Link"}
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