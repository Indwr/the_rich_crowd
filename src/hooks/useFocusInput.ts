import { useEffect, useRef } from 'react';

const useFocusInput = () => {
  const inputsRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputsRef.current?.focus();
  }, []);

  return { inputsRef };
};

export default useFocusInput;