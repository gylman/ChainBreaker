import type { PropsWithChildren } from "react";
import Header from "./Header";
import BottomNav from "./BottomNav";
import { IconAddressBook, IconHistory, IconTransfer } from "@tabler/icons-react";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <Header />
      <div aria-hidden className="h-[76px] w-full" />

      {children}

      <BottomNav.Root>
        <BottomNav.Button icon={IconTransfer} label="Transfer" match={/^\/(?!contacts)(?!history).*$/m} to="/" />
        <BottomNav.Button icon={IconAddressBook} label="Contacts" match={/^\/contacts.*$/m} to="/contacts" />
        <BottomNav.Button icon={IconHistory} label="History" match={/^\/history.*$/m} to="/history" />
      </BottomNav.Root>
    </>
  );
}
