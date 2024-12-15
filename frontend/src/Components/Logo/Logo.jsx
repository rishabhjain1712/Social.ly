import React from 'react';
import '../../styles/Logo.css';

const Logo = ({size}) => {
  return (
    <h1 className='logo' style={{ fontSize: size}} onClick={() => window.location.reload()}>Social.ly</h1>
  );
};

export default Logo;
