import React, { Component } from 'react'
import Comment from './Comment'
import keys from '../apikeys/keys.json'

const CommentNotice = ({video}) => 
    <div>
        <a href={`https://www.youtube.com/watch?v=${video}`} className="ytl-hov"><p className="youtube-link">Please leave any comments or feedback on the YouTube page</p></a>
    </div>

export default CommentNotice