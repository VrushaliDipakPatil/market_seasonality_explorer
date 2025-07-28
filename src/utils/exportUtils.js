import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const exportAsImage = async (elementId) => {
  const element = document.getElementById(elementId);
  if (!element) {
    alert("Element not found");
    return;
  }
  try {
    const canvas = await html2canvas(element, {
      useCORS: true,
      backgroundColor: "#fff",
      scrollX: 0,
      scrollY: 0,
    });
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "calendar_snapshot.png";
    link.click();
  } catch (err) {
    console.error("Image export error:", err);
    alert("Failed to export as image.");
  }
};

export const exportAsPDF = async (elementId) => {
  const element = document.getElementById(elementId);
  if (!element) {
    alert("Element not found");
    return;
  }
  try {
    const canvas = await html2canvas(element, {
      useCORS: true,
      backgroundColor: "#fff",
      scrollX: 0,
      scrollY: 0,
    });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("calendar_snapshot.pdf");
  } catch (err) {
    console.error("PDF export error:", err);
    alert("Failed to export as PDF.");
  }
};

export const exportAsCSV = (data) => {
  const csvRows = [];
  const headers = Object.keys(data[0]);
  csvRows.push(headers.join(","));

  data.forEach((row) => {
    const values = headers.map((h) => JSON.stringify(row[h] ?? ""));
    csvRows.push(values.join(","));
  });

  const csvData = new Blob([csvRows.join("\n")], { type: "text/csv" });
  const url = window.URL.createObjectURL(csvData);
  const a = document.createElement("a");
  a.href = url;
  a.download = "calendar_data.csv";
  a.click();
};