

import React from 'react'
import { ToolCard } from '../components/ToolCard'

export const Tools = () => {

    const tools = [
        {
            title:"CGPA Calculator",
            description:"Calculate your CGPA quickly using your semester grades and credits.",
            path:"/tools/cgpa-calculator"
        },
        {
            title:"Percentage Calculator",
            description:"Calculate percentage from marks easily.",
            path:"/tools/percentage-calculator"
        },
        {
            title:"Attendance Calculator",
            description:"Find your current attendance and calculate how many classes you need.",
            path:"/tools/attendance-calculator"
        },
        {
            title:"Age Calculator",
            description:"Calculate your exact age from your date of birth.",
            path:"/tools/age-calculator"
        },
        {
            title:"Study Timetable",
            description:"Create a simple study schedule based on your subjects and available time.",
            path:"/tools/timetable"
        }

    ]
    
    return (
        <section className='mx-auto max-w-7xl px-6 py-16 '>
            <div className='max-w-2xl'>
                <p className='text-sm font-semibold uppercase tracking-wide text-blue-600'>
                    Student Tools
                </p>
                <h1 className='mt-3 text-4xl font-bold '>
                    Tools Built For Everyday Student Life.
                </h1>
                <p className='mt-4 text-gray-600'>
                    Free, simple tools to help you calculate, plan and
                    organize your student life.
                </p>
            </div>
            <div className='mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
                {
                    tools.map((tool)=>(
                        <ToolCard 
                        key={tool.title}
                        title={tool.title}
                        description={tool.description}
                        path={tool.path}
                        />
                    )
                    )
                }
            </div>
        </section>
    )
}


