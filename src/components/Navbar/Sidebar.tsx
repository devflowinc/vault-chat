import {
  BiRegularCheck,
  BiRegularEditAlt,
  BiRegularHelpCircle,
  BiRegularLayerPlus,
  BiRegularLogOut,
  BiRegularTrash,
  BiRegularX,
} from "solid-icons/bi";
import {
  Accessor,
  createEffect,
  createSignal,
  For,
  Resource,
  Show,
} from "solid-js";
import { PopoverButton } from "solid-headless";
import type { Topic } from "~/types/topics";
import { AiOutlineEdit } from "solid-icons/ai";

export interface SidebarProps {
  sidebarOpen: Accessor<boolean>;
  topics: Resource<Topic[]>;
  refetchTopics: (
    info?: unknown,
  ) => Topic[] | Promise<Topic[] | undefined> | null | undefined;
  setIsCreatingTopic: (value: boolean) => void;
  currentTopic: Accessor<Topic | undefined>;
  setCurrentTopic: (topic: Topic | undefined) => void;
}

export const Sidebar = (props: SidebarProps) => {
  const api_host = import.meta.env.VITE_API_HOST as unknown as string;

  const [editingIndex, setEditingIndex] = createSignal(-1);
  const [editingTopic, setEditingTopic] = createSignal("");

  // eslint-disable-next-line prefer-const
  let editingText: HTMLInputElement | undefined = undefined;

  createEffect((oldIndex) => {
    setTimeout(() => {
      if (oldIndex != editingText && editingText) {
        editingText.focus();
        editingText.selectionStart = editingText.selectionEnd;
        editingText.addEventListener("focusout", () => {
          setTimeout(() => {
            setEditingIndex(-1);
          }, 100);
        });
      }
    }, 100);
    return editingIndex();
  }, -1);

  const submitEditText = async () => {
    const topics = props.topics();
    const topic = topics ? topics[editingIndex()] : undefined;

    if (!topic) {
      console.log("No topic");
      return;
    }

    const res = await fetch(`${api_host}/topic`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        topic_id: topic.id,
        side: topic.side,
        resolution: editingTopic(),
      }),
    });

    if (!res.ok) {
      console.log("Error changing topic name (need toast)");
      return;
    }

    setEditingIndex(-1);
    void props.refetchTopics();
  };

  const deleteSelected = async () => {
    const res = await fetch(`${api_host}/topic`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        topic_id: props.currentTopic()?.id,
      }),
    });

    if (res.ok) {
      props.setCurrentTopic(undefined);
      void props.refetchTopics();
    }
  };

  const logout = () => {
    void fetch(`${api_host}/auth`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }).then((response) => {
      if (!response.ok) {
        return;
      }
      window.location.href = "/auth/login";
    });
  };

  return (
    <Show when={props.sidebarOpen()}>
      <div class="absolute h-screen w-7/12 rounded-br-md rounded-tr-md bg-neutral-50 dark:bg-neutral-800 dark:text-gray-50 md:relative lg:w-2/12">
        <div class="flex h-full flex-col">
          <PopoverButton
            onClick={() => {
              props.setIsCreatingTopic(true);
            }}
            class="flex items-center space-x-4 rounded-tr-md border-y border-neutral-400 bg-neutral-200 px-3 py-1 dark:border-neutral-500 dark:bg-neutral-700"
          >
            <div class="text-3xl">
              <BiRegularLayerPlus />
            </div>
            <div>New Topic</div>
          </PopoverButton>
          <PopoverButton class="overflow-y-scroll scrollbar-thin scrollbar-track-neutral-200 scrollbar-thumb-neutral-400 dark:scrollbar-track-neutral-800 dark:scrollbar-thumb-neutral-600">
            <For each={props.topics()}>
              {(topic, index) => (
                <PopoverButton
                  disabled={editingIndex() === index()}
                  as="div"
                  classList={{
                    "flex items-center space-x-4 border-y border-neutral-400 px-3 py-1 dark:border-y-neutral-500 dark:bg-neutral-800":
                      true,
                    "border-l-4 border-l-green-500 dark:border-l-green-500":
                      props.currentTopic() === topic,
                  }}
                  onClick={() => {
                    console.log("set current topic");
                    const topics = props.topics();
                    const topic = topics ? topics[index()] : undefined;
                    props.setCurrentTopic(topic);
                  }}
                >
                  <div class="text-3xl">
                    {topic.side ? <BiRegularCheck /> : <BiRegularX />}
                  </div>
                  {editingIndex() === index() && (
                    <div class="flex flex-1 items-center justify-between">
                      <input
                        ref={editingText}
                        value={editingTopic()}
                        onInput={(e) => {
                          setEditingTopic(e.currentTarget.value);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            void submitEditText().then();
                          }
                        }}
                        class="w-full bg-neutral-50 dark:bg-neutral-800 "
                      />
                      <div class="mx-1" />
                      <button
                        onClick={() => {
                          void submitEditText().then();
                        }}
                      >
                        <BiRegularCheck />
                      </button>
                      <div class="ml-1" />
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setEditingIndex(-1);
                        }}
                      >
                        <BiRegularX />
                      </button>
                    </div>
                  )}
                  {editingIndex() !== index() && (
                    <div class="flex flex-1">
                      <p class="text-left line-clamp-1">{topic.resolution}</p>
                      <div class="flex-1" />
                      {props.currentTopic() == topic && (
                        <div class="text-lg">
                          <BiRegularEditAlt
                            onClick={() => {
                              setEditingIndex(index());
                              setEditingTopic(topic.resolution);
                            }}
                          />
                        </div>
                      )}
                      {props.currentTopic() == topic && (
                        <div class="text-lg">
                          <BiRegularTrash
                            onClick={() => {
                              deleteSelected();
                            }}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </PopoverButton>
              )}
            </For>
          </PopoverButton>
          <div class="flex-1" />
          <PopoverButton class="flex items-center space-x-4 border-y border-neutral-400 bg-neutral-200 px-3 py-1 dark:border-neutral-500  dark:bg-neutral-700">
            <div class="text-3xl">
              <BiRegularHelpCircle />
            </div>
            <div>Help</div>
          </PopoverButton>
          <PopoverButton
            class="flex items-center space-x-4 rounded-br-md border-y border-neutral-400 bg-neutral-200 px-3 py-1 dark:border-neutral-500 dark:bg-neutral-800"
            onClick={logout}
          >
            <div class="text-3xl">
              <BiRegularLogOut />
            </div>
            <div>Logout</div>
          </PopoverButton>
        </div>
      </div>
    </Show>
  );
};
