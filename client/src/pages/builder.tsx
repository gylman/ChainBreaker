import Button from "../components/Button";
import { chainBreak, signer } from "../signals";
import { showToast } from "../utils/toast";

export default function Builder() {
  return (
    <>
      <header className="fixed left-0 top-0 h-[76px] w-full bg-black px-6 pb-4 pt-6 font-display text-4xl font-black leading-none text-white">
        Builder
      </header>

      <main className="flex h-full w-full items-center justify-center bg-black text-white">
        <Button
          className="w-fit rounded-full bg-blue-700 px-4 pb-1.5 pt-2.5 font-display font-bold text-white"
          onClick={async () => {
            if (!chainBreak.value || !signer.value) return;

            await chainBreak.value
              .connect(signer.value)
              .breakDebtCircuit(
                [
                  "0x197216E3421D13A72Fdd79A44d8d89f121dcab6C",
                  "0x1450FE54AdF040f12c8202ba0b112BE9f5d2D7e0",
                  "0xDaFD7e67664A118Fb2F7F130AE6E58A7588798cA",
                  "0x197216E3421D13A72Fdd79A44d8d89f121dcab6C",
                ],
                "1",
              )
              .then((res) => res.wait());

            showToast("Done!");
          }}
        >
          Run Builder
        </Button>
      </main>
    </>
  );
}
