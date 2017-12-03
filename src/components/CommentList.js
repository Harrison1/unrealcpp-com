import React, { Component } from 'react'
import Comment from './Comment'

class CommentList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comments: []
        };
    }

    setStateAsync(state) {
        return new Promise((resolve) => {
            this.setState(state, resolve)
        });
    }

    async componentDidMount() {
        const res = await fetch('')
        const comments = await res.json()
        this.setState({
            comments: comments.items
        });
    }

    render() {

        let commentList = null;
        if (this.state.comments.length) {
            commentList = this.state.comments.map( comment => <Comment key={ comment.id } name={ comment.snippet.topLevelComment.snippet.authorDisplayName } img={ comment.snippet.topLevelComment.snippet.authorProfileImageUrl.replace('s28', 's48') } text={ comment.snippet.topLevelComment.snippet.textDisplay } link={ comment.snippet.topLevelComment.snippet.authorChannelUrl } date={ comment.snippet.topLevelComment.snippet.publishedAt }/> )
            console.log(this.state.comments)
        } else {
            commentList = 'Loading ...';
        }

        return (
            <div>
                <h3 className="mb-0">COMMENTS</h3>
                <p><a href="/" className="youtube-link">Please leave any comments or feedback on the YouTubePage</a></p>
                <div>{ commentList }</div>
            </div>
        );
    }
}

export default CommentList