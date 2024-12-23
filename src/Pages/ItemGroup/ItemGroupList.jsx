import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, Divider, Grid, Box, Typography } from '@mui/material';
import axios from 'axios';

const ItemGroupList = ({ xtype, apiBaseUrl, zid, onItemSelect, onRefresh, xcode, xlong }) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const fontSize = '0.875rem';
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const handleMouseEnter = (index) => {
        setHoveredIndex(index);
    };

    const handleMouseLeave = () => {
        setHoveredIndex(null);
    };

    const fetchData = async () => {
     
        try {
            const response = await axios.get(`${apiBaseUrl}/search?zid=${zid}&xtype=${xtype}`);
            setItems(response.data);
          
            setLoading(false);
        } catch (error) {
            console.error('Error fetching list items:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [apiBaseUrl, xlong, xcode]);

    useEffect(() => {
        if (onRefresh) {
            onRefresh(fetchData);
        }
    }, [onRefresh]);

    return (


        <div style={{ overflowY: 'auto', marginTop: '15px', borderRadius: '4px', }}>
            {/* Heading */}
            <Box display="flex" justifyContent="space-between" mb={1} borderBottom={1}>
                {/* Column Names */}
                <Typography variant="subtitle1" style={{ fontWeight: '', width: '20%' }}>
                    Code
                </Typography>
                <Typography variant="subtitle1" style={{ fontWeight: '', width: '25%' }}>
                    Name
                </Typography>
                <Typography variant="subtitle1" style={{ fontWeight: '', width: '20%' }}>
                    Type
                </Typography>
                <Typography variant="subtitle1" style={{ fontWeight: '', width: '20%' }}>
                    Nature
                </Typography>
                <Typography variant="subtitle1" style={{ fontWeight: '', width: '15%' }}>
                    Active?
                </Typography>
            </Box>

            {loading ? (
                <p>Loading...</p>
            ) : items.length === 0 ? (
                <p>No items available</p>
            ) : (
                <Box>
                    {items.map((item, index) => (
                        <div key={index} onClick={() => onItemSelect(item)}
                            onMouseEnter={() => handleMouseEnter(index)}
                            onMouseLeave={handleMouseLeave}
                            style={{
                                backgroundColor: hoveredIndex === index ? '#f0f0f0' : 'transparent',
                               
                                cursor: 'pointer',
                                
                            }}
                        >
                            <Box display="flex" justifyContent="space-between" mb={1}>
                                {/* Left side (item fields) */}
                                <Box flex="0 1 20%" style={{ width: 'auto',fontWeight: 'light', fontSize }}>
                                    <Typography sx={{fontSize }} variant="subtitle1" align="left">{item.xcode || 'N/A'}</Typography>
                                </Box>
                                <Box flex="0 1 25%" style={{ width: 'auto',fontWeight: 'light' }}>
                                    <Typography sx={{fontSize }} variant="subtitle1" align="left">{item.xlong || 'N/A'}</Typography>
                                </Box>
                                <Box flex="0 1 20%" style={{ width: 'auto' }}>
                                    <Typography sx={{fontSize }} variant="subtitle1" align="left">{item.xtypeobj || 'N/A'}</Typography>
                                </Box>
                                <Box flex="0 1 20%" style={{ width: 'auto' }}>
                                    <Typography sx={{fontSize }} variant="subtitle1" align="left">{item.xgtype || 'N/A'}</Typography>
                                </Box>
                                <Box flex="0 1 15%" style={{ width: 'auto' }}>
                                    <Typography sx={{fontSize }} variant="subtitle1" align="left">{item.zactive==='1'?'Yes':'No'}</Typography>
                                </Box>
                            </Box>
                            {index < items.length - 1 && <Divider />}
                        </div>
                    ))}
                </Box>
            )}
        </div>
    );
};

export default ItemGroupList;
