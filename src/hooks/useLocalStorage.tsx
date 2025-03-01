import { type Dispatch, type SetStateAction, useEffect, useState } from "react";

type Props<T> = [T, Dispatch<SetStateAction<T>>];

export default function useLocalStorage<T>(
  key: string,
  initialValue: T
): Props<T> {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error("Error writing to localStorage:", error);
    }
  }, [storedValue, key]);

  return [storedValue, setStoredValue];
}
