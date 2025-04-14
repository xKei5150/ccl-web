"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
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
      <h2 className="text-base font-medium mb-1">Create an Account</h2>
      <p className="text-xs text-muted-foreground mb-3">
        Step 1: Enter your account credentials
      </p>
      
      <form className="space-y-3">
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
            required
            className="h-9 text-sm"
          />
        </div>
        
        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-sm">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Create a password"
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
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="Confirm your password"
            required
            className="h-9 text-sm"
          />
        </div>
        
        <Button
          type="button"
          className="w-full mt-2 h-9 text-sm"
          onClick={() => setStep(2)}
          disabled={!validateStep1()}
        >
          Next Step
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        
        <p className="text-xs text-muted-foreground text-center">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </>
  );

  const renderStep2 = () => (
    <>
      <h2 className="text-base font-medium mb-1">Personal Information</h2>
      <p className="text-xs text-muted-foreground mb-3">
        Step 2: Tell us about yourself
      </p>
      
      <form onSubmit={handleRegister} className="space-y-3">
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label className="text-sm">Name</Label>
            <div className="grid grid-cols-2 gap-1.5">
              <Input
                name="name.firstName"
                value={formData.name.firstName}
                onChange={handleInputChange}
                placeholder="First Name"
                required
                className="h-9 text-sm"
              />
              <Input
                name="name.lastName"
                value={formData.name.lastName}
                onChange={handleInputChange}
                placeholder="Last Name"
                required
                className="h-9 text-sm"
              />
            </div>
            <Input
              name="name.middleName"
              value={formData.name.middleName}
              onChange={handleInputChange}
              placeholder="Middle Name (optional)"
              className="h-9 text-sm mt-1.5"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="localAddress" className="text-sm">Address</Label>
            <Input
              id="localAddress"
              name="contact.localAddress"
              value={formData.contact.localAddress}
              onChange={handleInputChange}
              placeholder="Enter your address"
              required
              className="h-9 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            <div className="space-y-1.5">
              <Label htmlFor="sex" className="text-sm">Sex</Label>
              <Select
                value={formData.demographics.sex}
                onValueChange={(value) => handleSelectChange(value, "demographics.sex")}
              >
                <SelectTrigger id="sex" className="h-9 text-sm">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="birthDate" className="text-sm">Birth Date</Label>
              <Input
                id="birthDate"
                name="demographics.birthDate"
                type="date"
                value={formData.demographics.birthDate}
                onChange={handleInputChange}
                required
                className="h-9 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            <div className="space-y-1.5">
              <Label htmlFor="maritalStatus" className="text-sm">Marital Status</Label>
              <Select
                value={formData.demographics.maritalStatus}
                onValueChange={(value) =>
                  handleSelectChange(value, "demographics.maritalStatus")
                }
              >
                <SelectTrigger id="maritalStatus" className="h-9 text-sm">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="married">Married</SelectItem>
                  <SelectItem value="widowed">Widowed</SelectItem>
                  <SelectItem value="divorced">Divorced</SelectItem>
                  <SelectItem value="separated">Separated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="residencyStatus" className="text-sm">Residency</Label>
              <Select
                value={formData.status.residencyStatus}
                onValueChange={(value) =>
                  handleSelectChange(value, "status.residencyStatus")
                }
              >
                <SelectTrigger id="residencyStatus" className="h-9 text-sm">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="permanent">Permanent</SelectItem>
                  <SelectItem value="temporary">Temporary</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex gap-1.5 mt-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setStep(1)}
            disabled={isLoading}
            className="h-9 text-xs"
          >
            <ArrowLeft className="mr-1 h-3 w-3" />
            Back
          </Button>
          <Button
            type="submit"
            className="flex-1 h-9 text-xs"
            disabled={!validateStep2() || isLoading}
          >
            {isLoading ? "Registering..." : "Register"}
            <UserPlus className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </form>
    </>
  );

  return (
    <div className="w-full">
      {step === 1 ? renderStep1() : renderStep2()}
    </div>
  );
}