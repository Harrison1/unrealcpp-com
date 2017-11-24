import React from 'react'
import Link from 'gatsby-link'

const Tag = ( { tag } ) =>
    <Link className="tag-link" to={ `tags/${ tag }` }>
        { tag }
    </Link>

export default Tag