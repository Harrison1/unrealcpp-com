import React from 'react'

const AuthorCard = ({ image, name, website }) =>
  <section className="author-card">
    <div>
      <h3 className='tcenter'>Author</h3>
      <img className="author-profile-image" src={ image } alt={ name } />
    </div>
    <div className="author-card-content">
      <h4 className="author-card-name">{ name }</h4>
      <p className="twitter-handle"><a href={website}>harrisonmcguire.com</a></p>
    </div>
  </section>

export default AuthorCard
