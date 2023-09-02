import { type ForwardedRef, type HTMLAttributes, forwardRef, type InputHTMLAttributes } from "react";
import { cx } from "../utils/common";

const Input = forwardRef(
  <
    Props extends Omit<HTMLAttributes<HTMLInputElement> & InputHTMLAttributes<HTMLInputElement>, "size"> & {
      size?: "sm" | "md";
    },
  >(
    { size, ...props }: Props,
    ref: ForwardedRef<HTMLInputElement>,
  ) => {
    const sizeWithDefault = size ?? "md";

    return (
      <input
        ref={ref}
        {...props}
        className={cx(
          "w-full min-w-0 rounded-full border-2 border-gray-800 font-sans focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-800",
          { sm: "px-4 py-1.5 text-sm", md: "px-4 py-2" }[sizeWithDefault],
          props.className,
        )}
      />
    );
  },
);

export default Input;
