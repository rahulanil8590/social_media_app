import React, { useEffect, useRef, useState } from 'react'
import Textinputs from './Textinputs'
import { HiOutlinePaperAirplane } from "react-icons/hi";
import InputEmoji from "react-input-emoji";
import { getMessage, requestApi } from '../utils';
import moment from 'moment';
import { useSelector } from 'react-redux';
const ChatBox = ({chat , chats, user , SetsendMessage , id , recieveMessage}) => {
  const {theme} =  useSelector((state) => state.theme)
    const[newMessage , setnewMessage] = useState("")
    const[messages , setMessages] = useState(null)
  
    const scrollref = useRef()
    useEffect(() =>{
      console.log("ChatBox data receive :" ,  recieveMessage);
      if(recieveMessage !== null && recieveMessage?.ChatId === chat?._id){
        console.log("ChatBox data receive :" ,  recieveMessage);
        setMessages([...messages , recieveMessage])
        console.log(messages , "messages ===778===");
      }
    },[recieveMessage])
    const createMessage = async(e) =>{
        if(newMessage === " " || !newMessage)return
          
        const newData = {ChatId : chat?._id , senderId : user?._id , text : newMessage}
        SetsendMessage({ ...newData, recieverId : id });
    
      try {
        const res = await requestApi({
          url :`/chat/sendMessage`,
          method : "POST",
          data : newData
          
      })

      setMessages( [...messages, res]);
      setnewMessage(" ")
      } catch (error) {
        console.log(error);
      }
    }
   

    const handlechange = (newMessage) =>{
     
        setnewMessage(newMessage)
    }
    const GetMessage = async() =>{
      try {
        console.log(chats?._id , "=== chats?._id");
       const res = await getMessage(chat?._id)
       console.log(res, "===getMessage");
       setMessages( res)
      } catch (error) {
        console.log(error);
      }
    }
    useEffect(() =>{
     GetMessage()
    },[chats])
    useEffect(() => {
      scrollref.current?.scrollIntoView({  behaviour: 'smooth'}) 
    },[messages])
  

  return (
    <div className='w-full flex  flex-col  items-center shadow-sm rounded-xl bg-primary px-6 py-4 h-full relative'>

          <div className={`w-full  h-[500px] xl:h-[550px] flex gap-2 flex-col overflow-y-auto  overflow-hidden  px-4 py-3`} >
                {
                  messages?.map(message=> {
                    return(
                      
                      <div 
                      key={message._id}
                      ref={scrollref}
                      className={`max-w-lg flex flex-col h-auto rounded-lg  px-3 py-1 shadow-md  break-words  ${  user._id === message.senderId ? 'self-end bg-[#391DFF] text-white rounded-br-none' : 'self-start bg-[#FFAA1D] text-white rounded-bl-none '} `}>
                        <span className=' text-[20px] accent-ascent-1 '>{message.text}</span>
                        <span className='text-[10px] accent-ascent-2 pt-2 self-end '>
                           {moment(message?.createdAt ?? " 2024-04-30").fromNow()}
                        </span>
                          
                      </div>
                      
                    )
                  })
                }
         </div>

        <div className='w-full flex p-2 absolute bottom-0 '>
           
            <InputEmoji
                value={newMessage}
                onChange={handlechange}
                background={`${theme === 'dark' ? 'rgba(47,45,48,1)' :  'white'}`}
                borderColor={`${theme === 'dark' ? '#66666609' :  'blue'}`}
                color={`${theme === 'dark' ? 'white' :  'text-slate-600'}`}
                 placeholder="Type a message"
                 onEnter={() => createMessage() } 
                 cleanOnEnter
                 />
            <div 
            className='absolute right-16  bottom-6 rotate-90 z-20 cursor-pointer'
            onClick={(e) => createMessage()}>
                     <HiOutlinePaperAirplane  size={'22px'} color={`${theme === 'dark' ? 'white' :  'blue'}`}/>
            </div>
        </div>
    </div>
  )
}

export default ChatBox
