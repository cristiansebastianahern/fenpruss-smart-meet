import React, { useEffect } from 'react';

const Visualizer = ({ canvasRef, isActive }) => {
  useEffect(() => {
    // Canvas setup
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
  }, []);

  return (
    <div className="visualizer-container">
      <canvas 
        ref={canvasRef}
        className={`audio-visualizer ${isActive ? 'active' : ''}`}
      />
    </div>
  );
};

export default Visualizer;