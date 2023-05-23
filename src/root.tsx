import {
  Body,
  ErrorBoundary,
  FileRoutes,
  Head,
  Html,
  Meta,
  Routes,
  Scripts,
  Title,
} from "solid-start";
import UserStoreContext from "./components/contexts/UserStoreContext";
import "./root.css";

export default function Root() {
  const theme = (() => {
    if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
      return localStorage.getItem('theme')
    }
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark'
    }
    return 'light'
  })()

  if (theme === 'light') {
    document.documentElement.classList.remove('dark')
  } else {
    document.documentElement.classList.add('dark')
  }

  return (
    <Html lang="en">
      <Head>
        <Title>AI Debate Coach</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />

        <title>Arguflow AI Debate Coach</title>
        <meta
          name="description"
          content="Get affordable coaching and instant feedback with 24/7 availability from Arguflow - Your AI Debate coach"
        />

        <meta property="og:url" content="https://arguflow.com" />
        <meta property="og:type" content="website/" />
        <meta property="og:title" content="Arguflow AI Debate Coach" />
        <meta
          property="og:description"
          content="Get affordable coaching and instant feedback with 24/7 availability from Arguflow - Your AI Debate coach"
        />
        <meta
          property="og:image"
          content="https://blog.arguflow.com/arguflow-og.png"
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="arguflow.com" />
        <meta property="twitter:url" content="https://arguflow.com" />
        <meta name="twitter:title" content="Arguflow AI Debate Coach" />
        <meta
          name="twitter:description"
          content="Get affordable coaching and instant feedback with 24/7 availability from Arguflow - Your AI Debate coach"
        />
        <meta
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
