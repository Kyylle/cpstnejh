import React from 'react';
import CompanyProfile from './CompanyProfile';
import CompanyFeeds from './CompanyFeeds';
import CompanyAnalytics from './CompanyAnalytics';
import './css/companyLayout.css';

const Layout = () => {
    return (
        <div className='employer-layout-container'>
            <div className='employer-left-column'>
                <CompanyProfile/>
            </div>
            <div className='employer-middle-column'>
                <CompanyFeeds/>
            </div>
            <div className='employer-right-column'>
                <CompanyAnalytics/>
            </div>
        </div>
    )
}

export default Layout;