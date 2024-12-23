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
import { addFunction } from '../../../ReusableComponents/addFunction';


const Moreqdetailstore = ({ xtornum = '' }) => {
    const { zid } = useAuth();
    const variant = 'outlined'
    const [formErrors, setFormErrors] = useState({});
    const itemRef = useRef(null);
    const [isTyping, setIsTyping] = useState(false);
    const [refreshCallback, setRefreshCallback] = useState(null); // Store the refresh function
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const apiBaseUrl = `api/imtordetail?zid=${zid}&xtornum=${xtornum}`;

    const addEndpoint = 'api/imtordetail';
    const updateEndpoint = `api/imtordetail/update`;
    const deleteEndpoint = `api/imtordetail/delete/details`;
    const mainSideListEndpoint = `api/imtordetail/${zid}/paginated`;

    const [updateCount, setUpdateCount] = useState(0);

    const [selectedItem, setSelectedItem] = useState(null);
    const [searchResults, setSearchResults] = useState([]);
    const [itemDropdownOpen, setItemDropdownOpen] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
    const [rect, setBoundingRect] = useState(null)
    const apiListUrl = `api/imtordetail/${zid}/${xtornum}`
    const [formData, setFormData] = useState({
        zid: zid,
        zauserid: '',
        xtornum: '',
        xrow: '',
        xitem: '',
        xprepqty: '',
        xdesc:'',
        xbatch: '',
        xlong: '',
        xunit: ''


    });


    const itemConfig = [
        { header: 'Item Code', field: 'xitem' },
        { header: 'Name', field: 'xdesc' },
        { header: 'Unit', field: 'xunit' },
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
        if (refreshCallback && formData.xtornum) {
            refreshCallback(); // Trigger the refresh callback from SortableList
        }
    }, [formData.xtornum, refreshCallback]);


    useEffect(() => {
        setRefreshTrigger(true);
    }, [updateCount]);

    useEffect(() => {
        console.log("33")
        if (refreshTrigger) {
            handleRefresh();
            setRefreshTrigger(false); 
        }
    }, [refreshTrigger, handleRefresh]);

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






    const handleAction = async (method) => {

        const data = {

            zid: zid,
            xtornum: xtornum,
            zauserid: formData.zauserid,
            xrow: formData.xrow,
            xitem: formData.xitem,
            xprepqty: formData.xprepqty,
            xbatch: formData.xbatch,
            xlong: formData.xlong

        };


        const errors = validateForm(formData, ['xitem']);
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            Swal.fire({
                icon: 'error',
                title: 'Invalid Input',
                text: 'Please fix the errors before proceeding.',
            });
            return;
        }


        const endpoint = "/api/imtordetail";

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
                        xtornum: '',
                        xrow: '',
                        xitem: '',
                        xprepqty: '',
                        xrate: '',
                        xbatch: '',
                        xlong: '',
                        xlineamt: ''
                    });
                }

            },
            params: { zid: formData.zid, xtornum: formData.xtornum, xrow: formData.xrow }
        });
    };

    const handleOnRefresh = useCallback((refreshFn) => {
        setRefreshCallback(() => refreshFn);
    }, []);



    const handleClear = () => {
        setFormData({
            zid: zid,
            zauserid: '',
            xtornum: '',
            xrow: '',
            xitem: '',
            xprepqty: '',
            xdesc:'',
            xbatch: '',
            xlong: '',
            xlineamt: '',
            xunit: ''

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



    const handleAdd = async () => {
        const errors = validateForm(formData, ['xitem','xprepqty']);
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            Swal.fire({
                icon: 'error',
                title: 'Invalid Input',
                text: 'Please fix the errors before proceeding.',
            });
            return;
        }

        const endpoint = 'api/imtordetail';
        const data = {
            ...formData,
            zid: zid,
            xtornum:xtornum
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


    const handleDelete = async () => {
        const endpoint = deleteEndpoint;


        const params = {
            zid:zid,
            column: 'xtornum',
            transactionNumber: formData.xtornum,
            row:formData.xrow
        };


        await handleApiRequest({
            endpoint,
            method: 'DELETE',
            params: params,
            onSuccess: (response) => {
                setFormData({
                    zauserid: '',
                    xtornum: '',
                    xrow: '',
                    xitem: '',
                    xprepqty: '',
                    xbatch: '',
                    xlong: '',
                    xlineamt: '',
                    xunit: ''
                });
                setUpdateCount(prevCount => prevCount + 1);
            },
        });
    };




    const handleUpdate = async () => {
        const errors = validateForm(formData, ['xitem']);
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            Swal.fire({
                icon: 'error',
                title: 'Invalid Input',
                text: 'Please fix the errors before proceeding.',
            });
            return;
        }

        const tableName = "Imtordetail";
        const updates = {

            xitem: formData.xitem,
            xprepqty: formData.xprepqty,
            xbatch: formData.xbatch,
            xlong: formData.xlong,
            xlineamt: formData.xlineamt,
            xunit: formData.xunit

        };
        const whereConditions = { xtornum: formData.xtornum, zid: zid, xrow: formData.xrow };

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




    return (
        <div className='grid grid-cols-12 gap-5 z-40'>
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
                                <Caption title={"Requisition Detail of " + xtornum} />
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
                                        
                                        
                                    />

                                    <TextField
                                        label="Unit"
                                        name='xunit'
                                        variant={variant}
                                        size="small"
                                        onChange={handleChange}
                                        value={formData.xunit}
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
                                        label="Requisition Qty"
                                        variant={variant}
                                        size="small"
                                        fullWidth
                                        id="xprepqty"
                                        name='xprepqty'
                                        onChange={handleChange}
                                        error={!!formErrors.xprepqty}
                                        helperText={formErrors.xprepqty}
                                        value={formData.xprepqty}
                                        required
                                        sx={{
                                            gridColumn: 'span 1',
                                            
                                        }}
                                        
                                    />

                                   

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
                                    apiUrl={apiListUrl}

                                    caption="Requisition Detail List"
                                    columns={[
                                        { field: 'xrow', title: 'Serial', width: '5%', align: 'left' },
                                        { field: 'xitem', title: 'Item', width: '10%', align: 'left' },
                                        { field: 'xdesc', title: 'Item Code', width: '65%', align: 'left' },
                                        { field: 'xprepqty', title: 'Required Quantity', width: '65%', align: 'left' },

                                    ]}
                                    onItemSelect={handleItemSelect}
                                    onRefresh={(refresh) => {
                                        if (refreshTrigger) {
                                            refresh();
                                            setRefreshTrigger(false);
                                        }
                                    }}
                                    pageSize={10}
                                    
                                    sortField="xtornum"
                                    additionalParams={{}}
                                    captionFont=".9rem"
                                    xclass="py-4 pl-2"
                                   
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

export default Moreqdetailstore;
