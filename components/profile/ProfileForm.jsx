'use client';

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUpload } from "@/components/ui/file-upload";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Mail, Home, HeartPulse, Save, Shield, Camera, Upload } from "lucide-react";

const formSchema = z.object({
    user: z.object({
        email: z.string().email("Invalid email address"),
        isActive: z.string().optional(),
        password: z.string().optional(),
        confirmPassword: z.string().optional(),
    }).refine(data => {
        if (data.password || data.confirmPassword) {
            return data.password === data.confirmPassword;
        }
        return true;
    }, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    }),
    personalInfo: z.object({
        photo: z.any().optional(),
        name: z.object({
            firstName: z.string().min(1, "First name is required"),
            middleName: z.string().optional(),
            lastName: z.string().min(1, "Last name is required"),
        }),
        contact: z.object({
            emailAddress: z.string().email("Invalid email address"),
            localAddress: z.string().min(1, "Address is required"),
        }),
        demographics: z.object({
            sex: z.enum(["male", "female", "other"], {
                required_error: "Please select a sex",
            }),
            birthDate: z.string().optional(),
            maritalStatus: z.enum(["single", "married", "divorced", "widowed"], {
                required_error: "Please select a marital status",
            }),
        }),
        status: z.object({
            residencyStatus: z.enum(["permanent", "temporary"], {
                required_error: "Please select a residency status",
            }).optional(),
            lifeStatus: z.enum(["alive", "deceased"]).default("alive").optional(),
        }),
    }),
});

export default function ProfileForm({ defaultValues, onSubmit, submitText = "Save Profile" }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState("profile");

    // Prepare default values with proper formatting
    const prepareDefaultValues = (data) => {
        if (!data) return {
            user: {
                email: "",
                isActive: "active",
                password: "",
                confirmPassword: "",
            },
            personalInfo: {
                name: {
                    firstName: "",
                    middleName: "",
                    lastName: "",
                },
                contact: {
                    emailAddress: "",
                    localAddress: "",
                },
                demographics: {
                    sex: "",
                    birthDate: "",
                    maritalStatus: "",
                },
                status: {
                    residencyStatus: "",
                    lifeStatus: "alive",
                },
            }
        };

        // Extract personal info data
        const personalInfo = data.personalInfo || {};

        // Format the date if it exists (YYYY-MM-DD for input type="date")
        let formattedBirthDate = "";
        if (personalInfo.demographics?.birthDate) {
            const date = new Date(personalInfo.demographics.birthDate);
            if (!isNaN(date.getTime())) {
                formattedBirthDate = date.toISOString().split('T')[0];
            }
        }

        return {
            user: {
                email: data.email || "",
                isActive: data.isActive || "active",
                password: "",
                confirmPassword: "",
            },
            personalInfo: {
                photo: personalInfo.photo || null,
                name: {
                    firstName: personalInfo.name?.firstName || "",
                    middleName: personalInfo.name?.middleName || "",
                    lastName: personalInfo.name?.lastName || "",
                },
                contact: {
                    emailAddress: personalInfo.contact?.emailAddress || data.email || "",
                    localAddress: personalInfo.contact?.localAddress || "",
                },
                demographics: {
                    sex: personalInfo.demographics?.sex || "",
                    birthDate: formattedBirthDate,
                    maritalStatus: personalInfo.demographics?.maritalStatus || "",
                },
                status: {
                    residencyStatus: personalInfo.status?.residencyStatus || "",
                    lifeStatus: personalInfo.status?.lifeStatus || "alive",
                },
            }
        };
    };

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: prepareDefaultValues(defaultValues),
    });

    // Update form when defaultValues change
    useEffect(() => {
        if (defaultValues) {
            const formattedValues = prepareDefaultValues(defaultValues);
            form.reset(formattedValues);
        }
    }, [defaultValues, form]);

    const handleSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            const formData = new FormData();

            // Remove password fields if empty
            if (!data.user.password) {
                delete data.user.password;
                delete data.user.confirmPassword;
            }

            formData.append("json", JSON.stringify(data));

            // Handle photo upload
            if (data.personalInfo.photo instanceof FileList || (Array.isArray(data.personalInfo.photo) && data.personalInfo.photo[0] instanceof File)) {
                formData.append("photo", Array.isArray(data.personalInfo.photo) ? data.personalInfo.photo[0] : data.personalInfo.photo);
            }

            await onSubmit(formData);
        } catch (error) {
            console.error("Error submitting form:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Get initials for avatar fallback
    const getInitials = () => {
        const firstName = form.watch("personalInfo.name.firstName");
        const lastName = form.watch("personalInfo.name.lastName");
        return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <Tabs defaultValue="profile" className="w-full" onValueChange={setActiveTab}>
                    <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-6">
                        <TabsTrigger value="profile" className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Profile Information
                        </TabsTrigger>
                        <TabsTrigger value="security" className="flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            Account Security
                        </TabsTrigger>
                    </TabsList>

                    {/* Profile Information Tab */}
                    <TabsContent value="profile" className="space-y-6">
                        {/* Photo Upload Section */}
                        <Card className="border-none shadow-md bg-gradient-to-br from-white to-gray-50">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Camera className="w-5 h-5 text-primary" />
                                    Profile Photo
                                </CardTitle>
                                <Separator />
                            </CardHeader>
                            <CardContent className="pt-6">
                                <FormField
                                    control={form.control}
                                    name="personalInfo.photo"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col items-center">
                                            {/* <div className="mb-6">
                                                <div className="relative group">
                                                    <Avatar className="w-36 h-36 border-4 border-white shadow-lg">
                                                        {field.value?.url ? (
                                                            <AvatarImage
                                                                src={field.value.url}
                                                                alt="Profile photo"
                                                                className="object-cover"
                                                            />
                                                        ) : (
                                                            <AvatarFallback className="bg-primary/10 text-2xl">
                                                                {getInitials()}
                                                            </AvatarFallback>
                                                        )}
                                                    </Avatar>
                                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-full">
                                                        <div className="bg-white/90 rounded-full p-2">
                                                            <Upload className="h-6 w-6 text-primary" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div> */}

                                            <div className="w-full max-w-sm">
                                                <FileUpload
                                                    onFileSelect={(file) => field.onChange(file)}
                                                    value={field.value}
                                                    onRemove={() => field.onChange(null)}
                                                    accept={{
                                                        "image/*": [".png", ".jpg", ".jpeg", ".gif"],
                                                    }}
                                                    previewSize="small"
                                                />
                                                <FormDescription className="text-center mt-2 text-xs text-muted-foreground">
                                                    Upload a square image for best results. Maximum size: 5MB.
                                                </FormDescription>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        {/* Basic Information */}
                        <Card className="border-none shadow-md">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="w-5 h-5 text-primary" />
                                    Basic Information
                                </CardTitle>
                                <Separator />
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="personalInfo.name.firstName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>First Name</FormLabel>
                                                <FormControl>
                                                    <Input {...field} className="bg-white" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="personalInfo.name.middleName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Middle Name</FormLabel>
                                                <FormControl>
                                                    <Input {...field} className="bg-white" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="personalInfo.name.lastName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Last Name</FormLabel>
                                                <FormControl>
                                                    <Input {...field} className="bg-white" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="personalInfo.demographics.sex"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Sex</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="bg-white">
                                                            <SelectValue placeholder="Select sex" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="male">Male</SelectItem>
                                                        <SelectItem value="female">Female</SelectItem>
                                                        <SelectItem value="other">Other</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="personalInfo.demographics.birthDate"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Birth Date</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="date"
                                                        {...field}
                                                        className="bg-white"
                                                        value={field.value || ""}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Contact Information */}
                        <Card className="border-none shadow-md">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Mail className="w-5 h-5 text-primary" />
                                    Contact Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="personalInfo.contact.emailAddress"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Contact Email</FormLabel>
                                            <FormControl>
                                                <Input {...field} type="email" className="bg-white" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="personalInfo.contact.localAddress"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Address</FormLabel>
                                            <FormControl>
                                                <Input {...field} className="bg-white" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        {/* Status Information */}
                        <Card className="border-none shadow-md">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <HeartPulse className="w-5 h-5 text-primary" />
                                    Status Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="personalInfo.demographics.maritalStatus"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Marital Status</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="bg-white">
                                                            <SelectValue placeholder="Select marital status" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="single">Single</SelectItem>
                                                        <SelectItem value="married">Married</SelectItem>
                                                        <SelectItem value="divorced">Divorced</SelectItem>
                                                        <SelectItem value="widowed">Widowed</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="personalInfo.status.residencyStatus"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Residency Status</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                                                    <FormControl>
                                                        <SelectTrigger className="bg-white">
                                                            <SelectValue placeholder="Select residency status" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="permanent">Permanent</SelectItem>
                                                        <SelectItem value="temporary">Temporary</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Account Security Tab */}
                    <TabsContent value="security" className="space-y-6">
                        {/* Account Information */}
                        <Card className="border-none shadow-md">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="w-5 h-5 text-primary" />
                                    Account Information
                                </CardTitle>
                                <Separator />
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="user.email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email Address</FormLabel>
                                            <FormControl>
                                                <Input {...field} type="email" className="bg-white" />
                                            </FormControl>
                                            <FormDescription>
                                                This is your account login email.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        {/* Password Change */}
                        <Card className="border-none shadow-md">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-primary" />
                                    Change Password
                                </CardTitle>
                                <Separator />
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="user.password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>New Password</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="password"
                                                    className="bg-white"
                                                    placeholder="Enter new password"
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Leave blank to keep your current password.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="user.confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Confirm New Password</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="password"
                                                    className="bg-white"
                                                    placeholder="Confirm new password"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                <div className="flex justify-end pt-6">
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full md:w-auto"
                    >
                        {isSubmitting ? (
                            <div className="flex items-center gap-2">
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                <span>Saving...</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Save className="w-4 h-4" />
                                <span>{submitText}</span>
                            </div>
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
} 