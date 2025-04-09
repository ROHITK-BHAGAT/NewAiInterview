import React from 'react'
import './HiringCard.css'


const HiringCard = (props) => {
  return (
    
    
    <div className={`card ${props.fourthCard}`}>
      <div className={`icon ${props.bgColor}`}>{props.icon} </div>
      <h2 className={`title ${props.title4}`}>{props.title}</h2>
      
      {props.isButton ? (
        <button className="btn1">{props.buttonText}</button>
      ) : (
        <p className="description">{props.descr}</p>
      )}
      
    </div>
    
  )
}

export default HiringCard
