import { ImStack } from "solid-icons/im";
import { TiTimes } from "solid-icons/ti";
import { AiOutlineCheck } from "solid-icons/ai";
import { BiRegularLogOut } from "solid-icons/bi";
import { Accessor, For, Show } from "solid-js";
import { FiHelpCircle } from "solid-icons/fi";
import { PopoverButton, PopoverPanel } from "solid-headless";

export interface TopicProps {
  name: string;
  resolved: boolean;
}

export interface SidebarProps {
  sidebarOpen: Accessor<boolean>;
  topics: Accessor<TopicProps[]>;
}

export const SidebarWithPopover = (props: SidebarProps) => {
  return (
    <PopoverPanel>
      <Sidebar sidebarOpen={props.sidebarOpen} topics={props.topics} />
    </PopoverPanel>
  );
};

export const Sidebar = (props: SidebarProps) => {
  const api_host = import.meta.env.VITE_API_HOST as unknown as string;

  return (
    <Show when={props.sidebarOpen()}>
      <div class="absolute h-screen w-7/12 rounded-br-md rounded-tr-md bg-neutral-50 dark:bg-neutral-800 dark:text-gray-50 md:relative lg:w-2/12">
        <div class="flex h-full flex-col">
          <PopoverButton class="flex items-center space-x-4 rounded-tr-md border-y border-neutral-400 bg-neutral-200 px-3 py-1 dark:border-neutral-500 dark:bg-neutral-700">
            <div class="text-3xl">
              <ImStack />
            </div>
            <div>New Topic</div>
          </PopoverButton>
          <PopoverButton class="overflow-y-scroll scrollbar-thin scrollbar-track-neutral-200 scrollbar-thumb-neutral-400 dark:scrollbar-track-neutral-800 dark:scrollbar-thumb-neutral-600">
            <For each={props.topics()}>
              {(topic) => (
                <PopoverButton
                  as="div"
                  class="flex items-center space-x-4 border-y border-neutral-400 px-3 py-1 dark:border-neutral-500 dark:bg-neutral-800">
                  <div class="text-3xl">
                    {topic.resolved ? <AiOutlineCheck /> : <TiTimes />}
                  </div>
                  <div>{topic.name}</div>
                </PopoverButton>
              )}
            </For>
          </PopoverButton>
          <div class="flex-1" />
          <PopoverButton class="flex items-center space-x-4 border-y border-neutral-400 bg-neutral-200 px-3 py-1 dark:border-neutral-500  dark:bg-neutral-700">
            <div class="text-3xl">
              <FiHelpCircle />
            </div>
            <div>Help</div>
          </PopoverButton>
          <PopoverButton
            class="flex items-center space-x-4 rounded-br-md border-y border-neutral-400 bg-neutral-200 px-3 py-1 dark:border-neutral-500 dark:bg-neutral-800"
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
          </PopoverButton>
        </div>
      </div>
    </Show>
  );
};
