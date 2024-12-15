import { useEffect, useRef, useState } from "react"

function App() {
//@ts-ignore
  const [messages, setMessages] = useState(["hi there", "hello"]);
  const wsRef = useRef();
  const inputRef = useRef();

  useEffect(() => {
    const ws = new WebSocket("http://localhost:8080");
    ws.onmessage = (event) => {
      setMessages(m => [...m, event.data]);
    }
    wsRef.current = ws;
    ws.onopen = () => {
      ws.send(JSON.stringify({
        type: "join",
        payload: {
          roomId: "red"
        }
      }))
    }
  }, [])

  return (
    <div className='h-screen bg-black'>
      <br /><br /><br />
      <div className='h-[80vh]'>
        {messages.map(message =>
          <div className="m-8"> <span className="bg-white text-black rounded p-4 m-8">{message}</span> </div>)}
      </div>
      <div className='w-full bg-white flex p-4'>
        <input ref={inputRef} id="message" className="flex-1" />
        <button onClick={() => {
          const message = inputRef.current?.value;

          wsRef.current.send(JSON.stringify({
            type: "chat",
            payload: {
              message: message
            }
          }))

        }} className='bg-purple-600 text-white p-4 pointer'> Send Message </button>
      </div>
    </div>
  )
}

export default App