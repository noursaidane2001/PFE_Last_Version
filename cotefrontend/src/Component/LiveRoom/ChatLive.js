import React, { useEffect, useRef } from 'react';
import io from 'socket.io-client';
function ChatLive() {
  const messagesRef = useRef(null);
  const inputRef = useRef(null);
  const socketRef = useRef(null);
  useEffect(() => {
    socketRef.current = io();
    socketRef.current.on('chat message', function(msg) {
      const item = document.createElement('li');
      item.textContent = msg;
      messagesRef.current.appendChild(item);
      window.scrollTo(0, document.body.scrollHeight);
    });
    return () => {
      socketRef.current.disconnect();
    };
  }, []);
  const handleSubmit = e => {
    e.preventDefault();
    if (inputRef.current.value) {
      socketRef.current.emit('chat message', inputRef.current.value);
      inputRef.current.value = '';
    }
  };
  return (
    <div style={{ marginTop: '85vh' , marginLeft: '1000px' }}>
      <ul id="messages" ref={messagesRef}></ul>
      <form id="form" onSubmit={handleSubmit}>
        <input id="input" autoComplete="off" ref={inputRef} />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
export default ChatLive;
