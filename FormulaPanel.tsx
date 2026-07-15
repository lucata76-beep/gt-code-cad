import React from 'react';

interface FormulaPanelProps {
  formula: string;
  onFormulaChange: (value: string) => void;
  onEvaluate: () => void;
}

const FormulaPanel: React.FC<FormulaPanelProps> = ({
  formula,
  onFormulaChange,
  onEvaluate
}) => (
  <div className="panel-section">
    <div className="panel-title">Mathematical Engine</div>
    <input
      type="text"
      className="formula-input"
      placeholder="y = x^2 or x^2 + y^2 = 25"
      value={formula}
      onChange={(event) => onFormulaChange(event.target.value)}
      onKeyDown={(event) => event.key === 'Enter' && onEvaluate()}
    />
    <button className="btn" onClick={onEvaluate} type="button">
      Plot Curve
    </button>
  </div>
);

export default FormulaPanel;
