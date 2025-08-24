import React, { useState } from 'react';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';

const SummaryArea = ({ transcript, isListening }) => {
  const [summary, setSummary] = useState('');
  const [acta, setActa] = useState({
    titulo: '',
    fecha: new Date().toISOString().split('T')[0],
    participantes: '',
    temas: '',
    acuerdos: '',
    conclusiones: ''
  });

  const handleActaChange = (field, value) => {
    setActa(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateActaContent = () => {
    return `
ACTA DE REUNIÓN - FENPRUSS

Título: ${acta.titulo}
Fecha: ${acta.fecha}

PARTICIPANTES:
${acta.participantes}

TEMAS TRATADOS:
${acta.temas}

TRANSCRIPCIÓN:
${transcript}

ACUERDOS:
${acta.acuerdos}

CONCLUSIONES:
${acta.conclusiones}

Generado por: cristiansebastianahern
Fecha de generación: ${new Date().toLocaleString()}
    `;
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const content = generateActaContent();
    
    // Configurar fuente para caracteres especiales
    doc.setFont('helvetica');
    
    // Dividir el contenido en líneas
    const lines = doc.splitTextToSize(content, 180);
    
    let y = 10;
    lines.forEach(line => {
      if (y > 280) {
        doc.addPage();
        y = 10;
      }
      doc.text(line, 15, y);
      y += 7;
    });

    doc.save(`acta-${acta.fecha}.pdf`);
  };

  const exportToDOCX = async () => {
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: "ACTA DE REUNIÓN - FENPRUSS",
                bold: true,
                size: 28
              })
            ]
          }),
          ...generateActaContent()
            .split('\n')
            .map(line => new Paragraph({
              children: [new TextRun({ text: line })]
            }))
        ]
      }]
    });

    const buffer = await Packer.toBuffer(doc);
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    saveAs(blob, `acta-${acta.fecha}.docx`);
  };

  return (
    <div className="summary-area">
      <h3>Resumen y Acta de Reunión</h3>
      
      <div className="acta-form">
        <div className="form-group">
          <label>Título de la Reunión:</label>
          <input
            type="text"
            value={acta.titulo}
            onChange={(e) => handleActaChange('titulo', e.target.value)}
            placeholder="Ej: Reunión Mensual de Directorio"
          />
        </div>

        <div className="form-group">
          <label>Fecha:</label>
          <input
            type="date"
            value={acta.fecha}
            onChange={(e) => handleActaChange('fecha', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Participantes:</label>
          <textarea
            value={acta.participantes}
            onChange={(e) => handleActaChange('participantes', e.target.value)}
            placeholder="Nombre y cargo de los participantes"
            rows="3"
          />
        </div>

        <div className="form-group">
          <label>Temas Tratados:</label>
          <textarea
            value={acta.temas}
            onChange={(e) => handleActaChange('temas', e.target.value)}
            placeholder="Lista de temas discutidos"
            rows="3"
          />
        </div>

        <div className="form-group">
          <label>Acuerdos:</label>
          <textarea
            value={acta.acuerdos}
            onChange={(e) => handleActaChange('acuerdos', e.target.value)}
            placeholder="Acuerdos alcanzados"
            rows="3"
          />
        </div>

        <div className="form-group">
          <label>Conclusiones:</label>
          <textarea
            value={acta.conclusiones}
            onChange={(e) => handleActaChange('conclusiones', e.target.value)}
            placeholder="Conclusiones de la reunión"
            rows="3"
          />
        </div>

        <div className="export-buttons">
          <button 
            className="export-button pdf"
            onClick={exportToPDF}
            disabled={isListening}
          >
            Exportar a PDF
          </button>
          <button 
            className="export-button docx"
            onClick={exportToDOCX}
            disabled={isListening}
          >
            Exportar a DOCX
          </button>
        </div>
      </div>
    </div>
  );
};

export default SummaryArea;