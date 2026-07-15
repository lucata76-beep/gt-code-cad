import React from 'react';

export interface ToolDefinition {
  id: string;
  icon: string;
  label: string;
}

interface ToolPanelProps {
  tools: ToolDefinition[];
  selectedTool: string;
  onSelectTool: (id: string) => void;
}

const ToolPanel: React.FC<ToolPanelProps> = ({
  tools,
  selectedTool,
  onSelectTool
}) => (
  <div className="panel-section">
    <div className="panel-title">Tools</div>
    <div className="tool-grid">
      {tools.map((tool) => (
        <button
          key={tool.id}
          className={`tool-btn ${selectedTool === tool.id ? 'active' : ''}`}
          onClick={() => onSelectTool(tool.id)}
          type="button"
        >
          <div className="tool-icon">{tool.icon}</div>
          <div>{tool.label}</div>
        </button>
      ))}
    </div>
  </div>
);

export default ToolPanel;
