import React, { useCallback, useEffect, useState } from 'react';

import {
    TextField,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    RadioGroup,
    FormControlLabel,
    Radio,
    Button,
    Box,
    Stack,
    FormLabel,
} from '@mui/material';
import HelmetTitle from '../../utility/HelmetTitle';
import SideButtons from '../../Shared/SideButtons';
import Caption from '../../utility/Caption';
import XcodesDropDown from '../../ReusableComponents/XcodesDropDown';
import { useAuth } from '../../Provider/AuthProvider';
import { handleApiRequest } from '../../utility/handleApiRequest';
import GenericList from '../../ReusableComponents/GenericList';
import { addFunction } from '../../ReusableComponents/addFunction';
import { validateForm } from '../../ReusableComponents/validateForm';
import Swal from 'sweetalert2';

const PdDependent = ({ xstaff, xname }) => {
    const { zid, zemail } = useAuth();
    const variant = 'outlined'

    const addEndpoint = 'api/dependent';
    const updateEndpoint = `api/dependent/update`;
    const deleteEndpoint = `api/dependent/delete/details`;
    const mainSideListEndpoint = `api/dependent/${zid}/paginated`;

    const [updateCount, setUpdateCount] = useState(0);
    const [isTyping, setIsTyping] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [selectedItem, setSelectedItem] = useState(null);
    const [refreshCallback, setRefreshCallback] = useState(null); // Store the refresh function
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const apiBaseUrl = `api/dependent/${zid}/rows`;
    const [formData, setFormData] = useState({
        zid: zid,
        zauserid: '',
        xstaff: '',
        xgender: '',
        xnid: '',
        xcontact: '',
        xrelation: '',
        xbirthdate: '',
        xname: '',
        xrow: ''


    });


    const handleDropdownSelect = (fieldName, value) => {
        setFormData((prevState) => ({
            ...prevState,
            [fieldName]: value,
        }));
    };


    const handleItemSelect = useCallback((item) => {
        setSelectedItem(item);
    }, []);

    useEffect(() => {
        if (selectedItem) {

            setFormData({
                ...selectedItem
            });
        }
    }, [selectedItem]);

    const handleRefresh = useCallback(() => {
        if (refreshCallback) {
            refreshCallback(); // Call the fetch function from the child
        }
    }, [refreshCallback]);

    useEffect(() => {

        if (refreshTrigger) {
            handleRefresh();
            setRefreshTrigger(false); // Reset trigger
        }
    }, [refreshTrigger, handleRefresh]);

    useEffect(() => {
        setRefreshTrigger(true);
    }, [updateCount]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => {
            const updatedData = { ...prev, [name]: value };
            return updatedData;
        });
        setIsTyping(true);
    };


    const handleAdd = async () => {

        const errors = validateForm(formData, ['xname','xrelation','xgender']);
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            Swal.fire({
                icon: 'error',
                title: 'Invalid Input',
                text: 'Please fix the errors before proceeding.',
            });
            return;
        }

        const endpoint = addEndpoint;
        const data = {
            ...formData,
            zemail: zemail,
            xstaff: xstaff,
            zid: zid
        };
        addFunction(data, endpoint, 'POST', (response) => {
            if (response && response.xrow) {
                console.log(response)
                setFormData((prev) => ({ ...prev, xrow: response.xrow }));
                setUpdateCount(prevCount => prevCount + 1);
                setFormErrors({});
            } else {
                // alert('Supplier added successfully.');
            }
        });
    };



    const handleUpdate = async () => {
        const errors = validateForm(formData, ['xdesc', 'xgitem']);
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            Swal.fire({
                icon: 'error',
                title: 'Invalid Input',
                text: 'Please fix the errors before proceeding.',
            });
            return;
        }
        setUpdateCount(prevCount => prevCount + 1);

        const tableName = "PdDependent";
        const updates = {
            xgender: formData.xgender,
            xnid: formData.xnid,
            xcontact: formData.xcontact,
            xrelation: formData.xrelation,
            xbirthdate: formData.xbirthdate,
            xname: formData.xname,



        };
        const whereConditions = { xstaff: formData.xstaff, xrow: formData.xrow, zid: zid };

        const data = {
            tableName,
            whereConditions,
            updates: updates,
        };


        const endpoint = updateEndpoint;

        await handleApiRequest({
            endpoint,
            data,
            method: 'PUT',
        });

        setFormErrors({});
    };


    const handleDelete = async () => {
        const endpoint = deleteEndpoint;
        const params = {
            zid: zid,
            column: 'xstaff',
            transactionNumber: formData.xstaff,
            row: formData.xrow
        };
    
        try {
            
            const response = await handleApiRequest({
                endpoint,
                method: 'DELETE',
                params: params,
            });
    
           
            setFormData({
                zauserid: '',
                xstaff: '',
                xgender: '',
                xnid: '',
                xcontact: '',
                xrelation: '',
                xbirthdate: '',
                xname: '',
                xrow: ''  // Ensure xrow is reset properly
            });
            setUpdateCount(prevCount => prevCount + 1);  
    
        } catch (error) {
          
            console.error("Delete failed:", error);
          
        }
    };
    



    const handleOnRefresh = useCallback((refreshFn) => {
        setRefreshCallback(() => refreshFn);
    }, []);


    return (
        <div className='grid grid-cols-12 gap-5 z-40'>
            <div className="">
                <SideButtons
                    onAdd={handleAdd}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                />
            </div>
            <div className='col-span-11 '>
                <div className='   rounded'>
                    <div className="w-full px-2  mx-auto  ">



                        <Box
                            display="grid"
                            gridTemplateColumns="repeat(2, 1fr)"
                            component="form"
                            sx={{
                                '& > :not(style)': { my: 1 },

                                mx: 'auto',
                                gap: 2,
                                mt: 1,
                                borderRadius: 2,
                                bgcolor: 'white',
                            }}
                            noValidate
                            autoComplete="off"

                        >
                            <Box sx={{
                                gridColumn: 'span 1',
                                border: '1px solid #ccc', // Light gray border
                                borderRadius: '8px', // Optional: Rounded corners
                                padding: 2,
                            }}>
                                <Caption title={"Family Information Detail of " + xname} />
                                <Box
                                    display="grid"

                                    gridTemplateColumns="repeat(2, 1fr)"
                                    gap={2}
                                    mt={2}
                                    mb={2} // margin-bottom
                                >

                                    <TextField
                                        label="Family member Name"
                                        name='xname'
                                        variant={variant}
                                        error={!!formErrors.xname}  
                                        helperText={formErrors.xname}
                                        size="small"
                                        // InputLabelProps={{
                                        //     shrink: true,
                                        //     sx: {
                                        //         fontWeight: 600, // Adjust font size here
                                        //     },

                                        // }}
                                        onChange={handleChange}
                                        value={formData.xname}
                                        fullWidth
                                        required
                                        sx={{
                                            '& .MuiInputLabel-root': {
                                                fontSize: '0.9rem',
                                            },
                                            '& .MuiInputBase-input': {
                                                fontSize: '0.9rem',
                                            },
                                        }}
                                    />

                                    <TextField
                                        label="Date of Birth"
                                        type="date"
                                        name='xbirthdate'
                                        size="small"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        onChange={handleChange}
                                        value={formData.xbirthdate}
                                        variant={variant}
                                        fullWidth

                                        // sx={{
                                        //     '& .MuiInputLabel-root': {
                                        //         fontSize: '0.9rem',
                                        //     },
                                        //     '& .MuiInputBase-input': {
                                        //         fontSize: '0.9rem',
                                        //     },
                                        // }}

                                    />
                                </Box>
                                <Box
                                    display="grid"
                                    gridTemplateColumns="repeat(2, 1fr)"
                                    gap={2}
                                    mb={2} // margin-bottom
                                >
                                    <XcodesDropDown
                                        id='xgender'
                                        name='xgender'
                                        variant={variant}
                                        label="Gender"
                                        size="small"
                                        // InputLabelProps={{
                                        //     shrink: true,

                                        // }}
                                        type="Gender"

                                        onSelect={(value) => handleDropdownSelect("xgender", value)}
                                        value={formData.xgender}
                                        // fontSize="0.9rem" 
                                        // captionSize="0.9rem"
                                        error={!!formErrors.xgender}  
                                        helperText={formErrors.xgender}


                                    />



                                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={2}>

                                        <XcodesDropDown
                                            variant={variant}
                                            label="Relation"
                                            size="small"
                                            // InputLabelProps={{
                                            //     shrink: true,

                                            // }}
                                            type="Relation"
                                            name='xrelation'
                                            onSelect={(value) => handleDropdownSelect("xrelation", value)}
                                            value={formData.xrelation}
                                            defaultValue=""
                                            error={!!formErrors.xrelation}  
                                            helperText={formErrors.xrelation}
                                        />

                                    </Stack>
                                </Box>

                                <Box
                                    display="grid"
                                    gridTemplateColumns="repeat(2, 1fr)"
                                    border
                                    gap={2}
                                    mb={2} // margin-bottom

                                >
                                    <TextField
                                        id='xnid'
                                        name='xnid'
                                        label="NID"
                                        size="small"
                                        // InputLabelProps={{
                                        //     shrink: true,
                                        //     sx: {
                                        //         fontWeight: 600
                                        //     }

                                        // }}
                                        onChange={handleChange}
                                        value={formData.xnid}
                                        variant={variant}
                                        fullWidth
                                        required
                                        // sx={{
                                        //     '& .MuiInputLabel-root': {
                                        //         fontSize: '0.9rem',
                                        //     },
                                        //     '& .MuiInputBase-input': {
                                        //         fontSize: '0.9rem',
                                        //     },
                                        //     gridColumn: 'span 1'
                                        // }}

                                    />

                                    <TextField
                                        label="Contact Number"
                                        variant={variant}
                                        size="small"
                                        // InputLabelProps={{
                                        //     shrink: true,
                                        //     sx: {
                                        //         fontWeight: 600
                                        //     }

                                        // }}
                                        fullWidth
                                        name='xcontact'
                                        onChange={handleChange}
                                        value={formData.xcontact}
                                        required
                                        // sx={{
                                        //     '& .MuiInputLabel-root': {
                                        //         fontSize: '0.9rem',
                                        //     },
                                        //     '& .MuiInputBase-input': {
                                        //         fontSize: '0.9rem',
                                        //     },

                                        // }}
                                    />

                                </Box>
                            </Box>
                            <Box sx={{
                                gridColumn: 'span 1',
                                border: '1px solid #ccc', // Light gray border
                                borderRadius: '8px', // Optional: Rounded corners
                                padding: 2,
                            }}>

                                <GenericList
                                    apiUrl={apiBaseUrl}
                                    caption="Dependents List"
                                    columns={[
                                       
                                        { field: 'xname', title: 'Name', width: '40%' },
                                        { field: 'xrelation', title: 'Relation', width: '30%' },
                                        { field: 'xcontact', title: 'Contact?', width: '30%', align: 'center' },
                                    ]}
                                    additionalParams={{
                                        zid: zid,
                                        column: 'xstaff',
                                        transactionNumber: xstaff
                                    }}
                                    onItemSelect={handleItemSelect}
                                    onRefresh={handleOnRefresh}
                                    captionFont="3.9rem"
                                    bodyFont=".9rem"


                                />

                            </Box>



                            {/* Row 1 */}



                        </Box>

                    </div>
                </div>
                <div>

                </div>



            </div>
        </div >
    );
};

export default PdDependent;
