import React from 'react'
import HomeNav from './HomeNav'

const Header = ({ image, title, tagline }) => 
    <header className="site-header outer" style={{backgroundImage: 'url('+ image + ')'}}>
        <div className="inner">
            <div className="site-header-content">
                <h1 className="site-title">
                    { title }
                </h1>
                <h2 className="site-description">
                    { tagline }
                </h2>
                <a className="gdtactics" href="https://gdtactics.com/">vist <strong>GD Tactics</strong> for the latest</a>
            </div>
            <HomeNav />
        </div>
    </header>

export default Header
