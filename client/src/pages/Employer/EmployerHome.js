import React from 'react';
import Navigation from './Navigation';
import Layout from './Layout';
import './css/employerHome.css'
const EmployerHome = () => {
    return (
        <div className='employer-home-container'>

            <div> <Navigation/></div>
           <div className='home-layout-container'><Layout/></div>
            
        </div>
    )
}

export default EmployerHome;