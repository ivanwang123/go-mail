import React from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useQuery } from "react-query";
import { parseMessage } from "../../utils/parseMessage";
import { MessageType } from "../../types/messageType";

const fetchMessage = async (id: string | undefined | string[]) => {
  try {
    const res = await axios.get(`/message/${id}`);
    return parseMessage(res.data.message);
  } catch (e) {
    throw new Error(e);
  }
};

function MessagePage() {
  const router = useRouter();
  const { id } = router.query;
  const { data, error, isLoading, isError } = useQuery<MessageType, any>(
    ["message", id],
    () => fetchMessage(id)
  );

  if (isLoading) return <h1>Loading...</h1>;
  if (isError) {
    console.error(error);
    return <h1>Error</h1>;
  }

  return (
    <main className="h-full flex flex-col">
      <div className="grid grid-cols-12">
        <div className="col-start-4 col-end-10 mt-4">
          <button
            type="button"
            className="font-bold text-gray-400 hover:text-black focus:outline-none"
            onClick={router.back}
          >
            ← Back
          </button>
        </div>
      </div>
      <div className="grid grid-cols-12 h-full py-4 overflow-y-auto text-primary">
        <div className="col-start-4 col-end-10">
          {data?.contentType === "html" ? (
            <iframe className="w-full h-full" srcDoc={data?.body}></iframe>
          ) : (
            <pre className="whitespace-pre-line">{data?.body}</pre>
          )}
        </div>
      </div>
    </main>
  );
}

export default MessagePage;
