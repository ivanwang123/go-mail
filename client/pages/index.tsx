import axios from "axios";
import React, { useState } from "react";
import { useInfiniteQuery } from "react-query";
import CreateModal from "../components/CreateModal";
import Message from "../components/Message";
import { MessageType } from "../types/messageType";
import { parseMessage } from "../utils/parseMessage";

const fetchMessages = ({ pageParam = "" }) => {
  return axios.get(`/message?page-token=${pageParam}`);
};

function Home() {
  const [page, setPage] = useState<number>(0);
  const {
    data,
    error,
    isLoading,
    isError,
    isFetching,
    fetchNextPage,
    refetch,
    // fetchPreviousPage,
  } = useInfiniteQuery<any, any>(["messages"], fetchMessages, {
    keepPreviousData: true,
    // staleTime: 0,
    getNextPageParam: (lastPage, _pages) => {
      return lastPage.data.pageToken;
    },
  });

  if (isLoading)
    return (
      <div className="grid place-items-center w-full h-full">
        <h1 className="font-bold">Loading...</h1>
      </div>
    );
  if (isError) {
    console.error(error);
    return <h1>Error</h1>;
  }

  const prevPage = async () => {
    if (data) {
      setPage((page) => Math.max(page - 1, 0));
    }
  };

  const nextPage = () => {
    if (data) {
      setPage((page) => {
        if (page === data.pages.length - 1) {
          fetchNextPage();
          return page + 1;
        }
        return Math.min(page + 1, data.pages.length - 1);
      });
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <CreateModal />
      <section className="flex items-center p-2">
        <h1 className="font-extrabold">
          <span className="w-12 h-12 p-1 bg-accent text-background rounded-full">
            Go
          </span>{" "}
          <span className="text-accent">Mail</span>
        </h1>
        <div className="ml-auto">
          <span className="text-sm text-secondary mr-4">
            {page * data?.pages[0]?.data.messages.length + 1} —{" "}
            {(page + 1) * data?.pages[0]?.data.messages.length}
          </span>
          <button
            type="button"
            className="w-10 h-10 font-bold rounded-full transition duration-300 hover:bg-gray-100 disabled:text-gray-300 focus:outline-none"
            onClick={prevPage}
            disabled={isFetching || page === 0}
          >
            &lt;
          </button>
          <button
            type="button"
            className="w-10 h-10 ml-2 font-bold rounded-full transition duration-300 hover:bg-gray-100 disabled:text-gray-300 focus:outline-none"
            onClick={nextPage}
            disabled={isFetching}
          >
            &gt;
          </button>
        </div>
      </section>
      <section className="h-full overflow-y-scroll">
        {data?.pages[page] ? (
          data?.pages[page]?.data.messages.slice(0, 20).map((message: any) => {
            let parsedMsg: MessageType = parseMessage(message);

            return <Message message={parsedMsg} refetch={refetch} />;
          })
        ) : (
          <div className="grid place-items-center w-full h-full">
            <h1 className="font-bold">Loading...</h1>
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;
