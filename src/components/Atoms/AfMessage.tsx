import { BiSolidUserRectangle } from "solid-icons/bi";
import { AiFillRobot } from "solid-icons/ai";
import { Show } from "solid-js";
import { FiRefreshCcw } from "solid-icons/fi";

export interface AfMessageProps {
  role: "user" | "assistant" | "system";
  content: string;
  feedback?: string;
}

export const AfMessage = (props: AfMessageProps) => {
  return (
    <Show when={props.role !== "system"}>
      <div
        classList={{
          "flex py-4 px-16 w-full dark:text-white": true,
          "bg-neutral-200 dark:bg-zinc-700": props.role === "assistant",
          "bg-neutral-50 dark:bg-zinc-800": props.role === "user",
        }}
      >
        {props.role === "user" ? <BiSolidUserRectangle /> : <AiFillRobot />}
        <div class="px-2" />
        <p class="text-neutral-800 dark:text-neutral-50">{props.content}</p>
        <Show when={props.feedback}>
          <div class="ml-4 text-neutral-500 dark:text-neutral-400">
            <div class="flex items-center">
              <p class="text-xs font-bold">Feedback:</p>
              <div class="px-1" />
              <FiRefreshCcw />
            </div>
            <p> {props.feedback} </p>
          </div>
        </Show>
      </div>
    </Show>
  );
};
