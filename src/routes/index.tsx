export default function Home() {
  return (
    <div class="bg-neutral-50 dark:bg-neutral-900 dark:text-white">
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
          <div class="rounded-lg bg-gradient-to-br from-cyan-900 to-cyan-500 px-4 py-2 text-white">
            Start Debating Now
          </div>
        </div>
      </div>
    </div>
  );
}
