"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
        <CardDescription>
          Sign in to access the Barangay Management System
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleLogin)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="Enter your email"
                      required
                      autoComplete="email"
                      disabled={isLoading}
                      aria-describedby="email-error"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Enter your password"
                      required
                      autoComplete="current-password"
                      disabled={isLoading}
                      aria-describedby="password-error"
                    />
                  </FormControl>
                  <FormMessage />
                  <div className="text-right">
                    <Button variant="link" className="p-0 h-auto" asChild>
                      <Link href="/auth/forgot-password">
                        Forgot password?
                      </Link>
                    </Button>
                  </div>
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              <LogIn className="mr-2 h-4 w-4" />
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </CardFooter>
          <div className="mt-2 text-center text-sm">
            Don't have an account?{" "}
            <Link href="/auth/register" className="underline">
              Register
            </Link>
          </div>
        </form>
      </Form>
    </Card>
  );
}