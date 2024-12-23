import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem, CircularProgress, FormHelperText } from '@mui/material';
import axiosInstance from '../Middleware/AxiosInstance';
import { useAuth } from '../Provider/AuthProvider';

const XlongDropDown = ({
    variant = "outlined",
    value, // Value passed down from parent
    label,
    type,
    onSelect,
    withXlong,
    fontWeight,
    defaultValue = '',
    fontSize = '0.9rem', // Default font size for options
    captionSize = '0.875rem', // Default font size for the label
    error, // error state passed from parent
    helperText,
}) => {
    const { zid } = useAuth();
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false); 
    const [selectedValue, setSelectedValue] = useState(defaultValue);


    useEffect(() => {
        const fetchOptions = async () => {
            setLoading(true);
            try {
                const response = await axiosInstance.get(`api/xcodes/search?zid=${zid}&xtype=${type}`);

                const data = response.data || [];
                setOptions(data); // Update state with API response
            } catch (error) {
                console.error(`Error fetching ${type} options:`, error);
            } finally {
                setLoading(false); 
            }
        };

        if (type) fetchOptions(); 
    }, [type, zid]); 


    useEffect(() => {
        if (value !== undefined) {
            setSelectedValue(value); 
        }
    }, [value]);

    // Handle selection change
    const handleChange = (event) => {
    
        const selectedXcode = event.target.value;
        const selectedOption = options.find(option => option.xcode === selectedXcode);
        setSelectedValue(selectedXcode); // Update selected value
        if (onSelect && selectedOption) {
            onSelect({ xcode: selectedXcode, xlong: selectedOption.xlong }); // Pass both xcode and xlong
        }
    };

    return (
        <FormControl fullWidth variant={variant} size="small">
            <InputLabel
            // shrink
                sx={{
                    fontSize: '1rem',
                    fontWeight: {fontWeight},

                }}
            >
                {label}

            </InputLabel>
            {loading ? (
                <CircularProgress size={24} sx={{ margin: 'auto' }} />
            ) : (
                <Select
                    value={selectedValue || ''} 
                    onChange={handleChange}
                    label={label}
                    // displayEmpty
                    sx={{
                        '& .MuiMenuItem-root': {
                            fontSize,
                        },
                        fontSize, // Apply fontSize to selected value in dropdown
                    }}
                >
                    <MenuItem value="">
                        <span style={{ fontSize }}>

                        </span>
                    </MenuItem>
                    {options.map((option, index) => (
                        <MenuItem
                            key={index}
                            value={option.xcode} // Use xcode as the value
                            sx={{
                                fontSize, // Apply fontSize to each menu item
                            }}
                            data-xlong={option.xlong} // Attach xlong to the menu item
                        >
                            {option.xcode}-{option.xlong}

                        </MenuItem>
                    ))}
                </Select>
            )}
            {error && helperText && <FormHelperText sx={{ color: 'red' }}>
                {helperText}
            </FormHelperText>}
        </FormControl>
    );
};

export default XlongDropDown;
