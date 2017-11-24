import React from 'react'
import Link from 'gatsby-link'

const PaginateLink = ({ tag, url, text }) => {
    if (!tag) {
        return <Link to={ url }>{ text }</Link>
    } else {
        return <span>{ text }</span>
    }
}

export default PaginateLink