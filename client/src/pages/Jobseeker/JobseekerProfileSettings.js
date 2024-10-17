import React from 'react';
import Navigation from './Navigation';
import JobseekerProfileSection from './profile/JobseekerProfileSection';

const JobseekerProfileSettings = ()=> {
    return (
        <div className='jps-container'>
            <div className='jps-nav-bar'>
                <Navigation/>
            </div>
            <div className='jps-main-content'>
                <JobseekerProfileSection/>
            </div>
        </div>
    )
}

export default JobseekerProfileSettings;