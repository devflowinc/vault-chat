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
  ]);

  return (
    <div class="flex h-full flex-col items-center">
      <For each={messages()}>
        {(message) => {
          return (
            <div
              classList={{
                "flex p-4 w-full": true,
                "bg-neutral-200": message.feedback,
                "bg-neutral-50": !message.feedback,
              }}
            >
              {message.feedback ? (
                <img class="h-6 w-6" src="/pfp.png" alt="Profile Picture" />
              ) : (
                <BiRegularChat />
              )}
              <div class="px-2" />
              <p class="text-xs text-gray-800"> {message.content} </p>
              {message.feedback && (
                <div class="ml-4">
                  <div class="flex items-center text-gray-500">
                    <p class="text-xs font-bold text-gray-500">Feedback:</p>
                    <div class="px-1" />
                    <FiRefreshCcw />
                  </div>
                  <p class="text-xs text-gray-500"> {message.feedback} </p>
                </div>
              )}
            </div>
          );
        }}
      </For>
      <div class="py-2" />
      <button class="flex w-fit items-center justify-center space-x-4 rounded-xl bg-gray-200 px-4 py-2">
        <FiRefreshCcw />
        <p>Regenerate Response</p>
      </button>
      <div class="flex-1" />
      <div class="flex w-full space-x-4 px-4">
        <input
          class="h-12 w-full rounded-xl bg-gray-200 p-4 text-gray-400"
          type="text"
          placeholder="Start your argument"
        />
        <button class="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-200 text-3xl text-white">
          <AiOutlineUpload />
        </button>
      </div>
    </div>
  );
};

export default Layout;
