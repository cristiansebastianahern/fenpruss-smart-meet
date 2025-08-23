import { useCallback } from 'react';

const useAudioVisualizer = (canvasRef) => {
  let audioContext = null;
  let analyser = null;
  let animationFrame = null;

  const startVisualizer = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      
      source.connect(analyser);
      analyser.fftSize = 256;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const draw = () => {
        animationFrame = requestAnimationFrame(draw);
        analyser.getByteFrequencyData(dataArray);

        ctx.fillStyle = 'rgb(32, 54, 125)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const barWidth = (canvas.width / bufferLength) * 2.5;
        let barHeight;
        let x = 0;

        for(let i = 0; i < bufferLength; i++) {
          barHeight = dataArray[i] / 2;
          ctx.fillStyle = `rgb(${barHeight + 100},50,50)`;
          ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
          x += barWidth + 1;
        }
      };

      draw();
    } catch (error) {
      console.error('Error iniciando visualizador:', error);
      throw error;
    }
  }, [canvasRef]);

  const stopVisualizer = useCallback(() => {
    if (audioContext) {
      audioContext.close();
    }
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }
  }, []);

  return {
    startVisualizer,
    stopVisualizer,
  };
};

export default useAudioVisualizer;