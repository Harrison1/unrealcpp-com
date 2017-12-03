import React from 'react'

const YouTubeVideo = ({ id }) =>
    <div className="gatsby-resp-iframe-wrapper" style={{ paddingBottom: "56.25%",  position: "relative",  height: "0", overflow: "hidden" }}>
        <iframe width="560" height="315" src={ "https://www.youtube.com/embed/"+ id } frameBorder="0" allowFullScreen style={{ position: "absolute", top: "0", left: "0", width: "100%", height: "100%" }}></iframe>
  </div>

export default YouTubeVideo