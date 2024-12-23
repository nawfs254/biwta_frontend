import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    TextField,
    Box,
    Typography,
    Button,
    Modal,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from '@mui/material';
import { useAuth } from '../../../Provider/AuthProvider';

import HelmetTitle from '../../../utility/HelmetTitle';
import SideButtons from '../../../Shared/SideButtons';
import Caption from '../../../utility/Caption';
import DynamicDropdown from '../../../ReusableComponents/DynamicDropdown';

import { handleApiRequest } from '../../../utility/handleApiRequest';
import { addFunction } from '../../../ReusableComponents/addFunction';
import { handleSearch } from '../../../ReusableComponents/handleSearch';
import LoadingPage from '../../Loading/Loading';
import SortableList from '../../../ReusableComponents/SortableList';
import XlongDropDown from '../../../ReusableComponents/XlongDropDown';
import { convertDate } from '../../../utility/convertDate';
import axiosInstance from '../../../Middleware/AxiosInstance';
import Swal from 'sweetalert2';
import { validateForm } from '../../../ReusableComponents/validateForm';
import GenericDropDown from '../../../ReusableComponents/GenericDropDown';


const Pogrnapp = () => {
    // Authentication Context
    const { zid, zemail } = useAuth();
    console.log(zid, zemail)
    const [formData, setFormData] = useState({
        zid: zid,
        xgrnnum: '',
        xstatusgrn: '',
        xdate: new Date().toISOString().split('T')[0],
        xcus: '',
        xwh: '',
        xref: '',
        xstatus: 'Open',
        xstatusdoc: '',
        xnote: '',


    });
    const [formErrors, setFormErrors] = useState({});

    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [isDropdownOpen, setDropdownOpen] = useState(false);

    const [supDropdownOpen, setSupDropdownOpen] = useState(false);
    const [grnDropdownOpen, setGrnDropdownOpen] = useState(false);
    const [directFetch, setDirectFetch] = useState('');
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState("Inactive");
    const [refreshCallback, setRefreshCallback] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [updateCount, setUpdateCount] = useState(0);
    const [sortField, setSortField] = useState('name'); // Default sorting field
    const [sortOrder, setSortOrder] = useState('asc');
    const [open, setOpen] = useState(false);
    const apiListUrl = `api/pogrndetails/${zid}/${formData.xgrnnum}`


    // Handle dropdown value change
    const handleStatusChange = (event) => {
        setStatus(event.target.value);
    };
    // References
    const triggerRef = useRef(null);
    const supplierRef = useRef(null);
    const variant = 'outlined';
    const apiBaseUrl = `api/pogrnheader`;

    const fieldConfig = [
        { header: 'GRN Number', field: 'xgrnnum' },
        { header: 'Date', field: 'xdate' },
        { header: 'Store', field: 'xwh' },
        { header: 'Supplier', field: 'xorg' },
        { header: 'Challan', field: 'xref' },
    ];


    const supConfig = [
        { header: 'Supplier ID', field: 'xcus' },
        { header: 'Name', field: 'xorg' },
        { header: 'Address', field: 'xmadd' },
    ];

    const handleSortChange = (field) => {
        // Toggle sorting order if the same field is clicked
        setSortOrder((prevOrder) => (field === sortField && prevOrder === 'asc' ? 'desc' : 'asc'));
        setSortField(field);
    };


    useEffect(() => {
        if (zid && zemail) setLoading(false);
    }, [zid, zemail]);

    // Handlers
    const handleChange = (e) => {
        // console.log(e.target)
        const { name, value } = e.target;
        setFormData((prev) => {
            if (prev[name] !== value) {
                return { ...prev, [name]: value };
            }
            return prev;
        });
    };

    const handleResultClick = (result) => {
        setDirectFetch('Yes')
        setFormData((prev) => ({
            ...prev,
            ...result,
            zid,
        }));
        setSupDropdownOpen(false);
        setGrnDropdownOpen(false);

    };

    const handleDropdownSelect = (fieldName, value) => {
        console.log(value)
        setFormData((prevState) => ({
            ...prevState,
            [fieldName]: value,

            xwh: value.xcode,
            xlong: value.xlong,
        }));
    };


    const handleGenericSelect = (fieldName, value) => {
        console.log(value)
        setFormData((prevState) => ({
            ...prevState,
            [fieldName]: value,



        }));
    };

    // console.log(formData)


    console.log(directFetch)
    useEffect(() => {
        if (selectedItem) {
            setFormData({
                ...selectedItem,
                xdate: convertDate(selectedItem.xdate)
            });
        }
    }, [selectedItem]);


    useEffect(() => {
        if (refreshCallback && formData.xgrnnum) {
            refreshCallback();
        }
    }, [formData.xgrnnum, refreshCallback]);


    useEffect(() => {
        setRefreshTrigger(true);
    }, [updateCount]);


    const handleAdd = async () => {
        const errors = validateForm(formData, ['xwh', 'xcus']);
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            Swal.fire({
                icon: 'error',
                title: 'Invalid Input',
                text: 'Please fix the errors before proceeding.',
            });
            return;
        }

        const endpoint = 'api/pogrnheader';
        const data = {
            ...formData,
            zauserid: zemail,
            zid: zid
        };
        addFunction(data, endpoint, 'POST', (response) => {
            if (response && response.xgrnnum) {

                setFormData((prev) => ({ ...prev, xgrnnum: response.xgrnnum }));
                setUpdateCount(prevCount => prevCount + 1);
                setFormErrors({});
            } else {
                // alert('Supplier added successfully.');
            }
        });
    };





    const handleItemSelect = useCallback((item) => {
        console.log(item)
        setFormData((prev) => ({
            ...prev,
            xgrnnum: item.xgrnnum, xwh: item.xwh, xcus: item.xcus, xref: item.xref, xorg: item.xorg, xlong: item.xlong, xstatusdoc: item.xstatusdoc
        }));
    }, []);

    const handleClear = () => {
        setFormData({
            zid: zid,
            xgrnnum: '',
            xstatusgrn: '',
            xdate: new Date().toISOString().split('T')[0],
            xcus: '',
            xwh: '',
            xref: '',
            xstatus: '',
            xnote: '',
            xlong: '',
            xorg: '',
            xsign1: ''

        });
        alert('Form cleared.');
    };

    const handleDelete = async () => {
        // console.log(formData)
        const endpoint = `api/pogrnheader/${zid}/${formData.xgrnnum}`;
        await handleApiRequest({
            endpoint,
            method: 'DELETE',
            onSuccess: (response) => {
                setFormData({
                    zid: zid,
                    xgrnnum: '',
                    xstatusgrn: '',
                    xdate: new Date().toISOString().split('T')[0],
                    xcus: '',
                    xwh: '',
                    xref: '',
                    xstatus: '',
                    xnote: '',
                    xlong: '',
                    xorg: '',
                    xsign1: ''

                });
                setUpdateCount(prevCount => prevCount + 1);

            },
        });
    };


    const handleUpdate = async () => {
        const errors = validateForm(formData, ['xwh', 'xcus']);
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
        const endpoint = `api/pogrnheader/${zid}/${formData.xgrnnum}`;
        const data = {
            ...formData,
            zid: zid
        };
        // console.log(data)

        await handleApiRequest({
            endpoint,
            data,
            method: 'PUT',
        });
        setFormErrors({});
    };






    const handleOpen = () => {
        document.body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`;
        document.body.style.overflow = "hidden";
        setOpen(true);
        // setRefreshTrigger(true)
    };

    const handleClose = () => {
        document.body.style.paddingRight = "";
        document.body.style.overflow = "";
        setOpen(false);
    };



    const handleApprove = async () => {
        if (window.confirm('Are You Sure to Approve This GRN?')) {
            setStatus("Processing...");
            const params = {
                zid: 100000,
                user: zemail,
                position: zemail,
                tornum: formData.xgrnnum,
                status: formData.xstatusdoc,
                request: 'GRN Approval'
            };

            try {

                const response = await axiosInstance.post("/api/pogrnheader/approveRequest", params);
                console.log(params)
                setStatus(response.data);
                setUpdateCount(prevCount => prevCount + 1);
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Operation completed successfully'
                });

            } catch (error) {
                setStatus("Error: " + (error.response?.data || error.message));

                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong. Please try again.'
                });
            }
        }
    };




    if (loading) {
        return <LoadingPage />;
    }

    return (

        <div>

            <div className='grid grid-cols-12 gap-1 mb-2'>
                <div className='col-span-1'>
                </div>
                <Button
                    onClick={handleApprove}
                    variant='outlined'
                    sx={{
                        marginLeft: 1,
                        paddingX: 2, // equivalent to Tailwind's px-2
                        paddingY: 0.5, // equivalent to Tailwind's py-0.5
                        // equivalent to Tailwind's w-24 (6rem = 24 * 0.25rem)
                        height: '2.5rem', // equivalent to Tailwind's h-10 (2.5rem = 10 * 0.25rem)
                        '&:hover': {
                            backgroundColor: '#F59E0B', // Yellow-600
                        },
                    }}
                    size="medium"

                >
                    Approve
                </Button>
            </div>


            <div className="grid grid-cols-12">




                {/* Helmet Title for Page */}
                <HelmetTitle title="Product Receive Entry" />

                {/* Sidebar with Action Buttons */}
                <div className="col-span-1">
                    <SideButtons
                        onAdd={handleAdd}
                        onClear={handleClear}
                        onUpdate={handleUpdate}
                        onDelete={handleDelete}
                        showAdd={false}
                        showDelete={false}
                        showUpdate={false}
                    />
                </div>



                {/* Modal */}

                <Box sx={{
                    gridColumn: 'span 5',
                    // border: '1px solid #ccc', // Light gray border
                    borderRadius: '8px', // Optional: Rounded corners
                    // padding: 2,
                }}>



                    <div className="shadow-lg rounded">
                        <div className="w-full  py-2 pt-0 mx-auto ">
                            <Caption title="Product Receive Approval" />
                            <Box
                                component="form"
                                sx={{
                                    '& > :not(style)': { my: 1 },
                                    mx: 'auto',
                                    gap: 2,
                                    px: 1,
                                    borderRadius: 2,
                                    bgcolor: 'white',
                                }}
                                autoComplete="off"
                            >
                                {/* Row 1 */}
                                <Box
                                    display="grid"
                                    gridTemplateColumns="repeat(2, 1fr)"
                                    gap={2}
                                    mb={2}
                                >
                                    {/* Dropdown for Search Results */}
                                    <DynamicDropdown
                                        isOpen={grnDropdownOpen}
                                        onClose={() => setGrnDropdownOpen(false)}
                                        triggerRef={triggerRef}
                                        data={searchResults}
                                        headers={fieldConfig.map((config) => config.header)}
                                        onSelect={handleResultClick}
                                        dropdownWidth={800}
                                        dropdownHeight={400}
                                    />
                                    {/* Supplier ID Field */}
                                    <TextField
                                        ref={triggerRef}
                                        id="xgrnnum"
                                        name="xgrnnum"
                                        label="GRN Number"
                                        
                                        size="small"
                                        value={formData.xgrnnum || ''}
                                        variant={variant}
                                        fullWidth
                                        onChange={(e) => {
                                            handleChange(e);
                                            const query = e.target.value;
                                            const apiSearchUrl = `api/pogrnheader/search?zid=${zid}&text=${query}`;
                                            handleSearch(
                                                e.target.value,
                                                apiSearchUrl,
                                                fieldConfig,
                                                setSearchResults,
                                                setGrnDropdownOpen,
                                                triggerRef,
                                                setDropdownPosition,
                                                { zid }
                                            );
                                        }}
                                        sx={{
                                            gridColumn: 'span 1',
                                            
                                        }}
                                    />
                                    {/* Company Field */}
                                    <TextField
                                        id="xdate"
                                        name="xdate"
                                        label="Date"
                                        
                                        type="date"
                                        size="small"
                                        value={formData.xdate}
                                        variant={variant}
                                        fullWidth
                                        onChange={handleChange}
                                        sx={{
                                            gridColumn: 'span 1',
                                            
                                        }}
                                    />

                                </Box>

                                {/* Row 2 */}
                                <Box
                                    display="grid"
                                    gridTemplateColumns="repeat(2, 1fr)"
                                    gap={2}
                                    mb={2}
                                >


                                    <DynamicDropdown
                                        isOpen={supDropdownOpen}
                                        onClose={() => setSupDropdownOpen(false)}
                                        triggerRef={supplierRef}
                                        data={searchResults}
                                        headers={supConfig.map((config) => config.header)}
                                        onSelect={handleResultClick}
                                        dropdownWidth={600}
                                        dropdownHeight={400}
                                    />
                                    {/* Mailing Address */}
                                    <TextField
                                        ref={supplierRef}
                                        id="xcus"
                                        name="xcus"
                                        label="Supplier"
                                        size="small"
                                        value={formData.xcus}
                                        error={!!formErrors.xcus}
                                        helperText={formErrors.xcus}
                                        
                                        variant={variant}
                                        fullWidth
                                        sx={{
                                            gridColumn: 'span 1',
                                            
                                        }}
                                        onChange={(e) => {
                                            handleChange(e);
                                            const query = e.target.value;
                                            const apiSupUrl = `api/cacus/search?zid=${zid}&text=${query}`;
                                            handleSearch(
                                                e.target.value,
                                                apiSupUrl,
                                                supConfig,
                                                setSearchResults,
                                                setSupDropdownOpen,
                                                supplierRef,
                                                setDropdownPosition,
                                                { zid }
                                            );
                                        }}
                                    />
                                    {/* Email */}
                                    <TextField
                                        id="xorg"
                                        name="xorg"
                                        label="Supplier Name"
                                        size="small"
                                        value={formData.xorg}
                                        variant={variant}
                                        
                                        inputProps={{
                                            readOnly: true,
                                        }}
                                        fullWidth
                                        onChange={handleChange}
                                        sx={{
                                            gridColumn: 'span 1',
                                            
                                        }}
                                    />
                                    {/* Phone */}

                                </Box>

                                {/* Row 3 */}
                                <Box
                                    display="grid"
                                    gridTemplateColumns="repeat(2, 1fr)"
                                    gap={2}
                                    mb={2}
                                >



                                    <XlongDropDown
                                        variant={variant}
                                        label="Store"
                                        size="small"
                                        name="xwh"
                                        type="Branch"
                                        onSelect={(value) => handleDropdownSelect("xwh", value)}
                                        value={formData.xwh}
                                        defaultValue=""
                                        error={!!formErrors.xwh}  // Check if there's an error for this field
                                        helperText={formErrors.xwh}
                                        withXlong="false"
                                        
                                    />



                                    {/* <TextField
                                        id="xlong"
                                        name="xlong"
                                        label="Store Name"
                                        size="small"
                                        value={formData.xlong}
                                        variant={variant}
                                        InputLabelProps={{
                                            shrink: true,
                                            sx: {
                                                fontWeight: 600,
                                            },
                                        }}
                                        inputProps={{
                                            readOnly: true,
                                        }}
                                        fullWidth
                                        onChange={handleChange}
                                        sx={{
                                            '& .MuiInputBase-input': {
                                                // Remove unnecessary padding
                                                // Ensure the input spans the full height
                                                fontSize: '.9rem'
                                            },
                                        }}
                                    /> */}

                                    <Box sx={{ display: 'flex', alignItems: 'center', gridColumn: 'span 1' }}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 400, fontSize: '1rem' }}>
                                            Status:
                                        </Typography>
                                        <Typography
                                            variant="subtitle1"
                                            sx={{
                                                marginLeft: 1,
                                                color: status === 'Confirmed' ? 'green' : 'red', // Conditional styling
                                            }}
                                        >
                                            {formData.xstatusdoc}
                                        </Typography>
                                    </Box>



                                    {/* Fax */}


                                </Box>
                                <Box
                                    display="grid"
                                    gridTemplateColumns="repeat(3, 1fr)"
                                    gap={2}
                                    mb={2} // margin-bottom
                                >



                                    <TextField
                                        id='xref'
                                        name='xref'
                                        label="Challan No"
                                        size="small"
                                        value={formData.xref}
                                        variant={variant}
                                        onChange={handleChange}
                                        
                                        fullWidth
                                        // disabled
                                        required
                                        sx={{
                                            gridColumn: 'span 3',
                                            
                                        }}

                                    />



                                </Box>

                                <Box
                                    display="grid"
                                    gridTemplateColumns="repeat(3, 1fr)"
                                    gap={2}
                                    mb={2} // margin-bottom
                                >
                                    <TextField
                                        label="Note"
                                        name='xnote'
                                        variant={variant}
                                        size="small"
                                        onChange={handleChange}
                                        value={formData.xnote}
                                        
                                        fullWidth
                                        required
                                        multiline
                                        sx={{
                                            gridColumn: 'span 3',
                                            
                                        }}
                                    />
                                </Box>
                                <Box
                                    display="grid"
                                    gridTemplateColumns="repeat(3, 1fr)"
                                    gap={2}
                                    mb={2}
                                >

                                    <GenericDropDown
                                        variant={variant}
                                        label="Next Approver"
                                        api={`api/employee/approver/100000`}
                                        xpkey="xstaff"
                                        xskey="xname"
                                        onSelect={(value) => handleGenericSelect("xsign1", value)}
                                        value={formData.xsign1}
                                        size="small"
                                        defaultValue=""
                                        span={2}
                                        
                                    />


                                </Box>

                            </Box>
                        </div>
                    </div>
                </Box >
                <Box sx={{
                    gridColumn: 'span 6',
                    px: 0,
                    // border: '1px solid #ccc', // Light gray border
                    borderRadius: '8px', // Optional: Rounded corners
                    // padding: 2,
                }}>

                    <SortableList
                        directFetch='Yes'
                        apiUrl={apiBaseUrl}
                        isFolded={false}
                        caption="Pending Receive Entry List for Approve"
                        columns={[
                            { field: 'xgrnnum', title: 'GRN Number', width: '25%', },
                            { field: 'xcus', title: 'Name', width: '25%' },
                            { field: 'xorg', title: 'Supplier Name', width: '40%', align: 'center' },
                            { field: 'xdate', title: 'GRN Date', width: '10%', align: 'center' },
                            { field: 'xstatusdoc', title: 'GRN Status', width: '10%', align: 'center' },
                        ]}
                        onItemSelect={handleItemSelect}
                        onRefresh={(refresh) => {
                            if (refreshTrigger) {
                                refresh();
                                setRefreshTrigger(false);
                            }
                        }}

                        pageSize={10}
                        onSortChange={handleSortChange}
                        sortField="xgrnnum"
                        additionalParams={{ zid: zid, superior: zemail }}
                        captionFont=".9rem"
                        xclass="py-4 pl-2"
                        bodyFont=".8rem"
                        mt={0}
                        page={1}
                    />
                    <SortableList

                        apiUrl={`api/pogrndetails/${zid}/${formData.xgrnnum}`}
                        isFolded={false}
                        caption="Receive Entry Detail List"
                        columns={[
                            { field: 'xrow', title: 'Serial', width: '5%', },
                            { field: 'xitem', title: 'Item', width: '10%' },
                            { field: 'xdesc', title: 'Item Code', width: '65%', align: 'center' },
                            { field: 'xqtygrn', title: 'GRN Qty', width: '10%', align: 'center' },
                            { field: 'xrategrn', title: 'Rate', width: '10%', align: 'center' },
                        ]}
                        // onItemSelect={handleItemSelect}
                        onRefresh={(refresh) => {
                            if (formData.xgrnnum) {
                                refresh(); // Trigger the refresh only when xgrnnum is available
                            }
                        }}
                        pageSize={10}
                        // onSortChange={handleSortChange}
                        sortField="xgrnnum"
                        additionalParams={{}}
                        captionFont=".9rem"
                        xclass="py-0 pl-2"
                        bodyFont=".7rem"
                        mt={2}
                        page={1}
                    // isModal
                    />
                </Box>
            </div >
        </div>
    );
};

export default Pogrnapp;
