import React from 'react';
import DarkVeil from './components/DarkVeil';
import InteractiveBlob from './components/InteractiveBlob';
import AnimatedContent from './components/AnimatedContent';
import FadeContent from './components/FadeContent';
import ParticleBackground from './components/ParticleBackground';
import LiquidBackground from './components/LiquidBackground';
import MagicalGradientBackground from './components/MagicalGradientBackground';
import ThreeScene from './components/ThreeScene';
import ImageCycler from './components/ImageCycler';
import './components/ImageCycler.css';

function App() {
  return (
    <div className="App">
      {/* Magical Gradient Background */}
      {/* <MagicalGradientBackground /> */}
      {/* <ParticleBackground /> */}

      {/* Header */}
      <header className="header">
        <AnimatedContent
          distance={10}
          direction="horizontal"
          reverse={false}
          duration={0.8}
          ease="power3.out"
          initialOpacity={0}
          animateOpacity
          scale={1.05}
          threshold={0.2}
          delay={0.3}>
          <div className="header-content">
            <button className="menu-toggle">
              <img src="http://localhost:3845/assets/3837ac9105cb0da4b7d3484845b1c5026fb5579e.svg" alt="Menu" />
            </button>
            <div className="logo">
              <img src="http://localhost:3845/assets/27d03463a798c29c5991d37b863cb140f9e8cf3d.svg" alt="Alley" className="logo-img" />
            </div>
            <a href="#contact" className="contact-link">Contact Us</a>
          </div>
        </AnimatedContent>
      </header>

      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <AnimatedContent
              distance={10}
              direction="horizontal"
              reverse={false}
              duration={0.8}
              ease="power3.out"
              initialOpacity={0}
              animateOpacity
              scale={1.05}
              threshold={0.2}
              delay={0.3}>
              <h1 className="hero-title">
                We create digital solutions that <strong>connect people </strong> to news, entertainment, and ideas.
              </h1>
            </AnimatedContent>

            <AnimatedContent
              distance={50}
              direction="vertical"
              reverse={false}
              duration={0.8}
              ease="power3.out"
              initialOpacity={0}
              animateOpacity
              scale={1.05}
              threshold={0.2}
              delay={0.3}
            >
              <div className="hero-image">
                <ImageCycler 
                  images={[
                    '/hero-images/ncoa-hero.png',
                    '/hero-images/vice-hero.png',
                    '/hero-images/hachette-hero-1.png',
                    '/hero-images/data-hero.png',
                    '/hero-images/hachette-hero.png',
                    '/hero-images/vice-hero-1.png',
                    '/hero-images/sciencenews-hero.png',
                  ]}
                  interval={1600}
                  className="hero-bg"
                />
              </div>
            </AnimatedContent>
          </div>
        </div>
      </section>

      {/* What We've Built Section */}
      <section className="projects">
        <div className="container">
          <AnimatedContent
            distance={100}
            direction="horizontal"
            reverse={true}
            duration={1.0}
            ease="power3.out"
            initialOpacity={0}
            animateOpacity
            threshold={0.1}
            delay={0.1}
          >
            <div className="section-header">
              <h2>What We've Built</h2>
              <div className="view-all-badge">VIEW ALL</div>
            </div>
          </AnimatedContent>

          <div className="projects-grid">
            <AnimatedContent
              distance={80}
              direction="horizontal"
              reverse={true}
              duration={0.9}
              ease="power3.out"
              initialOpacity={0}
              animateOpacity
              threshold={0.1}
              delay={0.2}
            >
              <div className="project-card">
                <div className="project-image-wrapper">
                  <img src="http://localhost:3845/assets/079a65832b104090d909305eb3534b2b53a15cc4.png" alt="Savage Ventures" className="project-image" />
                </div>
                <div className="project-info">
                  <h3>VICE</h3>
                </div>
              </div>
            </AnimatedContent>

            <AnimatedContent
              distance={80}
              direction="horizontal"
              reverse={false}
              duration={0.9}
              ease="power3.out"
              initialOpacity={0}
              animateOpacity
              threshold={0.1}
              delay={0.3}
            >
              <div className="project-card">
                <div className="project-image-wrapper">
                  <img src="http://localhost:3845/assets/08ab4df3bd6f6d250ef7055e43e31f5062b3778b.png" alt="NCOA" className="project-image" />
                </div>
                <div className="project-info">
                  <h3>ncoa</h3>
                </div>
              </div>
            </AnimatedContent>

            <AnimatedContent
              distance={80}
              direction="horizontal"
              reverse={true}
              duration={0.9}
              ease="power3.out"
              initialOpacity={0}
              animateOpacity
              threshold={0.1}
              delay={0.4}
            >
              <div className="project-card">
                <div className="project-image-wrapper">
                  <img src="http://localhost:3845/assets/38ea09fa109c19e7f9511e7db8c846f4e114f32c.png" alt="WPR" className="project-image" />
                </div>
                <div className="project-info">
                  <h3>WPR</h3>
                </div>
              </div>
            </AnimatedContent>

            <AnimatedContent
              distance={80}
              direction="horizontal"
              reverse={false}
              duration={0.9}
              ease="power3.out"
              initialOpacity={0}
              animateOpacity
              threshold={0.1}
              delay={0.5}
            >
              <div className="project-card">
                <div className="project-image-wrapper">
                  <img src="http://localhost:3845/assets/52d2501615d253d551aaf86fa75b8a9787e41273.png" alt="NCSES" className="project-image" />
                </div>
                <div className="project-info">
                  <h3>NCSES</h3>
                </div>
              </div>
            </AnimatedContent>

            <AnimatedContent
              distance={80}
              direction="horizontal"
              reverse={true}
              duration={0.9}
              ease="power3.out"
              initialOpacity={0}
              animateOpacity
              threshold={0.1}
              delay={0.6}
            >
              <div className="project-card">
                <div className="project-image-wrapper">
                  <img src="http://localhost:3845/assets/80b21953ca0ad571beae5065399b2a00bd52ab38.png" alt="Hachette" className="project-image" />
                </div>
                <div className="project-info">
                  <h3>Hachette</h3>
                </div>
              </div>
            </AnimatedContent>

            <AnimatedContent
              distance={80}
              direction="horizontal"
              reverse={false}
              duration={0.9}
              ease="power3.out"
              initialOpacity={0}
              animateOpacity
              threshold={0.1}
              delay={0.7}
            >
              <div className="project-card">
                <div className="project-image-wrapper">
                  <img src="http://localhost:3845/assets/b45ff6ab287af48eb9340251f09a4555dff1ee72.png" alt="TheWrap" className="project-image" />
                </div>
                <div className="project-info">
                  <h3>TheWrap</h3>
                </div>
              </div>
            </AnimatedContent>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="partners">
        <div className="container">

          <div className="partners-content">
            <AnimatedContent
              distance={60}
              direction="vertical"
              reverse={false}
              duration={0.8}
              ease="power3.out"
              initialOpacity={0}
              animateOpacity
              threshold={0.1}
              delay={0.1}
            >
              <div className="section-header">
                <h2>We care deeply about the long-term success of our partners.</h2>
              </div>
            </AnimatedContent>
            <div className="partners-logos">
              <div className="partners-row">
                <AnimatedContent
                  distance={50}
                  direction="vertical"
                  reverse={false}
                  duration={0.6}
                  ease="power3.out"
                  initialOpacity={0}
                  animateOpacity
                  threshold={0.1}
                  delay={0.2}
                >
                  <div className="partner-card glass-card">
                    <div className="logo-container">
                      <img src="/images/science-news-logo.png" alt="Science News" />
                    </div>
                  </div>
                </AnimatedContent>
                <AnimatedContent
                  distance={50}
                  direction="vertical"
                  reverse={false}
                  duration={0.6}
                  ease="power3.out"
                  initialOpacity={0}
                  animateOpacity
                  threshold={0.1}
                  delay={0.3}
                >
                  <div className="partner-card glass-card">
                    <div className="logo-container">
                      <img src="http://localhost:3845/assets/8b3b0e4231361f3dcd67aac86973de1969b57b85.svg" alt="Direct Relief" />
                    </div>
                  </div>
                </AnimatedContent>
                <AnimatedContent
                  distance={50}
                  direction="vertical"
                  reverse={false}
                  duration={0.6}
                  ease="power3.out"
                  initialOpacity={0}
                  animateOpacity
                  threshold={0.1}
                  delay={0.4}
                >
                  <div className="partner-card glass-card">
                    <div className="logo-container">
                      <img src="http://localhost:3845/assets/1642944defff67624b177d2510275fc939e248b6.svg" alt="DirectRelief" />
                    </div>
                  </div>
                </AnimatedContent>
              </div>
              <div className="partners-row">
                <AnimatedContent
                  distance={50}
                  direction="vertical"
                  reverse={false}
                  duration={0.6}
                  ease="power3.out"
                  initialOpacity={0}
                  animateOpacity
                  threshold={0.1}
                  delay={0.5}
                >
                  <div className="partner-card glass-card">
                    <div className="logo-container">
                      <img src="/images/science-news-logo.png" alt="Science News" />
                    </div>
                  </div>
                </AnimatedContent>
                <AnimatedContent
                  distance={50}
                  direction="vertical"
                  reverse={false}
                  duration={0.6}
                  ease="power3.out"
                  initialOpacity={0}
                  animateOpacity
                  threshold={0.1}
                  delay={0.6}
                >
                  <div className="partner-card glass-card">
                    <div className="logo-container">
                      <img src="http://localhost:3845/assets/8b3b0e4231361f3dcd67aac86973de1969b57b85.svg" alt="Direct Relief" />
                    </div>
                  </div>
                </AnimatedContent>
                <AnimatedContent
                  distance={50}
                  direction="vertical"
                  reverse={false}
                  duration={0.6}
                  ease="power3.out"
                  initialOpacity={0}
                  animateOpacity
                  threshold={0.1}
                  delay={0.7}
                >
                  <div className="partner-card glass-card">
                    <div className="logo-container">
                      <img src="http://localhost:3845/assets/1642944defff67624b177d2510275fc939e248b6.svg" alt="DirectRelief" />
                    </div>
                  </div>
                </AnimatedContent>
              </div>
              <div className="partners-row">
                <AnimatedContent
                  distance={50}
                  direction="vertical"
                  reverse={false}
                  duration={0.6}
                  ease="power3.out"
                  initialOpacity={0}
                  animateOpacity
                  threshold={0.1}
                  delay={0.5}
                >
                  <div className="partner-card glass-card">
                    <div className="logo-container">
                      <img src="/images/science-news-logo.png" alt="Science News" />
                    </div>
                  </div>
                </AnimatedContent>
                <AnimatedContent
                  distance={50}
                  direction="vertical"
                  reverse={false}
                  duration={0.6}
                  ease="power3.out"
                  initialOpacity={0}
                  animateOpacity
                  threshold={0.1}
                  delay={0.6}
                >
                  <div className="partner-card glass-card">
                    <div className="logo-container">
                      <img src="http://localhost:3845/assets/8b3b0e4231361f3dcd67aac86973de1969b57b85.svg" alt="Direct Relief" />
                    </div>
                  </div>
                </AnimatedContent>
                <AnimatedContent
                  distance={50}
                  direction="vertical"
                  reverse={false}
                  duration={0.6}
                  ease="power3.out"
                  initialOpacity={0}
                  animateOpacity
                  threshold={0.1}
                  delay={0.7}
                >
                  <div className="partner-card glass-card">
                    <div className="logo-container">
                      <img src="http://localhost:3845/assets/1642944defff67624b177d2510275fc939e248b6.svg" alt="DirectRelief" />
                    </div>
                  </div>
                </AnimatedContent>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Three.js Demo Section */}
      <section className="three-demo" style={{ margin: '50px 0' }}>
        <div className="container">

          {/* Existing Particle Scene */}
          <div style={{ height: '400px', width: '100%', border: '1px solid #333', marginBottom: '30px' }}>
            <ThreeScene />
          </div>

        </div>
      </section>
    </div>
  );
}

export default App;