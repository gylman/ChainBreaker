import { atomWithStorage } from "jotai/utils";

type NamedContact = { name: string; address: string };
export const namedContactsAtom = atomWithStorage<NamedContact[]>("namedContactsAtom", []);

export const debtClearingAllowedAtom = atomWithStorage<boolean>("debtClearingAllowedAtom", true);
