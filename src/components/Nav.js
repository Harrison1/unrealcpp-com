import React from 'react'
import Link from 'gatsby-link'
import githubLogo from '../img/github-icon-white.svg'
import youtubeLogo from '../img/youtube-logo.svg'

const Nav = ( { isHome } ) => 
    <nav className="site-nav">
        <div className="site-nav-left">
            <a className="site-nav-logo" href="/">U++</a>
            <ul className="nav" role="menu">
                <li role="menuitem">
                    <Link to="/">
                        Home
                    </Link>
                </li>
                <li role="menuitem">
                    <Link to="/tags">
                        Tags
                    </Link>
                </li>
                <li role="menuitem">
                    <a href="/">
                        Patreon
                    </a>
                </li>
            </ul>
        </div>
        <div className="site-nav-right">
            <a className="social-logo" href="https://www.youtube.com/c/HarrisonMcGuire" >
                <img src={ youtubeLogo } alt="youtube logo" />
            </a>
            <a className="social-logo" href="https://github.com/Harrison1/unrealcpp" >
                <img src={ githubLogo } alt="github logo" />
            </a>
        </div>
    </nav>

export default Nav