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
                maritalStatus: { type: "string", enum: ["single", "married", "widowed", "separated"] }
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
            personalInfo: { type: "string" },
            active: { type: "boolean" }
          },
          required: ["email", "password", "role"]
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
            status: { type: "string", enum: ["draft", "published"] },
            author: { type: "string" }
          },
          required: ["title", "content", "status"]
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
            members: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  member: { type: "string" }
                },
                required: ["member"]
              }
            }
          },
          required: ["familyName", "localAddress", "status", "residencyDate", "members"]
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
            typeOfCorporation: { 
              type: "string", 
              enum: ["private", "public", "non-profit"],
              description: "Only applicable if typeOfOwnership is corporation"
            },
            businessContactNo: { type: "string" },
            businessEmailAddress: { type: "string" },
            status: { type: "string", enum: ["active", "inactive", "pending"] },
            supportingDocuments: {
              type: "array",
              items: { type: "string" }
            }
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
      records: {
        type: "array",
        items: {
          type: "object",
          properties: {
            business: { type: "string" },
      validity: { type: "string" },
      officialReceiptNo: { type: "string" },
      issuedTo: { type: "string" },
      amount: { type: "number" },
      paymentDate: { type: "string" },
            status: { type: "string", enum: ["pending", "approved", "rejected"] },
            supportingDocuments: {
              type: "array",
              items: { type: "string" }
            }
    },
          required: ["business", "validity", "officialReceiptNo", "issuedTo", "amount", "status"]
        }
      }
    },
    required: ["records"]
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
                  statement: { type: "string" },
                  personalInfo: { type: "string" }
                },
                required: ["name", "role"]
              }
            },
            supportingDocuments: {
              type: "array",
              items: { type: "string" }
            },
            reportStatus: { type: "string", enum: ["open", "inProgress", "closed"] },
            submittedBy: { type: "string" }
          },
          required: ["title", "date", "description", "location", "reportStatus", "submittedBy"]
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
            person: { type: "string" },
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
              }
            },
            supportingDocuments: {
              type: "array",
              items: { type: "string" }
            },
            certificateDetails: {
              type: "object",
              properties: {
                controlNumber: { type: "string" },
                dateIssued: { type: "string" },
                validUntil: { type: "string" },
                ctcDetails: {
                  type: "object",
                  properties: {
                    ctcNo: { type: "string" },
                    ctcDateIssued: { type: "string" },
                    ctcAmount: { type: "string" },
                    ctcPlaceIssued: { type: "string" }
                  }
                },
                payment: {
                  type: "object",
                  properties: {
                    orNumber: { type: "string" },
                    amount: { type: "string" },
                    date: { type: "string" },
                    method: { type: "string", enum: ["cash", "online", "free"] }
                  }
                },
                approver: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    position: { type: "string" },
                    date: { type: "string" }
                  }
                }
              }
            }
          },
          required: ["type", "person", "purpose", "status"]
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
            approvalHistory: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  state: { type: "string" },
                  timestamp: { type: "string" },
                  user: { type: "string" },
                  notes: { type: "string" }
                }
              }
            },
            groups: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  subtotalOperation: { type: "string", enum: ["sum", "average", "min", "max"] },
                  items: {
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
                      }
                    }
                  }
                }
              }
            },
            finalCalculations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  number: { type: "integer" },
                  title: { type: "string" },
                  operation: { type: "string" },
                  value: { type: "number" },
                  groupReference: { type: "integer" }
                }
              }
            },
            createdBy: { type: "string" }
          },
          required: [
            "title", "approvalState", "createdBy"
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
            startDate: { type: "string" },
            endDate: { type: "string" },
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
            relatedFinancing: { type: "string" },
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
            },
            createdBy: { type: "string" }
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
            year: { type: ["number", "string"], minimum: 1900, maximum: 2100 },
            maleCount: { type: ["number", "string"], minimum: 0 },
            femaleCount: { type: ["number", "string"], minimum: 0 },
            totalPopulation: { type: ["number", "string"], minimum: 0 },
            householdsCount: { type: ["number", "string"], minimum: 0 },
            voterCount: { type: ["number", "string"], minimum: 0 },
            pwdCount: { type: ["number", "string"], minimum: 0 },
            ageGroups: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  ageRange: { type: "string" },
                  count: { type: ["number", "string"], minimum: 0 }
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
                  count: { type: ["number", "string"], minimum: 0 }
                },
                required: ["diseaseName", "count"]
              }
            },
            submittedBy: { type: "string" }
          },
          required: [
            "year", "maleCount", "femaleCount", "totalPopulation", "submittedBy"
          ]
        }
      }
    },
    required: ["records"]
  },
}; 