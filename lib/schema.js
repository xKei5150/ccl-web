import { z } from "zod";

const basicString = z.string().min(1).max(255);
const date = z.preprocess((arg) => {
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
      member: z.string()
    })
  ),
  localAddress: z.string().min(5, "Address must be at least 5 characters"),
  residencyDate: date,
  status: z.enum(["active", "inactive"], {
    required_error: "Please select a status",
  }),
});

export const personalDataSchema = z.object({
  name: z.object({
  firstName: basicString,
  middleName: z.string().max(255).optional(),
  lastName: basicString,
  }),
  contact: z.object({
  emailAddress: z.string().email(),
  localAddress: z.string(),
  }),
  demographics: z.object({
    sex: z.enum(["male", "female"]),
    birthDate: z.string(),
    maritalStatus: z.enum(["single", "married", "widowed", "separated"]),
  }),
  status: z.object({
    residencyStatus: z.enum(["permanent", "temporary"]),
  lifeStatus: z.enum(["alive", "deceased"]),
  }),
});

export const generalRequestTypeSchema = z.enum([
  "indigencyCertificate",
  "barangayClearance",
  "barangayResidency",
]);

export const generalRequestSchema = z.object({
  type: generalRequestTypeSchema,
  person: z.string(),
  purpose: basicString,
  additionalInformation: z.object({
    forWhom: z.string().optional(),
    remarks: z.string().optional(),
    duration: z.string().optional(),
  }).optional(),
  supportingDocuments: z.array(
    z.any()
  ).optional(),
  status: z.enum(["pending", "processing", "approved", "rejected", "completed"], {
    required_error: "Please select a status",
  }),
});

export const businessDataSchema = z.object({
  businessName: z.string(),
  address: z.string(),
  registrationDate: date,
  typeOfOwnership: z.enum([
    "sole proprietorship",
    "partnership",
    "corporation",
    "llc",
  ]),
  owners: z.array(
    z.object({
      ownerName: z.string()
    })
  ),
  typeOfCorporation: z.preprocess((val) => val === null ? undefined : val, 
    z.enum(["private", "public", "non-profit"]).optional()
  ),
  businessContactNo: z.string().regex(/^(09|\+639)\d{9}$|^\d{7,10}$|^\(02\) \d{4}-\d{4}$/, {
      message: "Invalid contact number format. Must be a valid Philippine mobile number, a telephone number with 7 to 10 digits, or a landline number in the format (02) 8415-2272.",
    }),
  businessEmailAddress: z.string().email(),
  status: z.enum(["active", "inactive", "pending"]),
  supportingDocuments: z.array(
    z.any()
  ).optional(),
});

export const businessPermitRequestSchema = z.object({
  business: z.string(), // Reference to business ID
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
  date: date,
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
  reportStatus: z.enum(["open", "inProgress", "closed"]),
  submittedBy: z.string()
});

export const projectSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().optional(),
  projectType: z.enum(["event", "infrastructure", "program", "initiative", "other"]),
  status: z.enum(["planning", "ongoing", "completed", "on_hold", "cancelled"]),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  location: z.string().optional(),
  projectLead: z.string().optional(),
  teamMembers: z.array(
    z.object({
      name: z.string(),
      role: z.string().optional()
    })
  ).optional(),
  relatedFinancing: z.string().optional(),
  eventDetails: z.object({
    expectedAttendees: z.number().optional(),
    actualAttendees: z.number().optional(),
    attendeeNotes: z.string().optional()
  }).optional(),
  infrastructureDetails: z.object({
    contractor: z.string().optional(),
    completionPercentage: z.number().optional()
  }).optional(),
  programDetails: z.object({
    targetBeneficiaries: z.string().optional(),
    keyPerformanceIndicators: z.string().optional()
  }).optional(),
  createdBy: z.string()
});

export const demographicsSchema = z.object({
  year: z.number().min(1900).max(2100),
  maleCount: z.number().min(0),
  femaleCount: z.number().min(0),
  totalPopulation: z.number().min(0),
  householdsCount: z.number().min(0).optional(),
  voterCount: z.number().min(0).optional(),
  pwdCount: z.number().min(0).optional(),
  ageGroups: z.array(
    z.object({
      ageRange: z.string(),
      count: z.number().min(0)
    })
  ).optional(),
  chronicDiseases: z.array(
    z.object({
      diseaseName: z.string(),
      count: z.number().min(0)
    })
  ).optional(),
  submittedBy: z.string()
});