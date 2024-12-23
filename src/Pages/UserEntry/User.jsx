import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    TextField,
    Box,

    Checkbox,
    FormControlLabel,
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

const User = () => {
    // Authentication Context
    const { zid } = useAuth();
    // State Management
    const [formData, setFormData] = useState({
        zid: 100000,
        zemail: '',
        xpassword: '',
        xrole: '',
        xwh: '',
        xposition: '',
        zactive: false


    });
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [staffResult, setStaffResult] = useState([]);
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [isStaffOpen, setStaffOpen] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
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
    const staffRef = useRef(null);

    // Configuration
    const variant = 'outlined';
    const apiBaseUrl = `api/xusers/search?zid=${zid}&searchtext={query}`;
    const apiSearchUrl = apiBaseUrl
    const apiStaffUrl = `/api/employee/searchtext?zid=${zid}&searchText={query}`;
    const fieldConfig = [
        { header: 'Login ID', field: 'zemail' },
        { header: 'Store', field: 'xwh' },
        { header: 'Role', field: 'xrole' },
        { header: 'Employee ID', field: 'xposition' },
    ];


    const staffConfig = [
        { header: 'Employee ID', field: 'xposition' },
        { header: 'Name', field: 'xname' },
        { header: 'Department', field: 'xdeptname' },

    ];





    useEffect(() => {
        if (zid) setLoading(false);
    }, [zid]);

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

    const handleCheckboxChange = (event) => {
        const isChecked = event.target.checked; // Simplified logic
        setFormData((prevState) => ({
            ...prevState,
            zid: zid,
            zactive: isChecked ? 1 : 0,
        }));
    };



    const handleResultClick = (result) => {
        setFormData((prev) => ({
            ...prev,
            ...result,
            zid,
            zactive: parseInt(result.zactive) === 1,
        }));
        setDropdownOpen(false);
    };


    const handleStaffClick = (result) => {
        setFormData((prev) => ({
            ...prev,
            ...result,
            zid,
            zactive: parseInt(result.zactive) === 1,
        }));
        setStaffOpen(false);
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

        const endpoint = 'api/xusers';
        const data = {
            ...formData,

            zid: zid
        };
        addFunction(data, endpoint, 'POST', (response) => {
            if (response && response.xitem) {

                setFormData((prev) => ({ ...prev, xitem: response.xitem }));
                setUpdateCount(prevCount => prevCount + 1);
            } else {
                // alert('Supplier added successfully.');
            }
        });
    };






    const handleItemSelect = useCallback((item) => {

        setSelectedItem(item,);
    }, []);

    const handleClear = () => {
        setFormData({
            zid: zid,
            zemail: '',
            xpassword: '',
            xrole: '',
            xwh: '',
            xposition: '',
            zactive: ''

        });
        alert('Form cleared.');
    };

    const handleDelete = async () => {

        const endpoint = `api/xusers/${zid}/${formData.zemail}`;
        await handleApiRequest({
            endpoint,
            method: 'DELETE',
            onSuccess: (response) => {
                setFormData({
                    zid: zid,
                    zemail: '',
                    xpassword: '',
                    xrole: '',
                    xwh: '',
                    xposition: '',

                });
                setUpdateCount(prevCount => prevCount + 1);

            },
        });
    };


    const handleUpdate = async () => {
        setUpdateCount(prevCount => prevCount + 1);
        const endpoint = `api/xusers/${zid}/${formData.zemail}`;
        const data = {
            ...formData,
            zid: zid
        };


        await handleApiRequest({
            endpoint,
            data,
            method: 'PUT',
            // onSuccess: (response) => {
            //     setErrors({});
            // },
        });
    };

    // Render Loading Page if Necessary
    if (loading) {
        return <LoadingPage />;
    }

    return (
        <div className="grid grid-cols-12">
            {/* Helmet Title for Page */}
            <HelmetTitle title="User Entry" />

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
                        <Caption title="User Entry" />
                        <Box
                            component="form"
                            sx={{
                                '& > :not(style)': { my: 1 },
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
                                gridTemplateColumns="repeat(2, 1fr)"
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
                                    id="zemail"
                                    name="zemail"
                                    label="Login ID"
                                    size="small"
                                    value={formData.zemail}
                                    variant={variant}
                                    fullWidth
                                    onChange={(e) => {
                                        handleChange(e);
                                        handleSearch(
                                            e.target.value,
                                            apiBaseUrl,
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
                                    id="xpassword"
                                    name="xpassword"
                                    label="Password"
                                    type='password'
                                    size="small"
                                    value={formData.xpassword}
                                    variant={variant}
                                    fullWidth
                                    onChange={handleChange}
                                    sx={{ gridColumn: 'span 1' }}
                                />


                            </Box>

                            {/* Row 2 */}
                            <Box
                                display="grid"
                                gridTemplateColumns="repeat(2, 1fr)"
                                gap={2}
                                mb={2}
                            >

                                <TextField
                                    id="xrole"
                                    name="xrole"
                                    label="Role"
                                    size="small"
                                    value={formData.xrole}
                                    variant={variant}
                                    fullWidth
                                    onChange={handleChange}
                                    sx={{ gridColumn: 'span 1' }}
                                />


                                <XcodesDropDown
                                    id="xmstat"
                                    name="xmstat"
                                    variant={variant}
                                    label="Store"
                                    size="small"
                                    type="Branch"
                                    apiUrl={apiBaseUrl} // Replace with your API endpoint
                                    onSelect={(value) => handleDropdownSelect("Store", value)}
                                    value={formData.xwh}
                                    defaultValue=""
                                />
                            </Box>
                            <Box
                                display="grid"
                                gridTemplateColumns="repeat(2, 1fr)"
                                gap={2}
                                mb={2}
                            >
                                <TextField
                                    id="xposition"
                                    ref={staffRef}
                                    name="xposition"
                                    label="Employee ID"
                                    size="small"
                                    value={formData.xposition}
                                    variant={variant}
                                    fullWidth
                                    onChange={(e) => {
                                        handleChange(e);
                                        handleSearch(
                                            e.target.value,
                                            apiStaffUrl,
                                            staffConfig,
                                            setStaffResult,
                                            setStaffOpen,
                                            staffRef,
                                            setDropdownPosition
                                        );
                                    }}
                                    sx={{ gridColumn: 'span 1' }}
                                />

                                <DynamicDropdown
                                    isOpen={isStaffOpen}
                                    onClose={() => setStaffOpen(false)}
                                    triggerRef={staffRef}
                                    data={staffResult}
                                    headers={staffConfig.map((config) => config.header)}
                                    onSelect={handleStaffClick}
                                    dropdownWidth={800}
                                    dropdownHeight={400}
                                />

                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={formData.zactive || false}
                                            onChange={handleCheckboxChange}
                                            name="Activate?"
                                            disableRipple
                                            color="primary"
                                        />
                                    }
                                    label="Active?" // Add the label here
                                />

                            </Box>




                        </Box>
                    </div>
                </div>
            </Box >

            <Box sx={{
                gridColumn: 'span 5',

                // border: '1px solid #ccc', // Light gray border
                borderRadius: '8px', // Optional: Rounded corners
                // padding: 2,
            }}>

                {/* <GenericList
                    apiUrl={apiSearchUrl}
                    caption="Item List"
                    columns={[
                        { field: 'xitem', title: 'Item Code', width: '45%', },
                        { field: 'xdesc', title: 'Name', width: '25%' },
                        { field: 'xunit', title: 'Unit', width: '15%', align: 'center' },
                        { field: 'xroute', title: 'Route', width: '15%', align: 'center' },
                    ]}
                    //  additionalParams={{ zid: zid,xrelation:xrelation }}
                    onItemSelect={handleItemSelect}
                    onRefresh={(refresh) => {
                        if (refreshTrigger) {
                            refresh();
                            setRefreshTrigger(false); // Reset trigger after refreshing
                        }
                    }}
                    captionFont="3.9rem"
                    bodyFont=".9rem"
                    xclass="py-4 pl-2"
                /> */}
            </Box>
        </div >
    );
};

export default User;
