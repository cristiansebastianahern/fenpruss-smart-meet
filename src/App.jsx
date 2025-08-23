import React, { useState, useRef, useEffect } from 'react';
import Header from './components/Header';
import Controls from './components/Controls';
import Visualizer from './components/Visualizer';
import TranscriptionArea from './components/TranscriptionArea';
import useTranscription from './hooks/useTranscription';
import useAudioVisualizer from './hooks/useAudioVisualizer';
import DebugPanel from './components/DebugPanel';
import './theme.css';

function App() {
  const [theme, setTheme] = useState('light');
  const [meetingSaved, setMeetingSaved] = useState(false);
  const [error, setError] = useState(null);
  const canvasRef = useRef(null);
  
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
    // Limpiar el error después de 5 segundos
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