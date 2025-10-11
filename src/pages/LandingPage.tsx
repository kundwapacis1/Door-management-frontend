
import Header from '../component/Header'
import { HeroSection } from '../component/Hero'
import AboutSection from '../component/aboutSection'
import ContactSection from '../component/contactSection'
import FooterSection from '../component/Footer'
import { useEffect } from 'react'


export default function LandingPage() {
  // Handle URL hash navigation
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      // Wait for components to render, then scroll
      setTimeout(() => {
        const element = document.getElementById(hash.substring(1));
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      }, 100);
    }
  }, []);

  return (
    <div>
      <Header/>
      <div id="hero-section" style={{ scrollMarginTop: '80px' }}>
        <HeroSection/>
      </div>
      <div className='px-[40px]'>
     <div id="about-section" style={{ scrollMarginTop: '80px' }}>
       <AboutSection/>
     </div>
     <div id="contact-section" style={{ scrollMarginTop: '80px' }}>
       <ContactSection/>
     </div>

      </div>
      <FooterSection/>
    </div>
  )
}
