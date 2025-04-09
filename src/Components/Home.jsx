import React, { useEffect, useState } from 'react';
import HCard from './HCard';
import CardSlider from './CardSlider';
import BCard from './BCard';
import Footer from './Footer';
import Navbar from './Navbar';
import Login from './Login';
import image from '../assets/Mask group.png';
import image2 from '../assets/Mask group (2).png';
import image1 from '../assets/Mask group (1).png';
import svg from '../assets/svg.png';
import i3 from '../assets/i (3).png';
import ScrollToTopButton from './ScrolltoTopBtn';
import RecruiterRegister from './RecruiterRegister';

const Home = () => {
  const [visibleElements, setVisibleElements] = useState([false, false, false, false, false, false]);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    visibleElements.forEach((_, index) => {
      setTimeout(() => {
        setVisibleElements((prev) => {
          const newState = [...prev];
          newState[index] = true;
          return newState;
        });
      }, (index + 1) * 400);
    });
  }, []);

  // Disable scroll on body when modal is open
  useEffect(() => {
    if (showLoginModal) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [showLoginModal]);

  const openLoginModal = () => {
    setShowLoginModal(true);
  };

  const closeLoginModal = () => {
    setShowLoginModal(false);
  };

  return (
    <>
      <Navbar />
      <div className='w-full flex divafternav'>
        <div className='flex flex-col lg:flex-row lg:justify-between lg:items-center main w-[100%]'>

          {/* div1 */}
          <div className="hero-container w-[90%] lg:w-[50%] ">
            <h1 className="hero-title">
              UPGRADE YOUR HIRING <br />
              GAME WITH <br />
              <span className="highlight">MAITRI AI INTERVIEWER</span>
            </h1>
            <h2 className='text-lg lg:text-3xl mt font-medium lg:font-normal'>
              Transform recruitment with AI-driven automation,
              <span className="hidden lg:inline"><br /></span>
              smarter screening, and seamless hiring
            </h2>
            <div className='flex items-center justify-center lg:justify-start'>
              <button onClick={openLoginModal} className="hero-btn">Get started</button>
            </div>
          </div>

          {/* div2 */}
          <div className='w-full lg:w-[50%] mt-2 lg:mt-0 hidden lg:block'>
            <img src={image} alt="" className={`absolute top-40 right-100 lg:w-80 aiimg transition-opacity duration-1000 ${visibleElements[0] ? 'opacity-100' : 'opacity-0'}`} />
            <img src={image2} alt="" className={`absolute top-50 right-15 lg:w-80 aiimg transition-opacity duration-1000 ${visibleElements[1] ? 'opacity-100' : 'opacity-0'}`} />
            <img src={image1} alt="" className={`absolute top-120 right-75 aiimg transition-opacity duration-1000 ${visibleElements[2] ? 'opacity-100' : 'opacity-0'}`} />

            <div className={`transition-opacity duration-1000 ${visibleElements[3] ? 'opacity-100' : 'opacity-0'}`}>
              <h1 className='shadow-2xl text-gray-900 text-lg font-semibold absolute top-30 right-61 rounded-2xl padding'>
                24/7 Available <span className='flex text-gray-500 text-sm'>Always Ready</span>
                <img src={i3} alt="" className='absolute top-8 left-3' />
              </h1>
            </div>
            <div className={`transition-opacity duration-1000 ${visibleElements[4] ? 'opacity-100' : 'opacity-0'}`}>
              <h1 className='shadow-2xl text-gray-900 text-lg font-semibold bg-white absolute top-113 right-75 rounded-2xl padding'>
                Save 80% Time <span className='flex text-gray-500 text-sm'>In Hiring Process</span>
                <img src={i3} alt="" className='absolute top-8 left-3' />
              </h1>
            </div>
            <div className={`transition-opacity duration-1000 ${visibleElements[5] ? 'opacity-100' : 'opacity-0'}`}>
              <h1 className='shadow-2xl text-gray-900 text-lg font-semibold bg-white absolute top-140 right-165 rounded-2xl padding'>
                Ai-Powered<span className='flex text-gray-500 text-sm'>Smart Analysis</span>
                <img src={svg} alt="" className='absolute top-8 left-3' />
              </h1>
            </div>
          </div>

        </div>
      </div>

      <div className='hiring-process'>
        <h1 className='transform'>Transform Your Hiring Process</h1>
        <p>Streamline recruitment with AI-powered tools designed for modern business</p>
      </div>
      <HCard />

      <div className='feature'>
        <h3>Upcoming features</h3>
      </div>
      <CardSlider />

      <div className='work'>
        <div className='workhead'>
          <h3 className='text-blue-900 text-2xl lg:text-4xl font-bold'>See How It Works</h3>
          <p className='text-gray-500 text-lg lg:text-2xl '>Watch AI HR in Action</p>
        </div>
        <div className="w-[350px] h-[250px] lg:w-200 lg:h-100  mx-auto aspect-video rounded-lg overflow-hidden ">
          <iframe
            src="https://drive.google.com/file/d/12DTDxL5UgKXi-1iA7i9PkeX3A9DQHoLs/preview"
            className="w-[350px] h-[250px] lg:w-200 lg:h-100 border-none"
            allow="autoplay fullscreen"
          ></iframe>
        </div>
      </div>

      <ScrollToTopButton />
      <BCard />
      <Footer />

      {/* Modal Popup for Login */}
      {showLoginModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-white/10 backdrop-blur-md bg-opacity-50">
          <div className="relative bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-scroll scroll-smooth   popup"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <button
              onClick={closeLoginModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold cursor-pointer"
            >
              ✕
            </button>
            <div className="p-2">
              <Login initialActiveRole="login" />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
