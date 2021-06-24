import React from 'react'
import Helmet from 'react-helmet'
import appleIcon57 from '../favicons/apple-icon-57x57.png'
import appleIcon60 from '../favicons/apple-icon-60x60.png'
import appleIcon72 from '../favicons/apple-icon-72x72.png'
import appleIcon76 from '../favicons/apple-icon-76x76.png'
import appleIcon114 from '../favicons/apple-icon-114x114.png'
import appleIcon152 from '../favicons/apple-icon-152x152.png'
import appleIcon180 from '../favicons/apple-icon-180x180.png'
import androidChrome192 from '../favicons/android-chrome-192x192.png'
import favicon32 from '../favicons/favicon-32x32.png'
import favicon96 from '../favicons/favicon-96x96.png'
import favicon16 from '../favicons/favicon-16x16.png'

const TemplateWrapper = ({ children }) => (
  <div>
    <Helmet>
      <title>Unreal C++</title>
      <meta name='description' content='A tutorial site dedicated to using C++ in Unreal Engine 4. This site is meant for game developers wanting to learn how to begin using c++ in UE4.' />
      <meta name='keywords' content='unreal, engine, ue4, c++, cpp, game, development, harrison, mcguire' />
      <meta charSet='utf-8' />
      <meta name='theme-color' content='#663399' />

      <link rel='apple-touch-icon' sizes='57x57' href={appleIcon57} />
      <link rel='apple-touch-icon' sizes='60x60' href={appleIcon60} />
      <link rel='apple-touch-icon' sizes='72x72' href={appleIcon72} />
      <link rel='apple-touch-icon' sizes='76x76' href={appleIcon76} />
      <link rel='apple-touch-icon' sizes='114x114' href={appleIcon114} />
      <link rel='apple-touch-icon' sizes='120x120' href={appleIcon114} />
      <link rel='apple-touch-icon' sizes='144x144' href={appleIcon114} />
      <link rel='apple-touch-icon' sizes='152x152' href={appleIcon152} />
      <link rel='apple-touch-icon' sizes='180x180' href={appleIcon180} />

      <link rel='icon' type='image/png' sizes='192x192' href={androidChrome192} />
      <link rel='icon' type='image/png' sizes='32x32' href={favicon32} />
      <link rel='icon' type='image/png' sizes='96x96' href={favicon96} />
      <link rel='icon' type='image/png' sizes='16x16' href={favicon16} />

      <link rel='canonical' href='https://unrealcpp.com' />

      <script async src='https://www.googletagmanager.com/gtag/js?id=G-FNY55777ZG'></script>
    </Helmet>
    <Helmet
      script={[{ 
        type: 'text/javascript', 
        innerHTML: `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-FNY55777ZG');`
      }]}
    />
    <div>
      { children }
    </div>
  </div>
);

export default TemplateWrapper;
