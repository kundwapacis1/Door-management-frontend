
import Header from '../component/Header'
import { HeroSection } from '../component/Hero'
import AboutSection from '../component/About'
import ContactSection from '../component/Contact'
import FooterSection from '../component/Footer'


export default function LandingPage() {
  return (
    <div>
      <Header/>
      <HeroSection/>
      <div className='px-[40px]'>
     <AboutSection/>
      <ContactSection/>

      </div>
      <FooterSection/>
    </div>
  )
}
