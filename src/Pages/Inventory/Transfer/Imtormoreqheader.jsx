import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    TextField,
    Box,
    Typography,
    Button,
    Modal,
} from '@mui/material';
import { useAuth } from '../../../Provider/AuthProvider';
import LoadingPage from '../../Loading/Loading';
import HelmetTitle from '../../../utility/HelmetTitle';
import SideButtons from '../../../Shared/SideButtons';
import Caption from '../../../utility/Caption';
import DynamicDropdown from '../../../ReusableComponents/DynamicDropdown';
import XlongDropDown from '../../../ReusableComponents/XlongDropDown';
import { handleApiRequest } from '../../../utility/handleApiRequest';
import { addFunction } from '../../../ReusableComponents/addFunction';
import { handleSearch } from '../../../ReusableComponents/handleSearch';
import { convertDate } from '../../../utility/convertDate';
import axiosInstance from '../../../Middleware/AxiosInstance';
import Swal from 'sweetalert2';
import { validateForm } from '../../../ReusableComponents/validateForm';
import Imtordetaildam from './Imtordetaildam';
import SortableList from '../../../ReusableComponents/SortableList';
import Imtordetail from './Imtordetail';
import Moreqdetailstore from './Moreqdetailstore';
import useEscape from '../../../utility/useEscape';


const Imtormoreqheader = () => {
    // Authentication Context
    const { zid, zemail } = useAuth();
    console.log(zid, zemail)
    const [formData, setFormData] = useState({
        zid: zid,
        xtornum: '',
        xstatustor: '',
        xdate: new Date().toISOString().split('T')[0],
        xfwh: '',
        xfwhdesc: '',
        xtwh: '',
        xtwhdesc: '',
        xnote: '',
        xlong: ''


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
    const apiListUrl = `api/imtordetail?action=requisition/${zid}/${formData.xtornum}`


    // Handle dropdown value change
    const handleStatusChange = (event) => {
        setStatus(event.target.value);
    };



    const triggerRef = useRef(null);
    const supplierRef = useRef(null);
    const variant = 'outlined';
    const apiBaseUrl = `api/imtorheader`;
    const apiListUrl2 = `api/imtorheader/confirmed`;

    const fieldConfig = [
        { header: 'Requisition Number', field: 'xtornum' },
        { header: 'Date', field: 'xdate' },
        { header: 'From Store', field: 'xfwh' },
        { header: 'Store Name', field: 'xfwhdesc' },
        { header: 'Status', field: 'xstatustor' }
    ];



    const handleSortChange = (field) => {

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



    useEffect(() => {
        if (selectedItem) {
            // console.log(convertDate(selectedItem.xdate))
            setFormData({
                ...selectedItem,
                xdate: convertDate(selectedItem.xdate)
            });
        }
    }, [selectedItem]);


    useEffect(() => {
        if (refreshCallback && formData.xtornum) {
            refreshCallback(); // Trigger the refresh callback from SortableList
        }
    }, [formData.xtornum, refreshCallback]);


    useEffect(() => {
        setRefreshTrigger(true);
    }, [updateCount]);






    const handleItemSelect = useCallback((item) => {
        console.log(item)
        setFormData((prev) => ({
            ...prev,
            xtornum: item.xtornum, xfwh: item.xfwh, xlong: item.xlong, xfwhdesc: item.xfwhdesc, xstatustor: item.xstatustor,
        }));
    }, []);

    const handleClear = () => {
        setFormData({
            zid: zid,
            xtornum: '',
            xstatustor: '',
            xdate: new Date().toISOString().split('T')[0],
            xfwh: '',
            xfwhdesc: '',
            xtwh: '',
            xtwhdesc: '',
            xnote: '',
            xlong: ''

        });
        alert('Form cleared.');
    };






    const handleOpen = () => {
        document.body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`;
        document.body.style.overflow = "hidden";
        setOpen(true);
    };

    const handleClose = () => {
        document.body.style.paddingRight = "";
        document.body.style.overflow = "";
        setOpen(false);
    };

    useEscape(handleClose)

    const handleConfirm = async () => {
        if (window.confirm('Issue Item?')) {
            setStatus("Processing...");
            const xlen = 8;
            const params = {
                zid: 100000,
                zemail: zemail,
                xtornum: formData.xtornum,
                xdate: formData.xdate,
                xfwh: formData.xfwh,
                xwh: formData.xtwh,
                xstatustor: formData.xstatustor,
                xlen: xlen
            };

            try {

                const response = await axiosInstance.post("/api/imtorheader/confirmsr", params);
                setStatus(response.data);

                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Operation completed successfully'
                });
                reloadFormData();
                setUpdateCount(prevCount => prevCount + 1);
            } catch (error) {
                // Handle error response
                setStatus("Error: " + (error.response?.data || error.message));

                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong. Please try again.'
                });
            }
        }
    };


    const handleCheck = async () => {
        setStatus("Processing...");
        const params = {
            zid: 100000,
            zemail: zemail,
            xtornum: formData.xtornum,
            xdate: formData.xdate,
            xfwh: formData.xfwh,
            xstatustor: formData.xstatustor
        };

        try {

            const response = await axiosInstance.post("/api/imtorheader/checksr", params);
            setStatus(response.data);

            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Operation completed successfully'
            });
            reloadFormData();
        } catch (error) {
            setStatus("Error: " + (error.response?.data || error.message));

            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong. Please try again.'
            });
        }

    };


    const reloadFormData = async () => {
        try {

            if (!zid || !formData?.xtornum) {
                console.error("Missing required parameters: zid or xtornum");
                return;
            }
            const requestBody = {
                selectedFields: ["xstatustor"],
                whereConditions: {
                    zid: zid,
                    xtornum: formData.xtornum
                }
            };


            const response = await axiosInstance.post("/api/imtorheader/fetch", requestBody);
            console.log("API Response:", response);


            if (response?.data) {
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    ...response.data[0],
                }));
            } else {
                console.warn("No data received from the API.");
            }
        } catch (error) {
            console.error("Error reloading form data:", error);
            if (error.response) {
                console.error(
                    `API returned status ${error.response.status}:`,
                    error.response.data
                );
            }
        }
    };




    if (loading) {
        return <LoadingPage />;
    }

    return (

        <div>

            <Button
                onClick={''}
                variant="outlined"
                sx={{
                    marginLeft: 'auto', // Automatically push the button to the center horizontally
                    marginRight: 'auto', // Same as above
                    paddingX: 2, // Horizontal padding
                    paddingY: 0.5, // Vertical padding (adjusted in conjunction with height)
                    paddingTop: '2px', // Explicit padding for top
                    paddingBottom: '2px', // Explicit padding for bottom
                    whiteSpace: 'nowrap',
                    height: '2.5rem',
                    display: 'block', // Ensure the button takes up its own space
                    '&:hover': {
                        backgroundColor: '#F59E0B',
                    },
                }}
                size="medium"
            >
                View Report
            </Button>

            <div className='grid grid-cols-12 gap-1 mb-2'>
                <div className='col-span-1'>
                </div>

                <Button
                    onClick={handleCheck}
                    variant='outlined'
                    sx={{
                        marginLeft: 1,
                        paddingX: 2, // equivalent to Tailwind's px-2
                        paddingY: 0.5, // equivalent to Tailwind's py-0.5
                        whiteSpace: 'nowrap',
                        gridColumn: 'span 2',
                        // equivalent to Tailwind's w-24 (6rem = 24 * 0.25rem)
                        height: '2.5rem', // equivalent to Tailwind's h-10 (2.5rem = 10 * 0.25rem)
                        '&:hover': {
                            backgroundColor: '#F59E0B', // Yellow-600
                        },
                    }}
                    size="medium"
                    disabled={formData.xstatustor === "Confirmed" || formData.xtornum === "" }
                >
                    Check And Hold
                </Button>
                <Button
                    onClick={handleOpen}
                    variant='outlined'
                    sx={{
                        marginLeft: 1,
                        paddingX: 1,
                        paddingY: 0.5,
                        height: '2.5rem',
                        '&:hover': {
                            backgroundColor: '#F59E0B', // Yellow-600
                        },
                    }}
                    size="medium"
                    disabled={formData.xtornum === ""}
                >
                    Detail
                </Button>
                <Button
                    onClick={handleConfirm}
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
                    disabled={formData.xstatustor === "Confirmed" || formData.xtornum === "" }

                >
                    Issue
                </Button>
            </div>


            <div className="grid grid-cols-12">




                {/* Helmet Title for Page */}
                <HelmetTitle title="Issue From Store" />

                {/* Sidebar with Action Buttons */}
                <div className="col-span-1">
                    <SideButtons
                        onClear={handleClear}
                        showAdd={false}
                        showUpdate={false}
                        showDelete={false}

                    />
                </div>


                <Modal
                    open={open}
                    onClose={handleClose}
                    disablePortal
                    disableEnforceFocus
                    disableAutoFocus
                    disableScrollLock
                >
                    <Box sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "1300px", // Fixed width
                        height: "500px", // Fixed height
                        bgcolor: "background.paper",
                        border: "2px solid #000",
                        boxShadow: 24,
                        borderRadius: "5px",
                        p: 4,
                        zIndex: 10,
                    }}>
                        <Moreqdetailstore xtornum={formData.xtornum} />
                    </Box>
                </Modal>
                {/* Modal */}

                <Box sx={{
                    gridColumn: 'span 5',
                    // border: '1px solid #ccc', // Light gray border
                    borderRadius: '8px', // Optional: Rounded corners
                    // padding: 2,
                }}>



                    <div className="shadow-lg rounded">
                        <div className="w-full  py-2 pt-0 mx-auto ">
                            <Caption title="Issue From Store" />
                            <Box
                                component="form"
                                sx={{
                                    '& > :not(style)': { my: 2 },
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
                                        id="xtornum"
                                        name="xtornum"
                                        label="SR Number"
                                        
                                        size="small"
                                        value={formData.xtornum || ''}
                                        variant={variant}
                                        fullWidth
                                        onChange={(e) => {
                                            handleChange(e);
                                            const query = e.target.value;
                                            const apiSearchUrl = `api/imtorheader/search?action=requisition&zid=${zid}&text=${query}`;
                                            // const apiSearchUrl = `api/imtorheader/All?zid=${zid}&text=${encodeURIComponent(query)}`;

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
                                        label="SR Date"
                                        
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


                                <Box
                                    display="grid"
                                    gridTemplateColumns="repeat(2, 1fr)"
                                    gap={2}
                                    mb={2}
                                >



                                    <XlongDropDown
                                        variant={variant}
                                        label="From Store"
                                        size="small"
                                        name="xfwh"
                                        type="Branch"
                                        value={formData.xfwh}
                                        defaultValue=""
                                        error={!!formErrors.xfwh} 
                                        helperText={formErrors.xfwh}
                                        withXlong="false"
                                        
                                        
                                    />


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
                                            {formData.xstatustor}
                                        </Typography>
                                    </Box>


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
                                        readOnly
                                        
                                        fullWidth
                                        required
                                        multiline
                                        sx={{
                                            gridColumn: 'span 3',
                                            
                                        }}
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
                        apiUrl={`api/imtorheader/confirmed`}
                        isFolded={false}
                        caption="Requisition List"
                        columns={[
                            { field: 'xtornum', title: 'Requisition Number', width: '25%', align: 'left' },
                            { field: 'xfwh', title: 'Store', width: '25%', align: 'left' },
                            { field: 'xfwhdesc', title: 'Store Name', width: '40%', align: 'left' },
                            { field: 'xdate', title: 'Date', width: '10%', align: 'left' },
                            { field: 'xstatustor', title: 'Status', width: '10%', align: 'left' },
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
                        sortField="xtornum"
                        additionalParams={{ zid: zid, xstatustor: 'Approved', xtrn: 'SR--' }}
                        captionFont=".9rem"
                        xclass="py-4 pl-2"
                        bodyFont=".8rem"
                        mt={0}
                        page={1}
                    />
                    <SortableList

                        apiUrl={`api/imtordetail/${zid}/${formData.xtornum}`}
                        isFolded={false}
                        caption="Store Requisition Detail List"
                        columns={[
                            { field: 'xrow', title: 'Serial', width: '5%', align: 'left' },
                            { field: 'xitem', title: 'Item', width: '10%', align: 'left' },
                            { field: 'xdesc', title: 'Item Code', width: '65%', align: 'left' },
                            { field: 'xprepqty', title: 'Required Quantity', width: '65%', align: 'left' },
                            { field: 'xqtyalc', title: 'Issued Quantity', width: '65%', align: 'left' },
                            { field: 'xstype', title: 'Stock Status', width: '65%', align: 'left' },

                        ]}
                        // onItemSelect={handleItemSelect}
                        onRefresh={(refresh) => {
                            if (formData.xtornum) {
                                refresh(); // Trigger the refresh only when xtornum is available
                            }
                        }}
                        pageSize={10}
                        // onSortChange={handleSortChange}
                        sortField="xtornum"
                        additionalParams={{}}
                        // captionFont=".9rem"
                        xclass="py-0 pl-2"
                      
                        mt={2}
                        page={1}
                    // isModal
                    />
                </Box>
            </div >
        </div>
    );
};

export default Imtormoreqheader;
