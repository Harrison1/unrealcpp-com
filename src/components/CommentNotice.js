import React from 'react'

const CommentNotice = ({ video }) => 
    <div>
        <a href={`https://www.youtube.com/watch?v=${video}`} className="ytl-hov"><p className="youtube-link">Please leave any comments or feedback on the YouTube page</p></a>
    </div>

export default CommentNotice
