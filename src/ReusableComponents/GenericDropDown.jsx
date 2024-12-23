import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem, CircularProgress } from '@mui/material';
import axiosInstance from '../Middleware/AxiosInstance';
import { useAuth } from '../Provider/AuthProvider';

const GenericDropDown = ({
    variant = "outlined",
    value,
    api,
    label,
    xpkey,
    xskey,
    onSelect,
    defaultValue = '',
    fontSize = '0.875rem',
    span
}) => {
    const { zid } = useAuth();
    const [options, setOptions] = useState([]); 
    const [loading, setLoading] = useState(false); 
    const [selectedValue, setSelectedValue] = useState(defaultValue); 

    useEffect(() => {
        const fetchOptions = async () => {
            setLoading(true);
            try {
                const response = await axiosInstance.get(api);
                const data = response.data || [];
                console.log(data)
                setOptions(data); 
            } catch (error) {
                console.error(`Error fetching data:`, error);
            } finally {
                setLoading(false);
            }
        };
        fetchOptions();
    }, [api]);

    useEffect(() => {
        if (value !== undefined) {
            setSelectedValue(value); // Ensure the `value` prop is applied correctly
        }
    }, [value]);

    const handleChange = (event) => {
        const newValue = event.target.value;
        setSelectedValue(newValue); 
        if (onSelect) onSelect(newValue); 
    };

    return (
        <FormControl fullWidth variant={variant} size="small" 
        sx={{
            gridColumn: span ? `span ${span}` : 'span 1',
        }}
        >
            <InputLabel
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
                    sx={{
                        '& .MuiMenuItem-root': {
                            fontSize,
                        },
                        fontSize,
                    }}
                >
                    <MenuItem value="">
                        <span style={{ fontSize }}>Select {label}</span>
                    </MenuItem>
                    {options.map((option, index) => (
                        <MenuItem
                            key={index}
                            value={option[xpkey]}
                            sx={{
                                fontSize,
                            }}
                        >
                            {option[xpkey]}-{ option[xskey]}
                        </MenuItem>
                    ))}
                </Select>
            )}
        </FormControl>
    );
};

export default GenericDropDown;
