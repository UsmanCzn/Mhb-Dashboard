import React, { useEffect, useState } from 'react';
import { Grid, Typography,Button,Box,Tab } from '@mui/material';   
import { useNavigate, useParams } from 'react-router-dom'; 
import {TabContext,TabList,TabPanel} from '@mui/lab'; 
import CustomerInfo from 'features/Customers/CustomerInfo/CustomerInfo';
import Wallet from 'features/Customers/wallet';
import BranchTimings from '../branchTimings/index';
import UpdateBranch from 'components/branches/updateBranch';
import branchServices from 'services/branchServices';

export default function LocationDetail() {
    const { type } = useParams();
    const [value, setValue] = React.useState('1'); 
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const navigate = useNavigate();
    const [modalOpen, setModalOpen] = useState(false)
    const [reload, setReload] = useState(false)
    const { bhid } = useParams();
    const [branch, setBranch] = useState({})

    const getBranch = async () => {

        await branchServices.getBranchById(bhid)
            .then((res) => {
                setBranch(res?.data?.result)
            })
            .catch((err) => {
                console.log(err.response);
            })
    }


    useEffect(
        () => {
            getBranch()
        }
        , []
    )

  return (
    <Grid container spacing={2}>
 
        
        <Grid item xs={12}>

            <Grid container  alignItems="center" justifyContent="space-between">
                <Grid item xs={6}>
                    <Typography fontSize={22} fontWeight={700}>
                       Location Detail
                    </Typography>
                </Grid> 
            </Grid> 
        </Grid>
        <Grid item xs={12}>

        <TabContext value={value}>
        <Box sx={{ borderBottom: 0.3, borderColor: 'divider',marginTop:4,width:'100%' }}>
            <TabList onChange={handleChange}>
                <Tab label="Info" value="1" />
                <Tab label="Branch Timings" value="2" /> 
            </TabList>
        </Box>
        <TabPanel value="1">
            <UpdateBranch update={true} updateData={branch}  />
        </TabPanel>
        <TabPanel value="2">
            <BranchTimings/>
        </TabPanel>
       
        
    </TabContext>
    </Grid>
      

    </Grid>
  );
}
