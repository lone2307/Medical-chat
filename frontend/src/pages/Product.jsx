import { useState } from 'react'



export default function Product() {
  const [message, setMessage] = useState('');
  const [chatLog, setChatLog] = useState([]);

  const sendMessage = async () => {
    const res = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
    });
    const data = await res.json();
    setChatLog([...chatLog, { from: 'user', text: message }, { from: 'bot', text: data.response }]);
    setMessage('');
  };
  return (
    <div>
      <h1>Product Page</h1>
      <div>
        <h1>Chatbot</h1>
        <div style={{ minHeight: '200px', border: '1px solid gray', padding: '10px' }}>
        {chatLog.map((msg, i) => (
            <div key={i}><strong>{msg.from}:</strong> {msg.text}</div>
        ))}
        </div>  
        <input
        type="text"
        value={message}
        onChange={e => setMessage(e.target.value)}
        placeholder="Type a message"
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}