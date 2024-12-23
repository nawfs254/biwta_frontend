import React, { useEffect, useState } from 'react';
import { Box, Typography, Divider } from '@mui/material';
import axiosInstance from '../Middleware/AxiosInstance';
import Caption from '../utility/Caption';

const GenericList = ({
    apiUrl,        // API endpoint for fetching data
    caption,       // Caption for the list
    columns,       // Array of column configurations (field and title)
    onItemSelect,  // Callback when an item is selected
    onRefresh,     // Callback for refreshing data
    additionalParams = {},
    captionFont,
    bodyFont,
    xclass
}) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);  // Add error state
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const handleMouseEnter = (index) => setHoveredIndex(index);
    const handleMouseLeave = () => setHoveredIndex(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);  // Reset error state on each fetch attempt
            const response = await axiosInstance.get(apiUrl, { params: additionalParams });
            console.log(response.data);  // Log the response for debugging

            // Assuming response.data.data holds the items, adjust if necessary
            setItems(response.data.data || response.data || []);
        } catch (error) {
            console.error('Error fetching list items:', error);
            setError('No Item Present');  // Set error state
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (onRefresh) {
            onRefresh(() => fetchData());
        }
    }, [onRefresh]);

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className={`${xclass} shadow-lg rounded`} style={{ overflowY: 'auto', borderRadius: '4px' }}>
            {/* Caption */}
            <Caption title={caption} />

            {/* Table Header */}
            {columns && columns.length > 0 && (
                <Box display="flex" justifyContent="space-between" mt={2} mb={1} borderBottom={1}>
                    {columns.map((col, idx) => (
                        <Typography
                            key={idx}
                            variant="subtitle1"
                            style={{ fontWeight: '', width: '20%' }}
                        >
                            {col.title}
                        </Typography>
                    ))}
                </Box>
            )}

            {/* Loading/Error/Content */}
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>{error}</p>  // Display error message if fetching fails
            ) : items.length === 0 ? (
                <p>No items available</p>
            ) : (
                <Box>


                    {items.map((item, index) => (
                        <div
                            key={index}
                            onClick={() => onItemSelect(item)}
                            onMouseEnter={() => handleMouseEnter(index)}
                            onMouseLeave={handleMouseLeave}
                            style={{
                                backgroundColor: hoveredIndex === index ? '#f0f0f0' : 'transparent',
                                cursor: 'pointer',
                                padding: '8px 0',
                            }}
                        >
                            <Box display="flex" justifyContent="space-between" mb={1}>
                                {columns.map((col, idx) => (
                                    <Box
                                        key={idx}
                                        flex={col.flex || '1'}
                                        sx={{
                                            width: col.width || 'auto',
                                            fontSize: captionFont || '0.875rem',
                                        }}
                                    >
                                        <Typography
                                            sx={{ fontSize: bodyFont }}
                                            variant="subtitle1"
                                            align={col.align || 'left'}
                                        >
                                          
                                            {item && item[col.field] !== undefined ? item[col.field] : 'N/A'}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                            {index < items.length - 1 && <Divider />}
                        </div>
                    ))}
               
                </Box>
            )}
        </div>
    );
};

export default GenericList;
