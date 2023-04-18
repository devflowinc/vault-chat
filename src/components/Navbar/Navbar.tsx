import { BiRegularMenuAltLeft } from "solid-icons/bi";

export interface NavbarProps {
  sidebarOpen: () => boolean;
  setSideBarOpen: (isOpen: boolean) => void;
}

export const Navbar = (props: NavbarProps) => {
  const toggle = () => props.setSideBarOpen(!props.sidebarOpen());
  return (
    <div class="flex w-full items-center justify-between border-b border-gray-600 py-2">
      <BiRegularMenuAltLeft
        onClick={toggle}
        class="text-5xl text-gray-400 dark:text-white"
      />
      <img src="/Logo.png" alt="" />
      <p />
    </div>
  );
};
