import React from 'react'
import './Card.css'
import { IoPlayCircleOutline } from "react-icons/io5";
import { RiCalendarScheduleFill } from "react-icons/ri";
import { FaCircleCheck } from "react-icons/fa6";
import vector6 from '../assets/Vector (6).png'
import div2 from '../assets/div (2).png'
import div3 from '../assets/div (3).png'
import div4 from '../assets/div (4).png'
import div5 from '../assets/div (5).png'
const Card3 = () => {
  return (
    <div className='feedback-resume'>
      <div className="fresume">
        <div className='fresume1'>
          <h2 className="">AI-Powered Interviews</h2>

        </div>
        <div className='resume22 airesume'>
          <div className='w-[100%] lg:w-[60%]'>
            <div className='feedback1'>

              <p>Experience structured, bias-free interviews evaluated by our advanced AI system. Get fair assessments and detailed feedback in real-time.</p>
              <div className="flex gap-15">
                <p className="flex items-center text-sm gap-2">
                  <FaCircleCheck /> Structure Format
                </p>
                <p className="flex items-center text-sm gap-2">
                  <FaCircleCheck /> Structure Format
                </p>
              </div>
              <div className="flex gap-15">
                <p className="flex items-center text-sm  gap-2">
                  <FaCircleCheck /> Structure Format
                </p>
                <p className="flex items-center text-sm  gap-2">
                  <FaCircleCheck /> Structure Format
                </p>
              </div>
              <div className='mt-4 flex items-center gap-4'>
                <button className=' flex items-center bg-[#2563EB] text-white text-sm rounded-lg cursor-pointer schedule'>
                  <RiCalendarScheduleFill className='' />
                  Schedule Demo
                </button>

                <button className='flex items-center bg-white text-black border-2 border-blue-500 rounded-lg font-bold cursor-pointer watch '><IoPlayCircleOutline className='text-3xl' />Watch how it works</button>
              </div>
            </div>
          </div>
          <div className='w-[100%] lg:w-[50%] lg:h-[90%] flex items-center gap-5 relative'>
            <img src={vector6} alt="" className='absolute bottom-72 right-15 w-25 hidden lg:block'/>
            <img src={vector6}alt="" className='absolute bottom-0 left-0 w-25 hidden lg:block'/>
            <div className='w-35 ai-powered '>
              <img src={div2} alt="" className='accuracy'/>
              <img src={div4} alt="" />
            </div>
            <div className='w-35'>
              <img src={div3} alt="" className='accuracy' />
              <img src={div5} alt="" />
            </div>
            
          </div>
        </div>



      </div>
    </div>
  )
}

export default Card3
