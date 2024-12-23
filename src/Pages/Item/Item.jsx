import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    TextField,
    Box,

    Checkbox,
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
import SearchableList from '../../ReusableComponents/SearchableList';
import SortableList from '../../ReusableComponents/SortableList';
import { validateForm } from '../../ReusableComponents/validateForm';
import Swal from 'sweetalert2';
import XlongDropDown from '../../ReusableComponents/XlongDropDown';

const Item = () => {
    // Authentication Context
    const { zid, zemail } = useAuth();
    // State Management
    const [formData, setFormData] = useState({
        zid: 100000,
        zauserid: '',
        xitem: '',
        xdesc: '',
        xunit: '',
        xunitpur: '',
        xcfpur: '',
        xgitem: '',
        xcatitem: '',
        xrate: '',
        xprodnature: '',
        xgenericname: '',
        xgenericdesc: '',
        xdrugtype: '',
        xstrength: '',
        xroute: '',
        xbatmg: '',
        xreordqty: ''


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
    const [sortField, setSortField] = useState('name'); // Default sorting field
    const [sortOrder, setSortOrder] = useState('asc');
    // Handle dropdown value change
    const handleStatusChange = (event) => {
        setStatus(event.target.value);
    };

    const triggerRef = useRef(null);


    const variant = 'outlined';
    const apiBaseUrl = `api/products/`;
    const addEndpoint = 'api/products';
    const updateEndpoint = `api/products/update`;
    const deleteEndpoint = `api/products/${zid}/transaction`;
    const mainSideListEndpoint = `api/products/${zid}/paginated`;
    // const searchEndPoint = `api/products/${zid}/search?searchText=${query}&searchFields=xcus,xorg,xmadd`;


    const fieldConfig = [
        { header: 'ID', field: 'xitem' },
        { header: 'Name', field: 'xdesc' },
        { header: 'Generic Name', field: 'xgenericname' },
        { header: 'Unit', field: 'xunit' },
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

    const handleSortChange = (field) => {
        // Toggle sorting order if the same field is clicked
        setSortOrder((prevOrder) => (field === sortField && prevOrder === 'asc' ? 'desc' : 'asc'));
        setSortField(field);
    };


    const handleDropdownSelect = (fieldName, value) => {
        console.log(fieldName);

        setFormData((prevState) => {
            const updatedState = { ...prevState, [fieldName]: value };

            if (fieldName === 'xgitem') {
                updatedState.xgitem = value.xcode;
                
            }

            return updatedState;
        });
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
            if (response && response.xitem) {
                console.log(response)
                setFormData((prev) => ({ ...prev, xitem: response.xitem }));
                setUpdateCount(prevCount => prevCount + 1);
            } else {
                // alert('Supplier added successfully.');
            }
        });
    };

    const handleItemSelect = useCallback((item) => {
        handleClear();
        setFormData((prev) => ({
            ...prev,xitem:item.xitem,xdesc:item.xdesc,xgitem:item.xgitem,xcatitem:item.xcatitem,xcfpur:item.xcfpur,
            xunit:item.xunit,xunitpur:item.xunitpur
        }));
    }, []);




    // const handleItemSelect = useCallback((item) => {
    //     setSelectedItem(item);
    //     if (item.groupName) {
    //         setGroupName(item.groupName); // Set group name if present
    //     } else {
    //         setGroupName(null); // Clear group name if not present
    //     }
    // }, []);

    const handleClear = () => {
        setFormData({
            zid: zid,
            zauserid: '',
            xitem: '',
            xdesc: '',
            xunit: '',
            xunitpur: '',
            xcfpur: '',
            xgitem: '',
            xcatitem: '',
            xrate: '',
            xprodnature: '',
            xgenericname: '',
            xgenericdesc: '',
            xdrugtype: '',
            xstrength: '',
            xroute: '',
            xbatmg: '',
            // xreordqty: ''

        });
       
    };



    const handleDelete = async () => {
        const endpoint = deleteEndpoint;
        await handleApiRequest({
            endpoint,
            method: 'DELETE',
            params: {
                column: 'xitem',
                transactionNumber: formData.xitem
            },
            onSuccess: (response) => {
                setFormData({
                    zauserid: '',
                    xitem: '',
                    xdesc: '',
                    xunit: '',
                    xunitpur: '',
                    xcfpur: '',
                    xgitem: '',
                    xcatitem: '',
                    xrate: '',
                    xprodnature: '',
                    xgenericname: '',
                    xgenericdesc: '',
                    xdrugtype: '',
                    xstrength: '',
                    xroute: '',
                    xbatmg: '',
                    xreordqty: ''
                });
                setUpdateCount(prevCount => prevCount + 1);
            },
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

        const tableName = "Caitem";
        const updates = {

            xdesc: formData.xdesc,
            xunit: formData.xunit,
            xunitpur: formData.xunitpur,
            xcfpur: formData.xcfpur,
            xgitem: formData.xgitem,
            xcatitem: formData.xcatitem,
            xrate: formData.xrate,
            xprodnature: formData.xprodnature,
            xgenericname: formData.xgenericname,
            xgenericdesc: formData.xgenericdesc,
            xdrugtype: formData.xdrugtype,
            xstrength: formData.xstrength,
            xroute: formData.xroute,
            xbatmg: formData.xbatmg,
            // xreordqty: formData.xreordqty

        };
        const whereConditions = { xitem: formData.xitem, zid: zid };

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
            <HelmetTitle title="Product Entry" />

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
                    <div className="w-full px-4 pt-0 py-4 mx-auto">
                        <Caption title="Product Entry" />
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
                                    id="xitem"
                                    name="xitem"
                                    label="Item Code"
                                    size="small"
                                    // InputLabelProps={{
                                    //     shrink: true, 
                                    // }}
                                    value={formData.xitem}
                                    variant={variant}
                                    fullWidth
                                    onChange={(e) => {
                                        handleChange(e);
                                        const query = e.target.value;
                                        const apiSearchUrl = `api/products/${zid}/search?searchText=${query}&searchFields=xitem,xdesc`;
                                        handleSearch(
                                            e.target.value,
                                            apiSearchUrl,
                                            fieldConfig,
                                            setSearchResults,
                                            setDropdownOpen,
                                            triggerRef,
                                            setDropdownPosition,
                                            query
                                        );
                                    }}
                                    sx={{ gridColumn: 'span 1' }}
                                />
                                {/* Company Field */}
                                <TextField
                                    id="xdesc"
                                    name="xdesc"
                                    label="Name"
                                    size="small"
                                    value={formData.xdesc}
                                    variant={variant}
                                    fullWidth
                                    // InputLabelProps={{
                                    //     shrink: true,
                                        
                                    // }}
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
                                    id="xgenericname"
                                    name="xgenericname"
                                    label="Generic Name"
                                    size="small"
                                    value={formData.xgenericname}
                                    variant={variant}
                                    fullWidth
                                    // InputLabelProps={{
                                    //     shrink: true, 
                                    // }}
                                    onChange={handleChange}
                                    sx={{ gridColumn: 'span 1' }}
                                />
                                {/* Email */}
                                <TextField
                                    id="xgenericdesc"
                                    name="xgenericdesc"
                                    label="Generic Description"
                                    size="small"
                                    value={formData.xgenericdesc}
                                    variant={variant}
                                    fullWidth
                                    // InputLabelProps={{
                                    //     shrink: true,
                                        
                                    // }}
                                    onChange={handleChange}
                                    sx={{ gridColumn: 'span 2' }}
                                />
                                {/* Phone */}

                            </Box>

                            {/* Row 3 */}
                            <Box
                                display="grid"
                                gridTemplateColumns="repeat(3, 1fr)"
                                gap={2}
                                mb={2}
                            >

                                <TextField
                                    id="xdrugtype"
                                    name="xdrugtype"
                                    label="Drug Type"
                                    size="small"
                                    value={formData.xdrugtype}
                                    variant={variant}
                                    fullWidth
                                    // InputLabelProps={{
                                    //     shrink: true,
                                        
                                    // }}
                                    onChange={handleChange}
                                />
                                {/* Mobile */}
                                <TextField
                                    id="xroute"
                                    name="xroute"
                                    label="Route"
                                    size="small"
                                    // InputLabelProps={{
                                    //     shrink: true,
                                        
                                    // }}
                                    value={formData.xroute}
                                    variant={variant}
                                    fullWidth
                                    onChange={handleChange}
                                />

                                <TextField
                                    id="xstrength"
                                    name="xstrength"
                                    label="Strength"
                                    size="small"
                                    // InputLabelProps={{
                                    //     shrink: true,
                                        
                                    // }}
                                    value={formData.xstrength}
                                    variant={variant}
                                    fullWidth
                                    onChange={handleChange}
                                />
                                {/* Fax */}


                            </Box>
                            <Box
                                display="grid"
                                gridTemplateColumns="repeat(3, 1fr)"
                                gap={2}
                                mb={2} // margin-bottom
                            >


                                <XlongDropDown
                                    variant={variant}
                                    label="Group"
                                    size="small"
                                    // InputLabelProps={{
                                    //     shrink: true,
                                        

                                    // }}
                                    name="xgitem"
                                    type="Item Group"
                                    apiUrl={apiBaseUrl} 
                                    onSelect={(value) => handleDropdownSelect("xgitem", value)}
                                    value={formData.xgitem}
                                    defaultValue=""
                                />


                                <XcodesDropDown
                                    variant={variant}
                                    label="Category"
                                    size="small"
                                    // InputLabelProps={{
                                    //     shrink: true,
                                    // }}
                                    name="xcatitem"
                                    type="Category"
                                    apiUrl={apiBaseUrl}
                                    onSelect={(value) => handleDropdownSelect("xcatitem", value)}
                                    value={formData.xcatitem}
                                    defaultValue=""
                                />

                                <TextField
                                    label="Conversion Factor"
                                    name='xcfpur'
                                    variant={variant}
                                    size="small"
                                    defaultValue={1}
                                    onChange={handleChange}
                                    value={formData.xcfpur}
                                    // InputLabelProps={{
                                    //     shrink: true, 
                                    // }}
                                    fullWidth
                                    required
                                />

                            </Box>

                            <Box
                                display="grid"
                                gridTemplateColumns="repeat(3, 1fr)"
                                gap={2}
                                mb={2} // margin-bottom
                            >
                                <TextField
                                    label="Unit"
                                    name='xunit'
                                    variant={variant}
                                    // InputLabelProps={{
                                    //     shrink: true,
                                    // }}
                                    size="small"
                                    onChange={handleChange}
                                    value={formData.xunit}
                                    fullWidth
                                    required
                                />
                                <TextField
                                    label="Purchase Unit"
                                    name='xunitpur'
                                    variant={variant}
                                    // InputLabelProps={{
                                    //     shrink: true,
                                    // }}
                                    size="small"
                                    onChange={handleChange}
                                    value={formData.xunitpur}
                                    fullWidth

                                />

                                {/* <Checkbox
                                    // checked={checked}
                                    //onChange={handleCheckboxChange}
                                    name="Activate?"
                                    color="primary"  // You can use 'primary', 'secondary', 'default' or 'error'
                                /> */}

                            </Box>










                        </Box>
                    </div>
                </div>
            </Box >
            <Box sx={{
                gridColumn: 'span 5',
                borderRadius: '8px', // Optional: Rounded corners
            }}>

                <SortableList
                    apiUrl={mainSideListEndpoint}
                    caption="Item List"
                    sortField="xitem"
                    columns={[
                        { field: 'xitem', title: 'Item Code', width: '35%', },
                        { field: 'xdesc', title: 'Name', width: '45%' },
                        { field: 'xroute', title: 'Route', width: '20%', align: 'center' },
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
                    captionFont=".9rem"
                    bodyFont=".8rem"
                    xclass="py-4 pl-2"
                    mt={0}
                    page={1}


                />
            </Box>
        </div >
    );
};

export default Item;
