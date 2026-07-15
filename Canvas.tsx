import React from 'react';

interface CanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  ariaLabel?: string;
}

const Canvas: React.FC<CanvasProps> = ({
  canvasRef,
  ariaLabel = 'Area di disegno CAD'
}) => (
  <div className="canvas-container">
    <div className="canvas-wrapper">
      <canvas
        ref={canvasRef}
        className="canvas"
        aria-label={ariaLabel}
        onTouchStart={(event) => event.preventDefault()}
        onTouchMove={(event) => event.preventDefault()}
      />
    </div>
  </div>
);

export default Canvas;
