import { useCallback, useState } from 'react';
import { generateFanucGCode, GCodeCurve } from '../utils/gcodeGenerator';

export const useGCode = () => {
  const [gcode, setGcode] = useState('');

  const generate = useCallback((curves: GCodeCurve[]) => {
    const generated = generateFanucGCode(curves);
    setGcode(generated);
    return generated;
  }, []);

  const clear = useCallback(() => setGcode(''), []);

  return { gcode, generate, clear };
};
