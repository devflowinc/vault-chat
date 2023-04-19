import { createSignal } from "solid-js";
import Layout from "~/components/Layouts/MainLayout";
import { Navbar } from "~/components/Navbar/Navbar";
import { TopicProps, Sidebar } from "~/components/Navbar/Sidebar";

export default function DebateHome() {
  const [topics] = createSignal<TopicProps[]>([
    { name: "Topic 1", resolved: false },
    { name: "Topic 2", resolved: true },
  ]);
  const [sidebarOpen, setSideBarOpen] = createSignal<boolean>(false);
  return (
    <div class="relative min-h-screen w-screen overflow-x-hidden bg-neutral-50 dark:bg-black">
      <Navbar sidebarOpen={sidebarOpen} setSideBarOpen={setSideBarOpen} />
      <Sidebar sidebarOpen={sidebarOpen} topics={topics} />
      <Layout />
    </div>
  );
}
