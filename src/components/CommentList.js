import React, { Component } from 'react'
import Comment from './Comment'
import keys from '../apikeys/keys.json'

class CommentList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            comments: [],
            zero: 'Loading ...'
        }
    }

    setStateAsync(state) {
        return new Promise((resolve) => {
            this.setState(state, resolve)
        });
    }

    // async componentDidMount() {
    //     const res = await fetch('https://www.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&order=relevance&videoId=' + this.props.video + '&key=' + keys.youtube)
    //     const comments = await res.json()
    //     const zero = await comments.items.length ? 'Loading ...' : 'O Comments'
    //     this.setState({
    //         comments: comments.items,
    //         zero: zero
    //     });
    // }

    render() {

        let commentList = null
        if (this.state.comments.length) {
            commentList = this.state.comments.map( comment => <Comment key={ comment.id } name={ comment.snippet.topLevelComment.snippet.authorDisplayName } img={ comment.snippet.topLevelComment.snippet.authorProfileImageUrl.replace('s28', 's48') } text={ comment.snippet.topLevelComment.snippet.textDisplay } link={ comment.snippet.topLevelComment.snippet.authorChannelUrl } date={ comment.snippet.topLevelComment.snippet.publishedAt } replies={ comment.hasOwnProperty('replies') ? comment.replies.comments : null } /> )
        } else {
            commentList = this.state.zero;
        }

        return (
            <div>
                <h3 className="mb-0">COMMENTS</h3>
                <p><a href="/" className="youtube-link">Please leave any comments or feedback on the YouTube page</a></p>
                <div>{ commentList }</div>
            </div>
        );
    }
}

export default CommentList