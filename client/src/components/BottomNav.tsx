import { type TablerIconsProps } from "@tabler/icons-react";
import type { PropsWithChildren } from "react";
import { Link } from "wouter";
import { usePathname } from "wouter/use-location";
import { cx } from "../utils/common";
import Button from "./Button";

function Root({ children }: PropsWithChildren) {
  return (
    <nav className="contents">
      <ul className="font-display fixed bottom-0 flex h-16 w-full justify-stretch overflow-clip border-t-2 border-blue-900 bg-white">
        {children}
      </ul>
    </nav>
  );
}

function BottomNavButton({
  icon: Icon,
  label,
  match,
  to,
}: {
  icon: (props: TablerIconsProps) => JSX.Element;
  label: string;
  match: RegExp;
  to: string;
}) {
  const pathname = usePathname();
  const isActive = match.test(pathname);

  return (
    <li className="contents">
      <Button rippleColor="rgb(37 99 235 / 12%)" className="min-w-0 flex-1">
        <Link href={to} className="contents">
          <div
            className={cx(
              "flex h-full w-full flex-col items-center justify-center transition-transform",
              isActive ? "font-bold text-blue-600" : "scale-[85%] text-gray-500",
            )}
          >
            <Icon size={28} />
            <span className="text-sm">{label}</span>
          </div>
        </Link>
      </Button>
    </li>
  );
}

const BottomNav = {
  Root,
  Button: BottomNavButton,
};

export default BottomNav;
