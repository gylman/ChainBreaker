import type { ButtonHTMLAttributes, HTMLAttributes } from "react";
import useRipple from "use-ripple-hook";

export default function Button({
  rippleColor,
  as = "button",
  ...props
}: HTMLAttributes<HTMLButtonElement> &
  ButtonHTMLAttributes<HTMLButtonElement> &
  HTMLAttributes<HTMLDivElement> & { rippleColor?: string; as?: "button" | "div" }) {
  const [ref, event] = useRipple({ color: rippleColor ?? "rgba(255, 255, 255, .3)" });
  const As = as;

  return <As {...props} ref={ref} onPointerDown={event} />;
}
