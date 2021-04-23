export type MessageType = {
  id: string;
  from: string;
  subject: string;
  body: string;
  date: string;
  contentType: "plain" | "html";
  snippet: string;
  threadId: string;
  read: boolean;
};
