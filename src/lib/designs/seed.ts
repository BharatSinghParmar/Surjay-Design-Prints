import type { AttributeDef } from "@/types/design";

// Starter feature set. The admin can rename, hide, reorder, add or delete any of
// these from /admin/attributes — this is only what a fresh install begins with.
export const DEFAULT_ATTRIBUTES: AttributeDef[] = [
  { id: "attr-color", key: "color", label: "Colour", inputType: "text", visible: true, showOnCard: true, sortOrder: 1 },
  { id: "attr-length", key: "length_m", label: "Length", unit: "m", inputType: "number", visible: true, showOnCard: true, sortOrder: 2 },
  { id: "attr-width", key: "width_in", label: "Width", unit: "in", inputType: "number", visible: true, showOnCard: false, sortOrder: 3 },
  { id: "attr-gsm", key: "gsm", label: "GSM", inputType: "number", visible: true, showOnCard: false, sortOrder: 4 },
  { id: "attr-composition", key: "composition", label: "Composition", inputType: "text", visible: true, showOnCard: false, sortOrder: 5 },
  { id: "attr-finish", key: "finish", label: "Finish", inputType: "select", options: ["Matte", "Glossy", "Soft", "Crisp"], visible: true, showOnCard: false, sortOrder: 6 },
  { id: "attr-price", key: "price", label: "Price / metre", unit: "₹", inputType: "number", visible: false, showOnCard: false, sortOrder: 7 }
];
