import React, { Component } from 'react'
import Reply from './Reply'
import moment from 'moment'

class Comment extends Component {

    constructor(props) {
        super(props)
        this.state = {
            showReplies: false,
            showRepliesText: 'View Replies',
            hideRepliesText: 'Hide Replies'
        }

        this.toggleReplies = this.toggleReplies.bind(this);
    }

    toggleReplies() {
        this.setState(prevState => ({
            showReplies: !prevState.showReplies
        }))
    }

    handleClick() {
        this.setState(prevState => ({
          isToggleOn: !prevState.isToggleOn
        }));
    }

    render() {
            let replyList = null
            if (this.props.replies !== null  && this.props.replies.length) {
                replyList = this.props.replies.map( reply => <Reply key={ reply.id } name={ reply.snippet.authorDisplayName } img={ reply.snippet.authorProfileImageUrl } text={ reply.snippet.textDisplay } link={ reply.snippet.authorChannelUrl } date={ reply.snippet.publishedAt } /> )
            } else {
                replyList = null;
            }
            return (
                <div className="yt-comment-box">
                    <div className="yt-comment">
                        <div className="author-thumbnail">
                            <a href={ this.props.link } className="simple-endpoint">
                                <img src={ this.props.img } className="comment-author-img" width="40" height="40" alt={ this.props.name } />
                            </a>
                        </div>
                        <div className="comment-content">
                            <div className="comment-header">
                                <span>
                                    <a href={ this.props.link } className="yt-comment-author">{ this.props.name }</a>
                                </span>
                                <span className="yt-comment-date">
                                    { moment(this.props.date).startOf('hour').fromNow() }
                                </span>
                                <p dangerouslySetInnerHTML={ { __html: this.props.text } }></p>
                            </div>
                        </div>
                    </div>
                    { replyList !== null && replyList.length ?
                        <div>
                            <p className="reply-toggle" onClick={this.toggleReplies}>{this.state.showReplies ? this.state.hideRepliesText : this.state.showRepliesText}</p>
                            <div className={ "loaded-replies " + (this.state.showReplies ? "replies-show" : "replies-hidden") }>
                                { replyList }
                            </div>
                        </div>
                        :
                        <div></div>
                    }
                </div>
            )
    }
}

export default Comment