import { z } from "zod";

const basicString = z.string().min(1).max(255);
const date =   z.preprocess((arg) => {
  if (typeof arg === "string" || arg instanceof Date) {
    return new Date(arg);
  }
  return arg;
}, z.date());

export const supportingDocumentSchema = z.object({
  file: z.instanceof(File),
  notes: z.string().optional(),
});

export const householdSchema = z.object({
  familyName: basicString.min(2, "Family name must be at least 2 characters"),
  members: z.array(
    z.object({
      name: z.string().min(2, "Member name must be at least 2 characters"),
    })
  ),
  localAddress: z.string().min(5, "Address must be at least 5 characters"),
  residencyDate: date,
  status: z.enum(["active", "inactive"], {
    required_error: "Please select a status",
  }),
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
  registrationDate: date,
  typeOfOwnership: z.enum([
    "sole proprietorship",
    "partnership",
    "corporation",
    "cooperative",
  ]),
  owners: z.array(z.any()),
  typeOfCorporation: z.preprocess((val) => val === null ? undefined : val, z.enum(["private", "public"]).optional()),
  businessContactNo: 
    z.string().regex(/^(09|\+639)\d{9}$|^\d{7,10}$|^\(02\) \d{4}-\d{4}$/, {
      message: "Invalid contact number format. Must be a valid Philippine mobile number, a telephone number with 7 to 10 digits, or a landline number in the format (02) 8415-2272.",
    }),
  businessEmailAddress: z.string().email(),
  status: z.enum(["active", "inactive", "pending"]),
  supportingDocuments: z.array(
    z.any()
  ).optional(),
});

export const businessPermitRequestSchema = z.object({
  business: z.object({
    id: z.number(),
  }), // Business ID
  validity: date,
  paymentDate: date,
  officialReceiptNo: z.string(),
  issuedTo: z.string(),
  amount: z.number(),
  status: z.enum(["pending", "approved", "rejected"]),
  supportingDocuments: z.array(
    z.any()
  ).optional(),
});

export const reportSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  location: z.string().min(1, { message: "Location is required" }),
  involvedPersons: z.array(
    z.object({
      name: z.string().min(1, { message: "Name is required" }),
      role: z.enum(["complainant", "suspect", "respondent", "witness", "other"]),
      statement: z.string().optional(),
      personalInfo: z.string().optional()
    })
  ).optional(),
  supportingDocuments: z.array(
    z.any()
  ).optional(),
  reportStatus: z.enum(["open", "inProgress", "closed"]).optional(),
});