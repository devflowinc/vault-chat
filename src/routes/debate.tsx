import { Popover, Transition } from "solid-headless";
import { Show, createEffect, createResource, createSignal } from "solid-js";
import { NewTopicForm } from "~/components/Forms/NewTopicForm";
import Layout from "~/components/Layouts/MainLayout";
import { Navbar } from "~/components/Navbar/Navbar";
import { Sidebar } from "~/components/Navbar/Sidebar";
import { isTopic } from "~/types/actix-api";
import { Message } from "~/types/messages";
import { Topic } from "~/types/topics";

export default function DebateHome() {
  const [selectedTopic, setSelectedTopic] = createSignal<Topic | undefined>(
    undefined,
  );
  const [messages, setMessages] = createSignal<Message[]>([]);
  const [sidebarOpen, setSideBarOpen] = createSignal<boolean>(true);
  const [isCreatingTopic, setIsCreatingTopic] = createSignal<boolean>(false);
  const [loadingTopic, setLoadingTopic] = createSignal<boolean>(false);

  const api_host: string = import.meta.env.VITE_API_HOST as unknown as string;

  const [topics, { refetch }] = createResource(async (): Promise<Topic[]> => {
    const response = await fetch(`${api_host}/topic`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (!response.ok) return [];

    const data: unknown = await response.json();

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
          <div class="relative flex h-screen w-screen flex-row overflow-x-hidden bg-neutral-100 dark:bg-neutral-900">
            <div class="hidden w-1/3 md:block">
              <Sidebar
                currentTopic={selectedTopic}
                setCurrentTopic={setSelectedTopic}
                refetchTopics={refetch}
                sidebarOpen={sidebarOpen}
                topics={topics}
                setIsCreatingTopic={setIsCreatingTopic}
              />
            </div>
            <div class="md:hidden">
              <Sidebar
                currentTopic={selectedTopic}
                setCurrentTopic={(topic: Topic | undefined) => {
                  setIsCreatingTopic(false);
                  setSelectedTopic(topic);
                }}
                refetchTopics={refetch}
                sidebarOpen={isOpen}
                topics={topics}
                setIsCreatingTopic={setIsCreatingTopic}
              />
            </div>
            <Show when={loadingTopic()}>
              <Transition
                class="flex h-full w-full flex-col"
                show={loadingTopic()}
                enter="transition-opacity duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div class="flex h-full w-full flex-col items-center justify-center">
                  <div class="h-32 w-32 animate-spin rounded-full border-b-2 border-purple-500" />
                </div>
              </Transition>
            </Show>
            <Show
              when={
                !loadingTopic() &&
                !isCreatingTopic() &&
                selectedTopic() !== undefined
              }
            >
              <Transition
                class="flex h-full w-full flex-col"
                show={
                  !loadingTopic() &&
                  !isCreatingTopic() &&
                  selectedTopic() !== undefined
                }
                enter="transition-opacity duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Navbar
                  selectedTopic={selectedTopic}
                  sidebarOpen={sidebarOpen}
                  setSideBarOpen={setSideBarOpen}
                />
                <div class="flex h-full flex-col justify-end">
                  <Layout messages={messages} />
                </div>
              </Transition>
            </Show>
            <Show
              when={!loadingTopic() && (isCreatingTopic() || !selectedTopic())}
            >
              <Transition
                class="flex h-full w-full flex-col justify-center"
                show={
                  !loadingTopic() && (isCreatingTopic() || !selectedTopic())
                }
                enter="transition-opacity duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <NewTopicForm
                  onSuccessfulTopicCreation={() => {
                    setLoadingTopic(true);
                    setIsCreatingTopic(false);
                    void refetch();
                    setTimeout(() => {
                      setSelectedTopic(topics()?.[0]);
                      setLoadingTopic(false);
                    }, 500);
                  }}
                  setIsCreatingTopic={setIsCreatingTopic}
                  selectedTopic={selectedTopic}
                  setCurrentTopic={setSelectedTopic}
                  topics={topics}
                />
              </Transition>
            </Show>
          </div>
        );
      }}
    </Popover>
  );
}
