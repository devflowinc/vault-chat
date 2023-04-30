import { BiRegularCheck } from "solid-icons/bi";

export default function Home() {
  return (
    <div class="bg-neutral-50 text-neutral-900 dark:bg-neutral-900 dark:text-white">
      <div class="bg-gradient-radial-t from-fuchsia-300 p-4">
        <div class="flex items-center justify-between rounded-lg bg-neutral-50 px-4 py-3 shadow-md dark:bg-neutral-800">
          <div>
            <p>
              <span>Arguflow </span>
              <span class="text-violet-500">AI</span>
            </p>
          </div>
          <div class="rounded-lg bg-cyan-500 px-4 py-2">Start Debating</div>
        </div>
        <div class="py-4" />
        <div class="flex flex-col items-center space-y-8">
          <p class="text-5xl">
            <span>Arguflow </span>
            <span class="text-violet-500">AI</span>
          </p>
          <p>Your personal AI debate coach.</p>
          <div class="rounded-lg bg-gradient-to-br from-cyan-900 to-cyan-500 px-4 py-2 text-white shadow-md">
            Start Debating Now
          </div>
        </div>
      </div>
      <div class="py-4" />
      <div class="flex justify-center">
        <img src="/public/example-light.png" alt="" />
      </div>
      <div class="py-6" />
      <div class="px-12">
        <section>
          <p class="text-violet-500">Product</p>
          <div class="py-1" />
          <p class="text-2xl font-medium">The new artificial face of debate</p>
          <div class="py-2" />
          <p class="text-xs">
            Arguflow AI utilizes ChatGPT as a debate coach to provide users with
            real-time feedback on their responses during a debate, allowing
            users to choose any topic they wish to debate and providing
            flexibility and customization to fit their needs.
          </p>
        </section>
        <div class="py-6" />
        <p class="text-violet-500">Features</p>
        <div class="py-1" />
        <p class="text-2xl font-medium">Why choose Arguflow AI?</p>
        <div class="py-2" />
        <section class="flex flex-col">
          <img class="self-center" src="/public/calendar.svg" alt="" />
          <p class="text-2xl">24/7 Availability</p>
          <div class="py-1" />
          <p class="text-xs">
            Practice your debating skills at your own pace and on your own
            schedule.
          </p>
        </section>
        <div class="py-4" />
        <section class="flex flex-col">
          <img class="self-center" src="/public/feedback.svg" alt="" />
          <p class="text-2xl">Instant Feedback</p>
          <div class="py-1" />
          <p class="text-xs">
            Starting with your first response, ChatGPT will provide feedback in
            real-time, including your strengths and areas of improvement.
          </p>
        </section>
        <div class="py-4" />
        <section class="flex flex-col">
          <img class="self-center" src="/public/money.svg" alt="" />
          <p class="text-2xl">Affordable Coaching</p>
          <div class="py-1" />
          <p class="text-xs">
            Compared to private debate coaching companies, this platform is much
            more accessible and affordable, making it an ideal solution for
            businesses, schools, and individuals looking to improve their
            debating skills.
          </p>
        </section>
        <div class="py-6" />
        <p class="text-violet-500">Pricing</p>
        <p class="text-2xl">Affordable Plans</p>
        <div class="w-full space-y-4 bg-neutral-50 p-6 shadow-xl">
          <div>
            <p>Silver</p>
            <p class="text-xs text-neutral-500">Basic debate functions</p>
            <p>
              <span class="text-2xl font-semibold">$15</span>
              <span class="text-neutral-500">/mo</span>
            </p>
          </div>
          <div class="w-full rounded-lg bg-cyan-500 py-2 text-center shadow-md">
            Sign Up Now
          </div>
          <div>
            <ul>
              <li class="flex items-center text-cyan-500">
                <BiRegularCheck size={30} />
                <p class="text-xs text-neutral-900">ChatGPT 3</p>
              </li>
              <li class="flex items-center text-cyan-500">
                <BiRegularCheck size={30} />
                <p class="text-xs text-neutral-900"> Unlimitied Topics </p>
              </li>
              <li class="flex items-center text-cyan-500">
                <BiRegularCheck size={30} />
                <p class="text-xs text-neutral-900"> Basic Feedback </p>
              </li>
            </ul>
          </div>
        </div>
        <div class="py-2" />
        <div class="w-full space-y-4 bg-neutral-50 p-6 shadow-xl">
          <div>
            <p>Silver</p>
            <p class="text-xs text-neutral-500">Basic debate functions</p>
            <p>
              <span class="text-2xl font-semibold">$15</span>
              <span class="text-neutral-500">/mo</span>
            </p>
          </div>
          <div class="w-full rounded-lg bg-lime-500 py-2 text-center shadow-md">
            Sign Up Now
          </div>
          <div>
            <ul>
              <li class="flex items-center text-lime-500">
                <BiRegularCheck size={30} />
                <p class="text-xs text-neutral-900">ChatGPT 3</p>
              </li>
              <li class="flex items-center text-lime-500">
                <BiRegularCheck size={30} />
                <p class="text-xs text-neutral-900"> Unlimitied Topics </p>
              </li>
              <li class="flex items-center text-lime-500">
                <BiRegularCheck size={30} />
                <p class="text-xs text-neutral-900"> Basic Feedback </p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="py-96" />
    </div>
  );
}
