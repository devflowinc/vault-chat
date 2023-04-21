import { Popover, PopoverPanel } from "solid-headless";
import { createResource, createSignal, onMount } from "solid-js";
import { NewTopicForm } from "~/components/Forms/NewTopicForm";
import Layout from "~/components/Layouts/MainLayout";
import { Navbar } from "~/components/Navbar/Navbar";
import { Sidebar } from "~/components/Navbar/Sidebar";
import { isTopic } from "~/types/actix-api";
import { Message } from "~/types/messages";
import { Topic } from "~/types/topics";

export default function DebateHome() {
  const [selectedTopic, setSelectedTopic] = createSignal<Topic | undefined>(undefined);

  const [messages, setMessages] = createSignal<Message[]>([]);

  const [sidebarOpen, setSideBarOpen] = createSignal<boolean>(true);
  const [screenWidth, setScreenWidth] = createSignal<number>(window.innerWidth);

  const [isCreatingTopic, setIsCreatingTopic] = createSignal<boolean>(false);

  const api_host: string = import.meta.env.VITE_API_HOST as unknown as string;

  onMount(() => {
    window.addEventListener("resize", () => {
      setScreenWidth(window.innerWidth);
    });
  });

  const [topics, { refetch }] = createResource(async (): Promise<Topic[]> => {
    const response = await fetch(`${api_host}/topic`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (!response.ok) return [];

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const data = await response.json();

    if (data !== null && typeof data === "object" && Array.isArray(data)) {
      return data.filter((topic: unknown) => {
        return isTopic(topic);
      }) as Topic[];
    }
    return [];
  });

  return (
    <Popover defaultOpen={false}>
      {({ isOpen }) => {
        return (
          <div class="relative flex min-h-screen w-screen flex-row overflow-x-hidden bg-neutral-50 dark:bg-neutral-800">
            {screenWidth() > 1024 && (
              <Sidebar
                currentTopic={selectedTopic}
                setCurrentTopic={setSelectedTopic}
                refetchTopics={refetch}
                sidebarOpen={sidebarOpen}
                topics={topics}
                setIsCreatingTopic={setIsCreatingTopic}
              />
            )}
            {screenWidth() <= 1024 && (
              <PopoverPanel>
                <Sidebar
                  currentTopic={selectedTopic}
                  setCurrentTopic={setSelectedTopic}
                  refetchTopics={refetch}
                  sidebarOpen={isOpen}
                  topics={topics}
                  setIsCreatingTopic={setIsCreatingTopic}
                />
              </PopoverPanel>
            )}
            <div class="flex w-full flex-col">
              <Navbar
                selectedTopic={selectedTopic}
                sidebarOpen={sidebarOpen}
                setSideBarOpen={setSideBarOpen}
              />
              {isCreatingTopic() && (
                <NewTopicForm
                  refetchTopics={refetch}
                  setIsCreatingTopic={setIsCreatingTopic}
                />
              )}
              {!isCreatingTopic() && <Layout messages={messages} />}
            </div>
          </div>
        );
      }}
    </Popover>
  );
}
