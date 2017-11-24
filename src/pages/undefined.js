import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const UndefinedPage = () =>
    <div>
        <Navbar />
        <div className="home-template">
        
            <main id="site-main" className="site-main outer" role="main">
            
                <div className="inner">
                  <h1>Undefined Page</h1>
                  <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
                </div>
            </main>
        <Footer />
        </div>
    </div>

export default UndefinedPage