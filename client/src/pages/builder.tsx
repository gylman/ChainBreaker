import Button from "../components/Button";

export default function Builder() {
  return (
    <>
      <header className="fixed left-0 top-0 h-[76px] w-full bg-black px-6 pb-4 pt-6 font-display text-4xl font-black leading-none text-white">
        Builder
      </header>

      <main className="flex h-full w-full items-center justify-center bg-black text-white">
        <Button className="w-fit rounded-full bg-blue-700 px-4 pb-1.5 pt-2.5 font-display font-bold text-white">
          Run Builder
        </Button>
      </main>
    </>
  );
}
