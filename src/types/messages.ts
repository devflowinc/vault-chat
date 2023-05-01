export interface Message {
  content: string;
  feedback?: string;
}

export const isMessage = (data: unknown): data is Message => {
  return (
    typeof data === "object" &&
    data !== null &&
    "content" in data &&
    typeof (data as Message).content === "string" &&
    ("feedback" in data ? typeof (data as Message).feedback === "string" : true)
  );
};

export const isMessageArray = (data: unknown): data is Message[] => {
  return (
    Array.isArray(data) &&
    data.every((item) => {
      return isMessage(item);
    })
  );
};

export const messageRoleFromIndex = (idx: number) => {
  if (idx == 0 || idx == 1) {
    return "system";
  }
  if (idx % 2 == 0) {
    return "user";
  }
  return "assistant";
};
