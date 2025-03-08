import {useRef} from "react";

const ChatForm = ({chatHistory, setChatHistory, generateBotResponse}) => {
    const inputRef = useRef();

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const UserMessage = inputRef.current.value.trim();
        if (!UserMessage) return;
        inputRef.current.value = "";

        //Update history with the user's message
        setChatHistory(history => [...history, {role:"user", text: UserMessage}]);

        //Add thinking.. placeholder for bot;s response
        setTimeout(() => {
            setChatHistory((history) => [...history, {role:"model", text: "Thinking..."}]);

            generateBotResponse([...chatHistory,{role:"user", text: `Using the details provided above, please address this quesry: ${UserMessage}`}]);
        }, 600);

    };

    return (
        <form action="#" className='chat-form' onSubmit={handleFormSubmit}>
            <input ref={inputRef} type="text" placeholder="Message..." className="message-input" required/>
            <button className="material-symbols-outlined">arrow_upward</button>
        </form>
    );
};
export default ChatForm;