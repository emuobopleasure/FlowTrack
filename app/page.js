
import { DarkCta } from '@/components/landing/DarkCta'
import Hero from '@/components/landing/Hero'
import HowItWorks from '@/components/landing/HowItWorks'
import Services from '@/components/landing/Services'
import Footer from '@/components/layout/Footer'
import Navbar from '@/components/layout/Navbar'

const LandingPage = () => (
  <>
    <Navbar />
    <main>
      <Hero/>
      <Services />
      <HowItWorks />
      <DarkCta />
    </main>
    <Footer/>
  </>
)

export default LandingPage