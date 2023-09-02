import type { HTMLAttributes } from "react";
import { cx } from "../utils/common";

export default function AddressText({ address, ...props }: { address?: string } & HTMLAttributes<HTMLDivElement>) {
  if (!address) return null;

  return (
    <div {...props} className={cx("flex justify-center", props.className)}>
      <span className="min-w-0 max-w-max flex-1 truncate">{address.slice(0, -6)}</span>
      <span className="shrink-0">{address.slice(-6)}</span>
    </div>
  );
}
