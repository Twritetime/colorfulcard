import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "primary" | "outline" | "ghost" | "link" | "danger";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, children, variant = "default", size = "default", ...props },
    ref
  ) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
          {
            "bg-primary text-primary-foreground hover:bg-primary/90":
              variant === "primary",
            "bg-slate-900 text-white hover:bg-slate-800": variant === "default",
            "border border-slate-200 hover:bg-slate-100": variant === "outline",
            "hover:bg-slate-100 hover:text-slate-900": variant === "ghost",
            "underline-offset-4 hover:underline text-slate-900":
              variant === "link",
            "bg-red-500 text-white hover:bg-red-600": variant === "danger",
            "h-10 py-2 px-4": size === "default",
            "h-9 px-3 rounded-md": size === "sm",
            "h-11 px-8 rounded-md": size === "lg",
            "h-10 w-10": size === "icon",
          },
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button }; 