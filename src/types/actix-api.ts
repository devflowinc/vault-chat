import { Topic } from "./topics";

export interface ActixApiDefaultError {
  message: string;
}

export const isActixApiDefaultError = (
  data: unknown,
): data is ActixApiDefaultError => {
  return (
    typeof data === "object" &&
    data !== null &&
    "message" in data &&
    typeof (data as ActixApiDefaultError).message === "string"
  );
};

export const isTopic = (data: unknown): data is Topic => {
  return (
    typeof data === "object" &&
    data !== null &&
    "resolution" in data &&
    "side" in data &&
    "id" in data &&
    typeof (data as Topic).resolution === "string" &&
    typeof (data as Topic).side === "boolean" &&
    typeof (data as Topic).id === "string"
  );
};

export const detectReferralToken = (queryParamT: string | undefined) => {
  if (queryParamT) {
    let previousTokens: string[] = [];
    const previousReferralToken = window.localStorage.getItem("referralToken");
    if (previousReferralToken) {
      const previousReferralTokenArray: string[] = JSON.parse(
        previousReferralToken,
      ) as unknown as string[];
      previousTokens = previousReferralTokenArray;
      if (previousTokens.find((val) => val === queryParamT)) {
        return;
      }
    }
    previousTokens.push(queryParamT);
    window.localStorage.setItem(
      "referralToken",
      JSON.stringify(previousTokens),
    );
  }
};

export const getReferralTokenArray = (): string[] => {
  const previousReferralToken = window.localStorage.getItem("referralToken");
  if (previousReferralToken) {
    const previousReferralTokenArray: string[] = JSON.parse(
      previousReferralToken,
    ) as unknown as string[];
    return previousReferralTokenArray;
  }
  return [];
};
