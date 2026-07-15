import { useCallback, useState } from 'react';

export interface CADPoint {
  x: number;
  y: number;
}

export interface CADCurve {
  id: string;
  type: 'explicit' | 'implicit' | 'parametric' | 'primitive';
  equation: string;
  points: CADPoint[];
  color: string;
}

export const useCAD = () => {
  const [curves, setCurves] = useState<CADCurve[]>([]);
  const [selectedTool, setSelectedTool] = useState('select');

  const addCurve = useCallback((curve: CADCurve) => {
    setCurves((current) => [...current, curve]);
  }, []);

  const removeCurve = useCallback((id: string) => {
    setCurves((current) => current.filter((curve) => curve.id !== id));
  }, []);

  const clearCurves = useCallback(() => setCurves([]), []);

  return {
    curves,
    selectedTool,
    setSelectedTool,
    addCurve,
    removeCurve,
    clearCurves
  };
};
