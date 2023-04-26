import { Accessor, For, Show, createEffect, createSignal } from "solid-js";
import { BiRegularChat, BiRegularPlusCircle } from "solid-icons/bi";
import { FiRefreshCcw } from "solid-icons/fi";
import { isMessageArray, type Message } from "~/types/messages";
import { Topic } from "~/types/topics";
import { Transition } from "solid-headless";

export interface LayoutProps {
  selectedTopic: Accessor<Topic | undefined>;
}

const readChunks = (reader: ReadableStreamDefaultReader) => {
  return {
    async *[Symbol.asyncIterator]() {
      let readResult = await reader.read();
      console.log(readResult);
      while (!readResult.done) {
        yield readResult.value;
        readResult = await reader.read();
      }
    },
  };
};

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
    console.log("sending request");
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
    console.log("got response back");
    // get the response as a stream
    const reader = res.body?.getReader();
    if (!reader) {
      return;
    }
    console.log("got reader");
    let done = false;
    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      console.log("got value");
      if (value) {
        const decoder = new TextDecoder();
        const chunk = decoder.decode(value);
        console.log(chunk);
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
          class="flex h-full w-full flex-col"
          show={loadingMessages()}
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
      <Show when={!loadingMessages()}>
        <div class="flex flex-col justify-between">
          <div class="flex flex-col items-center overflow-y-scroll scrollbar-thin scrollbar-track-neutral-200 scrollbar-thumb-neutral-400 dark:scrollbar-track-neutral-800 dark:scrollbar-thumb-neutral-600">
            <For each={messages()}>
              {(message) => {
                return (
                  <div
                    classList={{
                      "flex p-4 w-full dark:text-white": true,
                      "bg-neutral-200 dark:bg-neutral-700":
                        message.feedback != undefined,
                      "bg-neutral-50 dark:bg-neutral-800":
                        message.feedback == undefined,
                    }}
                  >
                    {message.feedback ? (
                      <img
                        class="h-6 w-6"
                        src="/pfp.png"
                        alt="Profile Picture"
                      />
                    ) : (
                      <BiRegularChat />
                    )}
                    <div class="px-2" />
                    <p class="text-xs text-neutral-800 dark:text-neutral-50">
                      {" "}
                      {message.content}{" "}
                    </p>
                    {message.feedback && (
                      <div class="ml-4 text-neutral-500 dark:text-neutral-400">
                        <div class="flex items-center">
                          <p class="text-xs font-bold">Feedback:</p>
                          <div class="px-1" />
                          <FiRefreshCcw />
                        </div>
                        <p class="text-xs"> {message.feedback} </p>
                      </div>
                    )}
                  </div>
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

          <div class="mb-5 space-y-5 px-4">
            <form class="flex w-full space-x-4">
              <input
                class="h-12 w-full rounded-xl bg-neutral-200 p-4 text-neutral-400 dark:bg-neutral-700 dark:text-neutral-500"
                type="text"
                placeholder="Write your argument"
                value={newMessageContent()}
                onInput={(e) => {
                  setNewMessageContent(e.currentTarget.value);
                }}
              />
              <button
                type="submit"
                class="dark:hover-text-purple-500 flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-200 text-3xl text-neutral-800 hover:bg-neutral-100 hover:text-purple-500 dark:bg-neutral-700 dark:text-white dark:hover:bg-neutral-800"
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
                <BiRegularPlusCircle />
              </button>
            </form>
          </div>
        </div>
      </Show>
    </>
  );
};

export default Layout;
