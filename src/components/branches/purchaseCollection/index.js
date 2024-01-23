

import React, { useEffect, useState } from "react";
import { Grid, Typography, TextField, Button,Alert } from '@mui/material';

import Counter from 'components/companies/counter'
import DropDown from 'components/dropdown'

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { ServiceFactory } from "services/index";
// import { useSnackbar } from 'notistack';

const App = ({
    purchaseCollection
}) => {


    const customerService=ServiceFactory.get('customer')
    const branchService=ServiceFactory.get('branch')
    const [data, setData] = useState({
        amountPurchaseReward:0,
        groupOfCustomers:0,
        giftPrograms:[]
        
    })
    // const { enqueueSnackbar, closeSnackbar } = useSnackbar();
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
    const editPurchaseCollection=async ()=>{
        console.log(data);
 
        let payload={...purchaseCollection[0]}
        payload.amount=data.amountPurchaseReward
        payload.brandGroupId=data.groupOfCustomers
        payload.rewardProgramGifts=data.giftPrograms
        console.log(payload);

        await  branchService.editPurchasesCollectionProgram(payload) 
        .then((res)=>{ 
            console.log("customers groups Edit response", res?.data)
        })
        .catch((err)=>{
            console.log(err?.response?.data);
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
            setData({
                ...data,
                amountPurchaseReward:purchaseCollection[0]?.amount,
                giftPrograms:purchaseCollection[0]?.rewardProgramGifts,
                groupOfCustomers:purchaseCollection[0]?.brandGroupId
            
            }) 
        }
        ,[purchaseCollection]
    )
    return (


        <Grid container spacing={4}>

            <Grid item xs={12}>
                <Grid container spacing={2} >
                    <Grid item xs={3}>
                        <Counter title="Set amount of purchases to get reward"
                            value="amountPurchaseReward" data={data} setData={setData}
                        />
                    </Grid>
                    <Grid item xs={2} />
                    <Grid item xs={3}>
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
                            <Grid container spacing={2} >

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

                        {/* <Grid item>
                            <Button variant="outlined" onClick={() => setModalOpen(false)}>Cancel</Button>
                        </Grid> */}
                        <Grid item>
                            <Button primay variant="contained" onClick={editPurchaseCollection} >Save</Button>
                        </Grid>

                    </Grid>


                </Grid>

            </Grid>



        </Grid>

    )
}



export default App