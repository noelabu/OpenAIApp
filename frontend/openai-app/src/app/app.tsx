"use client"; 
import { useState, useEffect } from "react";
import { ChatResponse } from "@/model/chat";

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentChat, setCurrentChat] = useState('');
  const [userChat, setUserChat] = useState<ChatResponse[]>([]);
  const [data, setData] = useState('');

  const handleChange = (e:any) => {
    const chat = e.target.value;
    setCurrentChat(chat);
  };

  const handleSubmit = async () => {
      const prompt = currentChat
      const chatHistory = [...userChat]
      chatHistory.push({
        chat_type:"chat-end",
        message: currentChat
      });
      chatHistory.push({
        chat_type:"chat-start",
        message: ""
      });
      setUserChat(chatHistory);
      setIsLoading(true);
      setCurrentChat('');
      setData('');
      try {
        const APP_API_URL = process.env.NEXT_PUBLIC_API_URL
        const response = await fetch(
          `${APP_API_URL}/stream?prompt=${prompt}`,
          {
            method: 'GET',
          }
        )
        if (!response.ok || !response.body) {
          throw response.statusText;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        while (true) {
          const { value, done } = await reader.read();
          if(done) break;
          const decodedChunk = decoder.decode(value, { stream: true });
          setData(prevValue => `${prevValue}${decodedChunk}`);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
  };

  useEffect(() => {
    const chatHistory = [...userChat]
    const chatResponse = {
        chat_type:"chat-start",
        message: data
      }
    if (chatHistory.length !== 0) {
      chatHistory.splice(-1, 1, chatResponse)
    }
    setUserChat(chatHistory)
  },[data])

  return (
    <section className='container mx-auto p-5 fixed inset-0'>
      <div data-theme="retro" className="mockup-browser border bg-base-300 w-full h-full flex flex-col">
        <div className="mockup-browser-toolbar">
          <div className="bg-base-200 input">https://noelabu.github.io</div>
        </div>
        <div className='bg-base-200 p-5 pb-8 flex-grow overflow-auto'>
          {userChat.map((chat, idx) => (
            <div key={`chat_${idx}`} className={`chat ${chat?.chat_type}`}>
              <div className={`chat-bubble ${chat.chat_type == "chat-start" ? "chat-bubble-accent":"chat-bubble-neutral"}`}>
                {chat?.message ? (
                   chat?.message
                ): (
                  <span className="loading loading-dots loading-xs"></span>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="w-full flex flex-col">
          <div className="m-5 items-center">
            <div className="input-group w-full max-w-screen-2xl flex justify-self-end">
              <input name="usertext" 
                type="text" 
                value={currentChat}
                placeholder="Ask me Anything.." 
                className="input bg-base-200 w-full max-w-screen-2xl" 
                onChange={handleChange}/>
              <button className="btn btn-square btn-md place-self-end ml-2" type="submit" disabled={isLoading} onClick={handleSubmit}>
                { isLoading? (
                  <span className="loading loading-ring loading-md"></span>
                ): (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                    </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
)};