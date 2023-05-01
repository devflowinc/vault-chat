import { Accessor, For, Show, createEffect, createSignal } from "solid-js";
import {
  FiArrowDown,
  FiRefreshCcw,
  FiSend,
  FiStopCircle,
} from "solid-icons/fi";
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
  element.scrollIntoView({ block: "end" });
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
  const [streamingCompletion, setStreamingCompletion] =
    createSignal<boolean>(false);
  const [completionAbortController, setCompletionAbortController] =
    createSignal<AbortController>(new AbortController());

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
    regenerateLastMessage,
  }: {
    new_message_content: string;
    topic_id: string;
    regenerateLastMessage?: boolean;
  }) => {
    let requestMethod = "POST";

    if (regenerateLastMessage) {
      requestMethod = "DELETE";
      setMessages((prev) => {
        const newMessages = [{ content: "" }];
        return [...prev.slice(0, prev.length - 1), ...newMessages];
      });
    } else {
      setNewMessageContent("");
      const newMessageTextarea = document.getElementById(
        "new-message-content-textarea",
      ) as HTMLTextAreaElement;
      resizeTextarea(newMessageTextarea);

      setMessages((prev) => {
        const newMessages = [{ content: new_message_content }, { content: "" }];
        if (prev.length === 0) {
          newMessages.unshift(...[{ content: "" }, { content: "" }]);
        }
        return [...prev, ...newMessages];
      });
    }

    try {
      const res = await fetch(`${api_host}/message`, {
        method: requestMethod,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          new_message_content,
          topic_id,
        }),
        signal: completionAbortController().signal,
      });
      // get the response as a stream
      const reader = res.body?.getReader();
      if (!reader) {
        return;
      }
      setStreamingCompletion(true);
      let done = false;
      let finished_feedback = false;
      let current_content = "";
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        if (doneReading) {
          done = doneReading;
          setStreamingCompletion(false);
        }
        if (value) {
          const decoder = new TextDecoder();
          const chunk = decoder.decode(value);

          if (!finished_feedback) {
            current_content += chunk;

            if (current_content.length < 8) {
              continue;
            }

            if (!current_content.startsWith("feedback")) {
              finished_feedback = true;
              setMessages((prev) => {
                const newMessage = {
                  content: current_content,
                };
                return [...prev.slice(0, prev.length - 1), newMessage];
              });
              continue;
            }

            if (current_content.endsWith("\n")) {
              finished_feedback = true;
              current_content = current_content.slice(0, -2);
            }
            setMessages((prev) => {
              const lastMessage = prev[prev.length - 1];
              const newMessage = {
                content: lastMessage.content,
                feedback: current_content,
              };
              return [...prev.slice(0, prev.length - 1), newMessage];
            });
            continue;
          }

          setMessages((prev) => {
            const lastMessage = prev[prev.length - 1];
            const newMessage = {
              feedback: lastMessage.feedback,
              content: lastMessage.content + chunk,
            };
            return [...prev.slice(0, prev.length - 1), newMessage];
          });
          scrollToBottomOfMessages();
        }
      }
    } catch (e) {
      console.error(e);
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

  const submitNewMessage = () => {
    const topic_id = props.selectedTopic()?.id;
    if (!topic_id || !newMessageContent() || streamingCompletion()) {
      return;
    }
    void fetchCompletion({
      new_message_content: newMessageContent(),
      topic_id,
    });
  };

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
            <Show when={messages().length > 2}>
              <div class="flex w-full justify-center">
                <Show when={!streamingCompletion()}>
                  <button
                    classList={{
                      "flex w-fit items-center justify-center space-x-4 rounded-xl bg-neutral-50 px-4 py-2 text-sm dark:bg-neutral-700 dark:text-white":
                        true,
                      "ml-auto": !atMessageBottom(),
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      const topic_id = props.selectedTopic()?.id;
                      if (!topic_id) {
                        return;
                      }
                      void fetchCompletion({
                        new_message_content: "",
                        topic_id,
                        regenerateLastMessage: true,
                      });
                    }}
                  >
                    <FiRefreshCcw />
                    <p>Regenerate Response</p>
                  </button>
                </Show>
                <Show when={streamingCompletion()}>
                  <button
                    classList={{
                      "flex w-fit items-center justify-center space-x-4 rounded-xl bg-neutral-50 px-4 py-2 text-sm dark:bg-neutral-700 dark:text-white":
                        true,
                      "ml-auto": !atMessageBottom(),
                    }}
                    onClick={() => {
                      completionAbortController().abort();
                      setCompletionAbortController(new AbortController());
                      setStreamingCompletion(false);
                    }}
                  >
                    <FiStopCircle class="h-5 w-5" />
                    <p>Stop Generating</p>
                  </button>
                </Show>
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
                id="new-message-content-textarea"
                class="w-full resize-none whitespace-pre-wrap bg-transparent py-1 scrollbar-thin scrollbar-track-neutral-200 scrollbar-thumb-neutral-400 scrollbar-track-rounded-md scrollbar-thumb-rounded-md focus:outline-none dark:bg-neutral-700 dark:text-white dark:scrollbar-track-neutral-700 dark:scrollbar-thumb-neutral-600"
                placeholder="Write your argument"
                value={newMessageContent()}
                disabled={streamingCompletion()}
                onInput={(e) => resizeTextarea(e.target)}
                onKeyDown={(e) => {
                  if (e.ctrlKey && e.key === "Enter") {
                    e.preventDefault();
                    const new_message_content = newMessageContent();
                    if (!new_message_content) {
                      return;
                    }
                    const topic_id = props.selectedTopic()?.id;
                    if (!topic_id) {
                      return;
                    }
                    void fetchCompletion({
                      new_message_content,
                      topic_id,
                    });
                    return;
                  }
                  if (e.key === "Enter") {
                    e.preventDefault();
                    submitNewMessage();
                  }
                }}
                rows="1"
              />
              <button
                type="submit"
                classList={{
                  "flex h-10 w-10 items-center justify-center absolute right-2.5 bottom-0":
                    true,
                  "text-neutral-400": !newMessageContent(),
                }}
                disabled={!newMessageContent() || streamingCompletion()}
                onClick={(e) => {
                  e.preventDefault();
                  submitNewMessage();
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
