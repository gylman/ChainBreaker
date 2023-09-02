import { useEffect } from "react";
import useMetamask from "../hooks/useMetamask";
import { title, transactions, chainBreak, signer } from "../signals";
import { showToast } from "../utils/toast";
import Button from "./Button";
import Dialog from "./Dialog";
import Input from "./Input";

export default function PendingTransaction() {
  const { updateContacts } = useMetamask();

  useEffect(() => {
    title.value = "Transfer";
  }, []);

  const firstPendingTransaction = transactions.value
    .filter((tx) => (tx.isUser1 && tx.status === "pendingFor1") || (!tx.isUser1 && tx.status === "pendingFor2"))
    .at(0);

  return (
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
  );
}
