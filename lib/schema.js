import { z } from "zod";

const basicString = z.string().min(1).max(255);

export const supportingDocumentSchema = z.object({
  file: z.instanceof(File),
  notes: z.string().optional(),
});

export const householdSchema = z.object({
  familyName: basicString,
  members: z.array(z.string()),
  localAddress: z.string(),
  residencyDate: z.date(),
  status: z.string(),
});

export const personalDataSchema = z.object({
  photo: z.string().uuid(),
  firstName: basicString,
  middleName: z.string().max(255).optional(),
  lastName: basicString,
  birthDate: z.string(),
  sex: z.enum(["male", "female"]),
  contactNo: z.array(z.number()),
  emailAddress: z.string().email(),
  localAddress: z.string(),
  lifeStatus: z.enum(["alive", "deceased"]),
  citizenship: z.string(),
  maritalStatus: z.enum(["single", "married", "widowed", "separated"]),
  residencyStatus: z.enum(["living with family/relatives", "renting", "owned"]),
});

export const generalRequestTypeSchema = z.enum([
  "indigencyCertificate",
  "barangayClearance",
  "barangayResidency",
]);

export const generalRequestSchema = z.object({
  type: generalRequestTypeSchema,
  personalData: z.object({
    firstName: basicString,
    middleName: z.string().max(255).optional(),
    lastName: basicString,
    birthDate: z.string(),
    sex: z.enum(["male", "female"]),
    citizenship: z.string(),
    maritalStatus: z.enum(["single", "married", "widowed", "separated"]),
    localAddress: z.string(),
  }),
  supportingDocuments: z.array(
    z.any()
  ).optional(),
  status: z.enum(["pending", "approved", "rejected"]),
  purpose: basicString,
  forWhom: z.string().optional(),
  remarks: z.string().optional(),
  duration: z.string(),

});

export const businessDataSchema = z.object({
  businessName: z.string(),
  address: z.string(),
  registrationDate: z.date(),
  eligibility: z.date(),
  typeOfOwnership: z.enum([
    "sole proprietorship",
    "partnership",
    "corporation",
    "cooperative",
  ]),
  owners: z.array(z.string()),
  typeOfCorporation: z.enum(["private", "public"]).optional(),
  businessContactNo: z.array(
    z.string().regex(/^09\d{9}$/, {
      message: "Invalid Philippine mobile number format. Must start with '09' and have 11 digits.",
    })
  ),
  businessEmailAddress: z.string().email(),
  status: z.enum(["active", "inactive", "pending"]),
  supportingDocuments: z.array(
    z.any()
  ).optional(),
});

export const businessPermitRequestSchema = z.object({
  businessData: businessDataSchema,
  validity: z.date(),
  officialReceiptNo: z.string(),
  issuedTo: z.string(),
  amount: z.number(),
});

export const reportSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  location: z.string().min(1, { message: "Location is required" }),
  involvedPersons: z.array(
    z.object({
      name: z.string().min(1, { message: "Name is required" }),
      role: z.enum(["complainant", "respondent", "witness", "other"]),
      statement: z.string().optional(),
      personalInfo: z.string().optional()
    })
  ).optional(),
  supportingDocuments: z.array(
    z.any()
  ).optional(),
  reportStatus: z.enum(["open", "inProgress", "closed"]).optional(),
});