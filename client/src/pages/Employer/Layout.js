import React from 'react';
import CompanyProfile from './CompanyProfile';
import CompanyFeeds from './CompanyFeeds';
import CompanyAnalytics from './CompanyAnalytics';
import './css/layout.css';

const Layout = () => {
    return (
        <div className='layout-container'>
            <div className='left-column'>
                <CompanyProfile/>
            </div>
            <div className='middle-column'>
                <CompanyFeeds/>
            </div>
            <div className='right-column'>
                <CompanyAnalytics/>
            </div>
        </div>
    )
}

export default Layout;