import React from 'react';

interface GCodeViewerProps {
  gcode: string;
}

const GCodeViewer: React.FC<GCodeViewerProps> = ({ gcode }) => {
  if (!gcode) return null;

  return (
    <div className="gcode-viewer">
      <pre>{gcode}</pre>
    </div>
  );
};

export default GCodeViewer;
