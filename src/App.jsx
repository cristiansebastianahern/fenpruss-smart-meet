import React, { useState, useRef, useEffect } from 'react';
import Header from './components/Header';
import Controls from './components/Controls';
import Visualizer from './components/Visualizer';
import TranscriptionArea from './components/TranscriptionArea';
import SummaryArea from './components/SummaryArea';
import useTranscription from './hooks/useTranscription';
import useAudioVisualizer from './hooks/useAudioVisualizer';
import DebugPanel from './components/DebugPanel';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import './theme.css';

function App() {
  const [theme, setTheme] = useState('light');
  const [meetingSaved, setMeetingSaved] = useState(false);
  const [error, setError] = useState(null);
  const canvasRef = useRef(null);
  
  const [actaData, setActaData] = useState({
    titulo: '',
    fecha: new Date().toISOString().split('T')[0],
    participantes: '',
    temas: '',
    acuerdos: '',
    conclusiones: ''
  });
  
  const { 
    transcript, 
    isListening, 
    startTranscription, 
    stopTranscription,
    clearTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable 
  } = useTranscription();
  
  const { 
    startVisualizer, 
    stopVisualizer 
  } = useAudioVisualizer(canvasRef);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleStart = async () => {
    try {
      setError(null);
      setMeetingSaved(false);
      await startTranscription();
      await startVisualizer();
    } catch (error) {
      console.error('Error al iniciar:', error);
      setError(error.message);
      stopTranscription();
      stopVisualizer();
    }
  };

  const handleStop = () => {
    stopTranscription();
    stopVisualizer();
  };

  const handleClear = () => {
    const confirmed = window.confirm('¿Estás seguro de que deseas limpiar la transcripción?');
    if (confirmed) {
      clearTranscript();
      setMeetingSaved(false);
      setActaData({
        titulo: '',
        fecha: new Date().toISOString().split('T')[0],
        participantes: '',
        temas: '',
        acuerdos: '',
        conclusiones: ''
      });
      setError('Transcripción limpiada exitosamente');
    }
  };

  const handleSave = async () => {
    try {
      const currentDate = new Date().toLocaleString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });

      const content = `FENPRUSS Smart Meet - Transcripción
Fecha: ${currentDate}
----------------------------------------

${transcript}

----------------------------------------
Guardado por: cristiansebastianahern
`;

      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `transcripcion-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(link);
      link.click();
      
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      
      setMeetingSaved(true);
      setError('Transcripción guardada exitosamente');
    } catch (error) {
      console.error('Error al guardar:', error);
      setError('Error al guardar la transcripción');
    }
  };

  const handleActaChange = (field, value) => {
    setActaData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateActaContent = () => {
    return `
ACTA DE REUNIÓN - FENPRUSS

Título: ${actaData.titulo}
Fecha: ${actaData.fecha}

PARTICIPANTES:
${actaData.participantes}

TEMAS TRATADOS:
${actaData.temas}

TRANSCRIPCIÓN:
${transcript}

ACUERDOS:
${actaData.acuerdos}

CONCLUSIONES:
${actaData.conclusiones}

Generado por: cristiansebastianahern
Fecha de generación: ${new Date().toLocaleString()}
    `;
  };

  const exportToPDF = async () => {
    try {
      const doc = new jsPDF();
      const content = generateActaContent();
      
      doc.setFont('helvetica');
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

      doc.save(`acta-${actaData.fecha}.pdf`);
      setError('Acta exportada a PDF exitosamente');
    } catch (error) {
      console.error('Error al exportar a PDF:', error);
      setError('Error al exportar a PDF');
    }
  };

  const exportToDOCX = async () => {
    try {
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
      const blob = new Blob([buffer], { 
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
      });
      saveAs(blob, `acta-${actaData.fecha}.docx`);
      setError('Acta exportada a DOCX exitosamente');
    } catch (error) {
      console.error('Error al exportar a DOCX:', error);
      setError('Error al exportar a DOCX');
    }
  };

  return (
    <div className={`app-container ${theme}`}>
      <Header theme={theme} toggleTheme={toggleTheme} />
      <main className="main-content">
        {error && (
          <div className={`message ${error.includes('exitosamente') ? 'success' : 'error'}`}>
            {error}
          </div>
        )}
        <Controls 
          isListening={isListening}
          meetingSaved={meetingSaved}
          onStart={handleStart}
          onStop={handleStop}
          onClear={handleClear}
          onSave={handleSave}
          transcript={transcript}
          browserSupportsSpeechRecognition={browserSupportsSpeechRecognition}
          isMicrophoneAvailable={isMicrophoneAvailable}
        />
        <Visualizer canvasRef={canvasRef} />
        <TranscriptionArea 
          transcript={transcript}
          isListening={isListening}
          isMicrophoneAvailable={isMicrophoneAvailable}
        />
        <SummaryArea 
          actaData={actaData}
          onActaChange={handleActaChange}
          onExportPDF={exportToPDF}
          onExportDOCX={exportToDOCX}
          isListening={isListening}
          transcript={transcript}
        />
        <DebugPanel 
          isListening={isListening}
          isMicrophoneAvailable={isMicrophoneAvailable}
          transcript={transcript}
          browserSupportsSpeechRecognition={browserSupportsSpeechRecognition}
        />
      </main>
    </div>
  );
}

export default App;