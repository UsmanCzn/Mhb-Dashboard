import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
  Box,
  Select,
  InputLabel,
  FormControl,
  MenuItem
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import tiersService from 'services/tiersService';
import { useBranches } from 'providers/branchesProvider';
import brandServices from 'services/brandServices';
import LinearProgress from '@mui/material/LinearProgress';
import { useSnackbar } from 'notistack';



export const  BrandEventType = {
       CreditEvent:0,
        PointsEvent:1,
        FreeDrinkEvent:2
    }
const CampaingModal = ({ openModal, onCloseModal ,brandId,campaing}) => {
  const initialState = {
    startDate: new Date(),
    endDate: new Date(),
    creditExpiry:new Date(),
    name: '',
    points: 0,
    customerGroupId:'',
    eventType:0,
    branchId:null,
  }
  const [formData, setFormData] = useState(initialState);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [customersGroups, setCustomersGroups] = useState([])
  const { branchesList } = useBranches();
  const filteredBranchLish = branchesList.filter((e)=>e.brandId ===  brandId)
  const [loading, setloading] = useState(false)

  const [errors, setErrors] = useState({
    startDate: false,
    endDate: false,
    name: false,
    points: false,
    customerGroupId:false
  });

  const creditEvents = [
    {value:0 , label:"Credit Event"},
    {value:1 , label:"Points Event"},
  ]
  const handleChange = (event) => {
    const { name, value } = event.target; // Destructure name and value from the event target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: value === null || value === '', // Check if the value is null or empty string
    }));
  };

  const handleSubmit = () => {
    const formErrors = {
      startDate: formData.startDate === null || formData.startDate === '',
      endDate: formData.endDate === null || formData.endDate === '',
      name: formData.name.trim() === '',
      points: formData.points === '' || formData.points===null,
      customerGroupId:  formData.customerGroupId === '' || formData.customerGroupId===null,
    };
  
    setErrors(formErrors);
  
    if (Object.values(formErrors).some((error) => error)) {
      // If any field is empty, return without submitting
      return;
    }
    
    const parsedStartDate = new Date(formData.startDate);
    const parsedEndDate = new Date(formData.endDate);
    const expiryDate = new Date( formData.creditExpiry)
    const formatedStartDate = `${parsedStartDate.getFullYear()}-${parsedStartDate.getMonth() + 1}-${parsedStartDate.getDate()}`;
    const formatedEndDate = `${parsedEndDate.getFullYear()}-${parsedEndDate.getMonth() + 1}-${parsedEndDate.getDate()}`;
    const formatedExpiryDate = `${expiryDate.getFullYear()}-${expiryDate.getMonth() + 1}-${expiryDate.getDate()}`;
    const payload ={
      "brandEventName":formData.name ,
      "drinkName": "",
      "branchId": formData.branchId,
      "orderType": 0,
      "brandId": campaing ? campaing.brandId:brandId,
      "customerGroupId": formData.customerGroupId,
      "startDate": formatedStartDate,
      "endDate": formatedEndDate,
      "createdBy": 0,
      "credit": formData.eventType == 0 ? +formData.points:0,
      "creditExpiry": formatedExpiryDate,
      "freeDrinks": 0,
      "points": formData.eventType == 1 ? +formData.points:0,
      "eventType": formData.eventType,
      "notificationText": "string",
      "notificationTitle": "string",
      "notifyUsers": true
    }
    // Handle form submission here
    if(!campaing){
    createCampaing(payload)
    }else{
      payload['id']=campaing.id
      updateCampaing(payload)
    }
  };

  const createCampaing =async(body)=>{
    setloading(true)

    try{
     const resp = await brandServices.createBrandEvent(body)
     if(resp){
      onCloseModal(false);
      setloading(false)
    // Close the dialog

     }
    }catch(error){
      setloading(false);
      enqueueSnackbar('Some thing went wrong', {
        variant: 'error',
      });
    }
  }

  const updateCampaing = async (body)=>{
    setloading(true)
    try{
      const resp = await brandServices.updateBrandEvent(body)
      if(resp){
       onCloseModal(false); // Close the dialog
      setloading(false)
      }
     }catch(error){
      setloading(false);
      enqueueSnackbar('Some thing went wrong', {
        variant: 'error',
      });
     }
  }

  const getCustomerGroups =async ()=>{
    try{
    const response = await  tiersService.getCustomerGroups(0, 100)
    if(response){
      const tempgroups = response.data.result.data.data.filter(e=> (group.type === "DefaultBrandGroup" || group.type === "BrandGroup") && e.brandId ===brandId)
      setCustomersGroups(tempgroups)
    }
    }catch(error){

    }
  }

  useEffect(() => {
    getCustomerGroups();
    if(campaing){
      setFormData({
        startDate:campaing.startDate ,
        endDate: campaing.endDate,
        creditExpiry:campaing.creditExpiry,
        name: campaing.brandEventName,
        points: campaing.eventType ==1 ?campaing.points:campaing.credit,
        customerGroupId:campaing.customerGroupId,
        eventType:campaing.eventType,
        branchId:campaing.branchId
      })
    }
    else{
      setFormData(initialState)
    }
  }, [campaing, brandId])
  
  return (
    <Dialog open={openModal} onClose={()=>onCloseModal(false)}>
     {loading&&
      <Box sx={{ width: '100%' }}>
      <LinearProgress />
      </Box>
    }
      <DialogTitle>Add Campaing</DialogTitle>
      <DialogContent>

        <Box sx={{maxWidth: "500px"}}>
        <Grid container spacing={4}>
        <Grid item xs={6}>
          <TextField
          fullWidth
          margin="normal"
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          error={errors.name}
          helperText={errors.name && 'Name is required'}
        />
        </Grid>
        <Grid item xs={6}>
          <TextField
          fullWidth
          margin="normal"
          label="Points"
          type="number"
          name="points"
          value={formData.points}
          onChange={handleChange}
          required
          error={errors.points}
          helperText={errors.points && 'Points is required'}
        />
        </Grid>
          <Grid item xs={6} sx={{marginTop: "10px"}}>
            <LocalizationProvider  dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Expiry"
                fullWidth
                margin="normal"
                name="creditExpiry"
                value={formData.creditExpiry}
                renderInput={(params) => <TextField {...params} />}
                onChange={(e)=> {handleChange({target:{name:"creditExpiry", value:e}})}}
                minDate={new Date(2023, 0, 1)}
                error={errors.startDate}
                helperText={errors.creditExpiry && 'Expiry Date is required'}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={6} sx={{marginTop: "10px"}}>
            <LocalizationProvider  dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Start Date"
                fullWidth
                margin="normal"
                name="startDate"
                value={formData.startDate}
                renderInput={(params) => <TextField {...params} />}
                onChange={(e)=> {handleChange({target:{name:"startDate", value:e}})}}
                minDate={new Date(2023, 0, 1)}
                maxDate={new Date()}
                error={errors.startDate}
                helperText={errors.startDate && 'Start Date is required'}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={6} sx={{marginTop: "10px"}}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="End Date"
                fullWidth
                margin="normal"
                name="endDate"
                value={formData.endDate}
                renderInput={(params) => <TextField {...params} />}
                onChange={(e)=> {handleChange({target:{name:"endDate", value:e}})}}
                minDate={new Date(2023, 0, 1)}
                error={errors.endDate}
                helperText={errors.endDate && 'End Date is required'}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={6}>
          <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">{'Customer Group'}</InputLabel>
          <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={formData.customerGroupId}
              label={'Customer Group'}
              name="customerGroupId"
              onChange={handleChange}
              error={errors.customerGroupId}
              helperText={errors.customerGroupId && 'Group is required'}
          >
              {customersGroups.map((row, index) => {
                return (
                    <MenuItem key={index} value={row.id}>
                        {row?.name}
                    </MenuItem>
                );
              })}
          </Select>
          </FormControl>
          </Grid>
          <Grid item xs={6}>
          <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">{'Event Type'}</InputLabel>
          <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={formData.eventType}
              label={'Event Type'}
              name="eventType"
              onChange={handleChange}
          >
              {creditEvents.map((row, index) => {
                return (
                    <MenuItem key={index} value={row.value}>
                        {row?.label}
                    </MenuItem>
                );
              })}
          </Select>
          </FormControl>
          </Grid>
          <Grid item xs={6}>
          <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">{'Stores'}</InputLabel>
          <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={formData.branchId}
              label={'Stores'}
              name="branchId"
              onChange={handleChange}
          >
              {filteredBranchLish.map((row, index) => {
                return (
                    <MenuItem key={index} value={row.id}>
                        {row?.name}
                    </MenuItem>
                );
              })}
          </Select>
          </FormControl>
          </Grid>
        </Grid>
        </Box>
      
      </DialogContent>
      <DialogActions>
        <Button onClick={()=>onCloseModal(false)}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CampaingModal;
