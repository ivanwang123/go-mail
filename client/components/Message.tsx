import React, { MouseEvent } from "react";
import { decode } from "html-entities";
import { MessageType } from "../types/messageType";
import { timestampToStr } from "../utils/parseTime";
import axios from "axios";
import { useRouter } from "next/router";

type PropType = {
  message: MessageType;
  refetch: () => void;
};

function Message({ message, refetch }: PropType) {
  const router = useRouter();

  const handleDelete = (e: MouseEvent, id: string) => {
    e.stopPropagation();
    axios
      .post(`/message/trash/${id}`)
      .then(() => refetch())
      .catch((e) => console.error(e));
  };

  const handleViewFull = () => {
    router.push(`/message/${message.id}`);
  };

  return (
    // <Link href={`/message/${message.id}`}>
    <article
      className={`relative grid grid-cols-12 gap-2 flex items-center px-2 py-2 cursor-pointer group hover:bg-gray-300 ${
        message.read ? "bg-gray-100 font-normal" : "bg-background font-bold"
      }`}
      onClick={handleViewFull}
    >
      <div className="col-span-2 truncate">{message.from}</div>
      <div className="col-span-8 truncate">
        <span>{decode(message.subject) || "(no subject)"}</span>
        <span className="font-normal text-secondary text-sm ml-2">
          {decode(message.snippet)}
        </span>
      </div>
      <div className="col-span-2 text-right text-sm whitespace-nowrap">
        {timestampToStr(message.date)}
      </div>
      <div className="hidden absolute col-start-12 col-end-13 w-full h-full bg-gray-300 text-sm items-center justify-center group-hover:flex">
        <button
          type="button"
          className="z-10 hover:font-bold focus:outline-none"
          onClick={(e) => handleDelete(e, message.id)}
        >
          Delete
        </button>
      </div>
    </article>
    // </Link>
  );
}

export default Message;
