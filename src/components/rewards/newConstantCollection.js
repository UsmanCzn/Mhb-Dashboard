

import React, { useEffect, useState } from "react";
import { Grid, Typography, TextField, Button,Alert,Modal,Box } from '@mui/material';

import Counter from 'components/companies/counter'
import DropDown from 'components/dropdown'

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { ServiceFactory } from "services/index";
import rewardService from "services/rewardService";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { useSnackbar } from 'notistack';

const App = ({ 
    modal,
    setModal,
    setReload, 
    branchesList,
    selectedBrand
}) => {


    const getNextYearDate=()=>{
        const aYearFromNow = new Date();
aYearFromNow.setFullYear(aYearFromNow.getFullYear() + 1);
return aYearFromNow
    }
    const customerService=ServiceFactory.get('customer')
    const [data, setData] = useState({
        amountPurchaseReward:0,
        groupOfCustomers:0,
        giftPrograms:[],
        branchIds:[],
        startDate:new Date(),
        endDate:getNextYearDate(),
        limitPerMonth:0,
        limitPerYear:0,
        
    })
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [err,setErr]=useState('')
    const [reward,setReward]=useState({
        amount:0,
        name:""
    }) 

    const [customerGroups,setCustomerGroups]=useState([])

    const getCustomergroups=async ()=>{
        await  customerService.GetCustomersGroups()
        
        .then((res)=>{
         const filteredGroups = res?.data?.result?.data?.data.filter((item)=> item.brandId === selectedBrand.id)
         setCustomerGroups(filteredGroups)
        })
        .catch((err)=>{
            console.log(err?.response?.data);
        })
    }
   
    const createConstantCollection=async ()=>{
        // console.log(data); 
 
        let payload={...data}
        payload.discountPercentage=data.amountPurchaseReward
        payload.brandGroupId=data.groupOfCustomers;
        payload.rewardProgramGifts=data.giftPrograms;
        payload .limitPerMonth= +data.limitPerMonth;
        payload .limitPerYear= +data.limitPerYear;

        if(data.limitPerYear< data.limitPerMonth){
            enqueueSnackbar('Limit per year show be grater than limit per month', {
                variant: 'error',
              });
              return
        }
        await  rewardService.createConstantsCollectionProgram(payload) 
        .then((res)=>{ 
            console.log("customers groups Edit response Points", res?.data),
            setReload(prev=>!prev)
            setModal(false)
        })
        .catch((err)=>{
            console.log(err?.response?.data);
            if(err?.response?.data?.error?.validationErrors?.length>0){
                enqueueSnackbar(err?.response?.data?.error?.validationErrors[0]?.message, {
                    variant: 'error',
                  });
            }
            else{ 
            enqueueSnackbar(err?.response?.data?.error?.message, {
                variant: 'error',
              });
            }
        })
    }

    const addNewProgram=()=>{

        if(reward.name==""){
            setErr("Please enter reward name")
            // enqueueSnackbar('I love hooks');
            return
        }
        setErr("")
        setData({
            ...data,
            giftPrograms:[...data.giftPrograms,reward]
        })
        setReward({
            amount:0,
            name:""
        })
    }
    const removeProgram=(index)=>{
      
         setData(
            prev=>{
                prev.giftPrograms=prev.giftPrograms.filter((obj,ind)=>ind!=index)
                return {...prev}
            }
         )
        
    }
      
    useEffect(
        ()=>{
            getCustomergroups()   
            
        },[selectedBrand])
 

    
    return (
<Modal
   open={modal}  
   onClose={() =>
   setModal(false)}
   aria-labelledby="modal-modal-title"
   aria-describedby="modal-modal-description" 
   >
   <Box sx={style} >
      <Grid container spacing={4} mb={2}>
         <Grid item xs={12}>
            <Typography required variant="h5">{  "Add New Discounts" }</Typography>
         </Grid>
      </Grid>
      <Grid container spacing={4}>
         <Grid item xs={12}>
            <Grid container spacing={2} >
               <Grid item xs={6}>
                  <Typography  variant="h7">Stores</Typography>
                  <DropDown title="Select Stores"
                     list={branchesList}
                     data={data}
                     setData={setData}
                     keyo={"branchIds"}
                     mt={2}
                     type="groups"
                     notRequired={true}
                     />
               </Grid>
               <Grid item xs={6}>
                  <Typography
                     required variant="h7">Group of customers</Typography>
                  <DropDown title="Select the group of customers"
                     list={customerGroups}
                     data={data}
                     setData={setData}
                     keyo={"groupOfCustomers"}
                     mt={2}
                     type="customerGroup"
                     />
               </Grid>
               <Grid item xs={6}>
                  <Counter title="Set discount percentage"
                     value="amountPurchaseReward" data={data} setData={setData}
                     />
               </Grid>
            </Grid>
         </Grid>
         <Grid item xs={12}>
            <Grid container spacing={2} >
               <Grid item xs={6} marginTop={1}  >
                  <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  localeText={{ start: 'Check-in', end: 'Check-out' }}
                  >
                  <DatePicker
                  label="Start Date"
                  fullWidth
                  minDate={new Date()}
                  renderInput={(params) => 
                  <TextField {...params} fullWidth error={false}  />
                  }
                  value={data.startDate}
                  onChange={(newValue) => {
                  setData({
                  ...data,
                  startDate: newValue
                  })
                  }}
                  />
                  </LocalizationProvider>
               </Grid>
               <Grid item xs={6} marginTop={1}  >
                  <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  localeText={{ start: 'Check-in', end: 'Check-out' }}
                  >
                  <DatePicker
                  label="End Date"
                  minDate={new Date()}
                  renderInput={(params) => 
                  <TextField  {...params} fullWidth error={false} />
                  }
                  value={data.endDate}
                  onChange={(newValue) => {
                  setData({
                  ...data,
                  endDate: newValue
                  })
                  }}
                  />
                  </LocalizationProvider>
               </Grid>
               <Grid item xs={6} marginTop={1}  >
                  <TextField id="outlined-basic"
                     type="number"
                     onChange={(newValue) =>
                  {
                  setData({
                  ...data,
                  limitPerYear: newValue.target.value
                  })
                  }}
                  value={data.limitPerYear} fullWidth label="Limit per Year" variant="outlined"/>
               </Grid>
               <Grid item xs={6} marginTop={1}  >
                  <TextField id="outlined-basic"
                     type="number"
                     onChange={(newValue) =>
                  {
                  setData({
                  ...data,
                  limitPerMonth: newValue.target.value
                  })
                  }}
                  value={data.limitPerMonth} fullWidth label="Limit per Month" variant="outlined" />
               </Grid>
            </Grid>
         </Grid>
         <Grid item xs={12}>
            <Typography
               required variant="h7">Gift Programs</Typography>
            <Grid container spacing={2} >
               <Grid item xs={1}>
                  <TextField id="outlined-basic" fullWidth label="amount" variant="outlined" 
                  value={reward.amount}
                  onChange={
                  (e)=>{
                  setReward({
                  ...reward,
                  amount:e.target.value
                  })
                  }
                  }
                  />
               </Grid>
               <Grid item xs={3}>
                  <TextField id="outlined-basic" fullWidth label="Gift name" variant="outlined" 
                  value={reward.name}
                  onChange={
                  (e)=>{
                  setReward({
                  ...reward,
                  name:e.target.value
                  })
                  }
                  }
                  />
                  {
                  err?
                  <Alert severity="error">{err}</Alert>
                  :
                  null
                  }
               </Grid>
               <Grid item xs={3}>
                  <Button onClick={addNewProgram} >
                  Add new
                  </Button>
               </Grid>
            </Grid>
            {
            data?.giftPrograms?.map((row,index)=>{
            return(
            <Grid container key={index} spacing={2} my={1} >
               <Grid item xs={1}>
                  <TextField id="outlined-basic" fullWidth label="amount" variant="outlined" 
                     value={row.amount}
                     editable={false}
                     />
               </Grid>
               <Grid item xs={3}>
                  <TextField id="outlined-basic" fullWidth label="Gift name" variant="outlined" 
                     value={row.name}
                     editable={false}
                     />
               </Grid>
               <Grid item xs={3}>
                  <Button onClick={()=>removeProgram(index)} color="error" >
                  remove
                  </Button>
               </Grid>
            </Grid>
            )
            })
            }
         </Grid>
         <Grid item xs={12}>
            <Grid container >
               <Grid item xs={8} />
               <Grid container spacing={2}
                  justifyContent="flex-end"
                  >
                  {/* 
                  <Grid item>
                     <Button variant="outlined" onClick={() => setModalOpen(false)}>Cancel</Button>
                  </Grid>
                  */}
                  <Grid item>
                     <Button primay variant="contained" onClick={createConstantCollection} >Save</Button>
                  </Grid>
               </Grid>
            </Grid>
         </Grid>
      </Grid>
   </Box>
</Modal>
    )
}



export default App
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "70%", 
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 1,
    overflow: 'scroll',
  
  };