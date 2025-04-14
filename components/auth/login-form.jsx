"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LogIn } from "lucide-react";
import { login } from "@/app/(app)/auth/actions";
import Link from "next/link";
import { useForm } from "react-hook-form";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const returnTo = searchParams.get("from") || "/dashboard";

  async function handleLogin(data) {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("password", data.password);
      
      const result = await login(formData);

      if (result.success) {
        toast({
          title: "Welcome back!",
          description: "Login successful",
        });
        
        router.refresh();
        router.replace(returnTo);
      } else {
        // Set form errors based on the error message
        if (result.error.toLowerCase().includes("email")) {
          form.setError("email", {
            type: "manual",
            message: "Invalid email address",
          });
        }
        if (result.error.toLowerCase().includes("password")) {
          form.setError("password", {
            type: "manual",
            message: "Invalid password",
          });
        }
        // If no specific error, set both
        if (!result.error.toLowerCase().includes("email") && 
            !result.error.toLowerCase().includes("password")) {
          form.setError("email", {
            type: "manual",
            message: "Invalid credentials",
          });
          form.setError("password", {
            type: "manual",
            message: "Invalid credentials",
          });
        }

        toast({
          variant: "destructive",
          title: "Login failed",
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleLogin)}>
        <div className="space-y-3">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="Enter your email"
                    required
                    autoComplete="email"
                    disabled={isLoading}
                    className="h-9"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel className="text-sm">Password</FormLabel>
                  <Link href="/auth/forgot-password" className="text-xs text-primary hover:underline">
                    Forgot?
                  </Link>
                </div>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                    disabled={isLoading}
                    className="h-9"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        </div>
        
        <Button type="submit" className="w-full mt-4 h-9" disabled={isLoading}>
          <LogIn className="mr-2 h-4 w-4" />
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
        
        <div className="mt-3 text-center text-xs">
          Don't have an account?{" "}
          <Link href="/auth/register" className="text-primary hover:underline">
            Register
          </Link>
        </div>
      </form>
    </Form>
  );
}