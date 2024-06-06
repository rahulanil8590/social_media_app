//Hooks
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
//Ends
//icons
import { TbSocial } from 'react-icons/tb';
import {BsMoon, BsSunFill} from 'react-icons/bs'
import {IoMdNotificationsOutline} from "react-icons/io"
//ENds

//Components
import { Textinputs , CustomButton  } from '../Component'
import {SetTheme}from '../redux/themeSlice'
import {logout} from '../redux/UserSlice'
import { FetchPosts } from '../utils';
import { Noprofile } from '../Assets';
//Ends

const ChatBar = ({receiver , online}) => {
    console.log(receiver , " receiver");
    const { user } = useSelector((state) => state.user);
    const { theme } = useSelector((state) => state.theme)
    const dispatch = useDispatch()
   



    
     const handleTheme = () =>{
        const themeValue = theme === 'light' ? 'dark' : 'light'
        dispatch(SetTheme(themeValue))
     }
    const Logout =() =>{
        dispatch(logout())
    }
  return (
    <div className='topbar w-full flex items-center justify-between py-3 md:py-4 px-4 bg-primary'>
            <Link to={"/profile/" + receiver?._id}
                className='flex gap-2'>
                    <img src={receiver?.profileUrl ?? Noprofile} alt={receiver?.email} className='w-14 h-14 object-cover rounded-full' />
                    <div className='flex flex-col justify-center mx-2'>
                        <p className='text-lg font-medium text-ascent-1'>{receiver?.firstName} {receiver?.lastName}</p>
                        <span className='text-ascent-2 '>{`${online ? 'online' : `offline`}`}</span>
                    </div>
                    
                </Link>

            
            {/* Icon */}
            <div className='flex gap-4 items-center text-ascent-1 text-md md:text-lg'>
              <button onClick={() => handleTheme()}>

                {
                    theme ? <BsMoon/> : <BsSunFill/>
                }
                 </button>

                <div>
                    <CustomButton
                    title='Log out'
                    containStyle = 'text-sm text-ascent-1 px-4 md:px-6 py-1 md:py-2 border border-[#666] rounded'
                    onClick={() => Logout() } />                      
                </div>
            </div>
        </div>
  )
}

export default ChatBar
