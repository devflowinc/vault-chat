import { createSignal, For } from "solid-js";
import { BiRegularChat } from "solid-icons/bi";
import { FiRefreshCcw } from "solid-icons/fi";

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
    <div>
      <For each={messages()}>
        {(message) => {
          return (
            <div
              classList={{
                "flex p-4": true,
                "bg-neutral-200": message.feedback,
                "bg-neutral-50": !message.feedback,
              }}
            >
              {message.feedback ? (
                <img
                  class="h-6 w-6"
                  src="/public/pfp.png"
                  alt="Profile Picture"
                />
              ) : (
                <BiRegularChat />
              )}
              <div class="px-2" />
              <p class="text-xs text-gray-800"> {message.content} </p>
              {message.feedback && (
                <div class="ml-4">
                  <div class="flex items-center text-gray-500">
                    <p class="text-xs text-gray-500 font-bold">Feedback:</p>
                    <div class="px-1" />
                    <FiRefreshCcw />
                  </div>
                  <p class="text-gray-500 text-xs"> {message.feedback} </p>
                </div>
              )}
            </div>
          );
        }}
      </For>
    </div>
  );
};

export default Layout;
