import { useEffect } from "react";
import { title } from "../../signals";
import * as Tabs from "@radix-ui/react-tabs";
import Input from "../../components/Input";
import Dialog from "../../components/Dialog";
import Button from "../../components/Button";
import { IconDivide } from "@tabler/icons-react";
import AddressInput from "../../components/AddressInput";

export default function Transfer() {
  useEffect(() => {
    title.value = "Transfer";
  }, []);

  // example of a page
  return (
    <>
      <Tabs.Root className="contents" defaultValue="receive">
        <Tabs.List className="flex">
          <Tabs.Trigger
            className="min-w-0 flex-1 rounded-t-2xl border-b-2 border-gray-800 px-4 py-3 data-[state=active]:border-2 data-[state=active]:border-b-0 data-[state=active]:bg-lime-100 data-[state=active]:font-semibold"
            value="receive"
          >
            I Received
          </Tabs.Trigger>
          <Tabs.Trigger
            className="min-w-0 flex-1 rounded-t-2xl border-b-2 border-gray-800 px-4 py-3 data-[state=active]:border-2 data-[state=active]:border-b-0 data-[state=active]:bg-red-100 data-[state=active]:font-semibold"
            value="send"
          >
            I Sent
          </Tabs.Trigger>
        </Tabs.List>
        <main className="h-[calc(100%-126px)] overflow-y-auto overscroll-y-none">
          <form
            className="contents"
            onSubmit={(e) => {
              e.preventDefault();

              const form = e.target as HTMLFormElement;
              const formData = new FormData(form);

              console.log(formData);
            }}
          >
            <Tabs.Content className="min-h-full space-y-6 bg-lime-100 p-6 pb-[5.5rem]" value="receive">
              <fieldset className="space-y-1">
                <label className="font-semibold text-gray-800" htmlFor="other">
                  From<span className="text-red-500">*</span>
                </label>
                <AddressInput id="other" name="other" />
              </fieldset>
              <fieldset className="space-y-1">
                <label className="font-semibold text-gray-800" htmlFor="amount">
                  Amount<span className="text-red-500">*</span>
                </label>
                <div className="relative flex gap-1">
                  <Input id="amount" name="amount" defaultValue="" className="pl-8" required />
                  <div className="absolute left-4 py-2.5">$</div>
                  <label className="right-0 top-1.5 flex items-center gap-1">
                    <IconDivide size={16} />
                    <Input id="divided-by" name="divided-by" className="w-20 text-right" defaultValue={1} required />
                  </label>
                </div>
              </fieldset>
              <fieldset className="space-y-1">
                <label className="font-semibold text-gray-800" htmlFor="due-date">
                  Due Date<span className="text-red-500">*</span>
                </label>
                <Input type="datetime-local" id="due-date" name="due-date" defaultValue="" required />
              </fieldset>
              <fieldset className="space-y-1">
                <label className="font-semibold text-gray-800" htmlFor="message">
                  Message
                </label>
                <Input id="message" name="message" defaultValue="" />
              </fieldset>
              <div className="pt-2">
                <Button
                  type="submit"
                  className="font-display w-full rounded-full bg-lime-700 px-4 pb-2 pt-3 font-bold text-white"
                >
                  Confirm With Peer
                </Button>
              </div>
            </Tabs.Content>
            <Tabs.Content className="min-h-full space-y-6 bg-red-100 p-6 pb-[5.5rem]" value="send">
              <fieldset className="space-y-1">
                <label className="font-semibold text-gray-800" htmlFor="other">
                  To<span className="text-red-500">*</span>
                </label>
                <Input id="other" name="other" defaultValue="" />
              </fieldset>
              <fieldset className="space-y-1">
                <label className="font-semibold text-gray-800" htmlFor="amount">
                  Amount<span className="text-red-500">*</span>
                </label>
                <Input id="amount" name="amount" defaultValue="" />
              </fieldset>
              <fieldset className="space-y-1">
                <label className="font-semibold text-gray-800" htmlFor="due-date">
                  Due Date<span className="text-red-500">*</span>
                </label>
                <Input type="datetime-local" id="due-date" name="due-date" defaultValue="" />
              </fieldset>
              <fieldset className="space-y-1">
                <label className="font-semibold text-gray-800" htmlFor="message">
                  Message
                </label>
                <Input id="message" name="message" defaultValue="" />
              </fieldset>
              <div className="pt-2">
                <Button
                  type="submit"
                  className="font-display w-full rounded-full bg-red-700 px-4 pb-2 pt-3 font-bold text-white"
                >
                  Confirm With Peer
                </Button>
              </div>
            </Tabs.Content>
          </form>
        </main>
      </Tabs.Root>

      <Dialog.Root>
        <Dialog.Content>
          <Dialog.Title className="mb-1">Have You Received?</Dialog.Title>

          <div className="space-y-2">
            <fieldset className="space-y-0.5">
              <label className="text-sm font-semibold text-gray-800" htmlFor="confirm-other">
                From
              </label>
              <Input size="sm" id="confirm-other" name="confirm-other" defaultValue="" />
            </fieldset>
            <fieldset className="space-y-0.5">
              <label className="text-sm font-semibold text-gray-800" htmlFor="confirm-amount">
                Amount
              </label>
              <Input size="sm" id="confirm-amount" name="confirm-amount" defaultValue="" />
            </fieldset>
          </div>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
}
