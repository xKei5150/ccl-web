/**
 * Schema definitions for structured output with Gemini AI
 * These match the PayloadCMS collection structures
 */

export const schemas = {
  // Personal Information Schema
  personalInfo: {
    type: "object",
    properties: {
      records: {
        type: "array",
        items: {
          type: "object",
          properties: {
            name: {
              type: "object",
              properties: {
                firstName: { type: "string" },
                middleName: { type: "string" },
                lastName: { type: "string" }
              },
              required: ["firstName", "lastName"]
            },
            contact: {
              type: "object",
              properties: {
                emailAddress: { type: "string" },
                localAddress: { type: "string" }
              },
              required: ["emailAddress", "localAddress"]
            },
            demographics: {
              type: "object",
              properties: {
                sex: { type: "string", enum: ["male", "female"] },
                birthDate: { type: "string" },
                maritalStatus: { type: "string", enum: ["single", "married", "divorced", "widowed"] }
              },
              required: ["sex", "birthDate", "maritalStatus"]
            },
            status: {
              type: "object",
              properties: {
                residencyStatus: { type: "string", enum: ["permanent", "temporary"] },
                lifeStatus: { type: "string", enum: ["alive", "deceased"] }
              },
              required: ["residencyStatus", "lifeStatus"]
            }
          },
          required: ["name", "contact", "demographics", "status"]
        }
      }
    },
    required: ["records"]
  },

  // Users Schema
  users: {
    type: "object",
    properties: {
      records: {
        type: "array",
        items: {
          type: "object",
          properties: {
            email: { type: "string" },
            password: { type: "string" },
            role: { type: "string", enum: ["admin", "staff", "citizen"] },
            isActive: { type: "string", enum: ["active", "inactive"] }
          },
          required: ["email", "password", "role", "isActive"]
        }
      }
    },
    required: ["records"]
  },

  // Posts Schema
  posts: {
    type: "object",
    properties: {
      records: {
        type: "array",
        items: {
          type: "object",
          properties: {
            title: { type: "string" },
            content: { type: "string" },
            publishedDate: { type: "string" },
            status: { type: "string", enum: ["draft", "published"] }
          },
          required: ["title", "content", "publishedDate", "status"]
        }
      }
    },
    required: ["records"]
  },

  // Households Schema
  households: {
    type: "object",
    properties: {
      records: {
        type: "array",
        items: {
          type: "object",
          properties: {
            familyName: { type: "string" },
            localAddress: { type: "string" },
            status: { type: "string", enum: ["active", "inactive"] },
            residencyDate: { type: "string" },
            memberCount: { type: "integer", minimum: 1, maximum: 10 }
          },
          required: ["familyName", "localAddress", "status", "residencyDate", "memberCount"]
        }
      }
    },
    required: ["records"]
  },

  // Business Schema
  business: {
    type: "object",
    properties: {
      records: {
        type: "array",
        items: {
          type: "object",
          properties: {
            businessName: { type: "string" },
            address: { type: "string" },
            registrationDate: { type: "string" },
            typeOfOwnership: { 
              type: "string", 
              enum: ["sole proprietorship", "partnership", "corporation", "llc"] 
            },
            owners: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  ownerName: { type: "string" }
                },
                required: ["ownerName"]
              }
            },
            businessContactNo: { type: "string" },
            businessEmailAddress: { type: "string" },
            status: { type: "string", enum: ["active", "inactive", "pending"] }
          },
          required: [
            "businessName", "address", "registrationDate", "typeOfOwnership", 
            "owners", "businessContactNo", "businessEmailAddress", "status"
          ]
        }
      }
    },
    required: ["records"]
  },

  // Business Permit Schema
  businessPermit: {
    type: "object",
    properties: {
      validity: { type: "string" },
      officialReceiptNo: { type: "string" },
      issuedTo: { type: "string" },
      amount: { type: "number" },
      paymentDate: { type: "string" },
      status: { type: "string", enum: ["approved"] }
    },
    required: ["validity", "officialReceiptNo", "issuedTo", "amount", "paymentDate", "status"]
  },

  // Reports Schema
  reports: {
    type: "object",
    properties: {
      records: {
        type: "array",
        items: {
          type: "object",
          properties: {
            title: { type: "string" },
            date: { type: "string" },
            description: { type: "string" },
            location: { type: "string" },
            involvedPersons: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  role: { type: "string", enum: ["complainant", "respondent", "witness", "other"] },
                  statement: { type: "string" }
                },
                required: ["name", "role", "statement"]
              }
            },
            reportStatus: { type: "string", enum: ["open", "inProgress", "closed"] }
          },
          required: ["title", "date", "description", "location", "involvedPersons", "reportStatus"]
        }
      }
    },
    required: ["records"]
  },

  // Requests Schema
  requests: {
    type: "object",
    properties: {
      records: {
        type: "array",
        items: {
          type: "object",
          properties: {
            type: { 
              type: "string", 
              enum: ["indigencyCertificate", "barangayClearance", "barangayResidency"] 
            },
            purpose: { type: "string" },
            status: { 
              type: "string", 
              enum: ["pending", "processing", "approved", "rejected", "completed"] 
            },
            additionalInformation: {
              type: "object",
              properties: {
                forWhom: { type: "string" },
                remarks: { type: "string" },
                duration: { type: "string" }
              },
              required: ["forWhom", "remarks", "duration"]
            }
          },
          required: ["type", "purpose", "status", "additionalInformation"]
        }
      }
    },
    required: ["records"]
  },

  // Financing Schema
  financing: {
    type: "object",
    properties: {
      records: {
        type: "array",
        items: {
          type: "object",
          properties: {
            title: { type: "string" },
            description: { type: "string" },
            approvalState: { 
              type: "string", 
              enum: ["draft", "submitted", "under_review", "approved", "rejected"] 
            },
            accountType: { 
              type: "string", 
              enum: ["capital", "operational", "grant", "revenue", "transfer"] 
            },
            fiscalYear: { type: "string" },
            budgetedAmount: { type: "number" },
            budgetReference: { type: "string" },
            departmentCode: { type: "string" },
            justification: { type: "string" },
            authorizationReference: { type: "string" },
            groupsCount: { type: "integer", minimum: 1, maximum: 5 }
          },
          required: [
            "title", "description", "approvalState", "accountType", 
            "fiscalYear", "budgetedAmount", "groupsCount"
          ]
        }
      }
    },
    required: ["records"]
  },
  
  // Financing Groups Schema
  financingGroups: {
    type: "object",
    properties: {
      records: {
        type: "array",
        items: {
          type: "object",
          properties: {
            title: { type: "string" },
            description: { type: "string" },
            subtotalOperation: { type: "string", enum: ["sum", "average", "min", "max"] },
            itemsCount: { type: "integer", minimum: 1, maximum: 10 }
          },
          required: ["title", "subtotalOperation", "itemsCount"]
        }
      }
    },
    required: ["records"]
  },
  
  // Financing Items Schema
  financingItems: {
    type: "object",
    properties: {
      records: {
        type: "array",
        items: {
          type: "object",
          properties: {
            number: { type: "integer" },
            title: { type: "string" },
            value: { type: "number" },
            operation: { type: "string", enum: ["add", "subtract", "multiply", "divide"] },
            accountCode: { type: "string" },
            fiscalPeriod: { type: "string" }
          },
          required: ["number", "title", "value", "operation"]
        }
      }
    },
    required: ["records"]
  },

  // Projects Schema
  projects: {
    type: "object",
    properties: {
      records: {
        type: "array",
        items: {
          type: "object",
          properties: {
            title: { type: "string" },
            description: { type: "string" },
            projectType: { type: "string", enum: ["event", "infrastructure", "program", "initiative", "other"] },
            status: { type: "string", enum: ["planning", "ongoing", "completed", "on_hold", "cancelled"] },
            startDate: { type: "string" }, // Assuming ISO format string for date
            endDate: { type: "string" },   // Assuming ISO format string for date
            location: { type: "string" },
            projectLead: { type: "string" },
            teamMembers: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  role: { type: "string" }
                },
                required: ["name"]
              }
            },
            // Optional groups based on projectType - handled in prompt logic
            eventDetails: { 
                type: "object",
                properties: {
                    expectedAttendees: { type: "integer" },
                    actualAttendees: { type: "integer" },
                    attendeeNotes: { type: "string" }
                },
                description: "Present only if projectType is 'event'"
            },
            infrastructureDetails: { 
                type: "object",
                properties: {
                    contractor: { type: "string" },
                    completionPercentage: { type: "number" }
                },
                description: "Present only if projectType is 'infrastructure'"
            },
            programDetails: { 
                type: "object",
                properties: {
                    targetBeneficiaries: { type: "string" },
                    keyPerformanceIndicators: { type: "string" }
                },
                description: "Present only if projectType is 'program'"
            }
          },
          required: ["title", "projectType", "status"]
        }
      }
    },
    required: ["records"]
  },

  // Demographics Schema
  demographics: {
    type: "object",
    properties: {
      records: {
        type: "array",
        items: {
          type: "object",
          properties: {
            year: { type: "integer", minimum: 1900, maximum: 2100 },
            maleCount: { type: "integer", minimum: 0 },
            femaleCount: { type: "integer", minimum: 0 },
            householdsCount: { type: "integer", minimum: 0 },
            voterCount: { type: "integer", minimum: 0 },
            pwdCount: { type: "integer", minimum: 0 },
            ageGroups: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  ageRange: { type: "string" },
                  count: { type: "integer", minimum: 0 }
                },
                required: ["ageRange", "count"]
              }
            },
            chronicDiseases: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  diseaseName: { type: "string" },
                  count: { type: "integer", minimum: 0 }
                },
                required: ["diseaseName", "count"]
              }
            }
          },
          required: [
            "year", "maleCount", "femaleCount", "householdsCount", 
            "voterCount", "pwdCount", "ageGroups", "chronicDiseases"
          ]
        }
      }
    },
    required: ["records"]
  },
}; 