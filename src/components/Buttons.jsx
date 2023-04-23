import React from "react";
import clsx from "clsx";
import { forwardRef } from "react";

const Button = forwardRef(({ onClick, className, children, ...props }, ref) => {
  return (
    <button
      ref={ref}
      onClick={onClick}
      className={clsx(className, "h-10 px-4 rounded-md transition-colors")}
      {...props}
    >
      {children}
    </button>
  );
});

const IconButton = forwardRef(
  ({ onClick, className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        onClick={onClick}
        className={clsx(
          "h-10 w-10 transition-colors rounded-md grid place-content-center cursor-pointer",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

const IconTextButton = forwardRef(
  ({ onClick, className, icon, text, ...props }, ref) => {
    return (
      <button
        ref={ref}
        onClick={onClick}
        className={clsx(
          "h-10 w-10 flex items-center justify-center rounded-md font-semibold transition-colors md:gap-2 md:w-max md:px-4",
          className
        )}
        {...props}
      >
        <span>{icon}</span>
        <span className="capitalize hidden md:flex md:h-full md:items-center ">
          {text}
        </span>
      </button>
    );
  }
);

export { Button, IconButton, IconTextButton };
