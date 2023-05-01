import { BiSolidUserRectangle } from "solid-icons/bi";
import { AiFillRobot } from "solid-icons/ai";
import { Show, createMemo } from "solid-js";

export interface AfMessageProps {
  role: "user" | "assistant" | "system";
  content: string;
  feedback?: string;
}

export const AfMessage = (props: AfMessageProps) => {
  const displayMessage = createMemo(() => {
    if (props.role !== "assistant") {
      return {
        feedback: undefined,
        content: props.content,
      };
    }

    if (props.feedback) {
      return {
        feedback: props.feedback,
        content: props.content,
      };
    }

    const split_content = props.content.split("\n");
    let feedback = "";
    let content = props.content;
    if (split_content.length == 3 && split_content[0].startsWith("feedback")) {
      feedback = split_content[0];
      content = split_content[2];
    }

    return {
      feedback,
      content,
    };
  });

  return (
    <Show when={props.role !== "system"}>
      <div
        classList={{
          "flex flex-row space-x-4 px-16 py-4 dark:text-white w-full": true,
          "bg-neutral-200 dark:bg-zinc-700": props.role === "assistant",
          "bg-neutral-50 dark:bg-zinc-800": props.role === "user",
        }}
      >
        {props.role === "user" ? <BiSolidUserRectangle /> : <AiFillRobot />}
        <div
          classList={{
            "w-full": true,
            "grid grid-cols-3 gap-4": !!displayMessage().feedback,
          }}
        >
          <div class="col-span-2 whitespace-pre-line text-neutral-800 dark:text-neutral-50">
            {displayMessage().content}
          </div>
          <Show when={displayMessage().feedback}>
            <div class="justify-self-end text-neutral-500 dark:text-neutral-400">
              <div> {displayMessage().feedback} </div>
            </div>
          </Show>
        </div>
      </div>
    </Show>
  );
};
