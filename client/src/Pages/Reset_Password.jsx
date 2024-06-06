
//Hooks
import { useForm } from "react-hook-form";
import React, { useState } from 'react'
//END
//Components
import { Textinputs ,CustomButton, Loading } from '../Component';
import { requestApi } from "../utils";
//End
function Reset_Password() {
  const[ErrMsg ,setErrMsg] = useState("")
  const[OnSumbit , SetSubmit] = useState(false)
  const{register, handleSubmit , formState:{errors},} = useForm({
    mode: 'onChange'
    })
  const onSubmit =  async (data) =>{
    SetSubmit(true)
    try {
     const res = await requestApi({
       url : "/users/request-passwordreset",
       data : data,
       method : "POST"
     })
     console.log(res , "response of user");
     console.log(res, "response");
     if(res?.status === 'failed'){
         setErrMsg(res)
        
     }else{
       setErrMsg(res)
     }
     SetSubmit(false)
    } catch (error) {
     SetSubmit(false)
     console.log(error);
    }
    
  }
  return (
    <div  className='w-full h-[100vh] bg-bgColor flex items-center justify-center p-6'>
      <div className='bg-primary w-full md:w-1/3 2xl:w-1/4 px-6 py-8 shadow-md rounded-lg'>
          <p className='text-ascent-1 text-lg font-semibold'>Email Adress</p>
          <span className='text-sm text-ascent-2'>
            Enter email adress used during registration
          </span>

          <form onSubmit={handleSubmit(onSubmit)} className='py-2  flex flex-col gap-5 '>
          <Textinputs
                  label='Email Address'
                  name='email'
                  type="email"
                  placeholder="#example@gmail.com"
                  styles='w-full '
                  register = {register('email',{
                    required: "Email Address is required"
                  }) } 
                  error = {errors.email  ? errors.email.message : ''}/>
                {
                    ErrMsg?.message && (
                        <span className={`text-sm mt-0.5 ${
                          ErrMsg.status ==="failed" ? 'text-[#f64949fe]' : 'text-[#2ba150fe]'
                        }`}>{ErrMsg.message}</span>
                    )
                  }

                  {
                    OnSumbit ? <Loading/> :
                   <CustomButton
                   type="submit"
                   containStyle='inline-flex w-full justify-center rounded-md text-sm px-8 py-3 bg-blue text-white font-medium outline-none mt-5'
                   title='Submit'
                   onClick={() => {

                   }}
                   />
                  } 
          </form>
      </div>
    </div>
  )
}

export default Reset_Password
