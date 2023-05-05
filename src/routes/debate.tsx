import { Transition } from "solid-headless";
import {
  Show,
  createEffect,
  createResource,
  createSignal,
  useContext,
} from "solid-js";
import { useSearchParams } from "solid-start";
import { NewTopicForm } from "~/components/Forms/NewTopicForm";
import Layout from "~/components/Layouts/MainLayout";
import { Navbar } from "~/components/Navbar/Navbar";
import { Sidebar } from "~/components/Navbar/Sidebar";
import { GlobalStoreContext } from "~/components/contexts/UserStoreContext";
import { detectReferralToken, isTopic } from "~/types/actix-api";
import { Topic } from "~/types/topics";

export const debate = () => {
  const api_host: string = import.meta.env.VITE_API_HOST as unknown as string;

  const userStoreContext = useContext(GlobalStoreContext);

  const [searchParams] = useSearchParams();
  const [selectedTopic, setSelectedTopic] = createSignal<Topic | undefined>(
    undefined,
  );
  const [sidebarOpen, setSideBarOpen] = createSignal<boolean>(true);
  const [isCreatingTopic, setIsCreatingTopic] = createSignal<boolean>(false);
  const [loadingTopic, setLoadingTopic] = createSignal<boolean>(false);
  const [isLogin, setIsLogin] = createSignal<boolean>(false);

  detectReferralToken(searchParams.t);

  createEffect(() => {
    void fetch(`${api_host}/auth`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }).then((response) => {
      setIsLogin(response.ok);
      if (
        !response.ok &&
        !(
          window.location.pathname.includes("/auth/") ||
          window.location.pathname === "/"
        )
      ) {
        window.location.href = "/auth/login";
        return;
      }
    });
  });

  const [topics, setTopics] = createSignal<Topic[]>([]);

  const refetchTopics = async () => {
    const response = await fetch(`${api_host}/topic`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (!response.ok) return;

    const data: unknown = await response.json();
    if (data !== null && typeof data === "object" && Array.isArray(data)) {
      const _topics = data.filter((topic: unknown) => {
        return isTopic(topic);
      }) as Topic[];
      setTopics(_topics);
    }
  };

  createEffect(() => {
    void refetchTopics();
  });

  // const [topics, { refetch }] = createResource(async (): Promise<Topic[]> => {
  //   try {
  //     const response = await fetch(`${api_host}/topic`, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       credentials: "include",
  //     });
  //
  //     if (!response.ok) return [];
  //
  //     const data: unknown = await response.json();
  //
  //     if (data !== null && typeof data === "object" && Array.isArray(data)) {
  //       return data.filter((topic: unknown) => {
  //         return isTopic(topic);
  //       }) as Topic[];
  //     }
  //     return [];
  //   } catch (e) {
  //     console.error(e);
  //     return [];
  //   }
  // });

  return (
    <Show when={isLogin()}>
      <div class="relative flex h-screen flex-row bg-zinc-100 dark:bg-zinc-900">
        <div class="hidden w-1/3 md:block">
          <Sidebar
            currentTopic={selectedTopic}
            setCurrentTopic={setSelectedTopic}
            refetchTopics={refetchTopics}
            topics={topics}
            setIsCreatingTopic={setIsCreatingTopic}
            setSideBarOpen={setSideBarOpen}
          />
        </div>
        <div class="md:hidden">
          <Show when={sidebarOpen()}>
            <Sidebar
              currentTopic={selectedTopic}
              setCurrentTopic={(topic: Topic | undefined) => {
                setIsCreatingTopic(false);
                setSelectedTopic(topic);
              }}
              refetchTopics={refetchTopics}
              topics={topics}
              setIsCreatingTopic={setIsCreatingTopic}
              setSideBarOpen={setSideBarOpen}
            />
          </Show>
        </div>
        <Show when={loadingTopic()}>
          <Transition
            class="flex w-full flex-col"
            show={loadingTopic()}
            enter="transition-opacity duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div class="flex w-full flex-col items-center justify-center">
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
            class="flex w-full flex-col"
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
            <div
              id="topic-layout"
              class="overflow-y-auto scrollbar-thin scrollbar-track-neutral-200 scrollbar-thumb-neutral-400 scrollbar-track-rounded-md scrollbar-thumb-rounded-md dark:scrollbar-track-neutral-800 dark:scrollbar-thumb-neutral-600"
            >
              <Navbar
                selectedTopic={selectedTopic}
                setSideBarOpen={setSideBarOpen}
                setIsCreatingTopic={setIsCreatingTopic}
              />
              <Layout selectedTopic={selectedTopic} />
            </div>
          </Transition>
        </Show>
        <Show when={!loadingTopic() && (isCreatingTopic() || !selectedTopic())}>
          <Transition
            class="flex w-full flex-col justify-center"
            show={!loadingTopic() && (isCreatingTopic() || !selectedTopic())}
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
                void refetchTopics();
                setTimeout(() => {
                  setSelectedTopic(topics()[0]);
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
    </Show>
  );
};

export default debate;
