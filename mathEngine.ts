import { compile } from 'mathjs';

export interface MathPoint {
  x: number;
  y: number;
}

export const evaluateMathExpression = (
  expression: string,
  variables: Record<string, number>
): number => {
  try {
    const value = compile(expression).evaluate(variables);
    return typeof value === 'number' ? value : Number(value);
  } catch {
    return NaN;
  }
};

export const sampleExplicitCurve = (
  expression: string,
  minimumX = -10,
  maximumX = 10,
  steps = 200
): MathPoint[] => {
  const points: MathPoint[] = [];
  const increment = (maximumX - minimumX) / steps;

  for (let x = minimumX; x <= maximumX; x += increment) {
    const y = evaluateMathExpression(expression, { x });
    if (Number.isFinite(y)) points.push({ x, y });
  }

  return points;
};
