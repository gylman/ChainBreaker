import { useEffect } from "react";
import { title, transactions } from "../signals";
import * as Tabs from "@radix-ui/react-tabs";
import type { Tx } from "../types";
import { cx } from "../utils/common";
import { namedContactsAtom } from "../states";
import { useAtom } from "jotai";
import AddressText from "../components/AddressText";

export default function History() {
  useEffect(() => {
    title.value = "History";
  }, []);

  // example of a page
  return (
    <Tabs.Root className="contents" defaultValue="all">
      <Tabs.List className="flex">
        <Tabs.Trigger
          className="min-w-0 flex-1 rounded-t-2xl border-b-2 border-gray-800 px-4 py-3 data-[state=active]:border-2 data-[state=active]:border-b-0 data-[state=active]:font-semibold"
          value="all"
        >
          All
        </Tabs.Trigger>
        <Tabs.Trigger
          className="min-w-0 flex-1 rounded-t-2xl border-b-2 border-gray-800 px-4 py-3 data-[state=active]:border-2 data-[state=active]:border-b-0 data-[state=active]:font-semibold"
          value="deposits"
        >
          Deposits
        </Tabs.Trigger>
        <Tabs.Trigger
          className="min-w-0 flex-1 rounded-t-2xl border-b-2 border-gray-800 px-4 py-3 data-[state=active]:border-2 data-[state=active]:border-b-0 data-[state=active]:font-semibold"
          value="withdraws"
        >
          Withdrawals
        </Tabs.Trigger>
      </Tabs.List>
      <main className="h-[calc(100%-126px)] overflow-y-auto overscroll-y-none">
        <Tabs.Content className="min-h-full space-y-6 p-6 pb-[5.5rem]" value="all">
          <ul className="flex flex-col-reverse gap-2">
            {transactions.value.map((tx) => (
              <Item key={`${tx.address}:${tx.idx}`} tx={tx} />
            ))}
          </ul>
        </Tabs.Content>
        <Tabs.Content className="min-h-full space-y-6 p-6 pb-[5.5rem]" value="deposits">
          <ul className="flex flex-col-reverse gap-2">
            {transactions.value
              .filter((tx) => !tx.isSpent)
              .map((tx) => (
                <Item key={`${tx.address}:${tx.idx}`} tx={tx} />
              ))}
          </ul>
        </Tabs.Content>
        <Tabs.Content className="min-h-full space-y-6 p-6 pb-[5.5rem]" value="withdraws">
          <ul className="flex flex-col-reverse gap-2">
            {transactions.value
              .filter((tx) => tx.isSpent)
              .map((tx) => (
                <Item key={`${tx.address}:${tx.idx}`} tx={tx} />
              ))}
          </ul>
        </Tabs.Content>
      </main>
    </Tabs.Root>
  );
}

function Item({ tx }: { tx: Tx }) {
  const [namedContacts] = useAtom(namedContactsAtom);
  const nc = namedContacts.find((nc) => nc.address === tx.address);

  return (
    <li
      key={tx.address}
      className={cx(
        "justify-between rounded-xl border-2 border-gray-800 px-4 py-2",
        !tx.isSpent ? "bg-lime-100" : "bg-red-100",
      )}
    >
      {/* name */}
      <div className="w-full truncate text-lg font-medium">
        {nc ? nc.name : <AddressText className="!justify-start" address={tx.address} />}
      </div>
      <div className="w-full truncate">Status: {tx.status}</div>
      <div className="w-full truncate">Amount: ${tx.amount.toString()}</div>
      {tx.description && <div className="w-full truncate">Message: {tx.description}</div>}
    </li>
  );
}
