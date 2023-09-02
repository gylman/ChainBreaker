import { useEffect } from "react";
import * as Checkbox from "@radix-ui/react-checkbox";
import { IconCheck, IconUserPlus } from "@tabler/icons-react";
import { title, wallet, wantingDebtsCleared } from "../../signals";
import Input from "../../components/Input";
import Dialog from "../../components/Dialog";
import Button from "../../components/Button";
import ProfileImage from "../../components/ProfileImage";
import AddressText from "../../components/AddressText";

export default function Contacts() {
  useEffect(() => {
    title.value = "Contacts";
  }, []);

  const address = wallet.value?.accounts.at(0);

  useEffect(() => {}, [address]);

  // example of a page
  return (
    <>
      <Dialog.Root>
        <div className="fixed right-6 top-4">
          <Dialog.Trigger>
            <Button
              as="div"
              className="font-display w-full rounded-full bg-blue-700 px-4 py-2.5 font-bold text-white shadow-lg shadow-blue-700/30"
            >
              <div className="flex items-center gap-2">
                <IconUserPlus size={20} />
                <span className="h-5">Add New</span>
              </div>
            </Button>
          </Dialog.Trigger>
        </div>
        <Dialog.Content>
          <Dialog.Title className="mb-1">Add New Contact</Dialog.Title>

          <div className="space-y-2">
            <fieldset className="space-y-0.5">
              <label className="text-sm font-semibold text-gray-800" htmlFor="confirm-other">
                Address
              </label>
              <Input size="sm" id="confirm-other" name="confirm-other" defaultValue="" />
            </fieldset>
            <fieldset className="space-y-0.5">
              <label className="text-sm font-semibold text-gray-800" htmlFor="confirm-amount">
                Name
              </label>
              <Input size="sm" id="confirm-amount" name="confirm-amount" defaultValue="" />
            </fieldset>

            <div className="pt-4">
              <Button
                type="submit"
                className="font-display w-full rounded-full bg-blue-700 px-4 pb-1.5 pt-2.5 font-bold text-white"
              >
                Confirm With Peer
              </Button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Root>

      <div className="px-6 pb-[5.5rem] pt-2">
        {address && (
          <div className="mb-12 flex flex-col items-center gap-6">
            <ProfileImage />
            <AddressText className="font-display w-full text-3xl font-bold" address={address} />
          </div>
        )}

        <div className="space-y-2 rounded-2xl border-2 border-gray-800 bg-blue-100 px-4 py-4">
          <label className="flex select-none gap-4">
            <Checkbox.Root
              checked={wantingDebtsCleared.value}
              onCheckedChange={(checked) => {
                wantingDebtsCleared.value = checked === true;
              }}
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full data-[state=unchecked]:border-2 data-[state=unchecked]:border-gray-800 data-[state=checked]:bg-gray-800 data-[state=unchecked]:bg-white data-[state=checked]:text-white"
            >
              <Checkbox.Indicator className="CheckboxIndicator">
                <IconCheck size={16} />
              </Checkbox.Indicator>
            </Checkbox.Root>
            <span>I want my debts to be cleared</span>
          </label>

          {wantingDebtsCleared.value && (
            <>
              <fieldset className="!mt-4 space-y-0.5">
                <label className="text-sm font-semibold text-gray-800" htmlFor="other">
                  Gas Fee
                </label>
                <Input size="sm" id="other" name="other" defaultValue="" />
              </fieldset>

              <fieldset className="space-y-0.5">
                <label className="text-sm font-semibold text-gray-800" htmlFor="other">
                  Tip
                </label>
                <Input size="sm" id="other" name="other" defaultValue="" />
              </fieldset>
            </>
          )}
        </div>

        <div className="sticky top-[76px] mb-2 mt-6 bg-white pb-4">
          <Input placeholder="Search" className="sticky" />
        </div>

        <ul className="space-y-2">
          <li className="flex flex-wrap justify-between rounded-xl border-2 border-gray-800 bg-red-100 py-2 pl-4 pr-2">
            {/* name */}
            <span className="min-w-fit flex-1 truncate">Alice</span>

            {/* tags */}
            <div className="flex w-fit shrink-0 flex-wrap justify-end gap-x-1.5">
              <span className="shrink-0 rounded-full border-2 border-gray-800 px-2 text-sm">is owed</span>
            </div>
          </li>
          <li className="flex flex-wrap justify-between rounded-xl border-2 border-gray-800 bg-red-100 py-2 pl-4 pr-2">
            {/* name */}
            <span className="min-w-fit flex-1 truncate">Brian</span>

            {/* tags */}
            <div className="flex w-fit shrink-0 flex-wrap justify-end gap-x-1.5">
              <span className="shrink-0 rounded-full border-2 border-gray-800 px-2 text-sm">is owed</span>
              <span className="shrink-0 rounded-full border-2 border-red-800 bg-red-600 px-2 text-sm text-white">
                expired
              </span>
            </div>
          </li>
          <li className="flex flex-wrap justify-between rounded-xl border-2 border-gray-800 bg-lime-100 py-2 pl-4 pr-2">
            {/* name */}
            <span className="min-w-fit flex-1 truncate">Chris</span>

            {/* tags */}
            <div className="flex w-fit shrink-0 flex-wrap justify-end gap-x-1.5">
              <span className="shrink-0 rounded-full border-2 border-gray-800 px-2 text-sm">owes</span>
              <span className="shrink-0 rounded-full border-2 border-red-800 bg-red-600 px-2 text-sm text-white">
                expired
              </span>
            </div>
          </li>
          <li className="flex flex-wrap justify-between rounded-xl border-2 border-gray-800 py-2 pl-4 pr-2">
            {/* name */}
            <span className="min-w-fit flex-1 truncate">0xC204...75B3F9</span>

            {/* tags */}
            <div className="flex w-fit shrink-0 flex-wrap justify-end gap-x-1.5" />
          </li>
        </ul>
      </div>
    </>
  );
}
