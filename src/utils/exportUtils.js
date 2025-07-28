// src/utils/exportUtils.js
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const exportAsImage = async (elementId) => {
  const element = document.getElementById(elementId);
  if (!element) return;
  const canvas = await html2canvas(element);
  const dataUrl = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = "calendar_snapshot.png";
  link.click();
};

export const exportAsPDF = async (elementId) => {
  const element = document.getElementById(elementId);
  if (!element) return;
  const canvas = await html2canvas(element);
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF();
  pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
  pdf.save("calendar_snapshot.pdf");
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
