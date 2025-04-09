import React from 'react'
import './HiringCard.css'

const BenefitCard = (props) => {
  return (
    <div className="benefit-card">
      <div className={`iconB ${props.bgColor}`}>{props.icon}</div>
      <h2 className="title">{props.title}</h2>
      <p className="description decB">
        {props.descr}
      </p>
    </div>
  )
}

export default BenefitCard
