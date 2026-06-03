export const safeGetItem = (key: string) => {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn(
        `localStorage access denied for key "${key}":`,
        error.message,
      );
    }
    return null;
  }
};

export const safeSetItem = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn(
        `localStorage access denied for key "${key}":`,
        error.message,
      );
    }
    return false;
  }
};

export const safeRemoveItem = (key: string) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn(
        `localStorage access denied for key "${key}":`,
        error.message,
      );
    }
    return false;
  }
};
