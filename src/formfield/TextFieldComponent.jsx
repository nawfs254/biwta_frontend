import React from 'react';
import TextField from '@mui/material/TextField';

function TextFieldComponent({ name, id, value, onChange, label, variant = "outlined", className, pattern }) {
    return (
        <TextField
            id={id}
            name={name}
            label={label}
            value={value}
            onChange={onChange}
            variant={variant} // Can be "outlined", "filled", or "standard"
            fullWidth
            margin="normal"
            className={className}
        />
    );
}

export default TextFieldComponent;
