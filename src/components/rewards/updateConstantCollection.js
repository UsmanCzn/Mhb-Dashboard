

import React, { useEffect, useState } from "react";
import { Grid, Typography, TextField, Button,Alert,Modal,Box } from '@mui/material';

import Counter from 'components/companies/counter'
import DropDown from 'components/dropdown'

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { ServiceFactory } from "services/index";
import rewardService from "services/rewardService";
import { useSnackbar } from 'notistack';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';    

const App = ({
    constantCollection,
    modal,
    setModal,
    setReload, 
    selectedBrand
}) => {


    const customerService=ServiceFactory.get('customer')
    const branchService=ServiceFactory.get('branch')
    const [data, setData] = useState({
        amountPurchaseReward:0,
        groupOfCustomers:0,
        limitPerMonth:0,
        limitPerYear:0,
        startDate: new Date(),
        endDate: new Date(),
        giftPrograms:[]
        
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
            setCustomerGroups(res?.data?.result?.data?.data) 
        })
        .catch((err)=>{
            console.log(err?.response?.data);
        })
    }
    const editConstantCollection=async ()=>{
        let payload={...constantCollection}
        payload.discountPercentage=data.amountPurchaseReward
        payload.brandGroupId=data.groupOfCustomers
        payload.rewardProgramGifts=data.giftPrograms
        payload.limitPerMonth=data.limitPerMonth
        payload.limitPerYear=data.limitPerYear
        payload.startDate=data.startDate
        payload.endDate = data.endDate
        console.log(payload);

        await  rewardService.editConstantCollectionProgram(payload) 
        .then((res)=>{ 
            console.log("customers groups Edit response", res?.data)
            setModal(false)
            setReload(prev=>!prev)
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
            console.log(constantCollection,"Purchases oo");
            getCustomergroups()   
            setData({
                ...data,
                amountPurchaseReward:constantCollection?.discountPercentage,
                giftPrograms:constantCollection.rewardProgramGifts,
                groupOfCustomers:constantCollection.brandGroupId,
                limitPerMonth: constantCollection.limitPerMonth,
                limitPerYear: constantCollection.limitPerYear,
                startDate:constantCollection.startDate,
                endDate:constantCollection.endDate
            
            }) 
        
        }
        ,[constantCollection]
    )


    
    return (
        <Modal open={modal} onClose={() => setModal(false)} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
            <Box sx={style}>
                <Grid container spacing={4} mb={2}>
                    <Grid item xs={12}>
                        <Typography required variant="h5">
                            {'Edit Discount'}
                        </Typography>
                    </Grid>
                </Grid>

                <Grid container spacing={4}>
                    <Grid item xs={12}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Typography required variant="h7">
                                    Group of customers
                                </Typography>
                                <DropDown
                                    title="Select the group of customers"
                                    list={customerGroups}
                                    data={data}
                                    setData={setData}
                                    keyo={'groupOfCustomers'}
                                    mt={2}
                                    type="customerGroup"
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Counter
                                    title="Set amount of points to get reward"
                                    value="amountPurchaseReward"
                                    data={data}
                                    setData={setData}
                                />
                            </Grid>
                            <Grid item xs={6} marginTop={1}>
                                <LocalizationProvider dateAdapter={AdapterDayjs} localeText={{ start: 'Check-in', end: 'Check-out' }}>
                                    <DatePicker
                                        label="Start Date"
                                        fullWidth
                                        minDate={new Date()}
                                        renderInput={(params) => <TextField {...params} fullWidth error={false} />}
                                        value={data.startDate}
                                        onChange={(newValue) => {
                                            setData({
                                                ...data,
                                                startDate: newValue
                                            });
                                        }}
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={6} marginTop={1}>
                                <LocalizationProvider dateAdapter={AdapterDayjs} localeText={{ start: 'Check-in', end: 'Check-out' }}>
                                    <DatePicker
                                        label="End Date"
                                        minDate={new Date()}
                                        renderInput={(params) => <TextField {...params} fullWidth error={false} />}
                                        value={data.endDate}
                                        onChange={(newValue) => {
                                            setData({
                                                ...data,
                                                endDate: newValue
                                            });
                                        }}
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={6} marginTop={1}>
                                <TextField
                                    id="outlined-basic"
                                    type="number"
                                    onChange={(newValue) => {
                                        setData({
                                            ...data,
                                            limitPerYear: newValue.target.value
                                        });
                                    }}
                                    value={data.limitPerYear}
                                    fullWidth
                                    label="Limit per Year"
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={6} marginTop={1}>
                                <TextField
                                    id="outlined-basic"
                                    type="number"
                                    onChange={(newValue) => {
                                        setData({
                                            ...data,
                                            limitPerMonth: newValue.target.value
                                        });
                                    }}
                                    value={data.limitPerMonth}
                                    fullWidth
                                    label="Limit per Month"
                                    variant="outlined"
                                />
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography required variant="h7">
                            Gift Programs
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={1}>
                                <TextField
                                    id="outlined-basic"
                                    fullWidth
                                    label="amount"
                                    variant="outlined"
                                    value={reward.amount}
                                    onChange={(e) => {
                                        setReward({
                                            ...reward,
                                            amount: e.target.value
                                        });
                                    }}
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <TextField
                                    id="outlined-basic"
                                    fullWidth
                                    label="Gift name"
                                    variant="outlined"
                                    value={reward.name}
                                    onChange={(e) => {
                                        setReward({
                                            ...reward,
                                            name: e.target.value
                                        });
                                    }}
                                />
                                {err ? <Alert severity="error">{err}</Alert> : null}
                            </Grid>
                            <Grid item xs={3}>
                                <Button onClick={addNewProgram}>Add new</Button>
                            </Grid>
                        </Grid>

                        {data?.giftPrograms?.map((row, index) => {
                            return (
                                <Grid container spacing={2} my={1}>
                                    <Grid item xs={1}>
                                        <TextField
                                            id="outlined-basic"
                                            fullWidth
                                            label="amount"
                                            variant="outlined"
                                            value={row.amount}
                                            editable={false}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextField
                                            id="outlined-basic"
                                            fullWidth
                                            label="Gift name"
                                            variant="outlined"
                                            value={row.name}
                                            editable={false}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Button onClick={() => removeProgram(index)} color="error">
                                            remove
                                        </Button>
                                    </Grid>
                                </Grid>
                            );
                        })}
                    </Grid>

                    <Grid item xs={12}>
                        <Grid container>
                            <Grid item xs={8} />
                            <Grid container spacing={2} justifyContent="flex-end">
                                {/* <Grid item>
                            <Button variant="outlined" onClick={() => setModalOpen(false)}>Cancel</Button>
                        </Grid> */}
                                <Grid item>
                                    <Button primay variant="contained" onClick={editConstantCollection}>
                                        Save
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </Modal>
    );
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