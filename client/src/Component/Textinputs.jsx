import React, { forwardRef } from 'react'
import { useSelector } from 'react-redux'

const Textinputs = forwardRef(({ type , label , LabelStyle , name , placeholder ,styles ,register , error ,mt}, ref) => {
   const { theme } = useSelector((state) => state.theme)
  return (
    <div className={`w-full flex flex-col mt-2 ${mt}`}>
      {
        label &&  <p className={`text-ascent-2 text-sm mb-2 ${LabelStyle}`}>{label}</p>
      }
    <div>
      <input 
      type={type}
      name={name}
      ref={ref}
      placeholder={placeholder}
      className={`bg-secondary rounded border ${theme === 'dark' ? 'border-[#66666609]': 'border-blue'} text-sm  outline-none placeholder:text-[#666] text-ascent-1 px-4 py-3  ${styles}`}
      {...register} 
      aria-invalid={error ? "true" : "false"}/>
      
    </div>
        {
          error && (
            <span className='text-xs text-[#f64949fe] mt-0.5'>{error}</span>
          )
        }
    </div>
  )
})

export default Textinputs
