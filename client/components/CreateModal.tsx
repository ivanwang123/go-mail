import axios from "axios";
import React, { FormEvent, useState } from "react";

function CreateModal() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [to, setTo] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [body, setBody] = useState<string>("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    axios
      .post("/message/send", {
        to,
        subject,
        body,
      })
      .catch((e) => console.error(e));
    setIsOpen(false);
    setTo("");
    setSubject("");
    setBody("");
  };

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="absolute right-10 bottom-10 flex flex-col z-10">
      {isOpen && (
        <article className="bg-white border p-3 mb-2 shadow-lg z-20 rounded">
          <h1 className="text-lg font-bold mb-1">New Message</h1>
          <form className="w-96 flex flex-col" onSubmit={handleSubmit}>
            <div className="flex items-center border-b group">
              <label className="text-gray-400 mr-2" htmlFor="recipients">
                To
              </label>
              <input
                type="text"
                className="w-full py-1 focus:outline-none"
                id="recipient"
                name="recipient"
                placeholder="Recipient"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </div>
            <input
              type="text"
              className="border-b py-1 focus:outline-none"
              id="subject"
              name="subject"
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
            <textarea
              className="my-2 resize-none focus:outline-none"
              id="body"
              name="body"
              rows={14}
              value={body}
              onChange={(e) => setBody(e.target.value)}
            ></textarea>
            <button
              type="submit"
              className="self-start border-2 border-accent text-accent font-bold px-3 py-1 rounded hover:bg-accent hover:text-white focus:outline-none"
            >
              Send
            </button>
          </form>
        </article>
      )}
      <button
        type="button"
        className="self-end w-14 h-14 bg-accent text-base text-background font-bold rounded-full hover:shadow-lg focus:outline-none"
        onClick={toggleModal}
      >
        New
      </button>
    </div>
  );
}

export default CreateModal;
