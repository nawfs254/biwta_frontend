import React, { useState } from 'react';
import Box from '@mui/material/Box';

import Button from '@mui/material/Button';
import TextFieldComponent from '../formfield/TextFieldComponent';

function ExampleForm() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        address: '',
        city: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <Box
            component="form"
            sx={{
                '& > :not(style)': { m: 2 },
                maxWidth: 500,
                mx: 'auto',
                p: 3,
                boxShadow: 3,
                borderRadius: 2,
                bgcolor: 'white',
            }}
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit}
        >
            <TextFieldComponent
                id="firstName"
                name="firstName"
                label="First Name"
                value={formData.firstName}
                onChange={handleChange}
                variant="outlined"
            />
            <TextFieldComponent
                id="lastName"
                name="lastName"
                label="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                variant="outlined"
            />
            <TextFieldComponent
                id="phone"
                name="phone"
                label="Phone"
                value={formData.phone}
                onChange={handleChange}
                variant="outlined"
            />
            <TextFieldComponent
                id="address"
                name="address"
                label="Address"
                value={formData.address}
                onChange={handleChange}
                variant="outlined"
            />
            <TextFieldComponent
                id="city"
                name="city"
                label="City"
                value={formData.city}
                onChange={handleChange}
                variant="outlined"
            />
            <Button variant="contained" color="primary" type="submit">
                Submit
            </Button>
        </Box>
    );
}

export default ExampleForm;
