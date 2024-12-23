import React, { useState, useEffect, useRef } from 'react';
import { Box, Paper, Typography, List, ListItem, ListItemText } from '@mui/material';

const DynamicDropdown = ({
    isOpen,
    onClose,
    dropdownPosition = { top: 0, left: 0, width: 200 },
    data = [],
    headers = [],
    onSelect,
    dropdownHeight = 400,
}) => {
    const dropdownRef = useRef(null);
    const [hoveredIndex, setHoveredIndex] = useState(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleOutsideClick);
        }
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const { top, left, width } = dropdownPosition;

    return (
        <Paper
            ref={dropdownRef}
            elevation={4}
            sx={{
                position: 'absolute',
                top: `${top}px !important`,
                left: `${left}px`,
                width: `${width}px`,
                maxHeight: '200px',
                overflowY: 'auto',
                zIndex: 1900,
                borderRadius: 2
            }}
        >
            {/* Header Row */}
            {headers.length > 0 && (
                <Box
                    sx={{
                        display: 'flex',
                        p: 1,
                        bgcolor: 'grey.200',
                        borderBottom: 1,
                        borderColor: 'divider',
                        fontWeight: 'bold',
                    }}
                >
                    {headers.map((header, index) => (
                        <Typography
                            key={index}
                            variant="subtitle2"
                            sx={{
                                flex: 1,
                                textAlign: 'left',
                                fontSize: '13px', // Reduced font size
                                pr: 1,
                            }}
                        >
                            {header}
                        </Typography>
                    ))}
                </Box>
            )}
            <List dense disablePadding>
                {data.map((item, index) => (
                    <ListItem
                        key={index}
                        button
                        onClick={() => onSelect(item)}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        sx={{
                            display: 'flex',
                            alignItems: 'flex-start', // Align text to the top for rows with variable height
                            bgcolor: hoveredIndex === index ? 'grey.300' : index % 2 === 0 ? 'white' : 'grey.50',
                            transition: 'background-color 0.3s ease',
                            px: 1,
                            py: 0.5,
                        }}
                    >
                        {Object.values(item).map((value, idx) => (
                            <ListItemText
                                key={idx}
                                primary={value}
                                primaryTypographyProps={{
                                    variant: 'body2',
                                    sx: {
                                        flex: 1,
                                        textAlign: 'left',
                                        fontSize: '13px', // Reduced font size
                                        pr: 1,
                                    },
                                }}
                                sx={{
                                    flex: 1,
                                }}
                            />
                        ))}
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
};

export default DynamicDropdown;
