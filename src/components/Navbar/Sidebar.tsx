import {
  BiRegularCheck,
  BiRegularLogOut,
  BiRegularPlus,
  BiRegularTrash,
  BiRegularX,
} from "solid-icons/bi";
import { Accessor, createSignal, For, Setter } from "solid-js";
import type { Topic } from "~/types/topics";
import { OnScreenThemeModeController } from "../Atoms/OnScreenThemeModeController";

export interface SidebarProps {
  topics: Accessor<Topic[]>;
  refetchTopics: () => Promise<void>;
  setIsCreatingTopic: (value: boolean) => boolean;
  currentTopic: Accessor<Topic | undefined>;
  setCurrentTopic: (topic: Topic | undefined) => void;
  setSideBarOpen: Setter<boolean>;
}

export const Sidebar = (props: SidebarProps) => {
  const api_host = import.meta.env.VITE_API_HOST as unknown as string;

  const [editingIndex, setEditingIndex] = createSignal(-1);
  const [editingTopic, setEditingTopic] = createSignal("");

  const submitEditText = async () => {
    const topics = props.topics();
    const topic = topics[editingIndex()];

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
    <div class="absolute flex h-screen w-screen flex-row dark:text-gray-50 md:relative md:w-full">
      <div class="flex h-full w-2/3 flex-col bg-neutral-50 dark:bg-neutral-800 md:w-full">
        <div class="flex w-full px-4 py-2 ">
          <button
            onClick={() => {
              props.setIsCreatingTopic(true);
              props.setCurrentTopic(undefined);
              props.setSideBarOpen(false);
            }}
            class="flex w-full flex-row items-center rounded-md border border-neutral-500 px-3 py-1 hover:bg-neutral-200  dark:border-neutral-400 dark:hover:bg-neutral-700"
          >
            <div class="flex flex-row items-center space-x-2">
              <span class="text-xl">
                <BiRegularPlus />
              </span>
              <span>New Topic</span>
            </div>
          </button>
        </div>
        <div class="flex w-full flex-col space-y-2 overflow-y-auto px-2 scrollbar-thin scrollbar-track-neutral-200 scrollbar-thumb-neutral-400 scrollbar-track-rounded-md scrollbar-thumb-rounded-md dark:scrollbar-track-neutral-800 dark:scrollbar-thumb-neutral-600">
          <For each={props.topics()}>
            {(topic, index) => (
              <button
                classList={{
                  "flex items-center space-x-4 py-2 w-full rounded-md": true,
                  "bg-neutral-200 dark:bg-neutral-700":
                    props.currentTopic() === topic,
                }}
                onClick={() => {
                  const topics = props.topics();
                  const topic = topics[index()];

                  props.setCurrentTopic(topic);
                  props.setIsCreatingTopic(false);
                  props.setSideBarOpen(false);
                }}
              >
                {editingIndex() === index() && (
                  <div class="flex flex-1 items-center justify-between px-2">
                    <input
                      value={editingTopic()}
                      onInput={(e) => {
                        setEditingTopic(e.currentTarget.value);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          void submitEditText();
                        }
                      }}
                      class="w-full rounded-md bg-neutral-50 px-2 py-1 dark:bg-neutral-800"
                    />

                    <div class="flex flex-row space-x-1 pl-2 text-2xl ">
                      <button
                        onClick={() => {
                          void submitEditText();
                        }}
                        class="hover:text-green-500"
                      >
                        <BiRegularCheck />
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setEditingIndex(-1);
                        }}
                        class="hover:text-red-500"
                      >
                        <BiRegularX />
                      </button>
                    </div>
                  </div>
                )}
                {editingIndex() !== index() && (
                  <div class="flex flex-1 px-3">
                    <p class="line-clamp-1 text-left">{topic.resolution}</p>
                    <div class="flex-1" />
                    <div class="flex flex-row items-center space-x-2">
                      {/* {props.currentTopic() == topic && (
                        <div class="text-lg hover:text-purple-500">
                          <BiRegularEditAlt
                            onClick={() => {
                              setEditingIndex(index());
                              setEditingTopic(topic.resolution);
                            }}
                          />
                        </div>
                      )} */}
                      {props.currentTopic() == topic && (
                        <div class="text-lg hover:text-purple-500">
                          <BiRegularTrash
                            onClick={() => {
                              void deleteSelected();
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </button>
            )}
          </For>
        </div>
        <div class="flex-1 " />
        <div class="flex w-full flex-col space-y-1 border-t px-2 py-2 dark:border-neutral-400">
          <button
            class="flex w-full items-center space-x-4  rounded-md px-3 py-2 hover:bg-neutral-200   dark:hover:bg-neutral-700"
            onClick={logout}
          >
            <div class="text-3xl">
              <BiRegularLogOut />
            </div>
            <div>Logout</div>
          </button>
          <div class="flex w-full px-3">
            <OnScreenThemeModeController />
          </div>
        </div>
      </div>
      <button
        class="w-1/3 flex-col justify-start bg-gray-500/5 backdrop-blur-[3px] md:hidden"
        onClick={(e) => {
          e.preventDefault();
          props.setSideBarOpen((prev) => !prev);
        }}
      >
        <div class="ml-4 text-3xl">
          <BiRegularX />
        </div>
      </button>
    </div>
  );
};
