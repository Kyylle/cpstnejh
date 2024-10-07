import api from './api';

const registerJobseeker = async (jobseekerData) => {
    try {
        const response = await api.post('/jobseeker', jobseekerData);
        return response.data;
    } catch (error) {
        console.error('Error during registration:', error);
        throw error; // Optionally rethrow the error to handle it in the calling code
    }
};


export default registerJobseeker;