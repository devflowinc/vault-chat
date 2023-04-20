import { createSignal, For } from "solid-js";
import { BiRegularChat } from "solid-icons/bi";
import { FiRefreshCcw } from "solid-icons/fi";
import { AiOutlineUpload } from "solid-icons/ai";

interface Message {
  content: string;
  feedback?: string;
}

const Layout = () => {
  const [messages, setMessages] = createSignal<Message[]>([
    {
      content:
        "The step that contains lighting is the rendering step of the 3D animation process. In the rendering step, the animation is rendered into final images or video using a rendering software, such as Renderman or Arnold.",
      feedback:
        "The step that contains lighting is the rendering step of the 3D animation process.",
    },
    {
      content:
        "The step that contains lighting is the rendering step of the 3D animation process. In the rendering step, the animation is rendered into final images or video using a rendering software, such as Renderman or Arnold.",
    },
    {
      content:
        "The step that contains lighting is the rendering step of the 3D animation process. In the rendering step, the animation is rendered into final images or video using a rendering software, such as Renderman or Arnold.",
      feedback:
        "The step that contains lighting is the rendering step of the 3D animation process.",
    },
    {
      content:
        "The step that contains lighting is the rendering step of the 3D animation process. In the rendering step, the animation is rendered into final images or video using a rendering software, such as Renderman or Arnold.",
    },

    {
      content:
        "The step that contains lighting is the rendering step of the 3D animation process. In the rendering step, the animation is rendered into final images or video using a rendering software, such as Renderman or Arnold.",
      feedback:
        "The step that contains lighting is the rendering step of the 3D animation process.",
    },
    {
      content:
        "The step that contains lighting is the rendering step of the 3D animation process. In the rendering step, the animation is rendered into final images or video using a rendering software, such as Renderman or Arnold.",
    },

    {
      content:
        "The step that contains lighting is the rendering step of the 3D animation process. In the rendering step, the animation is rendered into final images or video using a rendering software, such as Renderman or Arnold.",
      feedback:
        "The step that contains lighting is the rendering step of the 3D animation process.",
    },
    {
      content:
        "The step that contains lighting is the rendering step of the 3D animation process. In the rendering step, the animation is rendered into final images or video using a rendering software, such as Renderman or Arnold.",
    },

    {
      content:
        "The step that contains lighting is the rendering step of the 3D animation process. In the rendering step, the animation is rendered into final images or video using a rendering software, such as Renderman or Arnold.",
      feedback:
        "The step that contains lighting is the rendering step of the 3D animation process.",
    },
    {
      content:
        "The step that contains lighting is the rendering step of the 3D animation process. In the rendering step, the animation is rendered into final images or video using a rendering software, such as Renderman or Arnold.",
    },

    {
      content:
        "The step that contains lighting is the rendering step of the 3D animation process. In the rendering step, the animation is rendered into final images or video using a rendering software, such as Renderman or Arnold.",
      feedback:
        "The step that contains lighting is the rendering step of the 3D animation process.",
    },
    {
      content:
        "The step that contains lighting is the rendering step of the 3D animation process. In the rendering step, the animation is rendered into final images or video using a rendering software, such as Renderman or Arnold.",
    },
  ]);

  return (
    <div class="flex h-full min-h-[90vh] flex-col justify-between">
      <div class="flex max-h-[80vh] flex-col items-center overflow-y-scroll scrollbar-thin scrollbar-track-neutral-200 scrollbar-thumb-neutral-400 dark:scrollbar-track-neutral-800 dark:scrollbar-thumb-neutral-600">
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
                  <img class="h-6 w-6" src="/pfp.png" alt="Profile Picture" />
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
        <button class="flex w-fit items-center justify-center space-x-4 rounded-xl bg-neutral-200 px-4 py-2 dark:bg-neutral-700 dark:text-neutral-50">
          <FiRefreshCcw />
          <p>Regenerate Response</p>
        </button>
      </div>
      <div class="mb-5 flex w-full space-x-4 px-4">
        <input
          class="h-12 w-full rounded-xl bg-neutral-200 p-4 text-neutral-400 dark:bg-neutral-700 dark:text-neutral-500"
          type="text"
          placeholder="Start your argument"
        />
        <button class="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-200 text-3xl text-white dark:bg-neutral-700 dark:text-neutral-800">
          <AiOutlineUpload />
        </button>
      </div>
    </div>
  );
};

export default Layout;
