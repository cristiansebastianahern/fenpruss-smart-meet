import { useState, useEffect, useCallback } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import 'regenerator-runtime/runtime';

const useTranscription = () => {
  const [isListening, setIsListening] = useState(false);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable
  } = useSpeechRecognition({
    commands: [],
    transcribing: true,
    clearTranscriptOnListen: false,
  });

  // Sincronizar el transcript con el estado local


  useEffect(() => {
    setIsListening(listening);
  }, [listening]);

  const startTranscription = useCallback(async () => {
    try {
      if (!browserSupportsSpeechRecognition) {
        throw new Error('Tu navegador no soporta el reconocimiento de voz.');
      }

      if (!isMicrophoneAvailable) {
        throw new Error('No se puede acceder al micrófono.');
      }

      console.log('Iniciando transcripción...');
      
      // Configurar el reconocimiento de voz
      await SpeechRecognition.startListening({ 
        continuous: true,
        language: 'es-ES',
        interimResults: true
      });
      
      setIsListening(true);
      console.log('Transcripción iniciada exitosamente');
    } catch (error) {
      console.error('Error detallado al iniciar transcripción:', error);
      throw error;
    }
  }, [browserSupportsSpeechRecognition, isMicrophoneAvailable]);

  const stopTranscription = useCallback(() => {
    console.log('Deteniendo transcripción...');
    SpeechRecognition.stopListening();
    setIsListening(false);
  }, []);

  const clearTranscript = useCallback(() => {
    resetTranscript();
    setLocalTranscript('');
  }, [resetTranscript]);

  return {
    transcript,
    isListening,
    startTranscription,
    stopTranscription,
    clearTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable
  };
};

export default useTranscription;