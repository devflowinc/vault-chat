import { Show, createSignal } from "solid-js";
import { A, useSearchParams } from "solid-start";
import {
  detectReferralToken,
  getReferralTokenArray,
  isActixApiDefaultError,
} from "~/types/actix-api";

const Register = () => {
  const [searchParams] = useSearchParams();
  detectReferralToken(searchParams.t);

  const api_host: string = import.meta.env.VITE_API_HOST as unknown as string;

  const [getErrorMessage, setErrorMessage] = createSignal("");
  const [getEmail, setEmail] = createSignal("");
  const [getEmailSent, setEmailSent] = createSignal(false);

  return (
    <div class="flex h-screen w-screen items-center justify-center bg-neutral-50 px-10 dark:bg-neutral-800">
      <div class="flex w-full max-w-sm flex-col space-y-2 text-neutral-900 dark:text-neutral-50">
        <a href="/" class="flex flex-col items-center">
          <img src="/Logo.png" alt="Arguflow Logo" class="mx-auto my-2" />
        </a>
        <Show when={!getEmailSent()}>
          <div class="text-center text-2xl font-bold">
            <span class="py-2">Register for Arguflow AI Coach</span>
          </div>
          <div class="text-center text-red-500">{getErrorMessage()}</div>
          <form class="flex flex-col space-y-4">
            <div class="flex flex-col space-y-2">
              <label for="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                class="rounded border border-neutral-300 p-2 text-neutral-900 dark:border-neutral-700 "
                onInput={(e) => {
                  setEmail(e.currentTarget.value);
                }}
                value={getEmail()}
              />
            </div>
            <div class="w-full">
              <button
                type="submit"
                class="w-full rounded bg-neutral-200 p-2  dark:bg-neutral-700"
                onClick={(e) => {
                  e.preventDefault();
                  setErrorMessage("");
                  const email = getEmail();
                  void fetch(`${api_host}/invitation`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      email: email,
                      referral_tokens: getReferralTokenArray(),
                    }),
                  }).then((response) => {
                    if (!response.ok) {
                      void response.json().then((data) => {
                        if (isActixApiDefaultError(data)) {
                          setErrorMessage(data.message);
                        }
                      });
                      return;
                    }
                    setEmailSent(true);
                  });
                }}
              >
                Send Email to Finish Registration
              </button>
            </div>
          </form>
          <div class="flex w-full justify-center">
            <span class="">
              Already have an account? {` `}
              <A href="/auth/login" class="text-blue-500 hover:text-blue-600">
                Login
              </A>
            </span>
          </div>
        </Show>
        <Show when={getEmailSent()}>
          <div class="flex w-full max-w-sm flex-col space-y-2 text-neutral-900 dark:text-neutral-50">
            <div class="text-center text-2xl font-bold">
              <span class="py-2">Check your email to finish registration</span>
            </div>
            <div class="flex w-full justify-center">
              <span class="">
                Already have an account? {` `}
                <A
                  href="/auth/login"
                  class="text-blue-500 underline hover:text-blue-600"
                >
                  Login
                </A>
              </span>
            </div>
          </div>
        </Show>
      </div>
    </div>
  );
};

export default Register;
