import { createSignal } from "solid-js";
import Layout from "~/components/Layouts/MainLayout";
import { Navbar } from "~/components/Navbar/Navbar";
import { TopicProps, Sidebar } from "~/components/Navbar/Sidebar";

export default function DebateHome() {
  const [topics] = createSignal<TopicProps[]>([
    { name: "Topic 1", resolved: false },
    { name: "Topic 2", resolved: true },
    { name: "Topic 2", resolved: true },
    { name: "Topic 2", resolved: true },
    { name: "Topic 2", resolved: true },
    { name: "Topic 2", resolved: true },
    { name: "Topic 2", resolved: true },
    { name: "Topic 2", resolved: true },
    { name: "Topic 2", resolved: true },
    { name: "Topic 2", resolved: true },
    { name: "Topic 2", resolved: true },
    { name: "Topic 2", resolved: true },
    { name: "Topic 2", resolved: true },
    { name: "Topic 2", resolved: true },
    { name: "Topic 2", resolved: true },
    { name: "Topic 2", resolved: true },
    { name: "Topic 2", resolved: true },
    { name: "Topic 2", resolved: true },
    { name: "Topic 2", resolved: true },
    { name: "Topic 2", resolved: true },
    { name: "Topic 2", resolved: true },
  ]);
  const [sidebarOpen, setSideBarOpen] = createSignal<boolean>(true);
  return (
    <div class="relative flex min-h-screen w-screen flex-row overflow-x-hidden bg-neutral-50 dark:bg-black">
      <Sidebar sidebarOpen={sidebarOpen} topics={topics} />
      <div class="flex w-full flex-col">
        <Navbar sidebarOpen={sidebarOpen} setSideBarOpen={setSideBarOpen} />
        <Layout />
      </div>
    </div>
  );
}
