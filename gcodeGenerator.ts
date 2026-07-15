export interface GCodePoint {
  x: number;
  y: number;
}

export interface GCodeCurve {
  equation: string;
  points: GCodePoint[];
}

export const generateFanucGCode = (curves: GCodeCurve[]): string => {
  const lines = [
    '; GT.Code Analytic CAD v1.0.0',
    `; Generated: ${new Date().toISOString()}`,
    '',
    'G21 (Metric units)',
    'G90 (Absolute positioning)',
    'G17 (XY plane)',
    '',
    '; Safety position',
    'G0 Z5.0',
    'G0 X0 Y0',
    ''
  ];

  curves.forEach((curve, index) => {
    lines.push(`; Curve ${index + 1}: ${curve.equation}`, 'G0 Z2.0');

    if (curve.points.length > 0) {
      const [first, ...rest] = curve.points;
      lines.push(
        `G0 X${first.x.toFixed(3)} Y${first.y.toFixed(3)}`,
        'G1 Z-0.5 F100'
      );

      rest.forEach((point) => {
        lines.push(`G1 X${point.x.toFixed(3)} Y${point.y.toFixed(3)} F500`);
      });
    }

    lines.push('');
  });

  lines.push('; End of program', 'G0 Z10.0', 'M30', '');
  return lines.join('\n');
};
