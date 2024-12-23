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
import { handleApiRequest } from '../../../utility/handleApiRequest';
import SideButtons from '../../../Shared/SideButtons';
import Caption from '../../../utility/Caption';
import XcodesDropDown from '../../../ReusableComponents/XcodesDropDown';
import SortableList from '../../../ReusableComponents/SortableList';
import { useAuth } from '../../../Provider/AuthProvider';
import DynamicDropdown from '../../../ReusableComponents/DynamicDropdown';
import { handleSearch } from '../../../ReusableComponents/handleSearch';
import { validateForm } from '../../../ReusableComponents/validateForm';
import Swal from 'sweetalert2';
import axiosInstance from '../../../Middleware/AxiosInstance';
import { toast } from 'react-toastify';
import { addFunction } from '../../../ReusableComponents/addFunction';


const Pogrndetail = ({ xgrnnum = '' }) => {
    const { zid } = useAuth();
    const variant = 'outlined'
    const [formErrors, setFormErrors] = useState({});
    const itemRef = useRef(null);
    const [updateCount, setUpdateCount] = useState(0);
    const [isTyping, setIsTyping] = useState(false);
    const [refreshCallback, setRefreshCallback] = useState(null); // Store the refresh function
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const apiBaseUrl = `api/pogrndetails?zid=${zid}&xgrnnum=${xgrnnum}`;
    const [selectedItem, setSelectedItem] = useState(null);
    const [searchResults, setSearchResults] = useState([]);
    const [itemDropdownOpen, setItemDropdownOpen] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
    const [rect, setBoundingRect] = useState(null)
    const apiListUrl = `api/pogrndetails/${zid}/${xgrnnum}`
    const [formData, setFormData] = useState({
        zid: zid,
        zauserid: '',
        xgrnnum: '',
        xrow: '',
        xitem: '',
        xqtygrn: '',
        xrategrn: '',
        xbatch: '',
        xdateexp: new Date().toISOString().split('T')[0],
        xlong: '',
        xlineamt: '',
        xunitpur: ''


    });


    const itemConfig = [
        { header: 'Item Code', field: 'xitem' },
        { header: 'Name', field: 'xdesc' },
        { header: 'Purchase Unit', field: 'xunitpur' },
    ];

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


    const handleDropdownSelect = (fieldName, value) => {
        setFormData((prevState) => ({
            ...prevState,
            [fieldName]: value,
        }));
    };


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


    useEffect(() => {
        // Check if the ref is attached and available after the component mounts
        if (itemRef.current) {
            const boundingRect = itemRef.current.getBoundingClientRect(); // Get position

            setBoundingRect(boundingRect);
        }
    }, []);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => {
            const updatedData = { ...prev, [name]: value };
            return updatedData;
        });
        setIsTyping(true);
    };


    const handleAdd = async () => {
        const errors = validateForm(formData, ['xitem', 'xqtygrn','xrate']);
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            Swal.fire({
                icon: 'error',
                title: 'Invalid Input',
                text: 'Please fix the errors before proceeding.',
            });
            return;
        }

       
        const itemResponse = await axiosInstance.get(`api/products/valid/xitem?zid=${zid}&trnnum=${formData.xitem}`);

        if (!itemResponse.data) {
            toast.error('Invalid Item Selected.', {
                position: "top-right",
                autoClose: 3000,
            });

            return;
        }


        const endpoint = 'api/pogrndetail';
        const data = {
            ...formData,
            zid: zid,
            xgrnnum: xgrnnum
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


    const handleAction = async (method) => {

        const data = {

            zid: zid,
            xgrnnum: xgrnnum,
            zauserid: formData.zauserid,
            xrow: formData.xrow,
            xitem: formData.xitem,
            xqtygrn: formData.xqtygrn,
            xrategrn: formData.xrategrn,
            xbatch: formData.xbatch,
            xdateexp: formData.xdateexp,
            xlong: formData.xlong,
            xlineamt: formData.xlineamt

        };


        const errors = validateForm(formData, ['xitem', 'xqtygrn','xrategrn']);
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            Swal.fire({
                icon: 'error',
                title: 'Invalid Input',
                text: 'Please fix the errors before proceeding.',
            });
            return;
        }


        const endpoint = "/api/pogrndetails";

        await handleApiRequest({
            endpoint,
            data,
            method,
            onSuccess: (response) => {
                handleRefresh();
                setRefreshTrigger(true);

                if (response && response.data.xrow) {
                    setFormData((prev) => ({ ...prev, xrow: response.data.xrow }));
                    setFormErrors({});
                } else {
                    // alert('Supplier added successfully.');
                }

                if (method === 'DELETE') {

                    setFormData({
                        zid: zid,
                        zauserid: '',
                        xgrnnum: '',
                        xrow: '',
                        xitem: '',
                        xqtygrn: '',
                        xrate: '',
                        xbatch: '',
                        xdateexp: '',
                        xlong: '',
                        xlineamt: ''
                    });
                }

            },
            params: { zid: formData.zid, xgrnnum: formData.xgrnnum, xrow: formData.xrow }
        });
    };

    const handleOnRefresh = useCallback((refreshFn) => {
        setRefreshCallback(() => refreshFn);
    }, []);



    const handleClear = () => {
        setFormData({
            zid: zid,
            zauserid: '',
            xgrnnum: '',
            xrow: '',
            xitem: '',
            xqtygrn: '',
            xrategrn: '',
            xbatch: '',
            xdateexp: new Date().toISOString().split('T')[0],
            xlong: '',
            xlineamt: '',
            xunitpur: ''

        });
        alert('Form cleared.');
    };


    const handleItemClick = (result) => {
        setFormData((prev) => ({
            ...prev,
            ...result,
            zid,
        }));
        setItemDropdownOpen(false);


    };




    return (
        <div className='grid grid-cols-12 gap-5 z-40'>
            <div className="">
                <SideButtons
                    onAdd={() => handleAction('POST')}
                    onUpdate={() => handleAction('PUT')}
                    onDelete={() => handleAction('DELETE')}
                    onClear={handleClear}
                // onShow={handleShow}
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
                                <Caption title={"Receive Entry Detail of " + xgrnnum} />
                                <Box
                                    display="grid"
                                    gridTemplateColumns="repeat(2, 1fr)"
                                    gap={2}
                                    mb={2} // margin-bottom
                                >

                                    <TextField
                                        label="Row Number"
                                        name='xrow'
                                        variant={variant}
                                        size="small"
                                        onChange={handleChange}
                                        value={formData.xrow}
                                        fullWidth
                                        // sx={{
                                        //     '& .MuiInputBase-input': {
                                        //         fontSize: '.9rem'
                                        //     },
                                        // }}
                                        // InputLabelProps={{
                                        //     shrink: true,
                                        //     sx: {
                                        //         fontWeight: 600,
                                        //     },
                                        // }}
                                    />

                                    <TextField
                                        label="Unit"
                                        name='xunitpur'
                                        variant={variant}
                                        size="small"
                                        onChange={handleChange}
                                        value={formData.xunitpur}
                                        fullWidth
                                        
                                    />

                                </Box>
                                <Box
                                    display="grid"
                                    gridTemplateColumns="repeat(2, 1fr)"
                                    gap={2}
                                    mb={2} // margin-bottom
                                >
                                    <DynamicDropdown
                                        isOpen={itemDropdownOpen}
                                        onClose={() => setItemDropdownOpen(false)}
                                        triggerRef={itemRef}
                                        data={searchResults}
                                        headers={itemConfig.map((config) => config.header)}
                                        onSelect={handleItemClick}
                                        dropdownWidth={400}
                                        dropdownHeight={300}
                                        rect={rect}
                                    />
                                    {/* Supplier ID Field */}
                                    <TextField
                                        inputRef={itemRef}
                                        id="xitem"
                                        name="xitem"
                                        required
                                        label="Item Code"
                                        error={!!formErrors.xitem} 
                                        helperText={formErrors.xitem}
                                        
                                        size="small"
                                        value={formData.xitem || ''}
                                        variant={variant}
                                        fullWidth
                                        onChange={(e) => {
                                            handleChange(e);
                                            const query = e.target.value;
                                            const apiSearchUrl = `api/products/search?zid=${zid}&text=${query}`;
                                            handleSearch(
                                                e.target.value,
                                                apiSearchUrl,
                                                itemConfig,
                                                setSearchResults,
                                                setItemDropdownOpen,
                                                itemRef,
                                                setDropdownPosition,
                                                { zid }
                                            );
                                        }}
                                        sx={{
                                            gridColumn: 'span 1',
                                            
                                        }}
                                    />



                                    <TextField
                                        label="Item Name"
                                        variant={variant}
                                        size="small"
                                        fullWidth
                                        name='xdesc'
                                        
                                        sx={{
                                            gridColumn: 'span 1',
                                            
                                        }}
                                        onChange={handleChange}
                                        value={formData.xdesc}


                                    />
                                </Box>

                                <Box
                                    display="grid"
                                    gridTemplateColumns="repeat(2, 1fr)"
                                    border
                                    gap={2}
                                    mb={2} // margin-bottom

                                >
                                    <TextField
                                        label="Receive Qty"
                                        variant={variant}
                                        size="small"
                                        fullWidth
                                        type="number"
                                        name='xqtygrn'
                                        onChange={handleChange}
                                        error={!!formErrors.xqtygrn} 
                                        helperText={formErrors.xqtygrn}
                                        value={formData.xqtygrn}
                                        required
                                        sx={{
                                            gridColumn: 'span 1',
                                            
                                        }}
                                        
                                    />

                                    <TextField
                                        label="Rate"
                                        variant={variant}
                                        size="small"
                                        fullWidth
                                        type="number"
                                        name='xrategrn'
                                        error={!!formErrors.xrategrn} 
                                        helperText={formErrors.xrategrn}
                                        onChange={handleChange}
                                        sx={{
                                            gridColumn: 'span 1',
                                            // '& .MuiInputBase-input': {
                                            //     fontSize: '.9rem'
                                            // },
                                        }}
                                        value={formData.xrategrn}
                                        
                                    />

                                </Box>
                                <Box
                                    display="grid"
                                    gridTemplateColumns="repeat(2, 1fr)"
                                    border
                                    gap={2}
                                    mb={2} // margin-bottom

                                >
                                    <TextField
                                        label="Batch"
                                        variant={variant}
                                        size="small"
                                        fullWidth
                                        name='xbatch'
                                        onChange={handleChange}
                                        value={formData.xbatch}
                                        sx={{
                                            gridColumn: 'span 1',
                                            
                                        }}
                                        
                                    />

                                    <TextField
                                        label="Expiration Date"
                                        type='date'
                                        variant={variant}
                                        size="small"
                                        fullWidth
                                        name='xdateexp'
                                        onChange={handleChange}
                                        sx={{
                                            gridColumn: 'span 1',
                                            
                                        }}
                                        value={formData.xdateexp}
                                        
                                    />

                                </Box>
                            </Box>
                            <Box sx={{
                                gridColumn: 'span 1',
                                border: '1px solid #ccc', // Light gray border
                                borderRadius: '8px', // Optional: Rounded corners
                                padding: 2,
                            }}>

                                <SortableList
                                    apiUrl={apiListUrl}

                                    caption="Receive Entry Detail List"
                                    columns={[
                                        { field: 'xrow', title: 'Serial', width: '5%', },
                                        { field: 'xitem', title: 'Item', width: '10%' },
                                        { field: 'xdesc', title: 'Item Code', width: '65%', align: 'center' },
                                        { field: 'xqtygrn', title: 'GRN Qty', width: '10%', align: 'center' },
                                        { field: 'xrategrn', title: 'Rate', width: '10%', align: 'center' },
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
                                    sortField="xgrnnum"
                                    additionalParams={{}}
                                    captionFont=".9rem"
                                    xclass="py-4 pl-2"
                                    bodyFont=".7rem"
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

export default Pogrndetail;
