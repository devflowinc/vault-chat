import { Popover, PopoverPanel } from "solid-headless";
import { createSignal, onMount } from "solid-js";
import { warnOnce } from "solid-start/session/sessions";
import { NewTopicForm } from "~/components/Forms/NewTopicForm";
import Layout from "~/components/Layouts/MainLayout";
import { Navbar } from "~/components/Navbar/Navbar";
import { Sidebar } from "~/components/Navbar/Sidebar";
import { isTopic } from "~/types/actix-api";
import { Message } from "~/types/messages";
import { Topic } from "~/types/topics";

export default function DebateHome() {
  const [selectedTopic, setSelectedTopic] = createSignal<TopicProps | null>(
    null,
  );

  const [topics, setTopics] = createSignal<Topic[]>([]);
  const [messages, setMessages] = createSignal<Message[]>([]);

  const [sidebarOpen, setSideBarOpen] = createSignal<boolean>(true);
  const [screenWidth, setScreenWidth] = createSignal<number>(window.innerWidth);

  const [isCreatingTopic, setIsCreatingTopic] = createSignal<boolean>(false);

  const api_host: string = import.meta.env.VITE_API_HOST as unknown as string;
  onMount(() => {
    window.addEventListener("resize", () => {
      setScreenWidth(window.innerWidth);
    });

    void fetch(`${api_host}/topic`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }).then((response) => {
      if (!response.ok) {
        return;
      }
      void response.json().then((data) => {
        if (data !== null && typeof data === "object" && Array.isArray(data)) {
          console.log(data);
          const topics = data.filter((topic: unknown) => {
            return isTopic(topic);
          });
          console.log(topics);
          setTopics(topics);
        }
      });
    });
  });

  return (
    <Popover defaultOpen={false}>
      {({ isOpen }) => {
        return (
          <div class="relative flex min-h-screen w-screen flex-row overflow-x-hidden bg-neutral-50 dark:bg-neutral-800">
            {screenWidth() > 1024 && (
              <Sidebar
                sidebarOpen={sidebarOpen}
                topics={topics}
                setIsCreatingTopic={setIsCreatingTopic}
              />
            )}
            {screenWidth() <= 1024 && (
              <PopoverPanel>
                <Sidebar
                  sidebarOpen={isOpen}
                  topics={topics}
                  setIsCreatingTopic={setIsCreatingTopic}
                />
              </PopoverPanel>
            )}
            <div class="flex w-full flex-col">
              <Navbar
                sidebarOpen={sidebarOpen}
                setSideBarOpen={setSideBarOpen}
              />
              {isCreatingTopic() && (
                <NewTopicForm setIsCreatingTopic={setIsCreatingTopic} />
              )}
              {!isCreatingTopic() && <Layout messages={messages} />}
            </div>
          </div>
        );
      }}
    </Popover>
  );
}
