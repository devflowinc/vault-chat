import {
  BiLogosTwitch,
  BiLogosTwitter,
  BiLogosYoutube,
  BiRegularCheck,
} from "solid-icons/bi";

export default function Home() {
  return (
    <div class="bg-neutral-50 text-neutral-900 dark:bg-neutral-900 dark:text-neutral-50">
      <div class="bg-gradient-radial-t from-magenta-400 p-4">
        <div class="flex items-center justify-between rounded-lg bg-neutral-50 px-4 py-3 shadow-md dark:bg-neutral-800">
          <div class="flex items-center">
            <img class="w-10" src="/logo_transparent.svg" alt="" />
            <p class="text-lg">
              <span>Arguflow </span>
              <span class="text-magenta">AI</span>
            </p>
          </div>
          <div class="rounded-lg bg-turquoise px-4 py-2 dark:text-neutral-900">
            Start Debating
          </div>
        </div>
        <div class="py-4" />
        <div class="flex flex-col items-center space-y-8">
          <p class="text-5xl">
            <span>Arguflow </span>
            <span class="text-magenta">AI</span>
          </p>
          <p>Your personal AI debate coach.</p>
          <div class="rounded-lg bg-gradient-to-br from-cyan-900 to-turquoise px-4 py-2 text-white shadow-md">
            Start Debating Now
          </div>
        </div>
      </div>
      <div class="py-4" />
      <div class="flex justify-center">
        <img class="block dark:hidden" src="/example-light.png" alt="" />
        <img class="hidden dark:block" src="/example-dark.png" alt="" />
      </div>
      <div class="py-6" />
      <div class="px-12">
        <section>
          <p class="text-magenta">Product</p>
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
        <p class="text-magenta">Features</p>
        <div class="py-1" />
        <p class="text-2xl font-medium">Why choose Arguflow AI?</p>
        <div class="py-2" />
        <section class="flex flex-col">
          <img class="self-center" src="/calendar.svg" alt="" />
          <p class="text-2xl">24/7 Availability</p>
          <div class="py-1" />
          <p class="text-xs">
            Practice your debating skills at your own pace and on your own
            schedule.
          </p>
        </section>
        <div class="py-4" />
        <section class="flex flex-col">
          <img class="self-center" src="/feedback.svg" alt="" />
          <p class="text-2xl">Instant Feedback</p>
          <div class="py-1" />
          <p class="text-xs">
            Starting with your first response, ChatGPT will provide feedback in
            real-time, including your strengths and areas of improvement.
          </p>
        </section>
        <div class="py-4" />
        <section class="flex flex-col">
          <img class="self-center" src="/money.svg" alt="" />
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
        <p class="text-magenta">Pricing</p>
        <p class="text-2xl">Affordable Plans</p>
        <div class="w-full space-y-4 bg-neutral-50 p-6 shadow-xl dark:bg-neutral-800 dark:text-neutral-50">
          <div>
            <p>Silver</p>
            <p class="text-xs text-neutral-500">Basic debate functions</p>
            <p>
              <span class="text-2xl font-semibold">$15</span>
              <span class="text-neutral-500">/mo</span>
            </p>
          </div>
          <div class="w-full rounded-lg bg-turquoise py-2 text-center shadow-md dark:text-neutral-900">
            Sign Up Now
          </div>
          <div>
            <ul>
              <li class="flex items-center text-turquoise">
                <BiRegularCheck size={30} />
                <p class="text-xs text-neutral-900 dark:text-neutral-50">
                  ChatGPT 3
                </p>
              </li>
              <li class="flex items-center text-turquoise">
                <BiRegularCheck size={30} />
                <p class="text-xs text-neutral-900 dark:text-neutral-50">
                  Unlimitied Topics
                </p>
              </li>
              <li class="flex items-center text-turquoise">
                <BiRegularCheck size={30} />
                <p class="text-xs text-neutral-900 dark:text-neutral-50">
                  Basic Feedback
                </p>
              </li>
            </ul>
          </div>
        </div>
        <div class="py-2" />
        <div class="w-full space-y-4 bg-neutral-50 p-6 shadow-xl dark:bg-neutral-800 dark:text-neutral-50">
          <div>
            <p>Silver</p>
            <p class="text-xs text-neutral-500">Basic debate functions</p>
            <p>
              <span class="text-2xl font-semibold">$15</span>
              <span class="text-neutral-500">/mo</span>
            </p>
          </div>
          <div class="w-full rounded-lg bg-acid py-2 text-center shadow-md dark:text-neutral-900">
            Sign Up Now
          </div>
          <div>
            <ul>
              <li class="flex items-center text-acid">
                <BiRegularCheck size={30} />
                <p class="text-xs text-neutral-900 dark:text-neutral-50">
                  ChatGPT 4
                </p>
              </li>
              <li class="flex items-center text-acid">
                <BiRegularCheck size={30} />
                <p class="text-xs text-neutral-900 dark:text-neutral-50">
                  Unlimitied Topics
                </p>
              </li>
              <li class="flex items-center text-acid">
                <BiRegularCheck size={30} />
                <p class="text-xs text-neutral-900 dark:text-neutral-50">
                  More Feedback
                </p>
              </li>
            </ul>
          </div>
        </div>
        <div class="py-6" />
        <p class="text-sm text-magenta">Partners</p>
        <div class="py-1" />
        <p class="text-2xl font-medium">Collaboration is Key</p>
        <div class="py-2" />
        <p class="text-xs">
          We are proud to work with a variety of partners who share our
          commitment to improving critical thinking and communication skills
          through innovative technology.
        </p>
        <div class="py-2" />
        <div class="-ml-3 flex">
          <img src="/Q-partner.png" alt="" />
          <img src="/C-partner.png" alt="" />
          <img src="/Z-partner.png" alt="" />
        </div>
        <div class="py-6" />
        <p class="text-sm text-magenta">Reviews</p>
        <p class="text-2xl font-medium">What people are saying</p>
        <div class="py-3" />
        <div class="rounded-lg p-4 shadow-lg dark:bg-neutral-800">
          <p class="text-xs text-turquoise"> Jane Doe </p>
          <div class="py-1" />
          <p class="text-xs">
            "I've been using Arguflow AI for a few months now, and I'm blown
            away by how effective it is at improving my debating skills.
          </p>
          <div class="pt-3" />
          <img src="/right-quote.svg" alt="" />
        </div>
        <div class="py-2" />
        <div class="rounded-lg p-4 shadow-lg dark:bg-neutral-800">
          <p class="text-xs text-turquoise"> Jane Doe </p>
          <div class="py-1" />
          <p class="text-xs">
            "I've been using Arguflow AI for a few months now, and I'm blown
            away by how effective it is at improving my debating skills. The
            platform is incredibly intuitive and user-friendly, making it easy
            to get started and customize my experience.
          </p>
          <div class="pt-3" />
          <img src="/right-quote.svg" alt="" />
        </div>
        <div class="py-2" />
        <div class="rounded-lg p-4 shadow-lg dark:bg-neutral-800">
          <p class="text-xs text-turquoise"> Jane Doe </p>
          <div class="py-1" />
          <p class="text-xs">
            "I'm blown away by how effective it is at improving my debating
            skills. The ability to choose any topic for debate is a
            game-changer, as I can practice on topics that are relevant to me or
            my business.
          </p>
          <div class="pt-3" />
          <img src="/right-quote.svg" alt="" />
        </div>
        <div class="py-6" />
        <div class="flex flex-col items-center space-y-2 text-center">
          <p class="text-2xl">Ready to Start Debating?</p>
          <p class="text-xs">
            Begin your debate journey today with Arguflow AI, your personal
            debate coach.
          </p>
          <div class="rounded-lg bg-gradient-to-br from-[#235761] to-turquoise px-4 py-2 text-white shadow-md">
            Sign Up
          </div>
        </div>
      </div>
      <div class="py-10" />
      <footer class="flex flex-col items-center bg-gradient-radial-b from-magenta p-4 pt-20">
        <div class="flex items-center">
          <img class="w-14" src="/logo_transparent.svg" alt="" />
          <p class="text-lg">
            <span>Arguflow </span>
            <span class="text-magenta">AI</span>
          </p>
        </div>
        <div class="flex flex-col gap-2">
          <a href="">Pricing</a>
          <a href="">Contact</a>
        </div>
        <div class="py-2" />
        <div class="flex gap-3">
          <BiLogosTwitter size={30} />
          <BiLogosTwitch size={30} />
          <BiLogosYoutube size={30} />
        </div>
      </footer>
    </div>
  );
}