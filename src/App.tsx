import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { NoirBand } from './components/NoirBand'
import { Products } from './components/Products'
import { Specs } from './components/Specs'
import { Calculator } from './components/Calculator'
import { Dealer } from './components/Dealer'
import { Faq } from './components/Faq'
import { CtaForm } from './components/CtaForm'
import { Footer } from './components/Footer'

export default function App() {
  return (
    <div id="top">
      <Nav />
      <main>
        <Hero />
        <NoirBand />
        <Products />
        <Specs />
        <Calculator />
        <Dealer />
        <Faq />
        <CtaForm />
      </main>
      <Footer />
    </div>
  )
}
