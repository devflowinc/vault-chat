import { createSignal } from "solid-js";
import { isActixApiDefaultError } from "~/types/actix-api";
import type { Topic } from "~/types/topics";
import { AfSwitch } from "../Atoms/AfSwitch";

export interface NewTopicFormProps {
  setIsCreatingTopic: (value: boolean) => void;
  refetchTopics: () => Promise<Topic[] | undefined>;
}

export const NewTopicForm = (props: NewTopicFormProps) => {
  const [side, setSide] = createSignal(true);
  const [topicName, setTopicName] = createSignal("");

  const [errorMessage, setErrorMessage] = createSignal("");

  const api_host: string = import.meta.env.VITE_API_HOST as unknown as string;

  const processResponse = (response: Response) => {
    if (!response.ok) {
      void response.json().then((data) => {
        if (isActixApiDefaultError(data)) {
          setErrorMessage(data.message);
        }
      });
      return;
    }
    props.setIsCreatingTopic(false);
    void props.refetchTopics();
  };

  return (
    <div class="flex min-h-[90vh] flex-col items-center justify-center bg-neutral-50 px-10 align-middle text-neutral-900 dark:bg-neutral-800 dark:text-neutral-50">
      <form class="flex flex-col space-y-4">
        <p class="text-2xl">Create New Topic</p>
        <div class="text-center text-red-500">{errorMessage()}</div>
        <label for="topicName"> Topic Name</label>
        <input
          type="topicName"
          name="topicName"
          id="topicName"
          class="rounded border border-neutral-300 p-2 text-neutral-900 dark:border-neutral-700"
          value={topicName()}
          onInput={(e) => setTopicName(e.currentTarget.value)}
        />

        <label for="side">Side</label>
        <AfSwitch setIsOn={setSide} />
      </form>

      <div class="flex space-x-2">
        <button
          type="submit"
          class="mt-2 w-full rounded bg-neutral-200 p-2  dark:bg-neutral-700"
          onClick={(e) => {
            e.preventDefault();
            void fetch(`${api_host}/topic`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify({
                resolution: topicName(),
                side: side(),
              }),
            }).then(processResponse);
          }}
        >
          Submit
        </button>
        <button
          class="mt-2 w-full rounded bg-neutral-200 p-2  dark:bg-neutral-700"
          onClick={() => {
            props.setIsCreatingTopic(false);
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
