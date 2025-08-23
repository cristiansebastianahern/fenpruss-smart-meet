import React from 'react';

const TranscriptionArea = ({ transcript, isListening, isMicrophoneAvailable }) => {
  return (
    <div className="transcription-area">
      <div className="transcription-header">
        <h3>Transcripción en Tiempo Real</h3>
        <div className="status-indicators">
          {isListening && <span className="recording-indicator">🔴 Grabando</span>}
          {!isMicrophoneAvailable && 
            <span className="warning-indicator">⚠️ Micrófono no disponible</span>
          }
        </div>
      </div>
      <div className="transcription-content">
        {transcript ? (
          <p>{transcript}</p>
        ) : (
          'La transcripción aparecerá aquí cuando inicies la reunión...'
        )}
      </div>
      <div className="debug-info">
        Estado: {isListening ? 'Escuchando' : 'Detenido'}
        <br />
        Micrófono: {isMicrophoneAvailable ? 'Disponible' : 'No disponible'}
        <br />
        Longitud del texto: {transcript ? transcript.length : 0} caracteres
      </div>
    </div>
  );
};

export default TranscriptionArea;