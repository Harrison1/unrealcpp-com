import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import '../css/prism-okaidia.css'
import '../css/global.css'
import '../css/screen.css'

const TemplateWrapper = ({ children }) => (
  <div>
    <Helmet title="Unreal C++" />
    <div>{children()}</div>
  </div>
);

TemplateWrapper.propTypes = {
  children: PropTypes.func
};

export default TemplateWrapper;
