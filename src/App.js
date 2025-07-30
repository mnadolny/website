import React from 'react';
import DarkVeil from './components/DarkVeil';
import InteractiveBlob from './components/InteractiveBlob';

function App() {
  return (
    <div className="App">
      {/* Interactive Blob Background */}
      <InteractiveBlob />
      
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <button className="menu-toggle">
            <img src="http://localhost:3845/assets/3837ac9105cb0da4b7d3484845b1c5026fb5579e.svg" alt="Menu" />
          </button>
          <div className="logo">
            <img src="http://localhost:3845/assets/27d03463a798c29c5991d37b863cb140f9e8cf3d.svg" alt="Alley" className="logo-img" />
          </div>
          <a href="#contact" className="contact-link">Contact Us</a>
        </div>
      </header>

      {/* Hero Section with DarkVeil Background */}
      <section className="hero">
        <div className="hero-background">
          {/* DarkVeil temporarily disabled - causes content to disappear */}
        </div>
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              We create digital solutions that <strong>connect people </strong> to news, entertainment, and ideas.
            </h1>
            
            <div className="hero-image">
              <img src="http://localhost:3845/assets/def3681d9678932fb30e5cdae4a88f133b653965.png" alt="Digital Solutions" className="hero-bg" />
            </div>
          </div>
        </div>
      </section>

      {/* What We've Built Section */}
      <section className="projects">
        <div className="container">
          <div className="section-header">
            <h2>What We've Built</h2>
            <div className="view-all-badge">VIEW ALL</div>
          </div>
          
          <div className="projects-grid">
            <div className="project-card">
              <img src="http://localhost:3845/assets/079a65832b104090d909305eb3534b2b53a15cc4.png" alt="Savage Ventures" className="project-image" />
              <div className="project-info">
                <h3>Savage Ventures</h3>
              </div>
            </div>
            
            <div className="project-card">
              <img src="http://localhost:3845/assets/08ab4df3bd6f6d250ef7055e43e31f5062b3778b.png" alt="NCOA" className="project-image" />
              <div className="project-info">
                <h3>ncoa</h3>
              </div>
            </div>
            
            <div className="project-card">
              <img src="http://localhost:3845/assets/38ea09fa109c19e7f9511e7db8c846f4e114f32c.png" alt="WPR" className="project-image" />
              <div className="project-info">
                <h3>WPR</h3>
              </div>
            </div>
            
            <div className="project-card">
              <img src="http://localhost:3845/assets/52d2501615d253d551aaf86fa75b8a9787e41273.png" alt="NCSES" className="project-image" />
              <div className="project-info">
                <h3>NCSES</h3>
              </div>
            </div>
            
            <div className="project-card">
              <img src="http://localhost:3845/assets/80b21953ca0ad571beae5065399b2a00bd52ab38.png" alt="Hachette" className="project-image" />
              <div className="project-info">
                <h3>Hachette</h3>
              </div>
            </div>
            
            <div className="project-card">
              <img src="http://localhost:3845/assets/b45ff6ab287af48eb9340251f09a4555dff1ee72.png" alt="TheWrap" className="project-image" />
              <div className="project-info">
                <h3>TheWrap</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="partners">
        <div className="container">
          <p className="partners-text">We care deeply about the long-term success of our partners.</p>
          
          <div className="partner-logos-grid">
            <div className="partner-row">
              <div className="partner-logo">
                <img src="http://localhost:3845/assets/c5f27162936e61ec291a4485f2c5a10c1e263c4e.svg" alt="Science News" />
              </div>
              <div className="partner-logo">
                <img src="http://localhost:3845/assets/1642944defff67624b177d2510275fc939e248b6.svg" alt="DirectRelief" />
              </div>
              <div className="partner-logo">
                <img src="http://localhost:3845/assets/1642944defff67624b177d2510275fc939e248b6.svg" alt="New York Post" />
              </div>
            </div>
            <div className="partner-row">
              <div className="partner-logo">
                <img src="http://localhost:3845/assets/c5f27162936e61ec291a4485f2c5a10c1e263c4e.svg" alt="Science News" />
              </div>
              <div className="partner-logo">
                <img src="http://localhost:3845/assets/1642944defff67624b177d2510275fc939e248b6.svg" alt="DirectRelief" />
              </div>
              <div className="partner-logo">
                <img src="http://localhost:3845/assets/1642944defff67624b177d2510275fc939e248b6.svg" alt="New York Post" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;