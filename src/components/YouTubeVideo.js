import React from 'react'

const YouTubeVideo = ({ id }) =>
    <div className="yt-video-wrapper">
        <iframe width="560" height="315" src={ "https://www.youtube.com/embed/"+ id } frameBorder="0" allowFullScreen></iframe>
  </div>

export default YouTubeVideo
