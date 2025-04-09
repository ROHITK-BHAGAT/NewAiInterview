import React from 'react'
import Card1 from './Card1'
import Card2 from './Card2'
import Card3 from './Card3'
import Card4 from './Card4'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Card.css"; // We'll create this file for custom animations

const CardSlider = () => {
    const settings = {
        dots: false,
        infinite: true,
        speed: 1000,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000, // Increased to allow animation to complete
        fade: true, // Use fade transition
        cssEase: 'cubic-bezier(0.7, 0, 0.3, 1)', // Custom easing for smoother transition
        beforeChange: (current, next) => {
            // Add zoom-out class to current slide
            document.querySelector(`.slide-${current}`).classList.remove('zoom-in');
            document.querySelector(`.slide-${current}`).classList.add('zoom-out');
            
            // Prepare next slide with zoom-in class
            document.querySelector(`.slide-${next}`).classList.remove('zoom-out');
            document.querySelector(`.slide-${next}`).classList.add('zoom-in');
        },
        afterChange: (current) => {
            // Reset classes after transition
            document.querySelectorAll('.slide').forEach((slide, index) => {
                if (index !== current) {
                    slide.classList.remove('zoom-in', 'zoom-out');
                }
            });
        }
    };
    
    return (
        <>
        <div className='cardmaindiv'>
             <div className="slider-container" style={{ width: '100%', overflow: 'hidden' }}>
                <Slider {...settings}>
                    <div className="slide slide-0">
                        <Card1 />
                    </div>
                    <div className="slide slide-1">
                        <Card2 />
                    </div>
                    <div className="slide slide-2">
                        <Card3 />
                    </div>
                    <div className="slide slide-3">
                        <Card4 />
                    </div>
                </Slider>
            </div>
        </div>
        </>
    )
}

export default CardSlider