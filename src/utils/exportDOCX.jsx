import { Document, Paragraph, Packer } from 'docx';

export const exportToDOCX = async (content, type = 'summary') => {
  const title = type === 'summary' ? 'Resumen de Reunión' : 'Acta de Reunión';
  const date = new Date().toLocaleDateString('es-ES');

  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          text: title,
          heading: 1
        }),
        new Paragraph({
          text: `Fecha: ${date}`
        }),
        new Paragraph({
          text: content
        })
      ]
    }]
  });

  // Generate and save document
  const blob = await Packer.toBlob(doc);
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `fenpruss-${type === 'summary' ? 'resumen' : 'acta'}.docx`;
  a.click();
  window.URL.revokeObjectURL(url);
};