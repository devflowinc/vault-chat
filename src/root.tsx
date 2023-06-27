import {
  Body,
  ErrorBoundary,
  FileRoutes,
  Head,
  Html,
  Link,
  Meta,
  Routes,
  Scripts,
  Title,
} from "solid-start";
import UserStoreContext from "./components/contexts/UserStoreContext";
import "./root.css";

export default function Root() {
  const theme = (() => {
    if (typeof localStorage !== "undefined" && localStorage.getItem("theme")) {
      return localStorage.getItem("theme");
    }
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    return "light";
  })();

  if (theme === "light") {
    document.documentElement.classList.remove("dark");
  } else {
    document.documentElement.classList.add("dark");
  }

  window.addEventListener("load", function() {
    navigator.serviceWorker.register("/sw.js").then(
      function(registration) {
        console.log(
          "Service Worker registered with scope:",
          registration.scope,
        );
      },
      function(error) {
        console.log("Service Worker registration failed:", error);
      },
    );
  });

  createEffect(() => {
    const script = document.createElement("script");
    script.src = "https://perhaps.arguflow.com/js/script.js";
    script.defer = true;
    script["data-domain"] = "arguflow.com";
    document.body.appendChild(script);

    onCleanup(() => document.body.removeChild(script));
  });

  return (
    <Html lang="en">
      <Head>
        <Title>Arguflow AI Debate Coach</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
        <Link rel="manifest" href="/manifest.json" />
        <script async={false} src="/sw.js" />
        <Meta name="theme-color" content="#5E5E5E" />

        <Meta
          name="description"
          content="Get affordable coaching and instant feedback with 24/7 availability from Arguflow - Your AI Debate coach"
        />

        <Meta property="og:url" content="https://arguflow.com" />
        <Meta property="og:type" content="website/" />
        <Meta property="og:title" content="Arguflow AI Debate Coach" />
        <Meta
          property="og:description"
          content="Get affordable coaching and instant feedback with 24/7 availability from Arguflow - Your AI Debate coach"
        />
        <Meta
          property="og:image"
          content="https://blog.arguflow.com/arguflow-og.png"
        />

        <Meta name="twitter:card" content="summary_large_image" />
        <Meta property="twitter:domain" content="arguflow.com" />
        <Meta property="twitter:url" content="https://arguflow.com" />
        <Meta name="twitter:title" content="Arguflow AI Debate Coach" />
        <Meta
          name="twitter:description"
          content="Get affordable coaching and instant feedback with 24/7 availability from Arguflow - Your AI Debate coach"
        />
        <Meta
          name="twitter:image"
          content="https://blog.arguflow.com/arguflow-og.png"
        />
      </Head>
      <Body>
        <ErrorBoundary>
          <UserStoreContext>
            <Routes>
              <FileRoutes />
            </Routes>
          </UserStoreContext>
        </ErrorBoundary>
        <Scripts />
      </Body>
    </Html>
  );
}
function createEffect(arg0: () => void) {
  throw new Error("Function not implemented.");
}
