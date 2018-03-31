import React, { Component } from 'react'
import Comment from './Comment'
import keys from '../apikeys/keys.json'

const CommentNotice = ({video}) => 
    <div>
        <p><a href={`https://www.youtube.com/watch?v=${video}`} className="youtube-link">Please leave any comments or feedback on the YouTube page</a></p>
    </div>

export default CommentNotice