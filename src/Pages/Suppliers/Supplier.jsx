import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    TextField,
    Box,
    Stack,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
} from '@mui/material';
import HelmetTitle from '../../utility/HelmetTitle';
import SideButtons from '../../Shared/SideButtons';
import Caption from '../../utility/Caption';
import DynamicDropdown from '../../ReusableComponents/DynamicDropdown';
import { useAuth } from '../../Provider/AuthProvider';
import { handleApiRequest } from '../../utility/handleApiRequest';
import { addFunction } from '../../ReusableComponents/addFunction';
import { handleSearch } from '../../ReusableComponents/handleSearch';
import LoadingPage from '../Loading/Loading';
import XcodesDropDown from '../../ReusableComponents/XcodesDropDown';
import GenericList from '../../ReusableComponents/GenericList';
import { dark } from '@mui/material/styles/createPalette';
import { validateForm } from '../../ReusableComponents/validateForm';
import Swal from 'sweetalert2';

const Supplier = () => {
    // Authentication Context
    const { zid, zemail } = useAuth();
    const xtype = "Supplier"
    // State Management
    const [formData, setFormData] = useState({
        zid: zid,
        zauserid: '',
        xcus: '',
        xorg: '',
        xmadd: '',
        xemail: '',
        xphone: '',
        xmobile: '',
        xfax: '',
        xbin: '',
        xstatus: '',
        xlicense: '',
        xtin: '',
        xircno: '',
        xpaymenttype: '',
        xcontact: '',
        xtype: xtype,
    });
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
    const [formErrors, setFormErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState("Inactive");
    const [refreshCallback, setRefreshCallback] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [updateCount, setUpdateCount] = useState(0);
    // Handle dropdown value change
    const handleStatusChange = (event) => {
        setStatus(event.target.value);
    };
    // References
    const triggerRef = useRef(null);

    // Configuration
    const variant = 'outlined';
    const apiBaseUrl = `api/cacus/${zid}`;

    const addEndpoint = 'api/cacus';
    const updateEndpoint = `api/cacus/update`;
    const deleteEndpoint = `api/cacus/${zid}/transaction`;
    // const searchEndPoint = `api/cacus/${zid}/search?searchText=${query}&searchFields=xcus,xorg,xmadd`;


    const fieldConfig = [
        { header: 'ID', field: 'xcus' },
        { header: 'Company Name', field: 'xorg' },
        { header: 'Mobile', field: 'xmobile' },
        { header: 'Mailing Address', field: 'xmadd' },
    ];




    useEffect(() => {
        if (zid && zemail) setLoading(false);
    }, [zid, zemail]);

    // Handlers
    const handleChange = (e) => {
        const { name, value } = e.target;
        // setFormData((prev) => ({ ...prev, [name]: value }));
        setFormData((prev) => {
            if (prev[name] !== value) {
                return { ...prev, [name]: value };
            }
            return prev;
        });
    };

    const handleResultClick = (result) => {
        setFormData((prev) => ({
            ...prev,
            ...result,
            zid,
        }));
        setDropdownOpen(false);
    };

    const handleDropdownSelect = (fieldName, value) => {
        setFormData((prevState) => ({
            ...prevState,
            [fieldName]: value,
        }));
    };



    useEffect(() => {
        if (selectedItem) {

            setFormData({
                ...selectedItem
            });
        }
    }, [selectedItem]);


    useEffect(() => {
        setRefreshTrigger(true);
    }, [updateCount]);




    const handleAdd = async () => {

        const endpoint = addEndpoint;
        const data = {
            ...formData,
            zauserid: zemail,
            zid: zid
        };
        addFunction(data, endpoint, 'POST', (response) => {
            if (response && response.xcus) {
                setFormData((prev) => ({ ...prev, xcus: response.xcus }));
                setUpdateCount(prevCount => prevCount + 1);
            } else {
                // alert('Supplier added successfully.');
            }
        });
    };


    const handleOnRefresh = useCallback((refreshFn) => {
        setRefreshCallback(() => refreshFn);
    }, []);




    const handleItemSelect = useCallback((item) => {
        handleClear();
        setSelectedItem(item);
    }, []);

    const handleClear = () => {
        setFormData({
            xcus: '',
            xorg: '',
            xmadd: '',
            xemail: '',
            xphone: '',
            xmobile: '',
            xfax: '',
            xbin: '',
            xlicense: '',
            xstatus: '',
            xtin: '',
            xircno: '',
            xpaymenttype: '',
            xcontact: '',
            xtype: xtype,
        });
       
    };

    const handleDelete = async () => {
        const endpoint = deleteEndpoint;
        await handleApiRequest({
            endpoint,
            method: 'DELETE',
            params: {
                column: 'xcus',
                transactionNumber: formData.xcus
            },
            onSuccess: (response) => {
                setFormData({
                    xcus: '',
                    xorg: '',
                    xmadd: '',
                    xemail: '',
                    xphone: '',
                    xmobile: '',
                    xfax: '',
                    xbin: '',
                    xlicense: '',
                    xstatus: '',
                    xtin: '',
                    xircno: '',
                    xpaymenttype: '',
                    xcontact: '',
                    xtype: xtype,
                });
                setUpdateCount(prevCount => prevCount + 1);
            },
        });
    };






    const handleUpdate = async () => {
        const errors = validateForm(formData, ['xorg', 'xmadd']);
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

        const tableName = "Cacus";
        const updates = {
            xorg: formData.xorg,
            xmadd: formData.xmadd,
            xemail: formData.xemail,
            xphone: formData.xphone,
            xmobile: formData.xmobile,
            xfax: formData.xfax,
            xbin: formData.xbin,
            xstatus: formData.xstatus,
            xlicense: formData.xlicense,
            xtin: formData.xtin,
            xircno: formData.xircono,
            xpaymenttype: formData.xpaymenttype,
            xcontact: formData.xcontact

        };
        const whereConditions = { xcus: formData.xcus, zid: zid };

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





    // Render Loading Page if Necessary
    if (loading) {
        return <LoadingPage />;
    }

    return (
        <div className="grid grid-cols-12">
            {/* Helmet Title for Page */}
            <HelmetTitle title="Supplier Entry" />

            {/* Sidebar with Action Buttons */}
            <div className="col-span-1">
                <SideButtons
                    onAdd={handleAdd}
                    onClear={handleClear}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                />
            </div>

            {/* Main Form Section */}
            {/* <div className="col-span-6"> */}
            <Box sx={{
                gridColumn: 'span 6',
                // border: '1px solid #ccc', // Light gray border
                borderRadius: '8px', // Optional: Rounded corners
                // padding: 2,
            }}>
                <div className="shadow-lg rounded">
                    <div className="w-full px-4 py-4 mx-auto">
                        <Caption title="Supplier Entry" />
                        <Box
                            component="form"
                            sx={{
                                '& > :not(style)': { my: 2 },
                                mx: 'auto',
                                gap: 2,
                                borderRadius: 2,
                                bgcolor: 'white',
                            }}
                            autoComplete="off"
                        >
                            {/* Row 1 */}
                            <Box
                                display="grid"
                                gridTemplateColumns="repeat(3, 1fr)"
                                gap={2}
                                mb={2}
                            >
                                {/* Dropdown for Search Results */}
                                <DynamicDropdown
                                    isOpen={isDropdownOpen}
                                    onClose={() => setDropdownOpen(false)}
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
                                    id="xcus"
                                    name="xcus"
                                    label="Supplier ID"
                                    size="small"
                                    value={formData.xcus}
                                    variant={variant}
                                    fullWidth

                                    onChange={(e) => {
                                        handleChange(e);
                                        const query = e.target.value;
                                        const apiSearchUrl = `api/cacus/${zid}/search?searchText=${query}&searchFields=xcus,xorg,xmadd`;

                                        handleSearch(
                                            e.target.value,
                                            apiSearchUrl,
                                            fieldConfig,
                                            setSearchResults,
                                            setDropdownOpen,
                                            triggerRef,
                                            setDropdownPosition
                                        );
                                    }}
                                    sx={{ gridColumn: 'span 1' }}
                                />
                                {/* Company Field */}
                                <TextField
                                    id="xorg"
                                    name="xorg"
                                    label="Company"
                                    size="small"
                                    value={formData.xorg}
                                    variant={variant}
                                    fullWidth
                                    onChange={handleChange}
                                    sx={{ gridColumn: 'span 2' }}
                                />
                            </Box>

                            {/* Row 2 */}
                            <Box
                                display="grid"
                                gridTemplateColumns="repeat(3, 1fr)"
                                gap={2}
                                mb={2}
                            >
                                {/* Mailing Address */}
                                <TextField
                                    id="xmadd"
                                    name="xmadd"
                                    label="Mailing Address"
                                    size="small"
                                    value={formData.xmadd}
                                    variant={variant}
                                    fullWidth
                                    onChange={handleChange}
                                    sx={{ gridColumn: 'span 1' }}
                                />
                                {/* Email */}
                                <TextField
                                    id="xemail"
                                    name="xemail"
                                    label="Email"
                                    size="small"
                                    value={formData.xemail}
                                    variant={variant}
                                    fullWidth
                                    onChange={handleChange}
                                />
                                {/* Phone */}
                                <TextField
                                    id="xphone"
                                    name="xphone"
                                    label="Phone"
                                    size="small"
                                    value={formData.xphone}
                                    variant={variant}
                                    fullWidth
                                    onChange={handleChange}
                                />
                            </Box>

                            {/* Row 3 */}
                            <Box
                                display="grid"
                                gridTemplateColumns="repeat(3, 1fr)"
                                gap={2}
                                mb={2}
                            >
                                {/* Mobile */}
                                <TextField
                                    id="xmobile"
                                    name="xmobile"
                                    label="Mobile Number"
                                    size="small"
                                    value={formData.xmobile}
                                    variant={variant}
                                    fullWidth
                                    onChange={handleChange}
                                />
                                {/* Fax */}
                                <TextField
                                    id="xfax"
                                    name="xfax"
                                    label="Fax"
                                    size="small"
                                    value={formData.xfax}
                                    variant={variant}
                                    fullWidth
                                    onChange={handleChange}
                                />
                                <TextField
                                    label="BIN"
                                    name='xbin'
                                    variant={variant}
                                    size="small"
                                    onChange={handleChange}
                                    value={formData.xbin}
                                    fullWidth
                                    required
                                />
                            </Box>
                            <Box
                                display="grid"
                                gridTemplateColumns="repeat(3, 1fr)"
                                gap={2}
                              
                            >
                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} >

                                    <TextField

                                        id='xlicense'
                                        name='xlicense'
                                        label="Trade License"
                                        size="small"
                                        value={formData.xlicense}
                                        variant={variant}
                                        onChange={handleChange}
                                        fullWidth
                                        // disabled
                                        required
                                        sx={{ gridColumn: 'span 1' }}

                                    />

                                </Stack>
                                <TextField
                                    label="TIN"
                                    name='xtin'
                                    variant={variant}
                                    size="small"
                                    onChange={handleChange}
                                    value={formData.xtin}
                                    fullWidth
                                    required
                                />
                                <TextField
                                    label="IRC"
                                    name='xircno'
                                    variant={variant}
                                    size="small"
                                    onChange={handleChange}
                                    value={formData.xircno}
                                    fullWidth

                                />

                            </Box>
                            <Box
                                display="grid"
                                gridTemplateColumns="repeat(3, 1fr)"
                                gap={2}
                            >
                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={2}>


                                    <XcodesDropDown
                                        id='xpaymenttype'
                                        name='xpaymenttype'
                                        variant={variant}
                                        label="Payment Type"
                                        size="small"
                                        type="Payment Type"
                                        onSelect={(value) => handleDropdownSelect("xpaymenttype", value)}
                                        value={formData.xpaymenttype}


                                    />

                                </Stack>
                                <TextField
                                    label="Contact Name"
                                    name='xcontact'
                                    variant={variant}
                                    size="small"
                                    onChange={handleChange}
                                    value={formData.xcontact}
                                    fullWidth
                                    required
                                />


                                <FormControl fullWidth
                                size="small"
                                >
                                    <InputLabel id="status-label">Status</InputLabel>
                                    <Select
                                        labelId="status-label"
                                        value={formData.xstatus}
                                        name='xstatus'
                                        label="Status"
                                        onChange={handleChange}
                                        onSelect={(value) => handleDropdownSelect("xstatus", value)}
                                        variant={variant}
                                    >
                                        <MenuItem value="Active">Active</MenuItem>
                                        <MenuItem value="Inactive">Inactive</MenuItem>
                                    </Select>
                                </FormControl>



                            </Box>
                        </Box>
                    </div>
                </div>
            </Box>
            <Box sx={{
                gridColumn: 'span 5',

                // border: '1px solid #ccc', // Light gray border
                borderRadius: '8px', // Optional: Rounded corners
                // padding: 2,
            }}>

                <GenericList
                    apiUrl={apiBaseUrl}
                    caption="Supplier List"
                    columns={[
                        { field: 'xcus', title: 'ID', width: '45%', },
                        { field: 'xorg', title: 'Name', width: '20%' },
                        { field: 'xmadd', title: 'Address', width: '20%', align: 'center' },
                        { field: 'xcontact', title: 'Contact?', width: '15%', align: 'center' },
                    ]}
                    //  additionalParams={{ zid: zid,xrelation:xrelation }}
                    onItemSelect={handleItemSelect}
                    onRefresh={(refresh) => {
                        if (refreshTrigger) {
                            refresh();
                            setRefreshTrigger(false);
                        }
                    }}
                    captionFont="3.9rem"
                    bodyFont=".9rem"
                    xclass="py-4 pl-2"
                />
            </Box>
        </div>
    );
};

export default Supplier;
