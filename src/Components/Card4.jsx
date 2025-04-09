import React from 'react'
import './Card.css'
import div6 from '../assets/div (6).png'
import span from '../assets/span.png'
import i from '../assets/i.png'
import i1 from '../assets/i (1).png'
import i2 from '../assets/i (2).png'

const Card4 = () => {
  return (
    <div className='flex items-center justify-center'>
   
            <div className="w-[90%] max-w-[1000px] h-[800px] lg:h-[600px] flex flex-col items-center gap-5 shadow-lg rounded-md p-5 bg-white">
              <div className='resume1'>
              <h2 className="text-2xl font-bold leading-[70px]">Upcoming Customized Job Matches</h2>
              </div>

              <div className='w-[290px] h-[900px] lg:w-[960px] lg:h-[370px] shadow-2xl rounded-md flex items-center gap-15 card4Upcoming '>
              <div className='resume21 card4th '>
              <img src={span} alt="" className='relative bottom-42 left-99 hidden lg:block card4qicon'/>
              <img src={div6} alt="" className='relative w-63 lg:w-82 lg:top-1 right-16 lg:right-25'/>
              </div>
              
              <div>
                  <div className=' '>
                      <p className='lg:w-[350px] text-gray-600 text-md job'>Get matched with roles that align perfectly with your skills and experince</p>
                      <div className='flex justify-between gap-2'>
                      <h1 className=' rounded-lg bg-blue-100 text-sm flex items-center gap-2 new-job'><img src={i} alt="" />150+ New Matches</h1>
                      <h1 className=' rounded-lg bg-blue-100 text-sm flex items-center gap-2 new-job'><img src={i1} alt="" />Updated Daily</h1>
                      </div>
                      <h2 className=' rounded-lg size-fit bg-blue-100 text-sm flex items-center gap-2 new-job'><img src={i2} alt="" />95% Match Rate</h2>
                      
                      <button className='matches'>View All Matches</button>
                  </div>
              </div>
            </div>
          
          
      
          </div>
          </div>
  )
}

export default Card4