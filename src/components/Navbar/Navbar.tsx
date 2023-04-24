import { PopoverButton } from "solid-headless";
import { BiRegularMenuAltLeft } from "solid-icons/bi";
import { Show } from "solid-js";
import { Topic } from "~/types/topics";

export interface NavbarProps {
  sidebarOpen: () => boolean;
  setSideBarOpen: (isOpen: boolean) => void;
  selectedTopic: () => Topic | undefined;
}

export const Navbar = (props: NavbarProps) => {
  const toggle = () => props.setSideBarOpen(!props.sidebarOpen());
  return (
    <Show when={props.selectedTopic()}>
      <div class="flex w-full items-center justify-between px-5 py-2 text-xl font-semibold text-neutral-800 dark:text-neutral-200">
        <div class="md:hidden">
          <PopoverButton>
            <BiRegularMenuAltLeft onClick={toggle} class="text-5xl" />
          </PopoverButton>
        </div>
        <div class="flex w-full items-center justify-center">
          <p>{props.selectedTopic()?.resolution}</p>
        </div>
      </div>
    </Show>
  );
};
