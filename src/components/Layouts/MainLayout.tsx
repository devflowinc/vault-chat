import { Accessor, For, Show, createEffect, createSignal } from "solid-js";
import { FiArrowDown, FiRefreshCcw, FiSend } from "solid-icons/fi";
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

const scrollToBottomOfMessages = () => {
  const element = document.getElementById("topic-messages");
  if (!element) {
    console.error("Could not find element with id 'topic-messages'");
    return;
  }
  console.log("scrolling to bottom");
  element.scrollIntoView({ behavior: "smooth", block: "end" });
};

const Layout = (props: LayoutProps) => {
  const api_host = import.meta.env.VITE_API_HOST as unknown as string;

  const resizeTextarea = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
    setNewMessageContent(textarea.value);
  };

  const [loadingMessages, setLoadingMessages] = createSignal<boolean>(true);
  const [messages, setMessages] = createSignal<Message[]>([]);
  const [newMessageContent, setNewMessageContent] = createSignal<string>("");
  const [atMessageBottom, setAtMessageBottom] = createSignal<boolean>(true);

  createEffect(() => {
    const element = document.getElementById("topic-layout");
    if (!element) {
      console.error("Could not find element with id 'topic-messages'");
      return;
    }

    setAtMessageBottom(
      element.scrollHeight - element.scrollTop === element.clientHeight,
    );

    element.addEventListener("scroll", () => {
      console.log("scrolling");
      setAtMessageBottom(
        element.scrollHeight - element.scrollTop === element.clientHeight,
      );
    });

    return () => {
      element.removeEventListener("scroll", () => {
        setAtMessageBottom(
          element.scrollHeight - element.scrollTop === element.clientHeight,
        );
      });
    };
  });

  const fetchCompletion = async ({
    new_message_content,
    topic_id,
  }: {
    new_message_content: string;
    topic_id: string;
  }) => {
    setNewMessageContent("");
    setMessages((prev) => {
      const newMessages = [{ content: new_message_content }];
      if (prev.length === 0) {
        newMessages.unshift({ content: "" });
      }
      return [...prev, ...newMessages];
    });
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
    setMessages((prev) => [...prev, { content: "" }]);
    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      if (value) {
        const decoder = new TextDecoder();
        const chunk = decoder.decode(value);
        setMessages((prev) => {
          const lastMessage = prev[prev.length - 1];
          const newMessage = {
            content: lastMessage.content + chunk,
          };
          return [...prev.slice(0, prev.length - 1), newMessage];
        });
        scrollToBottomOfMessages();
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
    scrollToBottomOfMessages();
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
        <div class="relative flex flex-col justify-between">
          <div class="flex flex-col items-center pb-32" id="topic-messages">
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
          </div>

          <div class="fixed bottom-0 right-0 flex w-full flex-col items-center space-y-4 bg-gradient-to-b from-transparent via-zinc-200 to-zinc-100 p-4 dark:via-zinc-800 dark:to-zinc-900 md:w-3/4">
            <Show when={messages().length > 0}>
              <div class="flex w-full justify-center">
                <button
                  classList={{
                    "flex w-fit items-center justify-center space-x-4 rounded-xl bg-neutral-50 px-4 py-2 text-sm dark:bg-neutral-700 dark:text-white":
                      true,
                    "ml-auto": !atMessageBottom(),
                  }}
                >
                  <FiRefreshCcw />
                  <p>Regenerate Response</p>
                </button>
                <Show when={!atMessageBottom()}>
                  <button
                    class="ml-auto flex w-fit items-center justify-center space-x-4 rounded-full bg-neutral-50 p-2 text-sm dark:bg-neutral-700 dark:text-white"
                    onClick={() => {
                      scrollToBottomOfMessages();
                    }}
                  >
                    <FiArrowDown class="h-5 w-5" />
                  </button>
                </Show>
              </div>
            </Show>
            <form class="relative flex h-fit max-h-[calc(100vh-32rem)] w-full flex-col items-center overflow-y-auto rounded-xl bg-neutral-50 py-1 pl-4 pr-2 text-neutral-800 dark:bg-neutral-700 dark:text-white">
              <textarea
                class="w-full resize-none whitespace-pre-wrap bg-transparent py-1 scrollbar-thin scrollbar-track-neutral-200 scrollbar-thumb-neutral-400 scrollbar-track-rounded-md scrollbar-thumb-rounded-md focus:outline-none dark:bg-neutral-700 dark:text-white dark:scrollbar-track-neutral-700 dark:scrollbar-thumb-neutral-600"
                placeholder="Write your argument"
                value={newMessageContent()}
                onInput={(e) => resizeTextarea(e.target)}
                rows="1"
              />
              <button
                type="submit"
                classList={{
                  "flex h-10 w-10 items-center justify-center absolute right-2.5 bottom-0":
                    true,
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
