import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Diferenciais from './components/Diferenciais';
import Jetskis from './components/Jetskis';
import Locais from './components/Locais';
import Galeria from './components/Galeria';
import Instagram from './components/Instagram';
import Testimonials from './components/Testimonials';
import Faq from './components/Faq';
import Location from './components/Location';
import Footer from './components/Footer';
import WhatsAppWidget from './components/WhatsAppWidget';

function App() {
  return (
    <div className="bg-navy min-h-screen">
      <Navbar />
      <main id="main">
        <Hero />
        <About />
        <Diferenciais />
        <Jetskis />
        <Locais />
        <Galeria />
        <Instagram />
        <Testimonials />
        <Faq />
        <Location />
      </main>
      <Footer />
      <WhatsAppWidget />
    </div>
  );
}

export default App;
