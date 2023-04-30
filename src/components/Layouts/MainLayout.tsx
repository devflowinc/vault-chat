import { Accessor, For, Show, createEffect, createSignal } from "solid-js";
import { FiRefreshCcw, FiSend } from "solid-icons/fi";
import {
  isMessageArray,
  messageRoleFromIndex,
  type Message,
} from "~/types/messages";
import { Topic } from "~/types/topics";
import { Transition } from "solid-headless";
import { AfMessage } from "../Atoms/AfMessage";

export interface LayoutProps {
  selectedTopic: Accessor<Topic | undefined>;
}

const Layout = (props: LayoutProps) => {
  const api_host = import.meta.env.VITE_API_HOST as unknown as string;

  const [loadingMessages, setLoadingMessages] = createSignal<boolean>(true);
  const [messages, setMessages] = createSignal<Message[]>([]);
  const [newMessageContent, setNewMessageContent] = createSignal<string>("");

  const fetchCompletion = async ({
    new_message_content,
    topic_id,
  }: {
    new_message_content: string;
    topic_id: string;
  }) => {
    const res = await fetch(`${api_host}/message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        new_message_content,
        topic_id,
      }),
    });
    // get the response as a stream
    const reader = res.body?.getReader();
    if (!reader) {
      return;
    }
    let done = false;
    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      if (value) {
        const decoder = new TextDecoder();
        const chunk = decoder.decode(value);
      }
    }
  };

  const fetchMessages = async (topicId: string | undefined) => {
    setLoadingMessages(true);
    if (!topicId) {
      return;
    }
    const res = await fetch(`${api_host}/messages/${topicId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const data: unknown = await res.json();
    if (data && isMessageArray(data)) {
      setMessages(data);
    }
    setLoadingMessages(false);
  };

  createEffect(() => {
    setMessages([]);
    void fetchMessages(props.selectedTopic()?.id);
  });

  return (
    <>
      <Show when={loadingMessages()}>
        <Transition
          class="flex w-full flex-col"
          show={loadingMessages()}
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
      <Show when={!loadingMessages()}>
        <div class="flex flex-col justify-between ">
          <div class="flex flex-col items-center">
            <For each={messages()}>
              {(message, idx) => {
                return (
                  <AfMessage
                    role={messageRoleFromIndex(idx())}
                    content={message.content}
                    feedback={message.feedback}
                  />
                );
              }}
            </For>
            <div class="py-2" />
            {messages().length > 0 && (
              <button class="flex w-fit items-center justify-center space-x-4 rounded-xl bg-neutral-200 px-4 py-2 dark:bg-neutral-700 dark:text-neutral-50">
                <FiRefreshCcw />
                <p>Regenerate Response</p>
              </button>
            )}
          </div>

          <div class="p-4">
            <form class="flex h-11 w-full flex-row items-center rounded-xl bg-neutral-200 p-4 text-neutral-400 dark:bg-neutral-700 dark:text-white">
              <input
                class="w-full bg-transparent focus:outline-none"
                type="text"
                placeholder="Write your argument"
                value={newMessageContent()}
                onInput={(e) => {
                  setNewMessageContent(e.currentTarget.value);
                }}
              />
              <button
                type="submit"
                classList={{
                  "flex h-12 w-12 items-center justify-center": true,
                  "text-neutral-400": !newMessageContent(),
                }}
                disabled={!newMessageContent()}
                onClick={(e) => {
                  e.preventDefault();
                  const topic_id = props.selectedTopic()?.id;
                  if (!topic_id) {
                    return;
                  }
                  void fetchCompletion({
                    new_message_content: newMessageContent(),
                    topic_id,
                  });
                }}
              >
                <FiSend />
              </button>
            </form>
          </div>
        </div>
      </Show>
    </>
  );
};

export default Layout;
