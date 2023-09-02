import { useEffect } from "react";
import { chainBreak, signer, title, transactions } from "../../signals";
import * as Tabs from "@radix-ui/react-tabs";
import Input from "../../components/Input";
import Dialog from "../../components/Dialog";
import Button from "../../components/Button";
import AddressInput from "../../components/AddressInput";
import { useAtomValue } from "jotai";
import { debtClearingAllowedAtom } from "../../states";
import { showToast } from "../../utils/toast";
import useMetamask from "../../hooks/useMetamask";

export default function Transfer() {
  const { updateContacts, myAddress } = useMetamask();

  useEffect(() => {
    title.value = "Transfer";
  }, []);

  const debtClearingAllowed = useAtomValue(debtClearingAllowedAtom);

  const firstPendingTransaction = transactions.value
    .filter((tx) => (tx.isUser1 && tx.status === "pendingFor1") || (!tx.isUser1 && tx.status === "pendingFor2"))
    .at(0);

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
            onSubmit={async (e) => {
              e.preventDefault();

              if (!chainBreak.value || !signer.value || !myAddress) return;

              const form = e.target as HTMLFormElement;
              const formData = new FormData(form);

              console.log(formData);

              const other = (formData.get("other[address]") as string).toLowerCase();
              const amountNumber = parseInt(formData.get("amount") as string);
              const tipNumber = parseFloat(formData.get("tip") as string);
              if (!isFinite(amountNumber) || !isFinite(tipNumber)) return;
              const amount = BigInt(amountNumber);
              const tip = BigInt(tipNumber * 1e18);
              const message = formData.get("message") as string;
              const type = formData.get("type") as "receive" | "send";

              const [user1] = await chainBreak.value.sort(myAddress, other);
              const isUser1 = user1.toLowerCase() === myAddress;
              const from1 = (type === "send" && isUser1) || (type === "receive" && !isUser1);

              await chainBreak.value
                .connect(signer.value)
                .createTx(other, amount, message, from1, {
                  value: tip,
                })
                .then((res) => res.wait());

              form.reset();
              showToast("Transaction successfully sent!");
              updateContacts();
            }}
          >
            <Tabs.Content className="min-h-full space-y-6 bg-lime-100 p-6 pb-[5.5rem]" value="receive">
              <input className="hidden" type="hidden" name="type" value="receive" readOnly />
              <fieldset className="!mt-0 space-y-1">
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
                  <Input id="amount" name="amount" defaultValue="" className="pl-8" required pattern="[0-9]+" />
                  <div className="absolute left-4 py-2.5">$</div>
                </div>
              </fieldset>
              {/* <fieldset className="space-y-1">
                <label className="font-semibold text-gray-800" htmlFor="due-date">
                  Due Date<span className="text-red-500">*</span>
                </label>
                <Input type="date" id="due-date" name="due-date" defaultValue="" required />
              </fieldset> */}
              <fieldset className="space-y-1">
                <label className="font-semibold text-gray-800" htmlFor="message">
                  Message
                </label>
                <Input id="message" name="message" defaultValue="" />
              </fieldset>
              {debtClearingAllowed && (
                <fieldset className="space-y-1">
                  <label className="font-semibold text-gray-800" htmlFor="tip">
                    Tip
                  </label>

                  <div className="relative flex gap-1">
                    <Input id="tip" name="tip" className="pl-14" defaultValue="0" pattern="[0-9]+([\.,][0-9]+)?" />
                    <div className="absolute left-4 py-2.5">ETH</div>
                  </div>
                </fieldset>
              )}
              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full rounded-full bg-lime-700 px-4 pb-2 pt-3 font-display font-bold text-white"
                >
                  Confirm With Peer
                </Button>
              </div>
            </Tabs.Content>
            <Tabs.Content className="min-h-full space-y-6 bg-red-100 p-6 pb-[5.5rem]" value="send">
              <input className="hidden" type="hidden" name="type" value="send" readOnly />
              <fieldset className="!mt-0 space-y-1">
                <label className="font-semibold text-gray-800" htmlFor="other">
                  To<span className="text-red-500">*</span>
                </label>
                <AddressInput id="other" name="other" />
              </fieldset>
              <fieldset className="space-y-1">
                <label className="font-semibold text-gray-800" htmlFor="amount">
                  Amount<span className="text-red-500">*</span>
                </label>
                <div className="relative flex gap-1">
                  <Input id="amount" name="amount" defaultValue="" className="pl-8" required pattern="[0-9]+" />
                  <div className="absolute left-4 py-2.5">$</div>
                </div>
              </fieldset>
              {/* <fieldset className="space-y-1">
                <label className="font-semibold text-gray-800" htmlFor="due-date">
                  Due Date<span className="text-red-500">*</span>
                </label>
                <Input type="date" id="due-date" name="due-date" defaultValue="" />
              </fieldset> */}
              <fieldset className="space-y-1">
                <label className="font-semibold text-gray-800" htmlFor="message">
                  Message
                </label>
                <Input id="message" name="message" defaultValue="" />
              </fieldset>
              {debtClearingAllowed && (
                <fieldset className="space-y-1">
                  <label className="font-semibold text-gray-800" htmlFor="tip">
                    Tip
                  </label>
                  <div className="relative flex gap-1">
                    <Input id="tip" name="tip" className="pl-14" defaultValue="0" pattern="[0-9]+([\.,][0-9]+)?" />
                    <div className="absolute left-4 py-2.5">ETH</div>
                  </div>
                </fieldset>
              )}
              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full rounded-full bg-red-700 px-4 pb-2 pt-3 font-display font-bold text-white"
                >
                  Confirm With Peer
                </Button>
              </div>
            </Tabs.Content>
          </form>
        </main>
      </Tabs.Root>

      <Dialog.Root open={!!firstPendingTransaction}>
        <Dialog.Content>
          {firstPendingTransaction && (
            <>
              <Dialog.Title className="mb-1">Have You Received?</Dialog.Title>

              <div className="space-y-2">
                <fieldset className="space-y-0.5">
                  <label className="text-sm font-semibold text-gray-800" htmlFor="confirm-other">
                    From
                  </label>
                  <Input
                    readOnly
                    size="sm"
                    id="confirm-other"
                    name="confirm-other"
                    value={firstPendingTransaction.address}
                  />
                </fieldset>
                <fieldset className="space-y-0.5">
                  <label className="text-sm font-semibold text-gray-800" htmlFor="confirm-amount">
                    Amount
                  </label>
                  <div className="relative">
                    <Input
                      readOnly
                      size="sm"
                      id="confirm-amount"
                      name="confirm-amount"
                      value={"$ " + firstPendingTransaction.amount.toString()}
                    />
                  </div>
                </fieldset>

                <div className="flex gap-4 pt-4">
                  <Button
                    onClick={async () => {
                      // confirm
                      if (!chainBreak.value || !signer.value) return;
                      await chainBreak.value
                        .connect(signer.value)
                        .rejectTx(firstPendingTransaction.address, firstPendingTransaction.idx)
                        .then((res) => res.wait());

                      updateContacts();
                      showToast("Transaction successfully rejected!");
                    }}
                    type="button"
                    className="w-full rounded-full bg-red-700 px-4 pb-1.5 pt-2.5 font-display font-bold text-white"
                  >
                    Reject
                  </Button>
                  <Button
                    onClick={async () => {
                      // confirm
                      if (!chainBreak.value || !signer.value) return;
                      await chainBreak.value
                        .connect(signer.value)
                        .confirmTx(firstPendingTransaction.address, firstPendingTransaction.idx)
                        .then((res) => res.wait());

                      updateContacts();
                      showToast("Transaction successfully confirmed!");
                    }}
                    className="w-full rounded-full bg-blue-700 px-4 pb-1.5 pt-2.5 font-display font-bold text-white"
                  >
                    Confirm
                  </Button>
                </div>
              </div>
            </>
          )}
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
}
