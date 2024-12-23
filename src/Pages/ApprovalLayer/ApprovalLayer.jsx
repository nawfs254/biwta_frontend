import React, { useCallback, useEffect, useRef, useState } from 'react';

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

import Swal from 'sweetalert2';
import SideButtons from "../../Shared/SideButtons"
import Caption from "../../utility/Caption"
import SortableList from "../../ReusableComponents/SortableList"
import { useAuth } from '../../Provider/AuthProvider';
import XcodesDropDown from '../../ReusableComponents/XcodesDropDown';
import DynamicDropdown from '../../ReusableComponents/DynamicDropdown';
import { validateForm } from '../../ReusableComponents/validateForm';
import { addFunction } from '../../ReusableComponents/addFunction';
import { handleApiRequest } from '../../utility/handleApiRequest';
import { handleSearch } from '../../ReusableComponents/handleSearch';
import axiosInstance from '../../Middleware/AxiosInstance';
const ApprovalLayer = () => {

    const variant = 'outlined'
    const { zid, zemail } = useAuth();
    const fieldConfig = [
        { header: 'Row', field: 'xrow' },
        { header: 'Process Type', field: 'xtypetrn' },
        { header: 'Number of Signatory', field: 'xnofsignatory' },
    ];
    const triggerRef = useRef(null);
    const [formErrors, setFormErrors] = useState({});
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [updateCount, setUpdateCount] = useState(0);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
    const baseUrl = axiosInstance;
    const [formData, setFormData] = useState({
        zid: zid,
        zauserid: '',
        xrow: '',
        xtypetrn: '',
        xnofsignatory: '',
        xyesno: '',

    });

    const handleResultClick = (result) => {
        setFormData((prev) => ({
            ...prev,
            ...result,
            zid,
        }));
        setDropdownOpen(false);

    };


    const handleItemSelect = useCallback((item) => {
        // console.log(item)
        setFormData((prev) => ({
            ...prev,
            xrow: item.xrow, xtypetrn: item.xtypetrn, xnofsignatory: item.xnofsignatory, xyesno: item.xyesno
        }));
    }, []);

    useEffect(() => {
        setRefreshTrigger(true);
    }, [updateCount]);



    const handleDropdownSelect = (fieldName, value) => {
        // console.log(fieldName, value);

        setFormData((prevState) => {
            const updatedState = { ...prevState, [fieldName]: value };
            return updatedState;
        });
    };


    const handleAdd = async () => {
        const errors = validateForm(formData, ['xtypetrn', 'xnofsignatory']);
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            Swal.fire({
                icon: 'error',
                title: 'Invalid Input',
                text: 'Please fix the errors before proceeding.',
            });
            return;
        }

        const endpoint = 'api/pdsignatoryrpt';
        const data = {
            ...formData,
            zauserid: zemail,
            zid: zid
        };

        addFunction(data, endpoint, 'POST', (response) => {
            if (response && response.xrow) {

                setFormData((prev) => ({ ...prev, xrow: response.xrow }));
                setUpdateCount(prevCount => prevCount + 1);
                setFormErrors({});
            } else {
                // alert('Supplier added successfully.');
            }
        });
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => {
            if (prev[name] !== value) {
                return { ...prev, [name]: value };
            }
            return prev;
        });
    };


    const handleUpdate = async () => {
        const errors = validateForm(formData, ['xtypetrn', 'xnofsignatory']);
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            Swal.fire({
                icon: 'error',
                title: 'Invalid Input',
                text: 'Please fix the errors before proceeding.',
            });
            return;
        }
       
        const endpoint = `api/pdsignatoryrpt/${zid}/${formData.xrow}`;
        const data = {
            ...formData,
            zid: zid
        };

        await handleApiRequest({
            endpoint,
            data,
            method: 'PATCH',
        });
        setFormErrors({});
        setUpdateCount(prevCount => prevCount + 1);
    };

    const handleDelete = async () => {
        // console.log(formData)
        const endpoint = `api/pdsignatoryrpt/${zid}/${formData.xtypetrn}`;
        await handleApiRequest({
            endpoint,
            method: 'DELETE',
            onSuccess: (response) => {
                setFormData({
                    zid: zid,
                    xrow: '',
                    xtypetrn: '',
                    xnofsignatory: '',
                    xyesno: 'Yes'

                });
                setUpdateCount(prevCount => prevCount + 1);

            },
        });
    };


    const handleClear = async () => {
        // console.log(formData)
       
                setFormData({
                    zid: zid,
                    xrow: '',
                    xtypetrn: '',
                    xnofsignatory: '',
                    xyesno: 'Yes'

                })
    };





    return (

        <div className='grid grid-cols-12 gap-5 z-40'>
            <div className="">
                <SideButtons
                    onAdd={handleAdd}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                    onClear={handleClear}
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
                                border: '1px solid #ccc',
                                borderRadius: '8px',
                                padding: 2,
                            }}>
                                <Caption title={"Approval Layer"} />
                                <Box
                                    display="grid"
                                    mt={2}
                                    gridTemplateColumns="repeat(2, 1fr)"
                                    gap={2}
                                    mb={2} // margin-bottom
                                >


                                    <DynamicDropdown
                                        isOpen={dropdownOpen}
                                        onClose={() => setDropdownOpen(false)}
                                        triggerRef={triggerRef}
                                        data={searchResults}
                                        headers={fieldConfig.map((config) => config.header)}
                                        onSelect={handleResultClick}
                                        dropdownWidth={800}
                                        dropdownHeight={400}
                                    />

                                    <TextField
                                        ref={triggerRef}
                                        label="Row Number"
                                        name='xrow'
                                        variant={variant}
                                        size="small"
                                        onChange={(e) => {
                                            handleChange(e);
                                            const query = e.target.value;
                                            const apiSearchUrl = `api/pdsignatoryrpt/search?zid=${zid}&text=${query}`;
                                            handleSearch(
                                                e.target.value,
                                                apiSearchUrl,
                                                fieldConfig,
                                                setSearchResults,
                                                setDropdownOpen,
                                                triggerRef,
                                                setDropdownPosition,
                                                { zid }
                                            );
                                        }}
                                        sx={{
                                            gridColumn: 'span 1',
                                            // '& .MuiInputBase-input': {
                                            //     fontSize: '.9rem'
                                            // },
                                        }}
                                        value={formData.xrow}
                                        fullWidth
                                        // InputLabelProps={{
                                        //     shrink: true,
                                        //     sx: {
                                        //         fontWeight: 600,
                                        //     },
                                        // }}
                                    />

                                    <XcodesDropDown
                                        variant={variant}
                                        label="Process Name"
                                        size="small"
                                        name="xtypetrn"
                                        type="Process Name"
                                        onSelect={(value) => handleDropdownSelect("xtypetrn", value)}
                                        value={formData.xtypetrn}
                                        defaultValue=""
                                        error={!!formErrors.xtypetrn}
                                        helperText={formErrors.xtypetrn}
                                        withXlong="false"
                                        fontSize='0.9rem'
                                        InputLabelProps={{
                                            shrink: true,
                                            sx: {

                                                fontWeight: 600,
                                            },
                                        }}
                                        sx={{
                                            pointerEvents: 'none', // Disables interaction with the dropdown
                                        }}
                                    />

                                </Box>
                                <Box
                                    display="grid"

                                    gridTemplateColumns="repeat(2, 1fr)"
                                    gap={2}
                                    mb={2} // margin-bottom
                                >

                                    <TextField
                                        label="Number Of Signatory"
                                        name='xnofsignatory'
                                        variant={variant}
                                        size="small"
                                        onChange={handleChange}
                                        value={formData.xnofsignatory}
                                        error={!!formErrors.xnofsignatory}
                                        helperText={formErrors.xnofsignatory}
                                        fullWidth
                                        sx={{
                                            // '& .MuiInputBase-input': {
                                            //     fontSize: '.9rem'
                                            // },
                                        }}
                                        // InputLabelProps={{
                                        //     shrink: true,
                                        //     sx: {
                                        //         fontWeight: 600,
                                        //     },
                                        // }}
                                    />

                                    <FormControl fullWidth variant={variant} size="small">
                                        <InputLabel
                                            // shrink
                                            // sx={{
                                            //     fontSize: '1rem',
                                            //     fontWeight: 600,
                                            // }}
                                        >
                                            Approval Mandatory?

                                        </InputLabel>
                                        <Select
                                            value={formData.xyesno}
                                            defaultValue=""
                                            onChange={(event) =>
                                                handleDropdownSelect("xyesno", event.target.value)
                                            }
                                            label="Approval Mandatory?"
                                            sx={{
                                                // '& .MuiMenuItem-root': {
                                                //     fontSize: '0.8rem',
                                                // },
                                                // fontSize: '0.8rem',
                                            }}
                                        >
                                            <MenuItem value="Yes">Yes</MenuItem>
                                            <MenuItem value="No">No</MenuItem>
                                        </Select>
                                    </FormControl>

                                </Box>
                                <Box
                                    display="grid"
                                    gridTemplateColumns="repeat(2, 1fr)"
                                    gap={2}
                                    mb={2} // margin-bottom
                                >

                                    <div className='col-span-2 text-red-400'>
                                        0 =&gt; No Approval,

                                        1 =&gt; 1 Layer Approval,

                                        2 =&gt; 2 Layer Approval
                                    </div>



                                </Box>

                                <Box
                                    display="grid"
                                    gridTemplateColumns="repeat(2, 1fr)"
                                    border
                                    gap={2}
                                    mb={2} // margin-bottom

                                >


                                </Box>
                                <Box
                                    display="grid"
                                    gridTemplateColumns="repeat(2, 1fr)"
                                    border
                                    gap={2}
                                    mb={2} // margin-bottom

                                >


                                </Box>
                            </Box>
                            <Box sx={{
                                gridColumn: 'span 1',
                                border: '1px solid #ccc', // Light gray border
                                borderRadius: '8px', // Optional: Rounded corners
                                padding: 2,
                            }}>

                                <SortableList
                                    apiUrl={`api/pdsignatoryrpt/signatory/${formData.zid}`}
                                    caption="Approver Layers "
                                    columns={[
                                        { field: 'xrow', title: 'Serial', width: '5%', },
                                        { field: 'xtypetrn', title: 'Approval Type', width: '65%', align: 'center' },
                                        { field: 'xnofsignatory', title: 'Signatory Number', width: '65%', align: 'center' },
                                        { field: 'xyesno', title: 'Approval Mandatory?', width: '65%', align: 'center' }

                                    ]}
                                    onItemSelect={handleItemSelect}
                                    onRefresh={(refresh) => {
                                        if (refreshTrigger) {
                                            refresh();
                                            setRefreshTrigger(false);
                                        }
                                    }}
                                    pageSize={10}
                                    // onSortChange={handleSortChange}
                                    sortField="xrow"
                                    additionalParams={{}}
                                    captionFont=".9rem"
                                    xclass="py-4 pl-2"
                                    // bodyFont=".7rem"
                                    mt={0}
                                    page={1}
                                    isModal
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

export default ApprovalLayer;
