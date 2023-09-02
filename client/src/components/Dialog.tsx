import * as D from "@radix-ui/react-dialog";
import type { PropsWithChildren } from "react";
import { cx } from "../utils/common";

function Content({ children }: PropsWithChildren) {
  return (
    <D.Portal>
      <D.Overlay className="animate-overlayShow fixed inset-0 bg-black/25" />
      <D.Content className="fixed left-1/2 top-1/2 max-h-[83.33%] w-11/12 max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border-2 border-gray-800 bg-white p-5 shadow-[6px_6px_0px_rgb(31_41_55)]">
        {children}
      </D.Content>
    </D.Portal>
  );
}

function Title(props: D.DialogTitleProps) {
  return <D.Title {...props} className={cx("font-display text-2xl font-black", props.className)} />;
}

const Dialog = {
  Root: D.Root,
  Trigger: D.Trigger,
  Content,
  Title,
};

export default Dialog;
