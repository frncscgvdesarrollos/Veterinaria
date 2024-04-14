import React from 'react'

export default function layout({ children }) {
  return (
    <div className='bg-violet-300 p-5 min-h-screen container mx-auto  rounded-lg'>
        {children}
    </div>
  )
}
