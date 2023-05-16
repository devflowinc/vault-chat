import {
  BiRegularChat,
  BiRegularCheck,
  BiRegularLogOut,
  BiRegularPlus,
  BiRegularTrash,
  BiRegularX,
} from "solid-icons/bi";
import { TbGavel } from "solid-icons/tb";
import {
  Accessor,
  createEffect,
  createSignal,
  For,
  Setter,
  Show,
} from "solid-js";
import type { Topic } from "~/types/topics";
import { FiSettings } from "solid-icons/fi";
import { FullScreenModal } from "../Atoms/FullScreenModal";
import { IoSparklesOutline } from "solid-icons/io";
import { OnScreenThemeModeController } from "../Atoms/OnScreenThemeModeController";
import { isStripeCheckoutSessionResponse, isUserPlan } from "~/types/actix-api";

export interface SidebarProps {
  topics: Accessor<Topic[]>;
  refetchTopics: () => Promise<void>;
  setIsCreatingTopic: (value: boolean) => boolean;
  currentTopic: Accessor<Topic | undefined>;
  setCurrentTopic: (topic: Topic | undefined) => void;
  setSideBarOpen: Setter<boolean>;
  setIsCreatingNormalTopic: Setter<boolean>;
}

export const Sidebar = (props: SidebarProps) => {
  const api_host = import.meta.env.VITE_API_HOST as unknown as string;
  const silver_plan_id: string = import.meta.env
    .VITE_STRIPE_SILVER_PLAN_ID as unknown as string;
  const gold_plan_id: string = import.meta.env
    .VITE_STRIPE_GOLD_PLAN_ID as unknown as string;

  const [editingIndex, setEditingIndex] = createSignal(-1);
  const [editingTopic, setEditingTopic] = createSignal("");
  const [settingsModalOpen, setSettingsModalOpen] = createSignal(false);
  const [currentPlan, setCurrentPlan] = createSignal<
    "free" | "silver" | "gold"
  >("free");
  const [silverPlanUrl, setSilverPlanUrl] = createSignal<string>("");
  const [goldPlanUrl, setGoldPlanUrl] = createSignal<string>("");
  const [planStatus, setPlanStatus] = createSignal<string>("");
  const [planPrice, setPlanPrice] = createSignal<string>("");

  const submitEditText = async () => {
    const topics = props.topics();
    const topic = topics[editingIndex()];

    const res = await fetch(`${api_host}/topic`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        topic_id: topic.id,
        side: topic.side,
        resolution: editingTopic(),
      }),
    });

    if (!res.ok) {
      console.log("Error changing topic name (need toast)");
      return;
    }

    setEditingIndex(-1);
    void props.refetchTopics();
  };

  const deleteSelected = async () => {
    const res = await fetch(`${api_host}/topic`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        topic_id: props.currentTopic()?.id,
      }),
    });

    if (res.ok) {
      props.setCurrentTopic(undefined);
      void props.refetchTopics();
    }
  };

  const logout = () => {
    void fetch(`${api_host}/auth`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }).then((response) => {
      if (!response.ok) {
        return;
      }
      window.location.href = "/auth/login";
    });
  };

  const cancelPlan = () => {
    void fetch(`${api_host}/stripe/plan`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }).then((response) => {
      if (!response.ok) {
        return;
      }
      setPlanStatus("canceled");
    });
  };

  const putToPlan = (plan_id: string) => {
    void fetch(`${api_host}/stripe/plan`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        plan_id: plan_id,
      }),
    }).then((response) => {
      if (!response.ok) {
        return;
      }
      const newPlanType = plan_id === silver_plan_id ? "silver" : "gold";
      setCurrentPlan(newPlanType);
      setPlanStatus("active");
      setPlanPrice(plan_id === silver_plan_id ? "$9.99" : "$49.99");
    });
  };

  createEffect(() => {
    const silver_plan_abort_controller = new AbortController();
    const gold_plan_abort_controller = new AbortController();

    const getPlanUrl = (
      plan_id: string,
      setPlanUrl: Setter<string>,
      abortController: AbortController,
    ) => {
      void fetch(`${api_host}/stripe/${plan_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        signal: abortController.signal,
      }).then(async (response) => {
        if (!response.ok) {
          return;
        }
        const response_json = (await response.json()) as unknown;
        if (!isStripeCheckoutSessionResponse(response_json)) {
          return;
        }
        setPlanUrl(response_json.checkout_session_url);
      });
    };

    getPlanUrl(silver_plan_id, setSilverPlanUrl, silver_plan_abort_controller);
    getPlanUrl(gold_plan_id, setGoldPlanUrl, gold_plan_abort_controller);

    return () => {
      silver_plan_abort_controller.abort();
      gold_plan_abort_controller.abort();
    };
  });

  createEffect(() => {
    const get_stripe_plan_abort_controller = new AbortController();

    void fetch(`${api_host}/stripe/plan`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      signal: get_stripe_plan_abort_controller.signal,
    }).then((response) => {
      if (!response.ok) {
        return;
      }
      void response.json().then((data) => {
        if (!isUserPlan(data)) {
          return;
        }
        setCurrentPlan(data.plan);
        setPlanStatus(data.status);
        setPlanPrice(data.plan === "silver" ? "$9.99" : "$49.99");
      });
    });

    return () => {
      get_stripe_plan_abort_controller.abort();
    };
  });

  return (
    <div class="absolute z-50 flex h-screen w-screen flex-row dark:text-gray-50 md:relative md:w-full">
      <div class="flex h-full w-2/3 flex-col bg-neutral-50 dark:bg-neutral-800 md:w-full">
        <div class="flex w-full flex-col space-y-2 px-4 py-2 ">
          <button
            onClick={() => {
              props.setIsCreatingNormalTopic(false);
              props.setIsCreatingTopic(true);
              props.setCurrentTopic(undefined);
              props.setSideBarOpen(false);
            }}
            class="flex w-full flex-row items-center rounded-md border border-neutral-500 px-3 py-1 hover:bg-neutral-200  dark:border-neutral-400 dark:hover:bg-neutral-700"
          >
            <div class="flex flex-row items-center space-x-2">
              <span class="text-xl">
                <BiRegularPlus />
              </span>
              <span>New Debate Topic</span>
            </div>
          </button>
          <button
            onClick={() => {
              props.setIsCreatingTopic(false);
              props.setIsCreatingNormalTopic(true);
              props.setCurrentTopic(undefined);
              props.setSideBarOpen(false);
            }}
            class="flex w-full flex-row items-center rounded-md border border-neutral-500 px-3 py-1 hover:bg-neutral-200  dark:border-neutral-400 dark:hover:bg-neutral-700"
          >
            <div class="flex flex-row items-center space-x-2">
              <span class="text-xl">
                <BiRegularPlus />
              </span>
              <span>New Regular Chat</span>
            </div>
          </button>
        </div>
        <div class="flex w-full flex-col space-y-2 overflow-y-auto px-2 scrollbar-thin scrollbar-track-neutral-200 scrollbar-thumb-neutral-400 scrollbar-track-rounded-md scrollbar-thumb-rounded-md dark:scrollbar-track-neutral-800 dark:scrollbar-thumb-neutral-600">
          <For each={props.topics()}>
            {(topic, index) => (
              <button
                classList={{
                  "flex items-center space-x-4 py-2 w-full rounded-md": true,
                  "bg-neutral-200 dark:bg-neutral-700":
                    props.currentTopic() === topic,
                }}
                onClick={() => {
                  const topics = props.topics();
                  const topic = topics[index()];

                  props.setCurrentTopic(topic);
                  props.setIsCreatingTopic(false);
                  props.setIsCreatingNormalTopic(false);
                  props.setSideBarOpen(false);
                }}
              >
                {editingIndex() === index() && (
                  <div class="flex flex-1 items-center justify-between px-2">
                    <input
                      value={editingTopic()}
                      onInput={(e) => {
                        setEditingTopic(e.currentTarget.value);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          void submitEditText();
                        }
                      }}
                      class="w-full rounded-md bg-neutral-50 px-2 py-1 dark:bg-neutral-800"
                    />

                    <div class="flex flex-row space-x-1 pl-2 text-2xl ">
                      <button
                        onClick={() => {
                          void submitEditText();
                        }}
                        class="hover:text-green-500"
                      >
                        <BiRegularCheck />
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setEditingIndex(-1);
                        }}
                        class="hover:text-red-500"
                      >
                        <BiRegularX />
                      </button>
                    </div>
                  </div>
                )}
                {editingIndex() !== index() && (
                  <div class="flex flex-1 items-center px-3">
                    <Show when={topic.normal_chat}>
                      <BiRegularChat class="mr-2" />
                    </Show>
                    <Show when={!topic.normal_chat}>
                      <TbGavel class="mr-2" />
                    </Show>
                    <p class="line-clamp-1 text-left">{topic.resolution}</p>
                    <div class="flex-1" />
                    <div class="flex flex-row items-center space-x-2">
                      {props.currentTopic() == topic && (
                        <div class="text-lg hover:text-purple-500">
                          <BiRegularTrash
                            onClick={() => {
                              void deleteSelected();
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </button>
            )}
          </For>
        </div>
        <div class="flex-1 " />
        <div class="flex w-full flex-col space-y-1 border-t px-2 py-2 dark:border-neutral-400">
          {/* <Show when={currentPlan() == "free"}>
            <a
              class="flex w-full items-center justify-center rounded-md bg-zinc-500 px-4 py-2 font-bold text-white"
              href={silverPlanUrl()}
            >
              <IoSparklesOutline class="mr-2" />
              Upgrade To Silver ($9.99/month)
            </a>
          </Show>
          <Show when={currentPlan() !== "free" && planStatus() == "canceled"}>
            <button
              class="flex w-full items-center justify-center rounded-md bg-zinc-500 px-4 py-2 font-bold text-white"
              onClick={() => {
                putToPlan(silver_plan_id);
              }}
            >
              <IoSparklesOutline class="mr-2" />
              Upgrade To Silver ($9.99/month)
            </button>
          </Show> */}
          <button
            class="flex w-full items-center space-x-4  rounded-md px-3 py-2 hover:bg-neutral-200   dark:hover:bg-neutral-700"
            onClick={logout}
          >
            <div class="text-3xl">
              <BiRegularLogOut />
            </div>
            <div>Logout</div>
          </button>
          <button
            class="flex w-full items-center space-x-4  rounded-md px-3 py-2 hover:bg-neutral-200   dark:hover:bg-neutral-700"
            onClick={() => setSettingsModalOpen(true)}
          >
            <div class="pl-1 text-2xl">
              <FiSettings />
            </div>
            <div>Settings</div>
          </button>
        </div>
      </div>
      <button
        class="w-1/3 flex-col justify-start bg-gray-500/5 backdrop-blur-[3px] md:hidden"
        onClick={(e) => {
          e.preventDefault();
          props.setSideBarOpen((prev) => !prev);
        }}
      >
        <div class="ml-4 text-3xl">
          <BiRegularX />
        </div>
      </button>
      <Show when={settingsModalOpen()}>
        <FullScreenModal
          isOpen={settingsModalOpen}
          setIsOpen={setSettingsModalOpen}
        >
          <div class="min-w-[250px] sm:min-w-[300px]">
            <div class="mb-4 text-xl font-bold">Settings</div>
            <div class="mb-6 flex flex-col space-y-2">
              <div class="flex w-full items-center justify-between space-x-4">
                <div>Theme:</div>
                <OnScreenThemeModeController />
              </div>
              <div class="text-lg font-bold">Subscription Details</div>
              <div class="flex w-full items-center justify-between space-x-4">
                <div>Tier:</div>
                <div>{currentPlan()}</div>
              </div>
              <Show when={currentPlan() !== "free"}>
                <div class="flex w-full items-center justify-between space-x-4">
                  <div>Price:</div>
                  <div>{planPrice()}/month</div>
                </div>
                <div class="flex w-full items-center justify-between space-x-4">
                  <div>Status:</div>
                  <div class="text-right">
                    {planStatus() === "canceled"
                      ? "canceled (you will not be charged at the end of current billing cycle)"
                      : "active"}
                  </div>
                </div>
              </Show>
            </div>
            <div class="flex flex-col space-y-2">
              {/* <Show when={currentPlan() === "free"}>
                <a
                  class="flex w-full items-center justify-center rounded-md bg-zinc-500 px-4 py-2 font-bold text-white"
                  href={silverPlanUrl()}
                >
                  <IoSparklesOutline class="mr-2" />
                  Upgrade To Silver ($9.99/month)
                </a>
                <Show when={currentPlan() !== "gold"}>
                  <a
                    class="flex w-full items-center justify-center rounded-md bg-amber-500 px-4 py-2 font-bold text-white"
                    href={goldPlanUrl()}
                  >
                    <IoSparklesOutline class="mr-2" />
                    Upgrade To Gold ($49.99/month) (GPT4)
                  </a>
                </Show>
              </Show> */}
              <Show when={currentPlan() !== "free"}>
                <Show
                  when={
                    currentPlan() !== "silver" || planStatus() == "canceled"
                  }
                >
                  <button
                    class="flex w-full items-center justify-center rounded-md bg-zinc-500 px-4 py-2 font-bold text-white"
                    onClick={() => {
                      putToPlan(silver_plan_id);
                    }}
                  >
                    <IoSparklesOutline class="mr-2" />
                    {currentPlan() === "gold" && planStatus() !== "canceled"
                      ? "Downgrade"
                      : "Upgrade"}{" "}
                    To Silver ($9.99/month)
                  </button>
                </Show>
                <Show
                  when={currentPlan() !== "gold" || planStatus() == "canceled"}
                >
                  <button
                    class="flex w-full items-center justify-center rounded-md bg-amber-500 px-4 py-2 font-bold text-white"
                    onClick={() => {
                      putToPlan(gold_plan_id);
                    }}
                  >
                    <IoSparklesOutline class="mr-2" />
                    Upgrade To Gold ($49.99/month) (GPT4)
                  </button>
                </Show>
                <button
                  class="flex w-full items-center justify-center rounded-md bg-stone-500 px-4 py-2 text-white"
                  onClick={() => {
                    cancelPlan();
                  }}
                >
                  Cancel Subscription
                </button>
              </Show>
            </div>
          </div>
        </FullScreenModal>
      </Show>
    </div>
  );
};
