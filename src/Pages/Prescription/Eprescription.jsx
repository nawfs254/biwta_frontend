import React, { useCallback, useEffect, useRef, useState } from 'react';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import GenericList from '../../ReusableComponents/GenericList';

import { useAuth } from '../../Provider/AuthProvider';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const Eprescription = () => {
  const { zid, zemail } = useAuth();

  const apiBaseUrl = `http://localhost:8080/api/mmappointment/${zid}/RX--000002`;
  const [selectedItem, setSelectedItem] = useState(null);

  const handleItemSelect = useCallback((item) => {
      
    setSelectedItem(item);
}, []);

const [refreshTrigger, setRefreshTrigger] = useState(false);


  const [patienttype, setpatienttype] = React.useState('');
  const [loading, setLoading] = useState(true);
  const [xdependent, setxdependent] = React.useState('');

  const handleChange = (event) => {
    setpatienttype(event.target.value);
  };

  const handleChangexdependent = (event) => {
    setxdependent(event.target.value);
  };

  useEffect(() => {
    if (zid && zemail) setLoading(false);
}, [zid, zemail]);

  const [formData, setFormData] = useState({
    zid: '100000',
    zauserid: '',
    xrow: '1',
    xpatient: '',
    xage: '',
    xdepartment: '',
    xsex: '',
  });

  const [medications, setMedications] = useState([{ medication: '', dosage: '', frequency: '' }]);

  const handleChangeForm = (field, value) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleAddMedication = () => {
    setMedications((prevMedications) => [...prevMedications, { medication: '', dosage: '', frequency: '' }]);
  };

  const handleRemoveMedication = (index) => {
    setMedications((prevMedications) => prevMedications.filter((_, i) => i !== index));
  };

  const handleChangeMedication = (index, field, value) => {
    setMedications((prevMedications) => {
      const updatedMedications = [...prevMedications];
      updatedMedications[index][field] = value;
      return updatedMedications;
    });
  };

  const handleAction = async (method) => {
    const data = { ...formData, medications };
    const endpoint = '/api/mmprescription';

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        console.log('Prescription submitted successfully!', await response.json());
      } else {
        console.error('Error submitting prescription:', await response.text());
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <Container fixed>
        <Paper elevation={3} sx={{ padding: 4 }}>
          <header style={{ textAlign: 'center', marginBottom: '0px' }}>
            <img
              src="/logo/prescriptionlogo.png"
              alt="Logo"
              style={{ width: '100px', height: '100px', position: 'absolute', left: '20%' }}
            />
            <h1>বাংলাদেশ অভ্যন্তরীণ নৌ-পরিবহন কর্তৃপক্ষ</h1>
            <h2>Bangladesh Inland Water Transport Authority</h2>
            <p>১৪১-১৪৩, মতিঝিল, বা/এ , ঢাকা-১০০০</p>
          </header>
          <Box component="form" noValidate autoComplete="off">
            <Grid>
              {/* Patient Details Section */}
              <Grid>
                <Item sx={{ padding: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Patient Details
                  </Typography>

                  <Grid container spacing={1} alignItems="center">

                    {/* Patient Type Dropdown */}
                    <Grid item xs={12} sm={3}>
                      <FormControl fullWidth size="small">
                        <InputLabel id="patient-type-label">Patient Type</InputLabel>
                        <Select
                          labelId="patient-type-label"
                          id="patient-type"
                          value={patienttype}
                          label="Patient Type"
                          onChange={handleChange}
                        >
                          <MenuItem value="Dependent">Dependent</MenuItem>
                          <MenuItem value="Employee">Employee</MenuItem>
                          <MenuItem value="Others">Others</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    {/* Dynamic Form Fields */}
                    {[
                      { label: 'Employee ID', value: 'xposition', id: 'xposition' },
                      { label: 'Employee Name', value: 'xpositiondesc', id: 'xpositiondesc' },
                      { label: 'Patient Name (Others)', value: 'xpatient', id: 'xpatient' },
                      { label: 'Age', value: 'xage', id: 'xage' },
                    ].map(({ label, value, id }) => (
                      <Grid item xs={12} sm={3} key={id}>
                        <TextField
                          fullWidth
                          id={id}
                          label={label}
                          variant="outlined"
                          size="small"
                          value={formData[value]}
                          onChange={(e) => handleChangeForm(value, e.target.value)}
                        />
                      </Grid>
                    ))}
                    <Grid item xs={12} sm={3}>
                      <FormControl fullWidth size="small">
                        <InputLabel id="patient-type-label">Dependent Name</InputLabel>
                        <Select
                          labelId="patient-type-label"
                          id="xdependent"
                          value={xdependent}
                          label="Dependent Name"
                          onChange={handleChangexdependent}
                        >
                          <MenuItem value="A">A</MenuItem>
                          <MenuItem value="A">A</MenuItem>
                          <MenuItem value="A">A</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>


                    {/* Gender Selection */}
                    <Grid item xs={12} sm={3}>
                      <FormControl component="fieldset" size="small">
                        <FormLabel component="legend" className='genderclassname'>Gender</FormLabel>
                        <RadioGroup
                          row
                          aria-labelledby="gender-radio-group"
                          name="gender-radio-group"
                          value={formData.gender}
                          onChange={(e) => handleChangeForm('gender', e.target.value)}
                        >
                          <FormControlLabel value="female" control={<Radio size="small" />} label="Female" />
                          <FormControlLabel value="male" control={<Radio size="small" />} label="Male" />
                          <FormControlLabel value="other" control={<Radio size="small" />} label="Other" />
                        </RadioGroup>
                      </FormControl>
                    </Grid>

                  </Grid>
                </Item>
              </Grid>


              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Item>
                    <Typography variant="h6" gutterBottom>
                      Patient Diagnosis History & Advice
                    </Typography>
                    <Grid container spacing={2} className="custom-font">
                      <Grid item xs={12} sm={4}>
                        <TextField
                          id="xchiefcomplain"
                          label="Chief Complaints"
                          multiline
                          rows={4}
                          fullWidth
                          defaultValue=""
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          id="xsurgicalhistory"
                          label="Past Medical History"
                          multiline
                          rows={4}
                          fullWidth
                          defaultValue=""
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          id="xinvestigationhistroy"
                          label="Investigation History"
                          multiline
                          rows={4}
                          fullWidth
                          defaultValue=""
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          id="xlasa"
                          label="Vital Signs"
                          multiline
                          rows={4}
                          fullWidth
                          defaultValue=""
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          id="xdiagnosis"
                          label="Diagnosis"
                          multiline
                          rows={4}
                          fullWidth
                          defaultValue=""
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          id="xinvestigation"
                          label="Investigations"
                          multiline
                          rows={4}
                          fullWidth
                          defaultValue=""
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          id="xfollowupadvice"
                          label="Advice"
                          multiline
                          rows={4}
                          fullWidth
                          defaultValue=""
                          variant="outlined"
                        />
                      </Grid>
                    </Grid>
                  </Item>
                </Grid>
              </Grid>




              {/* Prescription Section */}
              <Grid item xs={12}>
                <Item>
                  <Typography variant="h6">Prescription</Typography>
                  {medications.map((medication, index) => (
                    <Grid container spacing={1} key={index}>
                      {['medication', 'dosage', 'frequency'].map((field) => (
                        <Grid item xs={field === 'medication' ? 6 : 3} key={field}>
                          <TextField
                            fullWidth
                            label={field.charAt(0).toUpperCase() + field.slice(1)}
                            variant="outlined"
                            size="small"
                            value={medication[field]}
                            onChange={(e) => handleChangeMedication(index, field, e.target.value)}
                          />
                        </Grid>
                      ))}
                      <Grid item xs={12} style={{ textAlign: 'right' }}>
                        <IconButton onClick={() => handleRemoveMedication(index)}>
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  ))}
                  <Button variant="outlined" color="secondary" size="small" onClick={handleAddMedication}>
                    Add Medication
                  </Button>
                </Item>
              </Grid>

              {/* Submit Button Section */}
              <Grid item xs={12}>
                <Item>
                  <Button variant="contained" color="primary" size="small" onClick={() => handleAction('POST')}>
                    Submit Prescription
                  </Button>
                </Item>
              </Grid>
            </Grid>
          </Box>

          <GenericList
            apiUrl={`api/mmappointment/${zid}`}
            caption="Today Prescription List"
            columns={[
              { field: 'xcase', title: 'Case ID', width: '45%', },
              { field: 'xstatus', title: 'Status', width: '20%' },
              { field: 'xdoctor', title: 'Doctor ID', width: '20%', align: 'center' },
              { field: 'xapptype', title: 'Appointment Type', width: '15%', align: 'center' },
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
          />
          
        </Paper>
      </Container>
    </React.Fragment>
  );
};

export default Eprescription;
