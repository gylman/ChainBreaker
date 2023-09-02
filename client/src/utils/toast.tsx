import { ReactNode } from "react";
import { toast } from "react-hot-toast";

export function showToast(children: ReactNode) {
  toast.custom(
    <div className="w-11/12 max-w-md rounded-2xl border-2 border-gray-800 bg-white px-5 py-3 shadow-[6px_6px_0px_rgb(31_41_55)]">
      {children}
    </div>,
  );
}
