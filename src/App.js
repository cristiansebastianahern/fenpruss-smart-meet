import React, { useState } from 'react';
import Header from './components/Header';
import Controls from './components/Controls';
import TranscriptionArea from './components/TranscriptionArea';
import Visualizer from './components/Visualizer';
import Output from './components/Output';
import useTranscription from './hooks/useTranscription';
import useAudioVisualizer from './hooks/useAudioVisualizer';
import useTheme from './hooks/useTheme';

import './theme.css';

function App() {
  const [meetingSaved, setMeetingSaved] = useState(false);
  const [output, setOutput] = useState({ summary: '', act: '' });
  const { transcript, startTranscription, stopTranscription, isListening } = useTranscription();
  const { canvasRef, startVisualizer, stopVisualizer, isActive } = useAudioVisualizer();
  const { theme, toggleTheme } = useTheme();

  const handleStart = async () => {
    await startTranscription();
    startVisualizer();
  };

  const handleStop = () => {
    stopTranscription();
    stopVisualizer();
  };

  const handleSave = () => {
    setMeetingSaved(true);
    localStorage.setItem('transcript', transcript);
  };

  return (
    <div className={`app-container ${theme}`}>
      <Header theme={theme} toggleTheme={toggleTheme} />
      <Controls
        isListening={isListening}
        meetingSaved={meetingSaved}
        onStart={handleStart}
        onStop={handleStop}
        onSave={handleSave}
        transcript={transcript}
        setOutput={setOutput}
      />
      <Visualizer canvasRef={canvasRef} isActive={isActive} />
      <TranscriptionArea transcript={transcript} />
      <Output output={output} transcript={transcript} />
    </div>
  );
}

export default App;