import React from 'react'
import './Footer.css'
const Footer = () => {
  return (
    <>
    <div className='main-div'>
    <div className='main-div1'>
      <div className='community'>
        <h2>Join Our AI Community</h2>
        <p>Get the latest in AI-driven hiring. Be the first to know about updates.</p>
      </div>
      <div>
        <input type="text" placeholder='Enter your email' className='footer-input'/>
        <button className='sub cursor-pointer'>Subscribe</button>
      </div>
    </div>
    </div>

    <footer class="footer">
    <div class="container">
        
        <div class="footer-section">
            <h3>Quick Links</h3>
            <ul>
                <li><a href="#">Home</a></li>
                <li><a href="#">Features</a></li>
                <li><a href="#">Contact Us</a></li>
            </ul>
        </div>

       
        <div class="footer-section">
            <h3>Company</h3>
            <ul>
                <li><a href="#">Case Studies</a></li>
                <li><a href="#">AI Hiring Guide</a></li>
                <li><a href="#">Privacy Policy</a></li>
            </ul>
        </div>

     
        <div class="footer-section">
            <h3>Support</h3>
            <ul>
                <li><a href="#">Help Center</a></li>
                <li><a href="#">Request a Demo</a></li>
                <li><a href="#">Partner With Us</a></li>
            </ul>
        </div>

        
        <div class="footer-section">
            <h3>Stay Connected</h3>
            <div class="social-icons">
                <a href="https://www.linkedin.com/company/maitriai/posts/?feedView=all" target="_blank" className='footer-icon bg-[#EFF6FF] rounded-lg'><i class="fab fa-linkedin"></i></a>
                {/* <a href="#" className='footer-icon bg-[#EFF6FF] rounded-lg'><i class="fab fa-twitter"></i></a> */}
                <a href="https://www.instagram.com/maitriai_official?igsh=dXFkdGcxaXZma216" target="_blank" className='footer-icon bg-[#EFF6FF] rounded-lg'><i class="fab fa-instagram"></i></a>
                
            </div>
        </div>
    </div>

    <hr class="footer-line"/>

    
    <div class="bottom-footer">
        <p>@ 2025 AI Hiring Platform. All rights reserved.</p>
        <div class="footer-links">
            <a href="#">Terms</a>
            <a href="#">Privacy</a>
            <a href="#">Cookies</a>


        </div>
    </div>
</footer>

    </>
  )
}

export default Footer
