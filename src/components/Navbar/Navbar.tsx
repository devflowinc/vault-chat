import { BiRegularMenuAltLeft, BiRegularPlus } from "solid-icons/bi";
import { Setter } from "solid-js";
import { Topic } from "~/types/topics";

export interface NavbarProps {
  setSideBarOpen: Setter<boolean>;
  selectedTopic: () => Topic | undefined;
  setIsCreatingTopic: Setter<boolean>;
}

export const Navbar = (props: NavbarProps) => {
  return (
    <div class="flex h-11 w-full items-center justify-between border-b border-neutral-200 px-5 py-2 text-xl font-semibold text-neutral-800 dark:border-neutral-800 dark:text-neutral-200">
      <div class="md:hidden">
        <BiRegularMenuAltLeft
          onClick={() => props.setSideBarOpen((prev) => !prev)}
          class="text-4xl"
        />
      </div>
      <div class="flex w-full items-center justify-center">
        <p>{props.selectedTopic()?.resolution ?? "New Topic"}</p>
      </div>
      <div class="md:hidden">
        <BiRegularPlus
          onClick={() => {
            props.setSideBarOpen(false);
            props.setIsCreatingTopic(true);
          }}
          class="text-4xl"
        />
      </div>
    </div>
  );
};
