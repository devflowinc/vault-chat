import { Popover } from "solid-headless";
import { createSignal, onMount } from "solid-js";
import Layout from "~/components/Layouts/MainLayout";
import { Navbar } from "~/components/Navbar/Navbar";
import {
  TopicProps,
  Sidebar,
  SidebarWithPopover,
} from "~/components/Navbar/Sidebar";

export default function DebateHome() {
  const [topics] = createSignal<TopicProps[]>([
    { name: "Topic 1", resolved: false },
    { name: "Topic 2", resolved: true },
    { name: "Topic 2", resolved: true },
    { name: "Topic 2", resolved: true },
    { name: "Topic 2", resolved: true },
    { name: "Topic 2", resolved: true },
    { name: "Topic 2", resolved: true },
    { name: "Topic 2", resolved: true },
    { name: "Topic 2", resolved: true },
    { name: "Topic 2", resolved: true },
    { name: "Topic 2", resolved: true },
    { name: "Topic 2", resolved: true },
    { name: "Topic 2", resolved: true },
    { name: "Topic 2", resolved: true },
    { name: "Topic 2", resolved: true },
    { name: "Topic 2", resolved: true },
    { name: "Topic 2", resolved: true },
    { name: "Topic 2", resolved: true },
    { name: "Topic 2", resolved: true },
    { name: "Topic 2", resolved: true },
    { name: "Topic 2", resolved: true },
  ]);
  const [sidebarOpen, setSideBarOpen] = createSignal<boolean>(true);

  const [screenWidth, setScreenWidth] = createSignal<number>(window.innerWidth);

  onMount(() => {
    window.addEventListener("resize", () => {
      setScreenWidth(window.innerWidth);
    });
  });

  return (
    <Popover defaultOpen={false}>
      {({ isOpen }) => {
        return (
          <div class="relative flex min-h-screen w-screen flex-row overflow-x-hidden bg-neutral-50 dark:bg-neutral-800">
            {screenWidth() > 1024 && (
              <Sidebar sidebarOpen={sidebarOpen} topics={topics} />
            )}
            {screenWidth() <= 1024 && (
              <SidebarWithPopover sidebarOpen={isOpen} topics={topics} />
            )}
            <div class="flex w-full flex-col">
              <Navbar
                sidebarOpen={sidebarOpen}
                setSideBarOpen={setSideBarOpen}
              />
              <Layout />
            </div>
          </div>
        );
      }}
    </Popover>
  );
}
