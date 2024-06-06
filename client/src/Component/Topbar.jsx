
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
//Ends
const Topbar = () => {
    const { user } = useSelector((state) => state.user);
    const { theme } = useSelector((state) => state.theme)
    const dispatch = useDispatch()
    const{register, handleSubmit , formState:{errors}} = useForm({
        mode: 'onChange'
        })



     const Handlesearch  = async (data) =>{
        await FetchPosts(user?.token , dispatch , "/posts/ " , data)
     }
     const handleTheme = () =>{
        const themeValue = theme === 'light' ? 'dark' : 'light'
        dispatch(SetTheme(themeValue))
     }
    const Logout =() =>{
        dispatch(logout())
    }
    return (
        <div className='topbar w-full flex items-center justify-between py-3 md:py-4 px-4 bg-primary'>
            <Link to={'/'} className='flex gap-2 items-center'>
                <div className='w-full flex gap-2 items-center'>
                    <div className='p-2 bg-[#065ad8] text-white rounded'>
                        <TbSocial/>
                    </div>
                    <span className=' text-[#065ad8] text-2xl font-semibold'>ShareEmo</span>
                </div>

            </Link>

            <form onSubmit={handleSubmit(Handlesearch)} className='hidden md:flex items-center justify-center mb-2'>
                 <Textinputs
                  placeholder="Search....."
                  styles='w-[18rem] lg:w-[30rem] rounded-l-full py-2'
                  register = {register('search',{ 
                  }) }
                 />
                 <CustomButton
                   type="submit"
                   containStyle='bg-[#0444a4] px-6 py-3 mt-2 text-white rounded-r-full'
                   title='Search'
                   onClick={() => {

                   }}/>
            </form>
            {/* Icon */}
            <div className='flex gap-4 items-center text-ascent-1 text-md md:text-lg'>
              <button onClick={() => handleTheme()}>

                {
                    theme ? <BsMoon/> : <BsSunFill/>
                }
                 </button>

            <div className='hidden lg:flex'>
                <IoMdNotificationsOutline/>
            </div>
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

export default Topbar
