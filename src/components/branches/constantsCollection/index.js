

import React, { useState, useEffect } from "react";
import { Grid, Typography, TextField, Button } from '@mui/material';

import Counter from 'components/counter/counter' 
import DropDown from 'components/dropdown' 

import AddIcon from '@mui/icons-material/Add';
import { ServiceFactory } from "services/index";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';  
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSnackbar } from 'notistack';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import {useParams } from 'react-router-dom'; 
import NewConstantCollection from 'components/branches/constantsCollection/newConstantCollection'
import moment from "moment";

const App = ({
    setReload,
    constantCollection
}) => {

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const generateDefaultExpirationDate= ()=> {
        var d = new Date()
        var year = d.getFullYear()
        var month = d.getMonth()
        var day = d.getDate()
        return new Date(year + 10, month, day)
      }
    const { bhid } = useParams();

     
    const [collectionProgram, setCollectionProgram] = useState([])
    const branchService = ServiceFactory.get('branch')
    const customerService=ServiceFactory.get('customer') 
    const [customerGroups,setCustomerGroups]=useState([])
    const [createNew,setCreateNew]=useState(false)
    const [modalOpen,setModalOpen]=useState(false)
     
    const [data,setData]=useState(null)

    const editConstantCollection= async(data)=>{
        setData(data)
        setModalOpen(true)
    }
    const deleteConstantCollection= async(id)=>{


        await branchService.DeleteDiscountProgram(id)

        .then((res)=>{
            console.log(res.data,"delete response");
        })
        .catch((err)=>{
            console.log(err?.response?.data);
        })
        .finally(()=>{
            setReload(prev=>!prev)
        })
    }
    
    const getCustomergroups=async ()=>{
        await  customerService.GetCustomersGroups()
        .then((res)=>{
            setCustomerGroups(res?.data?.result?.data?.data) 
        })
        .catch((err)=>{
            console.log(err?.response?.data);
        })
    }

    useEffect(() => {
        getCustomergroups()  
        // setCollectionProgram(constantCollection); 
    }, [])


    return (


        <Grid container spacing={4} >
            <Grid item xs={12}> 
            <Grid container direction="row"  alignItems="center" justifyContent="flex-start" >

                <Button variant="outlined" startIcon={<AddIcon />}
                    onClick={()=> {
                        setData(null)
                        setModalOpen(true)}}
                >
                    Create new
                </Button>
            </Grid>

                
            </Grid>
{  constantCollection.length>0?
            <Grid item xs={12}>
                <Grid container spacing={2} >
                    <Grid item xs={1.4}>
                        <Typography
                            required variant="h6">Percentage of constant discount </Typography>
                    </Grid>
                    <Grid item xs={1.4}>
                        <Typography
                            required variant="h6">Max limit spent per month </Typography>
                    </Grid> 
                     <Grid item xs={1.4}>
                        <Typography
                            required variant="h6">Max limit spent per year </Typography>
                    </Grid>
                    <Grid item xs={1.4}>
                        <Typography
                            required variant="h6">Group of customers</Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography
                            required variant="h6">Time period</Typography>
                    </Grid>
                    <Grid item xs={2.4}>
                        <Typography
                            required variant="h6">Gift Program</Typography>
                    </Grid>
                    <Grid item xs={1}>
                        <Typography
                            required variant="h6">Action</Typography>
                    </Grid>
                </Grid>

            </Grid>
            :
            null
            }
 

            {
                constantCollection?.map((row, index) => {
                    return (
                        <Grid item xs={12} >
                        <Grid container spacing={2} >
                            <Grid item xs={1.4}>
                                
                            <Typography
                                      variant="h7"> {row?.discountPercentage} </Typography>
                              
                            </Grid>
                            <Grid item xs={1.4}> 
                            <Typography
                                      variant="h7"> {row?.limitPerMonth} </Typography>
                            </Grid>
        
                            <Grid item xs={1.4}>
                             
                            <Typography
                                      variant="h7"> {row?.limitPerYear} </Typography>
                            </Grid>
        
                            <Grid item xs={1.4}  >
                                
                                <Typography
                                      variant="h7">  {customerGroups.find(obj=>obj.id==row?.brandGroupId)?.name  }  </Typography>
                              
        
                            </Grid>
                            <Grid item xs={3}   >
                            <Typography
                                      variant="h7"> 
                            {moment(row?.startDate).format("DD-MMM-YYYY")+" to "+moment(row?.endDate).format("DD-MMM-YYYY")} 
                        </Typography>
                            </Grid>
                            <Grid item xs={2.4}>
                                 
                                {
                            row?.rewardProgramGifts?.map((rowi,index)=>{
                                return(
                                    <Grid container spacing={0} >
        
                                    <Grid item xs={2}>
                                    <Typography
                                      variant="h7"> 
                           {rowi.amount}
                        </Typography>
                                       
                                    </Grid>
                                    <Grid xs={0.4}/>
                                    <Grid item xs={6}>
                                    <Typography
                                      variant="h7"> 
                           {rowi.name}
                        </Typography>
                                      
                                    </Grid>
                                    
                                     
                  
                                     
                                </Grid>
                                )
                            })
                        }
                            </Grid>
                            <Grid item xs={1}    >
                                <Grid container direction="row"  alignItems="center"   justifyContent="space-evenly"  >
                             <EditIcon  onClick={()=>editConstantCollection(row)} />
                              <DeleteIcon onClick={()=>deleteConstantCollection(row?.id)} />
                                </Grid>
                           
                            </Grid>
                        </Grid>
                    </Grid>
                    )
                })
            }






            <Grid item xs={12}>
                <Grid container >

                    <Grid item xs={8} />
                    <Grid container spacing={2}

                        justifyContent="flex-end"
                    >

                        {/* <Grid item>
                            <Button variant="outlined" onClick={() => setModalOpen(false)}>Cancel</Button>
                        </Grid> */}
                        {/* <Grid item>
                            <Button primay variant="contained"   >Save</Button>
                        </Grid> */}

                    </Grid>


                </Grid>

            </Grid>


<NewConstantCollection modalOpen={modalOpen} setModalOpen={setModalOpen}
 customerGroups={customerGroups} setReload={setReload} editData={data} />

        </Grid>

    )
}



export default App