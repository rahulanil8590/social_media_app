
//ICON
import {TbSocial} from "react-icons/tb"
import {BsShare} from "react-icons/bs"
import {ImConnection} from "react-icons/im"
import {AiOutlineInteraction} from "react-icons/ai"
//END
//Assets
 import {BgImage} from "../Assets"
//Ends
//Hooks
import React, { useState } from 'react'
import {useDispatch} from 'react-redux'
import { useForm } from "react-hook-form";
import{Link} from 'react-router-dom'
//END
//Componet
import { Textinputs , CustomButton , Loading } from '../Component'
import { requestApi } from "../utils"
//END
function Register() {
  //Hook 
  const[ErrMsg ,setErrMsg] = useState("")
  const[OnSumbit , SetSubmit] = useState(false)
  const dispatch = useDispatch()
//End
  //FUNCTION
  const{register, handleSubmit , formState:{errors}, getValues} = useForm({
  mode: 'onChange'
  })

 const  onSubmit = async(data) =>{
  console.log(data , " data of user");
     SetSubmit(true)
     try {
      const res = await requestApi({
        url : "/auth/register",
        data : data,
        method : "POST"
      })
      console.log(res , "response of user");
      console.log(res, "response");
      if(res?.status === 'failed'){
          setErrMsg(res)
         
      }else{
        setErrMsg(res)
        setTimeout(() => {
          window?.location?.replace('/login')
        }, 5000);
      }
      SetSubmit(false)
     } catch (error) {
      SetSubmit(false)
      console.log(error);
     }
     
  }
  //END
  return (
    <div>
      <div className='bg-bgColor w-full h-[100vh] flex items-center justify-center p-6'>
      <div className='bg-primary w-full md:w-2/3 h-fit lg:h-full 2xl:h-5/6 py-6 lg:py-0 flex flex-row-reverse rounded-xl overflow-hidden shadow-xl'>
          {/* left */}
          <div className='w-full lg:w-1/2 h-full p-10 2xl:px-20  flex  flex-col justify-center '>
                  <div className='w-full flex gap-2 items-center mb-6'>
                            <div className='p-2 bg-[#065ad8] text-white rounded'>
                                <TbSocial/>
                            </div>
                            <span className=' text-[#065ad8] text-2xl font-semibold'>ShareEmo</span>
                  </div>
                <p className='text-ascent-1 text-base font-semibold'>Create your account</p>
                <form  className='py-8 flex flex-col ' autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
                  <div className="w-full flex flex-col lg:flex-row gap-1 md:gap-2">
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
                 </div>
                  <Textinputs
                  label='Email Address'
                  name='email'
                  type="email"
                  mt='mt-5'
                  placeholder="#example@gmail.com"
                  styles='w-full '
                  register = {register('email',{
                    required: "Email Address is required"
                  }) } 
                  error = {errors.email  ? errors.email.message : ''}/>

          <div className="w-full flex flex-col lg:flex-row gap-1 md:gap-2">
                  <Textinputs
                  label='Password'
                  name='password'
                  type="password"
                  mt='mt-5'
                  placeholder="Create a strong Password"
                  styles='w-full'
                  register = {register('password',{
                    required: "Password is required"
                  }) }
                  error = {errors.password  ? errors.password.message : ''}/>
                 <Textinputs
                  label='Comform-password'
                  name='Cpassword'
                  type="password"
                  mt='mt-5'
                  placeholder="Comform Password"
                  styles='w-full'
                  register = {register('Cpassword',{
                    validate : (value) =>{
                      const{password} = getValues()

                      if(password !== value){
                        return " Password do not match"
                      }
                    }
                  }) }
                  error = {errors.Cpassword && errors.Cpassword.type === "validate"  
                  ? errors.Cpassword.message : ''}/>
                  </div>
                  {
                    
                    ErrMsg?.message && (
                        <span className={`text-sm mt-0.5 ${
                          ErrMsg.status ==="failed" ? 'text-[#f64949fe]' : 'text-[#2ba150fe]'
                        }`}>{ErrMsg?.message}</span>
                    )
                  }

                  {
                    OnSumbit ? <Loading/> :
                   <CustomButton
                   type="submit"
                   containStyle='inline-flex w-full justify-center rounded-md text-sm px-8 py-3 bg-blue text-white font-medium outline-none mt-5'
                   title='Create a Account'
                   onClick={() => {

                   }}
                   />
                  }
                  
                </form>
                <p className="text-sm text-center text-ascent-2">
                  Already has aa account ?{""}
                  <Link 
                  to={'/login'}
                  className="text-[#065ad8] ml-2 cursor-pointer font-semibold">
                   login
                  </Link>
                </p>
          </div>
          {/* Rigth */}
          <div className="hidden w-1/2 lg:flex h-full flex-col items-center justify-center bg-blue ">
             <div className="relative w-full flex items-center justify-center">
                  <img src={BgImage} alt="bgImage" className="w-48 2xl:w-64 h-48 2xl:h-64 object-cover rounded-full" />
                  <div className="absolute bg-white flex gap-1 items-center rounded-lg py-2 px-5 right-5 top-12">
                      <BsShare size={12}/>
                      <span className="text-xs font-medium">Share</span>
                  </div>
                  <div className="absolute bg-white flex gap-1 items-center rounded-lg py-2 px-5 left-10 top-6">
                      <ImConnection/>
                      <span className="text-xs font-medium">Connect</span>
                  </div>
                  <div className="absolute bg-white flex gap-1 items-center rounded-lg py-2 px-5 left-11 bottom-6">
                     <AiOutlineInteraction />
                      <span className="text-xs font-medium">Interact</span>
                  </div>
                  
             </div>
             <div className="mt-16 items-center">
                      <p className="text-base text-white">Connect with friend and have share for fun </p>
                      <span className="text-sm text-white/80 ml-5">Share memories with friend and the world</span>
                  </div>
          </div>
      </div>
    </div>
    </div>
  )
}

export default Register
