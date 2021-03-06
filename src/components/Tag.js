import React from 'react'
import { Link } from 'gatsby'

const Tag = ({ tag }) =>
    <Link className="tag-link" to={ `/tags/${ tag }` }>
        { tag }
    </Link>

export default Tag
