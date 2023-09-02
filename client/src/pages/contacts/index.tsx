import { useEffect, useMemo, useState } from "react";
import * as Checkbox from "@radix-ui/react-checkbox";
import { IconCheck, IconUserPlus } from "@tabler/icons-react";
import { contacts, title, wallet } from "../../signals";
import Input from "../../components/Input";
import Dialog from "../../components/Dialog";
import Button from "../../components/Button";
import ProfileImage from "../../components/ProfileImage";
import AddressText from "../../components/AddressText";
import { useAtom } from "jotai";
import { namedContactsAtom, debtClearingAllowedAtom } from "../../states";
import { showToast } from "../../utils/toast";
import { cx } from "../../utils/common";

export default function Contacts() {
  const [namedContacts, setNamedContacts] = useAtom(namedContactsAtom);
  const [debtClearingAllowed, setDebtClearingAllowed] = useAtom(debtClearingAllowedAtom);

  useEffect(() => {
    title.value = "Contacts";
  }, []);

  const address = wallet.value?.accounts.at(0);

  const [query, setQuery] = useState("");
  const filteredContacts = useMemo(() => {
    return contacts.value.filter((contact) => {
      const nc = namedContacts.find((nc) => nc.address === contact.address);

      if (nc) {
        return (
          nc.name.toLocaleLowerCase().includes(query.toLocaleLowerCase()) ||
          nc.address.toLocaleLowerCase().includes(query.toLocaleLowerCase())
        );
      }

      return contact.address.toLocaleLowerCase().includes(query.toLocaleLowerCase());
    });
  }, [contacts.value, query]);

  // example of a page
  return (
    <>
      <Dialog.Root>
        <div className="fixed right-6 top-[20px]">
          <Dialog.Trigger>
            <Button as="div" className="w-full rounded-full bg-blue-700 px-4 py-2.5 font-display font-bold text-white">
              <div className="flex items-center gap-2">
                <IconUserPlus size={20} />
                <span className="h-5">Add New</span>
              </div>
            </Button>
          </Dialog.Trigger>
        </div>
        <Dialog.Content>
          <Dialog.Title className="mb-1">Add New Contact</Dialog.Title>

          <form
            className="space-y-2"
            onSubmit={(e) => {
              e.preventDefault();

              const form = e.target as HTMLFormElement;
              const formData = new FormData(form);

              const address = formData.get("address") as string;
              const name = formData.get("name") as string;

              setNamedContacts((contacts) => [
                ...contacts.filter((contact) => contact.address.toLocaleLowerCase() !== address.toLocaleLowerCase()),
                { address, name },
              ]);
              form.reset();
              showToast("New contact created!");
            }}
          >
            <fieldset className="space-y-0.5">
              <label className="text-sm font-semibold text-gray-800" htmlFor="address">
                Address
              </label>
              <Input size="sm" id="address" name="address" placeholder="0x" defaultValue="" required />
            </fieldset>
            <fieldset className="space-y-0.5">
              <label className="text-sm font-semibold text-gray-800" htmlFor="name">
                Name
              </label>
              <Input size="sm" id="name" name="name" defaultValue="" required />
            </fieldset>

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full rounded-full bg-blue-700 px-4 pb-1.5 pt-2.5 font-display font-bold text-white"
              >
                Add
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Root>

      <div className="px-6 pb-[5.5rem] pt-2">
        {address && (
          <div className="mb-12 flex flex-col items-center gap-6">
            <ProfileImage />
            <AddressText className="w-full font-display text-3xl font-bold" address={address} />
            <label className="flex select-none gap-4">
              <Checkbox.Root
                checked={debtClearingAllowed}
                onCheckedChange={(checked) => {
                  setDebtClearingAllowed(checked === true);
                }}
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full data-[state=unchecked]:border-2 data-[state=unchecked]:border-gray-800 data-[state=checked]:bg-gray-800 data-[state=unchecked]:bg-white data-[state=checked]:text-white"
              >
                <Checkbox.Indicator className="CheckboxIndicator">
                  <IconCheck size={16} />
                </Checkbox.Indicator>
              </Checkbox.Root>
              <span>Allow debt clearing</span>
            </label>
          </div>
        )}

        <div className="sticky top-[76px] mb-2 mt-6 bg-white pb-4">
          <Input
            placeholder="Search"
            className="sticky"
            value={query}
            onChange={(e) => {
              setQuery((e.target as HTMLInputElement).value);
            }}
          />
        </div>

        <ul className="space-y-2">
          {filteredContacts.map(({ address, balance }) => {
            const nc = namedContacts.find((nc) => nc.address === address);

            return (
              <li
                key={address}
                className={cx(
                  "flex flex-wrap justify-between gap-2 rounded-xl border-2 border-gray-800 py-2 pl-4 pr-2",
                  balance > 0 ? "bg-lime-100" : balance < 0 ? "bg-red-100" : "bg-white",
                )}
              >
                {/* name */}
                {nc ? (
                  <span className="min-w-fit flex-1 truncate">{nc.name}</span>
                ) : (
                  <span className="min-w-[48px] max-w-[calc(100%-96px)] flex-1 truncate">
                    <AddressText className="!justify-start" address={address} />
                  </span>
                )}

                {/* tags */}
                <div className="flex w-fit shrink-0 flex-wrap justify-end gap-x-1.5">
                  {balance > 0 && (
                    <span className="shrink-0 rounded-full border-2 border-gray-800 px-2 text-sm">owes</span>
                  )}
                  {balance < 0 && (
                    <span className="shrink-0 rounded-full border-2 border-gray-800 px-2 text-sm">is owed</span>
                  )}
                  {/* <span className="shrink-0 rounded-full border-2 border-red-800 bg-red-600 px-2 text-sm text-white">
                  expired
                </span> */}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
