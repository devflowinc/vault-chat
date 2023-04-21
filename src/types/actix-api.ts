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
