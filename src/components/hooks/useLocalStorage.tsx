import { useEffect, useState } from 'react';

const getSavedValue = (key: string, initialValue: any) => {
  const item = localStorage.getItem(key);
  const savedValue = item ? JSON.parse(item) : null;
  if (savedValue) {
    console.log('savedValue', savedValue);
    return savedValue;
  }
  return initialValue instanceof Function ? initialValue() : initialValue;
};

function useLocalStorage(
  key: string,
  initialValue: any
): (any | ((value: any) => void))[] {
  const [value, setValue] = useState(() => {
    return getSavedValue(key, initialValue);
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

export default useLocalStorage;
