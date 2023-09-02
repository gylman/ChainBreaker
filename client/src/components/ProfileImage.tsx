import { useEffect, useRef } from "react";
import { wallet } from "../signals";
// @ts-ignore
import jazzicon from "@metamask/jazzicon";

export default function ProfileImage({ size = 128 }: { size?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const account = wallet.value?.accounts.at(0);

  useEffect(() => {
    const element = ref.current;
    if (element && account) {
      const addr = account.slice(2, 10);
      const seed = parseInt(addr, 16);
      const icon = jazzicon(size, seed);
      if (element.firstChild) {
        element.removeChild(element.firstChild);
      }
      element.appendChild(icon);
    }
  }, [account, size]);

  return (
    <div
      ref={ref}
      className="overflow-clip rounded-full"
      style={{
        width: size,
        height: size,
      }}
    />
  );
}
