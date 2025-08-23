import React from 'react';

const Controls = ({ 
  isListening, 
  onStart, 
  onStop, 
  onClear,
  onSave,
  transcript,
  browserSupportsSpeechRecognition,
  isMicrophoneAvailable 
}) => {
  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="controls">
        <div className="browser-warning">
          ⚠️ Tu navegador no soporta reconocimiento de voz.
          <br />
          Por favor, usa Google Chrome para una mejor experiencia.
        </div>
      </div>
    );
  }

  return (
    <div className="controls">
      <div className="controls-group">
        {!isListening ? (
          <button 
            className="primary-button"
            onClick={onStart}
            disabled={!isMicrophoneAvailable}
          >
            Iniciar Reunión
          </button>
        ) : (
          <button 
            className="stop-button"
            onClick={onStop}
          >
            Detener Reunión
          </button>
        )}
        
        <button 
          className="clear-button"
          onClick={onClear}
          disabled={!transcript}
        >
          Limpiar Transcripción
        </button>

        <button 
          className="save-button"
          onClick={onSave}
          disabled={!transcript}
        >
          Guardar Transcripción
        </button>
      </div>
    </div>
  );
};

export default Controls;