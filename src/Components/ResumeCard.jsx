import React from 'react'
import logoimage from '../assets/react.svg';


const ResumeCard = () => {
    return (
        <div>
            <div className='dash1 shadow-lg'>


                <div className='flex items-center justify-start gap-32 resumeAnaly text-lg border-b border-gray-200'>
                    <div className='flex items-center'>
                        <img src={logoimage} alt="" className='border-2 border-black-300 rounded-full w-[40px] h-[40px]' /><span className='text-lg sam'>Sam</span>
                    </div>
                    <div>
                        <p>sam@gmail.com</p>
                        <p>1234567890</p>
                    </div>
                    <div>
                        <p>AI Expert</p>
                    </div>
                    <div>
                        <p>RESUME SLECTED</p>
                    </div>
                    <div>
                        <p>05/02/2025, 18:38:34</p>
                    </div>

                </div>


            </div>
        </div>
    )
}

export default ResumeCard
