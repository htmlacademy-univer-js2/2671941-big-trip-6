const ESCAPE_KEYS = ['Escape', 'Esc'];

export const isEscapeKey = (key) => ESCAPE_KEYS.includes(key);

export const addEscapeListener = (handler) => {
  const wrappedHandler = (evt) => {
    if (isEscapeKey(evt.key)) {
      handler(evt);
    }
  };

  document.addEventListener('keydown', wrappedHandler);
  return () => document.removeEventListener('keydown', wrappedHandler);
};