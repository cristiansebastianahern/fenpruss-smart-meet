import React from 'react';
import { exportToPDF } from '../utils/exportPDF';
import { exportToDOCX } from '../utils/exportDOCX';
import { exportToTXT } from '../utils/exportTXT';

const Output = ({ output }) => {
  const handleExport = async (format, type, content) => {
    try {
      switch (format) {
        case 'pdf':
          await exportToPDF(content, type);
          break;
        case 'docx':
          await exportToDOCX(content, type);
          break;
        case 'txt':
          exportToTXT(content, type);
          break;
        default:
          throw new Error('Formato no soportado');
      }
    } catch (error) {
      console.error('Error al exportar:', error);
      alert('Error al exportar el documento');
    }
  };

  return (
    <div className="output-container">
      {output.summary && (
        <div className="summary-section">
          <h3>Resumen de la Reunión</h3>
          <p>{output.summary}</p>
          <div className="export-buttons">
            <button onClick={() => handleExport('pdf', 'summary', output.summary)}>
              Exportar PDF
            </button>
            <button onClick={() => handleExport('docx', 'summary', output.summary)}>
              Exportar DOCX
            </button>
            <button onClick={() => handleExport('txt', 'summary', output.summary)}>
              Exportar TXT
            </button>
          </div>
        </div>
      )}
      
      {output.act && (
        <div className="act-section">
          <h3>Acta de la Reunión</h3>
          <p>{output.act}</p>
          <div className="export-buttons">
            <button onClick={() => handleExport('pdf', 'act', output.act)}>
              Exportar PDF
            </button>
            <button onClick={() => handleExport('docx', 'act', output.act)}>
              Exportar DOCX
            </button>
            <button onClick={() => handleExport('txt', 'act', output.act)}>
              Exportar TXT
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Output;