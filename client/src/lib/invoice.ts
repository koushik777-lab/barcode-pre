import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

interface BillingDetails {
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  gstin?: string;
}

interface Order {
  _id: string;
  packageName: string;
  quantity: number;
  totalPrice: number;
  status: string;
  billingDetails?: BillingDetails;
  createdAt: string;
}

/**
 * Converts a number to Indian Words (Rupees)
 */
function numberToWords(num: number): string {
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
  const teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  function convert(n: number): string {
    if (n < 10) return ones[n];
    if (n < 20) return teens[n - 10];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + ones[n % 10] : "");
    if (n < 1000) return ones[Math.floor(n / 100)] + " Hundred" + (n % 100 !== 0 ? " and " + convert(n % 100) : "");
    if (n < 100000) return convert(Math.floor(n / 1000)) + " Thousand" + (n % 1000 !== 0 ? " " + convert(n % 1000) : "");
    if (n < 10000000) return convert(Math.floor(n / 100000)) + " Lakh" + (n % 100000 !== 0 ? " " + convert(n % 100000) : "");
    return convert(Math.floor(n / 10000000)) + " Crore" + (n % 10000000 !== 0 ? " " + convert(n % 10000000) : "");
  }

  if (num === 0) return "Zero";
  return convert(Math.floor(num)) + " Rupees only";
}

export const generateInvoice = async (order: Order, user: any) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Colors
  const primaryColor = [0, 157, 224]; 
  const textColor = [51, 51, 51];

  // Helper for Logo
  try {
    const logoImg = "/new_logo.jpeg";
    doc.addImage(logoImg, "JPEG", 15, 10, 25, 25);
  } catch (e) {
    console.warn("Logo not found for invoice", e);
  }

  // --- Header ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Proforma Invoice", pageWidth / 2, 10, { align: "center" });

  doc.setFontSize(22);
  doc.setTextColor(30, 30, 30);
  doc.text("SHOP MY BARCODE", pageWidth - 15, 25, { align: "right" });
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text("2nd Floor 23A Royd Street Kolkata", pageWidth - 15, 30, { align: "right" });
  doc.text("Phone no.: 9073165879 Email: msrassessment@gmail.com", pageWidth - 15, 35, { align: "right" });

  // --- Sub Header Boxes ---
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.1);
  
  // Estimate For Box
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(15, 45, pageWidth / 2 - 15, 10, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.text("Estimate For", 20, 51);

  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.setFontSize(11);
  const billing = order.billingDetails || {};
  const customerName = (billing.fullName || user.username).toUpperCase();
  doc.text(customerName, 20, 62);
  
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  const address = [
    billing.address || "",
    billing.city ? `${billing.city}, ${billing.state || ""} - ${billing.zipCode || ""}` : "",
    billing.phone ? `Phone: ${billing.phone}` : "",
    billing.gstin ? `GSTIN: ${billing.gstin}` : ""
  ].filter(line => line !== "");
  
  let currentY = 67;
  address.forEach(line => {
    doc.text(line, 20, currentY);
    currentY += 5;
  });

  // Estimate Details Box (Right Side)
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(pageWidth / 2, 45, pageWidth / 2 - 15, 10, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.text("Estimate Details", pageWidth / 2 + 5, 51);

  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.setFontSize(10);
  const dateStr = new Date(order.createdAt).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
  
  // Fake Estimate Number based on order ID
  const estNo = `MSR-${new Date(order.createdAt).getFullYear()}-${(new Date(order.createdAt).getFullYear() + 1).toString().slice(-2)}/${order._id.slice(-4).toUpperCase()}`;
  
  doc.text(`Estimate No. : ${estNo}`, pageWidth - 20, 62, { align: "right" });
  doc.text(`Date : ${dateStr}`, pageWidth - 20, 68, { align: "right" });
  doc.text(`Order ID : ${order._id.toUpperCase()}`, pageWidth - 20, 74, { align: "right" });

  // --- Table ---
  // GST Calculations (Assuming 18% total GST)
  const totalAmount = order.totalPrice;
  const baseAmount = totalAmount / 1.18;
  const gstAmount = totalAmount - baseAmount;
  
  // Tax breakdown based on state (Assuming seller is in West Bengal)
  const isInterState = billing.state && billing.state.toLowerCase() !== "west bengal" && billing.state.toLowerCase() !== "wb";
  
  // --- Table ---
  const tableData = [
    [
      "1",
      `${order.packageName.toUpperCase()} REGISTRATION`,
      "9982",
      order.quantity.toString(),
      "Pcs",
      `Rs ${ (baseAmount / order.quantity).toFixed(2) }`,
      `Rs ${ baseAmount.toFixed(2) }`
    ]
  ];

  autoTable(doc, {
    startY: 85,
    margin: { left: 15, right: 15 },
    head: [["#", "Item name", "HSN/ SAC", "Quantity", "Unit", "Price/ Unit", "Amount"]],
    body: tableData,
    headStyles: { 
      fillColor: primaryColor as any, 
      textColor: [255, 255, 255] as any,
      fontStyle: "bold",
      halign: "center"
    },
    bodyStyles: {
      textColor: textColor as any,
      fontSize: 9,
      halign: "center"
    },
    columnStyles: {
      1: { halign: "left" },
      6: { halign: "right" }
    },
    theme: "grid"
  });

  const finalY = (doc as any).lastAutoTable.finalY || 100;

  // --- Totals Section ---
  doc.setFont("helvetica", "bold");
  doc.text("Total", 20, finalY + 5);
  doc.text(order.quantity.toString(), 118, finalY + 5, { align: "center" });
  doc.text(`Rs ${baseAmount.toFixed(2)}`, pageWidth - 20, finalY + 5, { align: "right" });

  // Amount In Words
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(15, finalY + 10, pageWidth / 2 - 15, 10, "F");
  doc.setTextColor(255, 255, 255);
  doc.text("Estimate Amount In Words", 20, finalY + 16);
  
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(numberToWords(totalAmount), 20, finalY + 25, { maxWidth: pageWidth / 2 - 25 });

  // Totals Box (Right)
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(pageWidth / 2, finalY + 10, pageWidth / 2 - 15, 10, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.text("Amounts", pageWidth / 2 + 5, finalY + 16);

  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  
  let amountsY = finalY + 25;
  doc.text("Sub Total", pageWidth / 2 + 5, amountsY);
  doc.text(`Rs ${baseAmount.toFixed(2)}`, pageWidth - 20, amountsY, { align: "right" });
  
  amountsY += 6;
  if (isInterState) {
    doc.text("IGST (18%)", pageWidth / 2 + 5, amountsY);
    doc.text(`Rs ${gstAmount.toFixed(2)}`, pageWidth - 20, amountsY, { align: "right" });
  } else {
    doc.text("CGST (9%)", pageWidth / 2 + 5, amountsY);
    doc.text(`Rs ${(gstAmount / 2).toFixed(2)}`, pageWidth - 20, amountsY, { align: "right" });
    amountsY += 6;
    doc.text("SGST (9%)", pageWidth / 2 + 5, amountsY);
    doc.text(`Rs ${(gstAmount / 2).toFixed(2)}`, pageWidth - 20, amountsY, { align: "right" });
  }
  
  amountsY += 8;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Total", pageWidth / 2 + 5, amountsY);
  doc.text(`Rs ${totalAmount.toFixed(2)}`, pageWidth - 20, amountsY, { align: "right" });

  // --- Footer ---
  const footerY = amountsY + 20;
  
  // Bank Details
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(15, footerY, pageWidth / 2.5, 10, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text("Bank Details", 20, footerY + 6);
  
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("Name : HDFC BANK, KOLKATA - PARK STREET", 20, footerY + 15, { maxWidth: pageWidth / 2.5 - 10 });
  doc.text("Account No. : 50200073444028", 20, footerY + 25);
  doc.text("IFSC code : HDFC0000693", 20, footerY + 30);
  doc.text("Account holder's name : MSR Assessment Private Limited.", 20, footerY + 35, { maxWidth: pageWidth / 2.5 - 10 });

  // Terms
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.setFont("helvetica", "bold");
  doc.text("Thanks for doing business with us!", pageWidth / 2, footerY + 15);
  doc.text("Swift Code: HDFCINBBCAL", pageWidth / 2, footerY + 20);
  doc.text("1. This is a computer generated invoice.", pageWidth / 2, footerY + 25);
  doc.text("2. All disputes subject to Kolkata jurisdiction.", pageWidth / 2, footerY + 30);

  // Signature Section
  const sigY = footerY + 50;
  doc.setFont("helvetica", "normal");
  doc.text("For: MSR ASSESSMENT PVT. LTD.", pageWidth - 20, sigY - 10, { align: "right" });
  
  // Signature Image
  try {
    const sigImg = "/signature.png";
    doc.addImage(sigImg, "PNG", pageWidth - 55, sigY - 5, 40, 15);
  } catch (e) {
    console.warn("Signature not found for invoice", e);
  }
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Authorized Signatory", pageWidth - 20, sigY + 15, { align: "right" });

  // Draw borders for the main sections
  doc.setDrawColor(200, 200, 200);
  doc.rect(15, 45, pageWidth - 30, sigY - 45 + 25);

  doc.save(`${order.packageName} invoice.pdf`);
};
