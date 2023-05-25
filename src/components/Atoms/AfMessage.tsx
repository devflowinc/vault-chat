import { BiRegularEdit, BiSolidUserRectangle } from "solid-icons/bi";
import { AiFillRobot } from "solid-icons/ai";
import { Show, createEffect, createMemo, createSignal } from "solid-js";

export interface AfMessageProps {
  role: "user" | "assistant" | "system";
  content: string;
  onEdit: (content: string) => void;
  feedback?: string;
}

export const AfMessage = (props: AfMessageProps) => {
  const [editing, setEditing] = createSignal(false);
  const [showEditingIcon, setShowEditingIcon] = createSignal(
    window.innerWidth < 450 ? true : false,
  );
  const [editingMessageContent, setEditingMessageContent] = createSignal("");

  createEffect(() => {
    setEditingMessageContent(props.content);
  });

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
    if (
      split_content.length == 3 &&
      split_content[0].toLowerCase().startsWith("feedback")
    ) {
      feedback = split_content[0];
      content = split_content[2];
    }

    return {
      feedback,
      content,
    };
  });

  const resizeTextarea = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
    setEditingMessageContent(textarea.value);
  };

  return (
    <Show when={props.role !== "system"}>
      <Show when={!editing()}>
        <div
          classList={{
            "dark:text-white md:px-16 w-full px-4 py-4 flex items-start": true,
            "bg-neutral-200 dark:bg-zinc-700": props.role === "assistant",
            "bg-neutral-50 dark:bg-zinc-800": props.role === "user",
          }}
          onMouseEnter={() => setShowEditingIcon(true)}
          onMouseLeave={() => {
            if (window.innerWidth < 450) {
              return;
            }
            setShowEditingIcon(false);
          }}
        >
          <div class="flex w-full flex-row space-x-4">
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
          <Show when={props.role === "user" && showEditingIcon()}>
            <button
              class="text-neutral-600 dark:text-neutral-400"
              onClick={() => setEditing(true)}
            >
              <BiRegularEdit />
            </button>
          </Show>
        </div>
      </Show>
      <Show when={editing()}>
        <div
          classList={{
            "dark:text-white md:px-16 w-full px-4 py-4 flex items-start": true,
            "bg-neutral-200 dark:bg-zinc-700": props.role === "assistant",
            "bg-neutral-50 dark:bg-zinc-800": props.role === "user",
          }}
        >
          <form class="w-full">
            <textarea
              id="new-message-content-textarea"
              class="max-h-[180px] w-full resize-none whitespace-pre-wrap rounded bg-transparent p-2 py-1 scrollbar-thin scrollbar-track-neutral-200 scrollbar-thumb-neutral-400 scrollbar-track-rounded-md scrollbar-thumb-rounded-md focus:outline-none dark:bg-neutral-700 dark:text-white dark:scrollbar-track-neutral-700 dark:scrollbar-thumb-neutral-600"
              placeholder="Write your argument"
              value={editingMessageContent()}
              onInput={(e) => resizeTextarea(e.target)}
              onKeyDown={(e) => {
                if (e.ctrlKey && e.key === "Enter") {
                  e.preventDefault();
                }
              }}
              rows="1"
            />
            <div class="mt-2 flex flex-row justify-center space-x-2 text-sm">
              <button
                type="submit"
                class="rounded bg-purple-500 px-2 py-1 text-white"
                onClick={(e) => {
                  e.preventDefault();
                  props.onEdit(editingMessageContent());
                  setEditing(false);
                }}
              >
                Save & Submit
              </button>
              <button
                type="button"
                class="rounded border border-neutral-500 px-2 py-1"
                onClick={(e) => {
                  e.preventDefault();
                  setEditing(false);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </Show>
    </Show>
  );
};
