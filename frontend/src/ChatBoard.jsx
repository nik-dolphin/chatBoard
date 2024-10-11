import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // Connect to the server

const ChatBoard = () => {
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    // Listen for new messages from the server
    socket.on("newMessage", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    // Clean up on component unmount
    return () => {
      socket.off("newMessage");
    };
  }, []);

  useEffect(() => {
    socket.emit('fetchMessages'); // Request existing messages
    socket.on('existingMessages', (existingMessages) => {
        setMessages(existingMessages);
    });
}, []);

  const sendMessage = (e) => {
    e.preventDefault();
    const newMessage = { username, content };
    // Emit the message to the server
    socket.emit("sendMessage", newMessage);
    setContent(""); // Clear the input field
  };

  return (
    <div>
      <h1>Chat Board</h1>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>
            <strong>{msg.username}:</strong> {msg.content}
          </li>
        ))}
      </ul>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Message"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatBoard;
