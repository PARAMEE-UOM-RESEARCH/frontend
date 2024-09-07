import { useEffect, useState } from "react";

export const useLocalStorageListner = (key, interval = 1000) => {
  const [value, setValue] = useState(() =>
    JSON.parse(localStorage.getItem(key))
  );

  useEffect(() => {
    const checkLocalStorage = () => {
      const newValue = JSON.parse(localStorage.getItem(key));
      if (newValue !== value) {
        setValue(newValue);
      }
    };

    const id = setInterval(checkLocalStorage, interval);

    return () => clearInterval(id);
  }, [key, value, interval]);

  return value;
};
