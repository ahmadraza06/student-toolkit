import React from 'react'
import { Link } from 'react-router-dom'

export const ToolCard = ({title,description , path}) => {
  return (
    <div className='rounded-2xl bg-white border p-6 shadow-sm transition  hover:translate-y-1 hover:shadow-md'>
        <h3 className='text-xl font-semibold ' >{title}</h3>
        <p className='mt-2 leading-6 text-sm text-gray-600'>{description}</p>
        <Link
        className='mt-5 inline-block rounded-lg bg-black px-4 py-2 text-sm font-medium text-white '
        to={path}>
            Use Tool
        </Link>
    </div>
  )
}


