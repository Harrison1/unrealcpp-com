import React from 'react'
import moment from 'moment'

const Comment = ({ name, img, text, link, date }) => 
    <div className="yt-comment">
        <div className="author-thumbnail">
            <a href={ link } className="simple-endpoint">
                <img src={ img } className="comment-author-img" width="40" height="40" alt={ name} />
            </a>
        </div>
        <div className="comment-content">
            <div className="comment-header">
                <span>
                    <a href={ link } className="yt-comment-author">{ name }</a>
                </span>
                <span className="yt-comment-date">
                    { moment(date).startOf('hour').fromNow() }
                </span>
                <p dangerouslySetInnerHTML={ { __html: text } }></p>
            </div>
        </div>
    </div>

export default Comment