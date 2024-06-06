import React from 'react'
import { Link } from 'react-router-dom'
import { Noprofile } from '../Assets'
import { BsChatLeftDotsFill } from "react-icons/bs";
import { useDispatch, useSelector } from 'react-redux';
import { requestApi } from '../utils';
import { SetChat } from '../redux/ChatsSlice';
const FriendsCard = ({friends , id }) => {
  const { theme } = useSelector((state) => state.theme)
  const { user } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const handleClick = async (id) =>{
    try {
      //chat create the friend and user conversation setup
      const newData = {senderId : user?._id , recieverId : id}
      const Chatres = await requestApi({
          url :`/chat/`,
          method : "POST",
          data : newData
          
      })
      console.log("hello onclick chat");
      
      const newChat = {chat : Chatres?._id , ...Chatres}
      dispatch(SetChat(Chatres))
   
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div>
       <div className='w-full flex flex-col  items-center shadow-sm rounded-xl bg-primary px-6 py-4 '>
       <div className='w-full flex items-center justify-between pb-3 border-b border-[#66666645] text-ascent-1'>
            <span>Friends</span>
            <span>{friends?.length}</span>
         </div>
         <div className='w-full flex flex-col gap-4 pt-4'>
                {
                  friends &&  friends.map((friend , index) => (
                    <>
                        <Link to={'/profile/'+ friend?._id}
                        key={friend?._id}
                        className='w-full flex gap-4 items-center cursor-pointer'>
                        <img src={friend?.profileUrl ?? Noprofile} alt={friend?.firstName}  className='w-10 h-10 object-cover rounded-full'/>
                        <div className='flex-1'>
                            <p className='text-base text-ascent-1 font-medium'>
                                {friend?.firstName} {friend?.lastName}
                            </p>
                            <span className='text-sm text-ascent-2'>
                                {friend?.profession ?? "No Profession"}
                            </span>
                        </div>
                    {
                      user?._id === id &&
                        <Link to={`/Chat/${friend?._id}`} onClick={() =>handleClick(friend?._id)}>
                             <div className='pt-3 cursor-pointer'>
                                    {
                                      theme === "dark" ? <BsChatLeftDotsFill color={'white'} size={'22px'}/> :<BsChatLeftDotsFill  size={'22px'}/>
                                    }
                                      
                             </div>           
                          </Link>
                    }
                      
                   
                        
                        </Link>
                       
                          </>
                    ))
                }
              
                
         </div>
       </div>
    </div>
  )
}

export default FriendsCard
