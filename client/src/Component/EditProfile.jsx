import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
//icon
import {MdClose} from 'react-icons/md'
import Textinputs from './Textinputs'
import CustomButton from './CustomButton'
import Loading from './Loading'
import { UpdateProfile, login } from '../redux/UserSlice'
import { HandleFileUpload, requestApi } from '../utils'
//end
const EditProfile = () => 
   {
    const{user} =  useSelector((state) => state.user)
    const[picture , setPicture] =useState([])
    const[ErrMsg ,setErrMsg] = useState("")
    const[isSumbiting, setSubmiting] = useState(false)
    const[File , setFile] =useState(null)
    const dispatch = useDispatch()
   
    const{register, handleSubmit , formState:{errors}} = useForm({
      mode: 'onChange',
      defaultValues :{...user}
      })
  
      const HandlePostSubmit = () =>{}
      const handleclose = () =>{
        dispatch(UpdateProfile(false))
      }
      const onSubmit = async(data) =>{
        setSubmiting(true)
        setErrMsg("")
        try {
         const url = File && (await HandleFileUpload(File , "image") ) 
        const{firstName ,  lastName , location , profession} = data
  
         const res = await requestApi({
          url : "/users/update-user",
          data : {
            firstName,
            lastName,
            location,
            profileUrl : url? url : user?.profileUrl,
            profession,
            
          },
          token: user?.token,
          method : "PUT"
         })
         if(res?.status === 'failied'){
          setErrMsg(res)
         }else{
          setErrMsg(res)
         const newUser = {token : res?.token, ...res?.user}
           dispatch(login(newUser))
        
        
           setTimeout(() =>{
            dispatch(UpdateProfile(false))
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
                            EditProfile
                        </label>

                        <button 
                        className='text-ascent-1'
                        onClick={handleclose}>
                            <MdClose size={24}/>
                        </button>
                </div>
                <form  className='px-4 sm:px-8 flex flex-col gap-3 2xl:gap-6' autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
                  
                <Textinputs
                  label='firstName'
                  mt='mt-5'
                  name='firstName'
                  type="text"
                  placeholder="first Name"
                  styles='w-full '
                  LabelStyle = "ml-2 "
                  register = {register('firstName',{
                    required: "first name is required"
                  }) } 
                  error = {errors.Firstname  ? errors.Firstname.message : ''}/>
                  <Textinputs
                  label='LastName'
                  name='lastName'
                  mt='mt-5'
                  type="text"
                  placeholder="Last Name"
                  styles='w-full'
                  LabelStyle = "ml-2 "
                  register = {register('lastName',{
                    required: "Last name is required"
                  }) } 
                  error = {errors.Lastname  ? errors.Lastname.message : ''}/>

                  <Textinputs
                  label='Location'
                  name='location'
                  type="text"
                  mt='mt-5'
                  placeholder="location"
                  styles='w-full '
                  register = {register('location',{
                    required: "Location do not match"
                  }) } 
                  error = {errors.location  ? errors.location.message : ''}/>

          
                  <Textinputs
                  label='Profession'
                  name='profession'
                  type="text"
                  mt='mt-5'
                  placeholder="Profession"
                  styles='w-full'
                  register = {register('profession',{
                    required: "Profession is required"
                  }) }
                  error = {errors.profession  ? errors.profession.message : ''}/>
                     <label
                     htmlFor='imgUpload'
                     className='flex items-center gap-1 text-base text-ascent-2 hover:text to-ascent-1 cursor-pointer'>
                      <input 
                      type="file"
                      id='imgUpload'
                      onChange={(e)=> setFile(e.target.files[0])}
                      accept='.jpg, .png , .jpeg '
                      className='' 
                      data-max-size="5120"/>
                    </label>
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

export default EditProfile
