import React, { Component } from 'react'

class CommentLink extends Component {
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

        let list = null;
        if (this.state.comments.length) {
            list = this.state.comments.map( comment => <p key={ comment.id }>{ comment.snippet.topLevelComment.snippet.textDisplay }</p>)
        } else {
            list = 'No Comments';
        }

        return (
            <div>
                <h3 className="mb-0">COMMENTS</h3>
                <div>{ list }</div>
            </div>
        );
    }
}

// const CommentLink = ({ link }) =>
//     <div>
//         <h3 className="mb-0">COMMENTS</h3>
//         <a className="youtube-link" href={ link }>Please leave any comments or feedback on the YouTube Page</a>
//     </div>

export default CommentLink