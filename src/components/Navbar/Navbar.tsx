import { PopoverButton } from "solid-headless";
import { BiRegularMenuAltLeft } from "solid-icons/bi";
import ThemeModeController from "./ThemeModeController";

export interface NavbarProps {
  sidebarOpen: () => boolean;
  setSideBarOpen: (isOpen: boolean) => void;
}

export const Navbar = (props: NavbarProps) => {
  const toggle = () => props.setSideBarOpen(!props.sidebarOpen());
  return (
    <div class="flex w-full items-center justify-between border-b border-neutral-600 px-5 py-2 text-neutral-200 dark:text-neutral-700">
      <PopoverButton>
        <BiRegularMenuAltLeft onClick={toggle} class="text-5xl" />
      </PopoverButton>
      <img src="/Logo.png" alt="" />
      <ThemeModeController />
    </div>
  );
};
