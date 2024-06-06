import React, { useState } from 'react'
import { MdClose } from 'react-icons/md'
import { SocialMediaLink } from '../redux/UserSlice'
import { useDispatch, useSelector } from 'react-redux'
import Textinputs from './Textinputs'
import { useForm } from 'react-hook-form'
import { requestApi } from '../utils'
import CustomButton from './CustomButton'
import Loading from './Loading'

const SocialMediaLinkModal = ({mediaStatus}) =>{
        const{user} =  useSelector((state) => state.user)
        const[ErrMsg ,setErrMsg] = useState("")
        const[isSumbiting, setSubmiting] = useState(false)
        const dispatch = useDispatch()
       
        const{register, handleSubmit , formState:{errors}} = useForm({
          mode: 'onChange',
          
          })
      
          const HandlePostSubmit = () =>{}
          const handleclose = () =>{
            dispatch(SocialMediaLink(false))
          }
          const onSubmit = async(data) =>{
            const {instagram , twitter , facebook} = data
            console.log(data , "====social dasta");
            setSubmiting(true)
            setErrMsg("")
            try {
        
      
             const res = await requestApi({
              url : "/users/socialmediaLink",
              data : {
               instagram,
               twitter,
               facebook 
              },
              token: user?.token,
              method : "POST"
             })
             console.log(res,"=====res of social Media");
             if(res?.status === 'failied'){
              setErrMsg(res)
             }else{
              setErrMsg(res)
           
            
            
               setTimeout(() =>{
                dispatch(SocialMediaLink(false))
              },3000)
            
             }
             setSubmiting(false)
              
            } catch (error) {
              console.log(error);
              setSubmiting(false)
            }
          }
  return (
    <div className='fixed z-50 inset-0 overflow-y-auto'>
    <div className='flex items-center justify-center px-4 pb-20 pt-4 min-h-screen text-center sm:block sm:p-0'>
          <div className='fixed inset-0 transition-opacity'>
              <div className='absolute inset-0 bg-[#000] opacity-70'></div>
          </div>
          <span className='hidden sm:inline-block sm:align-middle sm:h-screen'>
          </span>
          &#8203;
          <div className='inline-block align-bottom bg-primary rounded-lg text-left sm:align-middle 
          shadow-xl overflow-hidden transform transition-all sm:max-w-lg sm:w-full sm:my-8 '
          role='dialog'
          aria-modal= "true"
          aria-labelledby='modal-headline'
          >
              <div className='flex justify-between px-6 pb-2 pt-5'>
                      <label 
                      htmlFor="name"
                      className='block font-medium text-base text-ascent-1 text-left'>
                         Add social media Link
                      </label>

                      <button 
                      className='text-ascent-1'
                      onClick={handleclose}>
                          <MdClose size={24}/>
                      </button>
              </div>
              <form  className='px-4 sm:px-8 flex flex-col gap-3 2xl:gap-6' autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
                
              
                <Textinputs
                label='Link'
                name='Link'
                mt='mt-5'
                type="text"
                placeholder="Link your Social Media Apps"
                styles='w-full'
                LabelStyle = "ml-2 "
                register = {register(`${mediaStatus}`,{
                  required: "Social Media Link is required"
                }) } 
                error = {errors.Lastname  ? errors.Lastname.message : ''}/>            
               
                  {
                  ErrMsg?.message && (
                      <span className={`text-sm mt-0.5 ${
                        ErrMsg.status ==="failed" ? 'text-[#f64949fe]' : 'text-[#2ba150fe]'
                      }`}>{ErrMsg.message}</span>
                  )
                }
                  <div className='py-5 sm:flex  sm:flex-row-reverse border-t border-[#66666645]'>
                {
                  isSumbiting ? <Loading/> :
                 <CustomButton
                 type="submit"
                 containStyle='inline-flex w-full justify-center rounded-md text-sm px-8 py-3 bg-blue text-white font-medium outline-none mt-5'
                 title='Submit'
                 onClick={() => {

                 }}
                 />
                }
                 </div>
                
          </form>
    </div>
  </div>
  </div>
  )
}

export default SocialMediaLinkModal
