import { site } from "@/data/site";

export function GET() {
  const lines = [
    "BT",
    "/F1 22 Tf 72 720 Td (Surjay Design & Prints) Tj",
    "0 -42 Td /F1 13 Tf (Premium textile dyeing, printing and finishing for B2B buyers.) Tj",
    "0 -30 Td (Location: Rajasthan, India) Tj",
    "0 -24 Td (Services: Fabric Dyeing, Screen Printing, Hand Printing, Textile Finishing.) Tj",
    `0 -24 Td (Email: ${escapePdfText(site.email)}) Tj`,
    `0 -24 Td (Phone: ${escapePdfText(site.phone)}) Tj`,
    "0 -42 Td (Replace this generated profile with the final designed brand brochure.) Tj",
    "ET"
  ].join("\n");

  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>",
    `<< /Length ${lines.length} >>\nstream\n${lines}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>"
  ];

  let body = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((content, index) => {
    offsets.push(body.length);
    body += `${index + 1} 0 obj\n${content}\nendobj\n`;
  });
  const xrefOffset = body.length;
  body += `xref\n0 ${objects.length + 1}\n`;
  body += "0000000000 65535 f \n";
  offsets.slice(1).forEach((offset) => {
    body += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  body += `trailer << /Root 1 0 R /Size ${objects.length + 1} >>\n`;
  body += `startxref\n${xrefOffset}\n%%EOF`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="Surjay-Design-Company-Profile.pdf"'
    }
  });
}

function escapePdfText(value: string) {
  return value.replaceAll("\\", "\\\\").replaceAll("(", "\\(").replaceAll(")", "\\)");
}
