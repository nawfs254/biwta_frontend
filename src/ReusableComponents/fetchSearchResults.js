
import axiosInstance from '../Middleware/AxiosInstance';


export const fetchSearchResults = async (query, api, fieldConfig) => {
    if (!query) return []; 
    try {
        const url = api.replace('{query}', query); 
        const response = await axiosInstance.get(url);
        const filteredResults = response.data.map((item) => {
            const result = {};
            fieldConfig.forEach(({ field }) => {
                result[field] = item[field];
            });
            return result;
        });

        return filteredResults;
    } catch (error) {
        console.error('Error fetching search results:', error);
        throw error; 
    }
};
