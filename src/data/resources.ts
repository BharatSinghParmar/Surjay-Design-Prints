import { CompanyDocument } from "@/types/resource";
import { imageAssets } from "./site";

export const companyResources: CompanyDocument[] = [
  {
    id: "company-profile-v1",
    title: "Company Profile",
    description: "A comprehensive overview of our premium textile manufacturing capabilities, infrastructure, and future vision.",
    coverImage: imageAssets.hero, // Using the printing textile image as a nice cover
    pdfUrl: "/Surjay-Design-Company-Profile.pdf",
    version: "v1.0",
    language: "English",
    size: "12 MB",
    pages: 16,
    updatedAt: "2025-06-26",
    category: "Corporate",
    contents: [
      "Company Overview",
      "Manufacturing Process",
      "Printing Methods",
      "Infrastructure",
      "Products",
      "Quality Assurance",
      "Industries Served",
      "Contact Information"
    ]
  }
];
