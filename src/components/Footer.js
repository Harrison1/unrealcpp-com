import React from 'react'
import Link from 'gatsby-link'
import githubLogo from '../img/github-icon-white.svg'
import youtubeLogo from '../img/youtube-logo.svg'

const Footer = () =>
    <footer className="site-footer outer">
        <div className="site-footer-content inner">
            <section className="copyright">
                <Link to="/">UnrealCPP.com</Link> &copy; { (new Date()).getFullYear() }
            </section>
            <nav>
                <a className="social-logo" href="https://www.youtube.com/c/HarrisonMcGuire" >
                    <img src={ youtubeLogo } alt="youtube logo" />
                </a>
                <a className="social-logo" href="https://github.com/Harrison1/unrealcpp" >
                    <img src={ githubLogo } alt="github logo" />
                </a>
            </nav>
        </div>
    </footer>

export default Footer;

