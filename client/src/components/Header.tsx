import { title } from "../signals";

export default function Header() {
  return (
    <header className="font-display fixed left-0 top-0 h-[76px] w-full bg-white px-6 pb-4 pt-6 text-4xl font-black leading-none">
      {title.value}
    </header>
  );
}
