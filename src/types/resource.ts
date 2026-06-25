export interface CompanyDocument {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  pdfUrl: string;
  version: string;
  language: string;
  size: string;
  pages: number;
  updatedAt: string;
  category: string;
  contents: string[];
}
