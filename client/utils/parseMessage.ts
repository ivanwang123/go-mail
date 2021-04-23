import base64url from "base64url";
import { MessageType } from "../types/messageType";

export function parseMessage(message: any): any {
  const headers = findHeaders(message.payload.headers, [
    "Subject",
    "Date",
    "From",
  ]);

  let body = "";
  let contentType: "plain" | "html" = "plain";
  if (message.payload.mimeType === "multipart/alternative") {
    for (let i = 0; i < message.payload.parts.length; i++) {
      if (
        message.payload.parts[i].mimeType === "text/html" &&
        message.payload.parts[i].body.data
      ) {
        try {
          body = base64url.decode(message.payload.parts[i].body.data);
          contentType = "html";
        } catch (e) {
          console.error(e);
        }
      }
    }
  } else {
    if (message.payload.body.data) {
      try {
        body = base64url.decode(message.payload.body.data);
        contentType = message.payload.mimeType.slice(5);
      } catch (e) {
        console.error(e);
      }
    }
  }

  const id = message.id;
  const snippet = message.snippet;
  const threadId = message.threadId;
  const read = !message.labelIds.includes("UNREAD");

  let from = headers.From;
  const cutIdx = headers.From.lastIndexOf("<");
  if (cutIdx > 0) from = from.slice(0, cutIdx);

  const msg: MessageType = {
    id: id,
    subject: headers.Subject,
    from: from,
    date: headers.Date,
    body: body,
    contentType: contentType,
    snippet: snippet,
    threadId: threadId,
    read: read,
  };
  return msg;
}

const findHeaders = (headers: any[], headerNames: string[]): any => {
  let foundHeaders = headers.filter((header) =>
    headerNames.includes(header.name)
  );
  let headerMap: { [key: string]: string } = {};
  foundHeaders.forEach(({ name: key, value }) => (headerMap[key] = value));
  return headerMap;
};
