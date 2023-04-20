import { ImStack } from "solid-icons/im";
import { TiTimes } from "solid-icons/ti";
import { AiOutlineCheck } from "solid-icons/ai";
import { BiRegularLogOut } from "solid-icons/bi";
import { Accessor, For, Show, createEffect } from "solid-js";
import { FiHelpCircle } from "solid-icons/fi";

export interface TopicProps {
  name: string;
  resolved: boolean;
}

export interface SidebarProps {
  sidebarOpen: Accessor<boolean>;
  topics: Accessor<TopicProps[]>;
}

export const Sidebar = (props: SidebarProps) => {
  const api_host = import.meta.env.VITE_API_HOST as unknown as string;

  createEffect(() => {
    void fetch(`${api_host}/auth`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }).then((response) => {
      if (!response.ok) {
        window.location.href = "/auth/login";
        return;
      }
      void response.json().then((data) => {
        console.log("user response", data);
      });
    });
  });

  return (
    <Show when={props.sidebarOpen()}>
      <div class="h-screen w-2/12 bg-neutral-50">
        <div class="flex h-full flex-col">
          <div class="flex items-center space-x-4 border-b-2 bg-gray-400 px-3 py-1">
            <div class="text-3xl">
              <ImStack />
            </div>
            <div>New Topic</div>
          </div>
          <For each={props.topics()}>
            {(topic) => (
              <div class="flex items-center space-x-4 border-b-2 px-3 py-1">
                <div class="text-3xl">
                  {topic.resolved ? <AiOutlineCheck /> : <TiTimes />}
                </div>
                <div>{topic.name}</div>
              </div>
            )}
          </For>
          <div class="flex-1" />
          <div class="flex items-center space-x-4 border-b-2 bg-gray-400 px-3 py-1">
            <div class="text-3xl">
              <FiHelpCircle />
            </div>
            <div>Help</div>
          </div>
          <button
            class="flex items-center space-x-4 rounded-br-md border-b-2 bg-gray-400 px-3 py-1"
            onClick={() => {
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
            }}
          >
            <div class="text-3xl">
              <BiRegularLogOut />
            </div>
            <div>Logout</div>
          </button>
        </div>
      </div>
    </Show>
  );
};
