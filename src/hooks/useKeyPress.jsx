import { useEffect, useCallback, useRef, useLayoutEffect } from "react";

const useKeyPress = (keysToAction, node = null) => {
  // const { keys, conditionals, callback } = keysToAction;

  const callbackRef = useRef(keysToAction);

  useLayoutEffect(() => {
    callbackRef.current = keysToAction;
  });

  const handleKeyPress = useCallback(
    (event) => {
      for (let i = 0; i < keysToAction.length; i++) {
        const { keys, conditionals } = keysToAction[i];
        const areAllConditionsMet = conditionals && conditionals.every(Boolean);

        if (keys.length > 1) {
          if (
            keys.length > 1 &&
            event[keys[0]] &&
            event.key.toLowerCase() === keys[1].toLowerCase()
          ) {
            return callbackRef.current[i].callback(event);
            // return console.log(`${keys[0]}+${keys[1]} combo`);
          }
        }

        const areAllKeysPressed = keys.every((key) => key === event.key);
        // console.log({ areAllKeysPressed, areAllConditionsMet });
        if (areAllConditionsMet && areAllKeysPressed) {
          console.log(`${keys[0]} Pressed`);
          callbackRef.current[i].callback(event);
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
