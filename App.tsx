import React, { useState, useRef, useEffect } from 'react';
import './index.css';

interface Point {
  x: number;
  y: number;
}

interface Curve {
  id: string;
  type: 'explicit' | 'implicit' | 'parametric' | 'primitive';
  equation: string;
  points: Point[];
  color: string;
}

const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [curves, setCurves] = useState<Curve[]>([]);
  const [selectedTool, setSelectedTool] = useState<string>('select');
  const [formula, setFormula] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const [gcode, setGcode] = useState('');
  const [scale] = useState(20);
  const [offset, setOffset] = useState({ x: 400, y: 300 });

  const colors = ['#ff6b35', '#00d4ff', '#7c3aed', '#10b981', '#f59e0b'];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const currentOffset = { x: canvas.width / 2, y: canvas.height / 2 };
      setOffset(currentOffset);

      ctx.fillStyle = '#0a0e27';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = '#1e2746';
      ctx.lineWidth = 0.5;

      for (let x = 0; x < canvas.width; x += scale) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      for (let y = 0; y < canvas.height; y += scale) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      ctx.strokeStyle = '#ff6b35';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, currentOffset.y);
      ctx.lineTo(canvas.width, currentOffset.y);
      ctx.moveTo(currentOffset.x, 0);
      ctx.lineTo(currentOffset.x, canvas.height);
      ctx.stroke();

      curves.forEach((curve) => {
        if (curve.points.length < 2) return;

        ctx.strokeStyle = curve.color;
        ctx.lineWidth = 2;
        ctx.beginPath();

        curve.points.forEach((point, index) => {
          const x = currentOffset.x + point.x * scale;
          const y = currentOffset.y - point.y * scale;

          if (index === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        });

        ctx.stroke();
      });
    };

    draw();
    window.addEventListener('resize', draw);
    return () => window.removeEventListener('resize', draw);
  }, [curves, scale]);

  const evaluateFormula = () => {
    try {
      const points: Point[] = [];
      const steps = 200;

      if (formula.includes('y=')) {
        const expr = formula.replace('y=', '').trim();
        for (let i = -10; i <= 10; i += 20 / steps) {
          const x = i;
          const y = evaluateExpression(expr, { x });
          if (isFinite(y) && !isNaN(y)) {
            points.push({ x, y });
          }
        }
      } else if (formula.includes('x^2') || formula.includes('y^2')) {
        for (let i = -10; i <= 10; i += 0.1) {
          for (let j = -10; j <= 10; j += 0.1) {
            try {
              const result = evaluateExpression(formula, { x: i, y: j });
              if (Math.abs(result) < 0.1) {
                points.push({ x: i, y: j });
              }
            } catch {
              // Ignora i punti non valutabili.
            }
          }
        }
      }

      const newCurve: Curve = {
        id: Date.now().toString(),
        type: 'explicit',
        equation: formula,
        points,
        color: colors[curves.length % colors.length]
      };

      setCurves([...curves, newCurve]);
      setResults([`Curva aggiunta: ${formula}`, `Punti calcolati: ${points.length}`]);
    } catch {
      setResults(['Errore nella formula']);
    }
  };

  const evaluateExpression = (expr: string, vars: { x?: number; y?: number }): number => {
    try {
      const sanitized = expr.replace(/\^/g, '**');
      const func = new Function('x', 'y', `return ${sanitized}`);
      return Number(func(vars.x ?? 0, vars.y ?? 0));
    } catch {
      return NaN;
    }
  };

  const generateGCode = () => {
    let code = `; GT.Code Analytic CAD v1.0.0\n`;
    code += `; Generated: ${new Date().toISOString()}\n\n`;
    code += `G21 (Metric units)\n`;
    code += `G90 (Absolute positioning)\n`;
    code += `G17 (XY plane)\n\n`;
    code += `; Safety position\n`;
    code += `G0 Z5.0\n`;
    code += `G0 X0 Y0\n\n`;

    curves.forEach((curve, index) => {
      code += `; Curve ${index + 1}: ${curve.equation}\n`;
      code += `G0 Z2.0\n`;

      if (curve.points.length > 0) {
        const first = curve.points[0];
        code += `G0 X${first.x.toFixed(3)} Y${first.y.toFixed(3)}\n`;
        code += `G1 Z-0.5 F100\n`;

        for (let i = 1; i < curve.points.length; i++) {
          const p = curve.points[i];
          code += `G1 X${p.x.toFixed(3)} Y${p.y.toFixed(3)} F500\n`;
        }
      }
      code += '\n';
    });

    code += `; End of program\n`;
    code += `G0 Z10.0\n`;
    code += `M30\n`;
    setGcode(code);
  };

  const saveProject = () => {
    const data = {
      version: '1.0.0',
      curves,
      timestamp: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `project_${Date.now()}.gtcad`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportNC = () => {
    const blob = new Blob([gcode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `program_${Date.now()}.nc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const tools = [
    { id: 'select', icon: '↖', label: 'Select' },
    { id: 'line', icon: '📏', label: 'Line' },
    { id: 'circle', icon: '⭕', label: 'Circle' },
    { id: 'arc', icon: '⌒', label: 'Arc' },
    { id: 'rectangle', icon: '⬜', label: 'Rect' },
    { id: 'trim', icon: '✂️', label: 'Trim' },
    { id: 'offset', icon: '⇉', label: 'Offset' },
    { id: 'measure', icon: '📐', label: 'Measure' }
  ];

  return (
    <div className="app-container">
      <header className="header">
        <div className="logo">
          <div className="logo-icon glow-effect">GT</div>
          <span className="logo-text">.Code</span>
        </div>
        <div className="version">v1.0.0</div>
      </header>

      <div className="main-content">
        <div className="canvas-container">
          <div className="canvas-wrapper">
            <canvas
              ref={canvasRef}
              className="canvas"
              onTouchStart={(event) => event.preventDefault()}
              onTouchMove={(event) => event.preventDefault()}
              aria-label={`Area CAD, origine ${offset.x.toFixed(0)}, ${offset.y.toFixed(0)}`}
            />
          </div>
        </div>

        <div className="side-panel">
          <div className="panel-section">
            <div className="panel-title">Tools</div>
            <div className="tool-grid">
              {tools.map((tool) => (
                <button
                  key={tool.id}
                  className={`tool-btn ${selectedTool === tool.id ? 'active' : ''}`}
                  onClick={() => setSelectedTool(tool.id)}
                  type="button"
                >
                  <div className="tool-icon">{tool.icon}</div>
                  <div>{tool.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="panel-section">
            <div className="panel-title">Mathematical Engine</div>
            <input
              type="text"
              className="formula-input"
              placeholder="y = x^2 or x^2 + y^2 = 25"
              value={formula}
              onChange={(event) => setFormula(event.target.value)}
              onKeyDown={(event) => event.key === 'Enter' && evaluateFormula()}
            />
            <button className="btn" onClick={evaluateFormula} type="button">
              Plot Curve
            </button>
          </div>

          {results.length > 0 && (
            <div className="panel-section">
              <div className="panel-title">Results</div>
              {results.map((result, index) => (
                <div key={index} className="result-item">{result}</div>
              ))}
            </div>
          )}

          <div className="panel-section">
            <div className="panel-title">CAM / G-Code</div>
            <button className="btn full-width-btn" onClick={generateGCode} type="button">
              Generate G-Code
            </button>
            {gcode && (
              <div className="gcode-viewer">
                <pre>{gcode}</pre>
              </div>
            )}
          </div>

          <div className="panel-section">
            <div className="panel-title">Export</div>
            <div className="export-actions">
              <button className="btn export-btn" onClick={saveProject} type="button">
                Save .GTCAD
              </button>
              <button
                className="btn btn-secondary export-btn"
                onClick={exportNC}
                type="button"
                disabled={!gcode}
              >
                Export .NC
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
