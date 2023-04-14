import { useEffect, useCallback, useRef, useLayoutEffect } from "react";

const useKeyPress = (keysToAction, node = null) => {
  const keysToActionRef = useRef(keysToAction);

  useLayoutEffect(() => {
    keysToActionRef.current = keysToAction;
  });

  const handleKeyPress = useCallback(
    (event) => {
      for (let i = 0; i < keysToAction.length; i++) {
        const { keys, conditionals } = keysToAction[i];

        if (keys.length > 2) throw new Error("keys length exceeded");

        const areAllConditionsMet = conditionals && conditionals.every(Boolean);

        if (keys.length > 1) {
          const [specialKey, key] = keys;
          const isKeyCombinationPressed =
            event[specialKey] && event.key.toLowerCase() === key.toLowerCase();

          if (isKeyCombinationPressed && areAllConditionsMet) {
            // console.log(`${specialKey}+${key} combo`);
            return keysToActionRef.current[i].callback(event);
          }
        }

        const areAllKeysPressed = keys.every((key) => key === event.key);

        if (areAllConditionsMet && areAllKeysPressed) {
          // console.log(`${keys[0]} Pressed`);
          keysToActionRef.current[i].callback(event);
        }
      }
      // console.log(event);
    },
    [keysToAction]
  );

  useEffect(() => {
    const targetNode = node ?? document;

    targetNode && targetNode.addEventListener("keydown", handleKeyPress);

    return () =>
      targetNode && targetNode.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress, node]);
};

export default useKeyPress;
