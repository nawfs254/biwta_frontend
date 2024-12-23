import React, { useEffect, useRef, useState } from 'react';

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
    Modal,
    Typography,
    Checkbox,
    FormGroup,
} from '@mui/material';
import HelmetTitle from '../../utility/HelmetTitle';
import SideButtons from '../../Shared/SideButtons';
import Caption from '../../utility/Caption';
import XcodesDropDown from '../../ReusableComponents/XcodesDropDown';
import { useAuth } from '../../Provider/AuthProvider';
import PdDependent from '../DependentInfo/PdDependent';
import { handleApiRequest } from '../../utility/handleApiRequest';
import LoadingPage from '../Loading/Loading';
import axiosInstance from '../../Middleware/AxiosInstance';
import DynamicDropdown from '../../ReusableComponents/DynamicDropdown';
import { handleSearch } from '../../ReusableComponents/handleSearch';
import { addFunction } from '../../ReusableComponents/addFunction';
import { validateForm } from '../../ReusableComponents/validateForm';
import Swal from 'sweetalert2';
import useEscape from '../../utility/useEscape';


const Pdmsthrd = () => {
    const [dropdownValues, setDropdownValues] = useState({
        xdesignation: "",
        xdeptname: "",
        xsalute: '',
        xbloodgroup: '',

    });

    const fieldConfig = [
        { header: 'ID', field: 'xstaff', visible: false },
        { header: 'Salut', field: 'xsalute' },
        { header: 'Name', field: 'xname' },
        { header: 'Department', field: 'xdeptname' },
        { header: 'Designation', field: 'xdesignation' },
    ];

    const { zid, zemail } = useAuth();
    const [searchResults, setSearchResults] = useState([]);

    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
    const [isTyping, setIsTyping] = useState(false); // To handle typing state

    const listRef = useRef(null);
    const formRef = useRef(null);
    const inputRef = useRef(null);
    const [errors, setErrors] = useState({});
    const [formErrors, setFormErrors] = useState({});
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const triggerRef = useRef(null);
    const apiBaseUrl = "api/employee";
    const variant = 'outlined'
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);





    const [formData, setFormData] = useState({
        zid: zid,
        zauserid: '',
        xstaff: '',
        xname: '',
        xfstname: '',
        xbirthdate: '',
        xsalute: '',
        xlastname: '',
        xdeptname: '',
        xdesignation: '',
        xposition: '',
        xmname: '',
        xsex: 'Male',
        xnid: '',
        xreligion: '',
        xmobile: '',
        xemail: '',
        xjobtitle: '',
        xlocation: '',
        xregino: '',
        xprofdegree: ''


    });

    const query = ''
    const apiSearchUrl = `api/employee/${zid}/search?searchText=${query}&searchFields=xstaff,xname,xmobile`
    const addEndpoint = 'api/employee';
    const updateEndpoint = `api/employee/update`;
    const deleteEndpoint = `api/employee/${zid}/transaction`;
    const mainSideListEndpoint = `api/employee/${zid}/paginated`;

    useEffect(() => {
        if (zid && zemail) {
            setLoading(false);
        }
    }, [zid, zemail]);



    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => {
            const updatedData = { ...prev, [name]: value };

            // Concatenate salutation, first name, and last name for Full Name
            updatedData.xname = `${dropdownValues.xsalute || ''} ${updatedData.xfstname || ''} ${updatedData.xmname || ''} ${updatedData.xlastname || ''}`.trim();
            return updatedData;
        });
        setIsTyping(true);
    };


    const handleResultClick = (result) => {

        setFormData((prevState) => ({
            ...prevState,
            ...result,
            zid: zid,
        }));

        setDropdownOpen(false);
    };

    const handleCheckboxChange = (event) => {
        const isChecked = event.target.checked; // Simplified logic
        setFormData((prevState) => ({
            ...prevState,
            zid: zid,
            zactive: isChecked ? 1 : 0,
        }));
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

    const handleGenderChange = (event) => {
        const value = event.target.value;
        setFormData((prev) => ({
            ...prev,
            xsex: value,
        }));
    };



    const handleAdd = async () => {
        const endpoint = addEndpoint;

        const data = {
            ...formData,
            ...dropdownValues,
            zauserid: zemail,
            zid: zid,
        };



        addFunction(data, endpoint, 'POST', (response) => {
            if (response && response.xstaff) {
                console.log(response)
                setFormData((prev) => ({ ...prev, xstaff: response.xstaff }));
                // setUpdateCount(prevCount => prevCount + 1);
            } else {
                // alert('Supplier added successfully.');
            }
        });

    };






    const handleUpdate = async () => {
        const errors = validateForm(formData, ['xmobile']);
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            Swal.fire({
                icon: 'error',
                title: 'Invalid Input',
                text: 'Please fix the errors before proceeding.',
            });
            return;
        }

        const tableName = "Pdmst";
        const updates = {


            xname: formData.xname,
            xfstname: formData.xfstname,
            xbirthdate: formData.xbirthdate,
            xsalute: formData.xsalute,
            xlastname: formData.xlastname,
            xdeptname: formData.xdeptname,
            xdesignation: formData.xdesignation,
            // xposition: formData.xposition,
            xmname: formData.xmname,
            xsex: formData.xsex,
            xnid: formData.xnid,
            xreligion: formData.xreligion,
            xmobile: formData.xmobile,
            xemail: formData.xemail,
            xjobtitle: formData.xjobtitle,
            xlocation: formData.xlocation,
            xregino: formData.xregino,
            xprofdegree: formData.xprofdegree

        };
        const whereConditions = { xstaff: formData.xstaff, zid: zid };

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
        await handleApiRequest({
            endpoint,
            method: 'DELETE',
            params: {
                column: 'xstaff',
                transactionNumber: formData.xstaff
            },
            onSuccess: (response) => {
                setFormData({
                    xstaff: '',
                    xfstname: '',
                    xlastname: '',
                    xname: '',
                    xnid: '',
                    xmobile: '',
                    zauserid: '',
                    xbirthdate: '',
                    xsalute: '',
                    xdeptname: '',
                    xdesignation: '',
                    xemptype: '',
                    xposition: '',
                    xmname: '',
                    xsex: 'Male',
                    xreligion: '',
                    xbloodgroup: '',
                    xemail: '',
                    xjobtitle: '',
                    xmstat: '',
                    xlocation: '',
                    xregino: '',
                    xprofdegree: ''

                });
                setChecked(false);
            },
        });
    };


    const handleClear = () => {
        setFormData({
            xstaff: '',
            xfstname: '',
            xlastname: '',
            xname: '',
            xnid: '',
            xmobile: '',
            zauserid: '',
            xbirthdate: '',
            xsalute: '',
            xdeptname: '',
            xdesignation: '',
            xemptype: '',
            xposition: '',
            xmname: '',
            xsex: 'Male',
            xreligion: '',
            xbloodgroup: '',
            xemail: '',
            xjobtitle: '',
            xmstat: '',
            xlocation: '',
            xregino: '',
            xprofdegree: ''

        });
        alert('Form cleared.');
    };




    const handleDropdownSelect = (fieldName, value) => {
        setFormData((prevState) => ({
            ...prevState,
            [fieldName]: value,
        }));
    };


    if (loading && !zid && !zemail) {
        return <LoadingPage />;
    }

    return (
        <div className='grid grid-cols-12'>
            <HelmetTitle title="Employee Information" />
            <div className="">
                <SideButtons
                    onAdd={handleAdd}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                    onClear={handleClear}
                />
            </div>
            <div className='col-span-11 shadow-lg'>
                <Button
                    onClick={handleOpen}
                   variant='outlined'
                    sx={{
                        marginLeft: 1,
                        paddingX: 2,
                        paddingY: 0.5,
                        height: '2.5rem',
                        mb:2,
                        '&:hover': {
                            backgroundColor: '#F59E0B', // Yellow-600
                        },
                    }}
                    size="medium"

                >
                    Family Information
                </Button>

                {/* Modal */}
                <Modal
                    open={open}
                    onClose={handleClose}
                    disablePortal
                    disableEnforceFocus
                    disableAutoFocus
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
                        p: 4,
                        zIndex: 10,
                    }}>
                        <PdDependent xstaff={formData.xstaff} xname={formData.xname} />
                    </Box>
                </Modal>
                {/* Modal */}

                <div className=' shadow-lg  rounded'>
                    <div className="w-full px-2  py-2 pt-0   mx-auto  ">
                        <Caption title={"Employee Entry"} />
                        <Box
                            component="form"
                            sx={{
                                '& > :not(style)': { my: 1 },
                                mx: 'auto',
                                gap: 2,
                                mt: 2,
                                borderRadius: 2,
                                bgcolor: 'white',
                            }}
                            noValidate
                            autoComplete="off"

                        >
                            {/* Row 1 */}
                            <Box
                                display="grid"
                                gridTemplateColumns="repeat(4, 1fr)"
                                gap={2}
                                mb={2}
                               
                               
                            >

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
                                <TextField
                                    ref={triggerRef}
                                    id='xstaff'
                                    name='xstaff'
                                    label="Employee ID"
                                    size="small"
                                    // InputLabelProps={{
                                    //     shrink: true,
                                    //     sx: {
                                    //         fontWeight: 600,
                                    //     },
                                    // }}
                                    value={formData.xstaff}
                                    variant={variant}
                                    fullWidth
                                    onChange={(e) => {
                                        handleChange(e);
                                        const apiSearchUrl = `api/employee/${zid}/search?searchText=${e.target.value}&searchFields=xstaff,xname,xmobile`
                                        handleSearch(
                                            e.target.value,
                                            apiSearchUrl,
                                            fieldConfig,
                                            setSearchResults,
                                            setDropdownOpen,
                                            inputRef,
                                            setDropdownPosition
                                        )
                                    }}
                                    required
                                    sx={{ gridColumn: 'span 1' }}
                                />
                                <TextField

                                    id='xname'
                                    name='xname'
                                    label="Full Name"
                                    size="small"
                                    value={formData.xname}
                                    variant={variant}
                                    fullWidth
                                    // disabled
                                    required
                                    sx={{ gridColumn: 'span 3' }}
                                    // InputLabelProps={{
                                    //     shrink: true, // Ensures the label stays above the input field
                                    //     sx: {
                                    //         fontWeight: 600, // Adjust font size here
                                    //     },
                                    // }}
                                />
                            </Box>


                            <Box
                                display="grid"
                                gridTemplateColumns="repeat(4, 1fr)"
                                gap={2}
                                mb={2} // margin-bottom
                            >
                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={2}>

                                    <XcodesDropDown
                                        id='xsalute'
                                        name='xsalute'
                                        variant={variant}
                                        label="Salutation"
                                        size="small"
                                        // InputLabelProps={{
                                        //     shrink: true,
                                        //     sx: {
                                        //         fontWeight: 600,
                                        //     },

                                        // }}
                                        type="salutation"
                                        apiUrl={apiBaseUrl}
                                        onSelect={(value) => handleDropdownSelect("xsalute", value)}
                                        value={formData.xsalute}


                                    />

                                </Stack>
                                <TextField
                                    label="First Name"
                                    name='xfstname'
                                    variant={variant}
                                    size="small"
                                    // InputLabelProps={{
                                    //     shrink: true,
                                    //     sx: {
                                    //         fontWeight: 600, // Adjust font size here
                                    //     },
                                    // }}
                                    onChange={handleChange}
                                    value={formData.xfstname}
                                    fullWidth
                                    required
                                />
                                <TextField
                                    label="Middle Name"
                                    name='xmname'
                                    variant={variant}
                                    size="small"
                                    // InputLabelProps={{
                                    //     shrink: true,
                                    //     sx: {
                                    //         fontWeight: 600, // Adjust font size here
                                    //     },

                                    // }}
                                    onChange={handleChange}
                                    value={formData.xmname}
                                    fullWidth
                                    required
                                />
                                <TextField
                                    label="Last Name"
                                    name='xlastname'
                                    variant={variant}
                                    size="small"
                                    // InputLabelProps={{
                                    //     shrink: true,
                                    //     sx: {
                                    //         fontWeight: 600, // Adjust font size here
                                    //     },

                                    // }}
                                    onChange={handleChange}
                                    value={formData.xlastname}
                                    fullWidth
                                    required
                                />
                            </Box>


                            <Stack
                                direction={{ xs: 'column', sm: 'row' }}
                                // spacing={2} 
                                mb={2}
                                display="grid"
                                gap={2}
                                gridTemplateColumns="repeat(4, 1fr)"
                            >
                                <FormControl
                                    variant={variant}
                                    component="fieldset"
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'start',

                                        gap: 1,
                                    }}
                                >
                                    <FormLabel
                                        id="gender-label"
                                        size="small"
                                        // sx={{
                                        //     fontSize: '0.8rem',
                                        //     fontWeight: 600
                                        // }}
                                    >
                                        Gender
                                    </FormLabel>
                                    <RadioGroup
                                        row
                                        aria-labelledby="gender-label"
                                        name="xsex"
                                        defaultValue="Male"
                                        onChange={handleGenderChange}
                                    >
                                        <FormControlLabel
                                            value="Male"
                                            control={
                                                <Radio
                                                    size="small" // Smaller button size
                                                    sx={{ transform: 'scale(0.8)' }} // Further scaling if needed
                                                />
                                            }
                                            label={
                                                <span style={{ fontSize: '0.8rem' }}>Male</span> // Smaller text for the label
                                            }
                                        />
                                        <FormControlLabel
                                            value="Female"
                                            control={
                                                <Radio
                                                    size="small"
                                                    sx={{ transform: 'scale(0.8)' }}
                                                />
                                            }
                                            label={
                                                <span style={{ fontSize: '0.8rem' }}>Female</span>
                                            }
                                        />
                                        <FormControlLabel
                                            value="Other"
                                            control={
                                                <Radio
                                                    size="small"
                                                    sx={{ transform: 'scale(0.8)' }}
                                                />
                                            }
                                            label={
                                                <span style={{ fontSize: '0.8rem' }}>Other</span>
                                            }
                                        />
                                    </RadioGroup>
                                </FormControl>



                                <TextField
                                    label="Date of Birth"
                                    type="date"
                                    name='xbirthdate'
                                    size="small"
                                    InputLabelProps={{
                                        shrink: true,
                                        // sx: {
                                        //     fontWeight: 600, // Adjust font size here
                                        // },

                                    }}
                                    onChange={handleChange}

                                    value={formData.xbirthdate}
                                    variant={variant}
                                    fullWidth
                                />
                                <TextField size='small'
                                    name='xnid'
                                    onChange={handleChange}
                                    variant={variant}
                                    // InputLabelProps={{
                                    //     shrink: true,
                                    //     sx: {
                                    //         fontWeight: 600, // Adjust font size here
                                    //     },

                                    // }}
                                    label="National ID"
                                    value={formData.xnid}
                                    fullWidth required
                                />

                                <XcodesDropDown
                                    variant={variant}
                                    label="Designation"
                                    size="small"
                                    // InputLabelProps={{
                                    //     shrink: true,
                                    // }}
                                    name="xdesignation"
                                    // fontWeight={600}
                                    type="Designation"
                                    apiUrl={apiBaseUrl} // Replace with your API endpoint
                                    onSelect={(value) => handleDropdownSelect("xdesignation", value)}
                                    value={formData.xdesignation}
                                    defaultValue=""
                                />
                            </Stack>
                            {/* </Box> */}
                            {/* Row 4 */}
                            <Stack
                                direction={{ xs: 'column', sm: 'row' }}
                                // spacing={2} 
                                mb={2}
                                display="grid"
                                gap={2}
                                gridTemplateColumns="repeat(4, 1fr)"
                            >
                                <XcodesDropDown
                                    variant={variant}
                                    name='xdeptname'
                                    label="Department"
                                    // fontWeight={600}
                                    size="small"
                                    // InputLabelProps={{
                                    //     shrink: true,
                                    // }}
                                    type="Department"

                                    apiUrl={apiBaseUrl} // Replace with your API endpoint
                                    onSelect={(value) => handleDropdownSelect("xdeptname", value)}
                                    value={formData.xdeptname}
                                    defaultValue=""
                                />
                                <XcodesDropDown
                                    id="xreligion"
                                    name="xreligion"
                                    variant={variant}
                                    label="Religion"
                                    // fontWeight={600}
                                    size="small"
                                    // InputLabelProps={{
                                    //     shrink: true,
                                        
                                    // }}
                                    type="Religion"
                                    apiUrl={apiBaseUrl} // Replace with your API endpoint
                                    onSelect={(value) => handleDropdownSelect("xreligion", value)}
                                    value={formData.xreligion}
                                    defaultValue=""
                                />
                                <XcodesDropDown
                                    id="xbloodgroup"
                                    name="xbloodgroup"
                                    variant={variant}
                                    label="Blood Group"
                                    size="small"
                                    InputLabelProps={{
                                        shrink: true,
                                        sx: {
                                            fontWeight: 600, // Adjust font size here
                                        },

                                    }}
                                    type="Blood Group"
                                    apiUrl={apiBaseUrl} // Replace with your API endpoint
                                    onSelect={(value) => handleDropdownSelect("xbloodgroup", value)}
                                    value={formData.xbloodgroup}
                                    defaultValue=""
                                />
                                <XcodesDropDown
                                    id="xmstat"
                                    name="xmstat"
                                    variant={variant}
                                    label="Marital Status"
                                    // fontWeight={600}
                                    size="small"
                                    // InputLabelProps={{
                                    //     shrink: true,
                                    // }}
                                    type="Marital Status"
                                    apiUrl={apiBaseUrl} // Replace with your API endpoint
                                    onSelect={(value) => handleDropdownSelect("xmstat", value)}
                                    value={formData.xmstat}
                                    defaultValue=""
                                />
                            </Stack>

                            {/* Row 5 */}
                            <Stack
                                direction={{ xs: 'column', sm: 'row' }}
                                // spacing={2} 
                                mb={2}
                                display="grid"
                                gap={2}
                                gridTemplateColumns="repeat(4, 1fr)"
                            >
                                <TextField label="Personal Mobile No."
                                    size="small"
                                    // InputLabelProps={{
                                    //     shrink: true,
                                    //     sx: {
                                    //         fontWeight: 600, // Adjust font size here
                                    //     },

                                    // }}
                                    name='xmobile'
                                    onChange={handleChange}
                                    value={formData.xmobile}
                                    variant={variant} fullWidth required
                                    error={!!formErrors.xmobile}
                                    helperText={formErrors.xmobile}
                                />

                                <TextField label="Email"
                                    size="small"
                                    // InputLabelProps={{
                                    //     shrink: true,
                                    //     sx: {
                                    //         fontWeight: 600, // Adjust font size here
                                    //     },

                                    // }}
                                    name='xemail'
                                    onChange={handleChange}
                                    value={formData.xemail}
                                    variant={variant} fullWidth required />

                                <XcodesDropDown
                                    variant={variant}
                                    label="Job Title"
                                    name="xjobtitle"
                                    size="small"
                                    InputLabelProps={{
                                        shrink: true,
                                        

                                    }}
                                    // fontWeight={600}
                                    type="Job Title"
                                    onSelect={(value) => handleDropdownSelect("xjobtitle", value)}
                                    value={formData.xjobtitle}
                                    apiUrl={apiBaseUrl} // Replace with your API endpoint
                                    // onSelect={handleSalutationSelect}
                                    defaultValue=""
                                />

                                <XcodesDropDown
                                    id='xlocation'
                                    name='xlocation'
                                    variant={variant}
                                    label="Job Location"
                                    size="small"
                                    // InputLabelProps={{
                                    //     shrink: true,
                                    // }}
                                    type="Job Location"
                                    // fontWeight={600}
                                    onSelect={(value) => handleDropdownSelect("xlocation", value)}
                                    value={formData.xlocation}
                                    apiUrl={apiBaseUrl} // Replace with your API endpoint
                                    // onSelect={handleSalutationSelect}
                                    defaultValue=""
                                />
                            </Stack>

                            {/* Row 6 */}
                            <Stack
                                direction={{ xs: 'column', sm: 'row' }}
                                // spacing={2} 
                                mb={2}
                                display="grid"
                                gap={2}
                                gridTemplateColumns="repeat(4, 1fr)"
                            >
                                <XcodesDropDown
                                    variant={variant}
                                    label="Employee Type"
                                    size="small"
                                    // InputLabelProps={{
                                    //     shrink: true,
                                        

                                    // }}
                                    name="xemptype"
                                    // fontWeight={600}
                                    type="Employee Type"
                                    onSelect={(value) => handleDropdownSelect("xemptype", value)}
                                    value={formData.xemptype}
                                    apiUrl={apiBaseUrl} // Replace with your API endpoint
                                    // onSelect={handleSalutationSelect}
                                    defaultValue=""
                                />

                                <TextField
                                    label="BMDC Registration No"
                                    name='xregino'
                                    onChange={handleChange}
                                    value={formData.xregino}
                                    size="small"
                                    // InputLabelProps={{
                                    //     shrink: true,
                                        

                                    // }}
                                    // fontWeight={600}
                                    // InputLabelProps={{ shrink: true }}
                                    variant={variant}
                                    fullWidth
                                />

                                <TextField
                                    label="Credentials"
                                    size="small"
                                    // InputLabelProps={{
                                    //     shrink: true,
                                        

                                    // }}
                                    // fontWeight={600}
                                    id="xprofdegree"
                                    name="xprofdegree"
                                    onChange={handleChange}
                                    value={formData.xprofdegree}
                                    variant={variant}
                                    fullWidth
                                    multiline
                                    sx={{ gridColumn: 'span 2' }}
                                />


                            </Stack>
                            <Stack
                                direction={{ xs: 'column', sm: 'row' }}
                                // spacing={2} 
                                mb={2}
                                display="grid"
                                gap={2}
                                gridTemplateColumns="repeat(4, 1fr)"
                            >

                                <FormGroup >
                                    <FormControlLabel control={<Checkbox
                                        checked={formData.zactive || false}
                                        onChange={handleCheckboxChange}
                                        name="Activate?"
                                        size='small'
                                        color="primary"
                                    />} label="Is Approver?"
                                        sx={{
                                            // size:'small',
                                            '& .MuiFormControlLabel-label': {
                                                fontSize: '0.875rem',
                                                // fontWeight: '600',
                                            }
                                        }} />
                                </FormGroup>

                            </Stack>


                        </Box>


                    </div>
                </div>
                <div>

                </div>



            </div>
        </div >
    );
};

export default Pdmsthrd;
