import { PopoverButton } from "solid-headless";
import { BiRegularMenuAltLeft } from "solid-icons/bi";
import { Topic } from "~/types/topics";
import ThemeModeController from "./ThemeModeController";

export interface NavbarProps {
  sidebarOpen: () => boolean;
  setSideBarOpen: (isOpen: boolean) => void;
  selectedTopic: () => Topic | undefined;
}

export const Navbar = (props: NavbarProps) => {
  const toggle = () => props.setSideBarOpen(!props.sidebarOpen());
  return (
    <div class="flex w-full items-center justify-between border-b border-neutral-600 px-5 py-2 text-neutral-200 dark:text-neutral-700">
      <PopoverButton>
        <BiRegularMenuAltLeft onClick={toggle} class="text-5xl" />
      </PopoverButton>
      <div class="flex-1" />
      <div class="rounded-xl bg-neutral-200 px-8 py-2 text-neutral-400 dark:bg-neutral-700 dark:text-neutral-500">
        {props.selectedTopic() ? (
          <p>{props.selectedTopic()?.resolution}</p>
        ) : (
          <p>Arguflow</p>
        )}
      </div>
      <div class="flex-1" />
      <img src="/public/logo_transparent.svg" alt="" class="h-16" />;
      <ThemeModeController />
    </div>
  );
};
