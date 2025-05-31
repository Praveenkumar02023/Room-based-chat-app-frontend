
import {  useEffect, useRef, useState } from 'react'
import './App.css'
import { Message } from './components/Message';

function App() {
  const [messages,setMessages] = useState(["hi there"]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [socket,setSocket] = useState<WebSocket | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(()=>{

    if(scrollRef.current){
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }

  },[messages])

  useEffect(() => {
    
    const ws = new WebSocket("ws://localhost:8000");
    setSocket(ws);
    ws.onmessage = (m)=>{
      
        setMessages(prev => [...prev,m.data]);
    }
    
    ws.onopen = ()=>{
      const joinRoom = {
      "type" : "join",
      "payload" : {
        "roomId" : "1234"
      }
    }

    ws.send(JSON.stringify(joinRoom));
    }

    return () => {
    ws.close();
  }

  }, [])
  
  const sendMessage = ()=>{

    if(!socket) return;

    const message = {
      "type" : "chat",
      "payload" : {
        "message" : inputRef.current?.value
      }
    }

    socket.send(JSON.stringify(message));
  }

  return (
    <>
      <div className='flex flex-col h-screen w-screen bg-black'>
         <div ref={scrollRef} className='h-[90%] bg-amber-100 p-12 flex flex-col overflow-auto'>
              {messages.map((m,i)=>
                  <Message key={i} message= {m}/>
              )}
         </div>
         <div className='bg-white h-[10%] max-w-full flex justify-center'>
            <div  className='flex justify-center items-center '>
                 <input ref={inputRef} type="text" placeholder='type message..' className='h-10 bg-gray-500 w-2xl rounded-md pl-2 text-white' />
                 <button className='text-white h-10 w-16 rounded-md  bg-gray-800' onClick={sendMessage}>
                    Send
                  </button>
            </div>
         </div>
      </div>
    </>
  )
}

export default App
