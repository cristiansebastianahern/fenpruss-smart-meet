import { jsPDF } from 'jspdf';

export const exportToPDF = async (content, type = 'summary') => {
  const doc = new jsPDF();
  const title = type === 'summary' ? 'Resumen de Reunión' : 'Acta de Reunión';
  const date = new Date().toLocaleDateString('es-ES');

  // Add title
  doc.setFontSize(18);
  doc.text(title, 20, 20);

  // Add date
  doc.setFontSize(12);
  doc.text(`Fecha: ${date}`, 20, 30);

  // Add content
  doc.setFontSize(12);
  const splitText = doc.splitTextToSize(content, 170);
  doc.text(splitText, 20, 40);

  // Save the PDF
  doc.save(`fenpruss-${type === 'summary' ? 'resumen' : 'acta'}.pdf`);
};