import React from 'react';


const useKeydown = (key, keyFunction) => {
  React.useEffect(() => {
    const handleKeydown = ev => {
      if (ev.code === key) {
        keyFunction();
      }
    };
    window.addEventListener('keydown', handleKeydown);
    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  });
};

export default useKeydown;