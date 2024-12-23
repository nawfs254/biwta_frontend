import React, { useEffect, useRef } from 'react';
import SideButtons from '../../Shared/SideButtons';
import HelmetTitle from '../../utility/HelmetTitle';
import { useState } from 'react';  // Make sure to import useState
import Caption from '../../utility/Caption';
import Swal from 'sweetalert2';

import SelectField from '../../formfield/SelectField';
import Checkbox from '../../formfield/Checkbox';

import { Box, FormControl, FormControlLabel, InputLabel, List, ListItem, ListItemText, MenuItem, Select, TextField } from '@mui/material';
import axios from 'axios';
import { handleApiRequest } from '../../utility/handleApiRequest';
import { useAuth } from '../../Provider/AuthProvider';
import axiosInstance from '../../Middleware/AxiosInstance';
import XcodesDropDown from '../../ReusableComponents/XcodesDropDown';



const Store = () => {
    const [searchResults, setSearchResults] = useState([]); // For search results
    const [isTyping, setIsTyping] = useState(false); // To handle typing state
    const [selectedCode, setSelectedCode] = useState(''); // To store selected code
    const [checked, setChecked] = useState(false);
    const [xtypeobj, setXtypeobj] = useState('');
    const [isListOpen, setListOpen] = useState(false)
    const listRef = useRef(null);
    const formRef = useRef(null);
    const [errors, setErrors] = useState({});
    const { zid } = useAuth();
    const [xtype, setXtype] = useState('Branch');
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
    const inputRef = useRef(null);
    const [formData, setFormData] = useState({
        zid: zid,
        xtype: 'Branch',
        xcode: '',
        xlong: '',
        xemail: '',
        xmadd: '',
        zactive: false,
        xtypeobj: '',
        xphone: '',


    });




    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
        if (name === 'xcode') {

            setIsTyping(true);
            fetchSearchResults(value);
        }
    };

    const handleDropdownSelect = (fieldName, value) => {
        setFormData((prevState) => ({
            ...prevState,
            [fieldName]: value,
        }));
    };

    const fetchSearchResults = async (query) => {
        if (!query) {
            setSearchResults([]);
            setListOpen(false);
            return;
        }
        try {
            const response = await axiosInstance.get(`api/xcodes/searchtext?zid=${zid}&xtype=${xtype}&searchText=${query}`)
            setSearchResults(response.data);
            setListOpen(true);
            if (inputRef.current) {
                const rect = inputRef.current.getBoundingClientRect();
                setDropdownPosition({
                    top: rect.bottom + window.scrollY,  // Position below the input field
                    left: rect.left + window.scrollX,   // Align it with the input field
                });
            }
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    };



   

    const handleResultClick = (result) => {
        const updatedZactive = result.zactive === 1 ? true : false;
        setChecked(updatedZactive);
    
        setFormData({
            ...formData,
            xcode: result.xcode,
            xlong: result.xlong,
            xemail: result.xemail,
            xtype: result.xtype,
            xphone: result.xphone,
            xmadd: result.xmadd,
            xtypeobj: result.xtypeobj, // Make sure this is set correctly
            zactive: updatedZactive,
        });
    
        // Trigger the dropdown to show the correct value
        setListOpen(false);
    };
    

    useEffect(() => {
        const handleClickOutside = (event) => {
            // if (listRef.current && !listRef.current.contains(event.target)) {
            if (formRef.current && !formRef.current.contains(event.target)) {
                setListOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);



    const handleTypeChange = (e) => {

        setFormData({
            ...formData,
            xtypeobj: e.target.value,
        });
    };






    const handleCheckboxChange = (event) => {
        setChecked(event.target.checked ? 1 : 0);

    };


    const handleAdd = async () => {
        const endpoint = 'api/xcodes';
        const data = {
            ...formData,
            zid: zid,
            xtype: 'Branch',
            zactive: checked
        };

        await handleApiRequest({
            endpoint,
            data,
            method: 'POST',
            onSuccess: (response) => {
                setErrors({});
                // setFormData({
                //     xcode: '',
                //     xlong: '',
                //     xmadd: '',
                //     xemail: '',
                //     xtypeobj: '',
                //     xphone: '',
                // });
                // setChecked(false);
            },
        });
    };



    const handleUpdate = async () => {
        const endpoint = `api/xcodes?zid=${zid}&xtype=Branch&xcode=${formData.xcode}`;
        const data = {
            ...formData,
            zid: zid,
            xtype: 'Branch',
            zactive: checked
        };

        await handleApiRequest({
            endpoint,
            data,
            method: 'PUT',
            onSuccess: (response) => {
                setErrors({});
            },
        });
    };

    const handleDelete = async () => {
        const endpoint = `/api/xcodes?zid=${zid}&xtype=${xtype}&xcode=${formData.xcode}`;
        await handleApiRequest({
            endpoint,
            method: 'DELETE',
            onSuccess: (response) => {
                setErrors({});
                setFormData({
                    xcode: '',
                    xlong: '',
                    xmadd: '',
                    xphone: '',
                    xtypeobj: '',
                    xtype: 'Branch',
                });
                setChecked(false);
            },
        });
    };


    const handleClear = () => {
        setFormData({
            xcode: '',
            xlong: '',
            xmadd: '',
            xphone: '',
            zactive: '',
            xemail: '',
            xtypeobj: '',
            xtype: 'Branch',
        });
        setChecked(false);
        alert('Form cleared.');
    };





    return (
        <div className=''>
            <HelmetTitle title="Store" />
            <div className='grid grid-cols-12'>
                <div className="">
                    <SideButtons
                        onAdd={handleAdd}
                        onUpdate={handleUpdate}
                        onDelete={handleDelete}
                        onClear={handleClear}
                    // onShow={handleShow}
                    />
                </div>



                <div className='col-span-11 '>

                    <div className='grid grid-cols-2'>
                        <div className='border shadow-lg border-black rounded'>
                            <div className="w-full px-2  py-2  mx-auto  ">
                                <Caption title={"Store Entry"} />
                                <Box
                                    component="form"
                                    sx={{
                                        '& > :not(style)': { my: 1 },
                                        // maxWidth: 500,
                                        mx: 'auto',
                                        // p: 3,
                                        // boxShadow: 3,
                                        display: 'grid',
                                        gap: 2,
                                        mt: 1,
                                        gridTemplateColumns: 'repeat(3, 1fr)',
                                        borderRadius: 2,

                                        bgcolor: 'white',
                                    }}
                                    noValidate
                                    autoComplete="off"

                                >

                                   
                                    {isListOpen && searchResults.length > 0 && (
                                        <div ref={formRef}
                                            style={{
                                                position: 'absolute',
                                                top: dropdownPosition.top, // Use the dynamic top position
                                                left: dropdownPosition.left,
                                                maxHeight: '400px',
                                                width: '600px',
                                                maxWidth: '500px',
                                                overflowY: 'auto',
                                                border: '1px solid black',
                                                borderRadius: '4px',
                                                backgroundColor: '#fff', // Solid white background
                                                zIndex: 100,
                                                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                                            }}
                                        >
                                            {/* Column Headers */}
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    padding: '10px',
                                                    fontWeight: 'bold',
                                                    backgroundColor: '#f0f0f0',
                                                    borderBottom: '1px solid gray',
                                                }}
                                            >
                                                <div style={{ flex: 1, textAlign: 'left' }}>Code</div>
                                                <div style={{ flex: 2, textAlign: 'left' }}>Name</div>
                                                <div style={{ flex: 1, textAlign: 'left' }}>Type</div>
                                            </div>

                                            {/* List Items */}
                                            <List>
                                                {searchResults.map((result, index) => (
                                                    <ListItem
                                                        key={index}
                                                        button='true'
                                                        onClick={() => handleResultClick(result)}
                                                        style={{ display: 'flex' }}
                                                    // sx={{border:1 }}
                                                    >
                                                        {/* Columns in List */}
                                                        <div style={{ flex: 1, textAlign: 'left' }}>{result.xcode}</div>
                                                        <div style={{ flex: 2, textAlign: 'left' }}>{result.xlong}</div>
                                                        <div style={{ flex: 1, textAlign: 'left' }}>{result.xtype}</div>
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </div>
                                    )}



                                    <TextField
                                        ref={inputRef}
                                        id="xcode"
                                        name="xcode"
                                        size="small"
                                        label="Branch Code"
                                        value={formData.xcode}
                                        onChange={handleChange}
                                        variant="outlined"
                                        // fullWidth
                                        sx={{ gridColumn: 'span 1' }}

                                    />
                                    <TextField
                                        id="xlong"
                                        name="xlong"
                                        label="Branch Name"
                                        size="small"
                                        value={formData.xlong}
                                        onChange={handleChange}
                                        variant="outlined"
                                        sx={{ gridColumn: 'span 2' }}
                                    />
                                    <TextField
                                        id="xphone"
                                        name="xphone"
                                        label="Phone"
                                        size="small"
                                        value={formData.xphone}
                                        onChange={handleChange}
                                        variant="outlined"
                                        sx={{ gridColumn: 'span 1' }}
                                    />
                                    <TextField
                                        id="xmadd"
                                        name="xmadd"
                                        label="Address"
                                        size="small"
                                        value={formData.xmadd}
                                        onChange={handleChange}
                                        variant="outlined"
                                        sx={{ gridColumn: 'span 2' }}
                                    />

                                    {/* <FormControl fullWidth sx={{ gridColumn: 'span 1' }}>
                                        <InputLabel id="demo-simple-select-label">Branch Type</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            name="xtypeobj"
                                            value={formData.xtypeobj}
                                            label="Branch Type"
                                            onChange={handleTypeChange}
                                            // sx={{ gridColumn: 'span 1' }}
                                            sx={{ width: '100%' }}
                                        >
                                            <MenuItem value={''}>Select</MenuItem>
                                            <MenuItem value={'Physical'}>Physical</MenuItem>
                                            <MenuItem value={'Virtual'}>Virtual</MenuItem>

                                        </Select>
                                    </FormControl> */}

                                    <XcodesDropDown
                                        id='xtypeobj'
                                        name='xtypeobj'
                                        variant='outlined'
                                        label="Store Type"
                                        // size="small"
                                        type="Store Type"
                                        // apiUrl={apiBaseUrl}
                                        onSelect={(value) => handleDropdownSelect("xtypeobj", value)}
                                        value={formData.xtypeobj} 

                                    />

                                    <TextField
                                        id="xemail"
                                        name="xemail"
                                        label="Email"
                                        size="small"
                                        value={formData.xemail}
                                        onChange={handleChange}
                                        variant="outlined"
                                        sx={{ gridColumn: 'span 2' }}
                                    />



                                    <Checkbox
                                        checked={checked}
                                        onChange={handleCheckboxChange}
                                        name="Activate?"
                                        color="primary"  // You can use 'primary', 'secondary', 'default' or 'error'
                                    />




                                </Box>

                            </div>
                        </div>
                        <div>

                        </div>
                    </div>


                </div>
            </div>
        </div>
    );
};

export default Store;