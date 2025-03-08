import React, {useEffect, useRef, useState} from 'react'
import ChatbotIcon from './components/ChatbotIcon';
import ChatForm from "./components/ChatForm.jsx";
import ChatMessage from "./components/ChatMessage.jsx";
import {info} from "./components/info";

const App = () => {
  console.log("API URL:", import.meta.env.VITE_API_URL);

  const [chatHistory , setChatHistory] = useState([{
    hiddenInChat: true,
    role: "model",
    text: info
  }]);
  const [showChatbot , setshowChatbot] = useState(false);
  const chatBodyRef = useRef();

  const generateBotResponse = async (history) => {
    const updateHistory = (text, isError = false) => {
      setChatHistory(prev => [...prev.filter(msg => msg.text !== "Thinking..."),{role:"model", text, isError}]);
    }

    history = history.map(({role, text}) => ({role, parts:[{text}]}));

    const requestOptions = {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({contents:history})
    }

    try{
      const response = await fetch(import.meta.env.VITE_API_URL,requestOptions );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error.message || "Something went wrong!");

      const apiResponseText = data.candidates[0].content.parts[0].text.replace(/\*\/(.*?)\*\*/g, "$1").trim();
      updateHistory(apiResponseText);
    }catch(error){
      updateHistory(error.message, true);
    }
  };

  useEffect(() => {
    //Auto scroll whenever chat history updates
    chatBodyRef.current.scrollTo({top: chatBodyRef.current.scrollHeight, behavior: "smooth"});
  },[chatHistory]);

  return (
    <div className={`chat-container ${showChatbot ? "show-chatbot" : ""}`}>
      <button onClick={() => setshowChatbot((prev) => !prev)} id="chatbot-toggler">
        <span className="material-symbols-outlined">mode_comment</span>
      </button>

      <div className='chatbot-popup'>
        {/* ChatBot Header*/}
        <div className='chat-header'>
          <div className='header-info'>
            <ChatbotIcon/>
            <h2 className='chat-logo-text'>ChatBot</h2>
          </div>
          <button onClick={() => setshowChatbot((prev) => !prev)}
              className="material-symbols-outlined">keyboard_arrow_down</button>
        </div>

        {/* ChatBot Body*/}
        <div ref={chatBodyRef} className="chat-body">
          <div className="message bot-message">
            <ChatbotIcon/>
            <p className="message-text">
              Hey there <span className="material-symbols-outlined">hand_gesture</span>
              <br/>How can I help you today?
            </p>
          </div>

          {/* Render chat history dynamically */}
          {chatHistory.map((chat, index) => (
              <ChatMessage key={index} chat={chat} />
          ))}
        </div>

        {/* ChatBot Footer*/}
        <div className="chat-footer">
          <ChatForm chatHistory={chatHistory} setChatHistory={setChatHistory} generateBotResponse={generateBotResponse}/>
        </div>
      </div>
    </div>
  )
}

export default App;