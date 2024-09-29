"use client"; 
import { useState } from "react";
import { sendMessage } from "@/api/api";

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentChat, setCurrentChat] = useState('');
  const [userChat, setUserChat] = useState([
    {chat_type: "chat-end",
      message: "Tell me something about stars."
    },
    {chat_type: "chat-start",
      message: "Stars are in the sky."
    }
  ]);

  const handleChange = (e:any) => {
    const chat = e.target.value;
    setCurrentChat(chat);
  };
  
  const handleSubmit = async () => {
    const chatHistory = [...userChat]
    chatHistory.push({
      chat_type:"chat-end",
      message: currentChat
    });
    setUserChat(chatHistory);
    setIsLoading(true);
    const response = await sendMessage(currentChat);
    if (response) {
        //const chatHistory = [...userChat]
        chatHistory.push({
            chat_type:"chat-start",
            message: response
          });
        setUserChat(chatHistory);
        setIsLoading(false);
    }
  };
  return (
    <section className='container mx-auto p-5 fixed inset-0'>
      <div data-theme="retro" className="mockup-browser border bg-base-300 w-full h-full flex flex-col">
        <div className="mockup-browser-toolbar">
          <div className="bg-base-200 input">https://noelabu.github.io</div>
        </div>
        <div className='bg-base-200 p-5 pb-8 flex-grow overflow-auto'>
          {userChat.map((chat, idx) => (
            <div key={`chat_${idx}`} className={`chat ${chat?.chat_type}`}>
              <div className="chat-bubble">
                {chat?.message}
              </div>
            </div>
          ))}
        </div>
        <div className="w-full flex flex-col">
          <form className="form-control m-5 items-center">
            <div className="input-group w-full max-w-screen-2xl flex flex-col">
              <textarea 
                name="userText" 
                className="textarea textarea-bordered bg-base-200 resize-none w-full max-w-screen-2xl"
                onChange={handleChange}
                placeholder="Ask me Anything.."
              ></textarea>
              <button className="btn btn-square btn-sm place-self-end mt-2" type="submit" onClick={handleSubmit} disabled={isLoading}>
                { isLoading && (
                  <span className="loading loading-dots loading-sm"></span>
                )}
              </button>
            </div>
          </form>
          
        </div>
      </div>
    </section>
)};