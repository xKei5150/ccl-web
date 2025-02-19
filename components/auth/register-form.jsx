"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { UserPlus, ArrowLeft, ArrowRight } from "lucide-react";
import { register } from "@/app/(app)/auth/actions";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function RegisterForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: {
      firstName: "",
      middleName: "",
      lastName: "",
    },
    contact: {
      localAddress: "",
    },
    demographics: {
      sex: "",
      birthDate: "",
      maritalStatus: "",
    },
    status: {
      residencyStatus: "",
    },
  });

  async function handleRegister(e) {
    e.preventDefault();
    try {
      setIsLoading(true);
      const result = await register(formData);

      if (result.success) {
        toast({
          title: "Registration successful!",
          description: "Please check your email to verify your account.",
        });
        router.push("/auth/login");
      } else {
        toast({
          variant: "destructive",
          title: "Registration failed",
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

  function handleInputChange(e) {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [group, field] = name.split(".");
      setFormData(prev => ({
        ...prev,
        [group]: {
          ...prev[group],
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  }

  function handleSelectChange(value, name) {
    if (name.includes(".")) {
      const [group, field] = name.split(".");
      setFormData(prev => ({
        ...prev,
        [group]: {
          ...prev[group],
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  }

  function validateStep1() {
    return (
      formData.email &&
      formData.password &&
      formData.confirmPassword &&
      formData.password === formData.confirmPassword &&
      formData.password.length >= 6
    );
  }

  function validateStep2() {
    return (
      formData.name.firstName &&
      formData.name.lastName &&
      formData.contact.localAddress &&
      formData.demographics.sex &&
      formData.demographics.birthDate &&
      formData.demographics.maritalStatus &&
      formData.status.residencyStatus
    );
  }

  const renderStep1 = () => (
    <>
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
        <CardDescription>
          Step 1: Enter your account credentials
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Create a password"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="Confirm your password"
            required
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <Button
          type="button"
          className="w-full"
          onClick={() => setStep(2)}
          disabled={!validateStep1()}
        >
          Next Step
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        <p className="text-sm text-muted-foreground text-center">
          Already have an account?{" "}
          <Button variant="link" className="p-0 h-auto" asChild>
            <Link href="/auth/login">Sign in</Link>
          </Button>
        </p>
      </CardFooter>
    </>
  );

  const renderStep2 = () => (
    <>
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-2xl font-bold">Personal Information</CardTitle>
        <CardDescription>
          Step 2: Tell us about yourself
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                name="name.firstName"
                value={formData.name.firstName}
                onChange={handleInputChange}
                placeholder="First Name"
                required
              />
              <Input
                name="name.middleName"
                value={formData.name.middleName}
                onChange={handleInputChange}
                placeholder="Middle Name (optional)"
              />
              <Input
                name="name.lastName"
                value={formData.name.lastName}
                onChange={handleInputChange}
                placeholder="Last Name"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="localAddress">Local Address</Label>
            <Input
              id="localAddress"
              name="contact.localAddress"
              value={formData.contact.localAddress}
              onChange={handleInputChange}
              placeholder="Enter your address"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Sex</Label>
              <Select
                value={formData.demographics.sex}
                onValueChange={(value) => handleSelectChange(value, "demographics.sex")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select sex" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Birth Date</Label>
              <Input
                type="date"
                name="demographics.birthDate"
                value={formData.demographics.birthDate}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Marital Status</Label>
              <Select
                value={formData.demographics.maritalStatus}
                onValueChange={(value) => handleSelectChange(value, "demographics.maritalStatus")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="married">Married</SelectItem>
                  <SelectItem value="divorced">Divorced</SelectItem>
                  <SelectItem value="widowed">Widowed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Residency Status</Label>
              <Select
                value={formData.status.residencyStatus}
                onValueChange={(value) => handleSelectChange(value, "status.residencyStatus")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="renting">Renting</SelectItem>
                  <SelectItem value="own-mortgage">Own (with mortgage)</SelectItem>
                  <SelectItem value="own-outright">Own (outright)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => setStep(1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button
          type="submit"
          className="flex-1"
          disabled={isLoading || !validateStep2()}
        >
          <UserPlus className="mr-2 h-4 w-4" />
          {isLoading ? "Creating account..." : "Create Account"}
        </Button>
      </CardFooter>
    </>
  );

  return (
    <Card className="w-full max-w-md">
      <form onSubmit={handleRegister}>
        {step === 1 ? renderStep1() : renderStep2()}
      </form>
    </Card>
  );
}