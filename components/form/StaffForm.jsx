"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { createStaffMember, updateStaffMember } from "@/app/(app)/dashboard/staff/actions";
import { PersonalInfoSelect } from "@/components/form/PersonalInfoSelect";

export function StaffForm({ defaultValues }) {
  const router = useRouter();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm({
    defaultValues: defaultValues || {
      email: "",
      personalInfo: null,
      isActive: "active",
    },
  });

  const onSubmit = async (data) => {
    try {
      if (defaultValues) {
        await updateStaffMember(data, defaultValues.id);
        toast({
          title: "Success",
          description: "Staff member updated successfully",
        });
      } else {
        await createStaffMember(data);
        toast({
          title: "Success",
          description: "Staff member created successfully",
        });
      }
      router.push("/dashboard/staff");
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Email</label>
              <Input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                type="email"
                placeholder="staff@example.com"
                error={errors.email?.message}
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Personal Information</label>
              <PersonalInfoSelect
                value={watch("personalInfo")}
                onChange={(value) => setValue("personalInfo", value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/staff")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : defaultValues ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}