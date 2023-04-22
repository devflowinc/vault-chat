import {
  BiRegularMoon,
  BiRegularSun,
  BiSolidMoon,
  BiSolidSun,
} from "solid-icons/bi";
import { createSignal } from "solid-js";

export const setThemeMode = (mode: "light" | "dark") => {
  const oppositeMode = mode === "light" ? "dark" : "light";
  document.documentElement.classList.remove(oppositeMode);
  window.localStorage.setItem("theme", mode);
  document.documentElement.classList.add(mode);
};

export const getThemeMode = () => {
  const mode = window.localStorage.getItem("theme");
  return mode ?? "system";
};

export const clearThemeMode = () => {
  window.localStorage.removeItem("theme");
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
};

export const OnScreenThemeModeController = () => {
  const [mode, setMode] = createSignal(getThemeMode());

  return (
    <div class="flex items-center space-x-1 text-3xl text-neutral-200 dark:text-neutral-700">
      <BiRegularMoon
        onClick={() => {
          setThemeMode("dark");
          setMode("dark");
        }}
        class="block dark:hidden"
      />

      <div
        classList={{
          "text-violet-600": mode() == "dark",
        }}
      >
        <BiSolidMoon
          onClick={() => {
            if (mode() === "dark") {
              clearThemeMode();
              setMode("system");
            } else {
              setThemeMode("dark");
              setMode("dark");
            }
          }}
          class="hidden dark:block"
        />
      </div>
      <div class="h-4 border-r" />
      <div
        classList={{
          "text-amber-600": mode() === "light",
        }}
      >
        <BiSolidSun
          onClick={() => {
            if (mode() === "light") {
              clearThemeMode();
              setMode("system");
            } else {
              setThemeMode("light");
              setMode("light");
            }
          }}
          class="block dark:hidden"
        />
      </div>
      <BiRegularSun
        onClick={() => {
          setThemeMode("light");
          setMode("light");
        }}
        class="hidden dark:block"
      />
    </div>
  );
};
