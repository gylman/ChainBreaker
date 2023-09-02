import { Combobox, ComboboxProps } from "@headlessui/react";
import { type ElementType, useState } from "react";
import { cx } from "../utils/common";
import { IconCheck } from "@tabler/icons-react";

type Contact = { name?: string; address: string };
const contacts: Contact[] = [
  { name: "Alice", address: "0x1830d292" },
  { name: "Brian", address: "0x500d29a3" },
  { name: "Chris", address: "0xc20f721a" },
  { name: "David", address: "0x9377f024" },
  { address: "0x93918822" },
  { address: "0x27940ff2" },
  { address: "0x720deaa2" },
];

export default function AddressInput(props: ComboboxProps<Contact, false, false, ElementType>) {
  const [query, setQuery] = useState("");

  const isQueryAddress = query.startsWith("0x") && query.slice(2).match(/^[0-9a-f]*$/i);
  const filteredContacts =
    query === ""
      ? []
      : query.startsWith("0")
      ? [
          ...contacts.filter((contact) => contact.address.toLocaleLowerCase().startsWith(query.toLocaleLowerCase())),
          ...contacts.filter((contact) => contact.name?.toLocaleLowerCase().startsWith(query.toLocaleLowerCase())),
        ]
      : contacts.filter((contact) => contact.name?.toLocaleLowerCase().startsWith(query.toLocaleLowerCase()));

  return (
    <Combobox as="div" {...props} className="relative">
      <Combobox.Input<Contact, ElementType>
        onChange={(event) => setQuery(event.target.value)}
        displayValue={(contact) => contact.address}
        className="w-full min-w-0 rounded-full border-2 border-gray-800 px-4 py-2 font-sans focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
      />
      <Combobox.Options
        className={cx(
          "absolute z-10 mt-1 w-full overflow-clip rounded-2xl border-2 border-gray-800 bg-white shadow-[4px_4px_0px_rgb(31_41_55)]",
          !isQueryAddress && filteredContacts.length === 0 && "hidden",
        )}
      >
        {filteredContacts.map((contact) => (
          <Combobox.Option
            key={contact.address}
            value={contact}
            className={({ selected, active }) =>
              cx("relative py-1 pl-12 pr-4", selected ? "bg-blue-500 text-white" : active ? "bg-blue-200" : undefined)
            }
          >
            {({ selected }) => (
              <>
                {contact.name && <span>{contact.name}</span>}
                {contact.name ? (
                  <span className="ml-1 text-sm opacity-50">({contact.address})</span>
                ) : (
                  <span>{contact.address}</span>
                )}
                {selected && <IconCheck size={20} className="absolute left-3 top-1.5" />}
              </>
            )}
          </Combobox.Option>
        ))}
        {isQueryAddress && !filteredContacts.some((contact) => contact.address === query) && (
          <Combobox.Option
            value={{ address: query }}
            className={({ selected, active }) =>
              cx("relative py-1 pl-12 pr-4", selected ? "bg-blue-500 text-white" : active ? "bg-blue-200" : undefined)
            }
          >
            {query}
          </Combobox.Option>
        )}
      </Combobox.Options>
    </Combobox>
  );
}
