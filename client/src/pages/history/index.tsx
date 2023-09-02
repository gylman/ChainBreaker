import { useEffect } from "react";
import { title } from "../../signals";
import * as Tabs from "@radix-ui/react-tabs";

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
          Withdraws
        </Tabs.Trigger>
      </Tabs.List>
      <main className="h-[calc(100%-126px)] overflow-y-auto overscroll-y-none">
        <Tabs.Content className="min-h-full space-y-6 p-6 pb-[5.5rem]" value="all">
          All!
        </Tabs.Content>
        <Tabs.Content className="min-h-full space-y-6 p-6 pb-[5.5rem]" value="deposits">
          Deposits!
        </Tabs.Content>
        <Tabs.Content className="min-h-full space-y-6 p-6 pb-[5.5rem]" value="withdraws">
          Withdraws!
        </Tabs.Content>
      </main>
    </Tabs.Root>
  );
}
