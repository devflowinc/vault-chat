import { Popover } from "solid-headless";
import { createSignal, onMount } from "solid-js";
import Layout from "~/components/Layouts/MainLayout";
import { Navbar } from "~/components/Navbar/Navbar";
import {
  TopicProps,
  Sidebar,
  SidebarWithPopover,
} from "~/components/Navbar/Sidebar";
import { Message } from "~/types/messages";

export default function DebateHome() {
  const [selectedTopic, setSelectedTopic] = createSignal<TopicProps | null>(
    null,
  );

  const [topics, setTopics] = createSignal<TopicProps[]>([]);
  const [messages, setMessages] = createSignal<Message[]>([]);

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
              <Layout messages={messages} />
            </div>
          </div>
        );
      }}
    </Popover>
  );
}
