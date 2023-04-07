import { useEffect, useCallback, useRef, useLayoutEffect } from "react";

const useKeyPress = (keys, callback, node = null) => {
  const callbackRef = useRef(callback);

  useLayoutEffect(() => {
    callbackRef.current = callback;
  });

  const handleKeyPress = useCallback(
    (event) => {
      if (
        event.shiftKey ||
        keys.some((key) => event.key.toLowerCase() === key.toLowerCase())
      ) {
        callbackRef.current(event);
      }
    },
    [keys]
  );

  useEffect(() => {
    const targetNode = node ?? document;

    targetNode && targetNode.addEventListener("keydown", handleKeyPress);

    return () =>
      targetNode && targetNode.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress, node]);
};

export default useKeyPress;
