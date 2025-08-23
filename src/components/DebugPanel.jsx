import React from 'react';

const DebugPanel = ({ 
  isListening, 
  isMicrophoneAvailable, 
  transcript, 
  browserSupportsSpeechRecognition 
}) => {
  return (
    <div className="debug-panel">
      <h4>Panel de Depuración</h4>
      <pre>
        {JSON.stringify({
          navegadorSoportado: browserSupportsSpeechRecognition,
          microfonoDisponible: isMicrophoneAvailable,
          estaEscuchando: isListening,
          longitudTranscripcion: transcript?.length || 0,
          ultimasPalabras: transcript?.slice(-50) || '',
          timestamp: new Date().toISOString()
        }, null, 2)}
      </pre>
    </div>
  );
};

export default DebugPanel;