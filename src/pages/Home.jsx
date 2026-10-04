

import React from 'react'

export const Home = () => {
  return (
    <section className='mx-auto max-w-7xl  px-6 py-20'>
        <div className='max-w-3xl'>
            <p className='mb-4 text-sm font-semibold uppercase tracking-wide text-blue-600'>
                Build for Students
            </p>
            <h1 className='text-5xl font-bold tracking-tight'>
                Simple Tools for smarter student life.
            </h1>
            <p className='mt-6 text-lg text-gray-600'>
                Calculate your CGPA, check attendance, plan your
                study schedule, build your resume, and more.
            </p>
            <div className='mt-6 flex gap-4'>
                <a 
                href="/tools"
                className='rounded-lg bg-black px-6 py-3 font-medium text-white'
                >
                    Tools
                </a>
                <a href="/resume-builder"
                className='rounded-lg border font-medium px-6 py-3'
                >
                    Build Resume
                </a>
            </div>
        </div>
    </section>
  )
}
