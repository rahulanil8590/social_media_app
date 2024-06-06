import React from 'react'

function CustomButton({onClick , containStyle ,type ,iconRight , title}) {
  return (
    <div>
      <button
      type={type || 'button'}
      onClick={onClick}
      className={`inline-flex items-center text-base ${containStyle}`}
      >
        {title}

        {iconRight && <div className='ml-2'>{iconRight}</div>}
      </button>
    </div>
  )
}

export default CustomButton
