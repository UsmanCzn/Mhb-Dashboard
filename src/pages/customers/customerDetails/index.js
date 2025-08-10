import React, { useEffect, useState } from 'react';
import { Grid, Typography, Button, Box, Tab } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import CustomerInfo from 'features/Customers/CustomerInfo/CustomerInfo';
import Wallet from 'features/Customers/wallet';
import CreditBalance from 'features/Customers/creditBalance/index';
import ScansHistory from 'features/Customers/customerScans/index'
import CustomerOrders from './customers-orders';
import customerService from 'services/customerService';

export default function CustomerDetail() {
    const { cid } = useParams();
    const [value, setValue] = React.useState('1');
    const [user, setuser] = useState(null)
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const navigate = useNavigate();
    const [modalOpen, setModalOpen] = useState(false);
    const [reload, setReload] = useState(false);
    useEffect(() => {
        getCustomer();
    }, [])
    
    const getCustomer = async () => {
        await customerService
            .getCustomerDetail(cid)
            .then((res) => {
                setuser(res?.data?.result);
            })
            .catch((err) => {
                console.log(err?.response);
            });
    };
    return (
        <Grid container direction="column" spacing={2}>
            <Grid item xs={12}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item xs={6}>
                        <Typography fontSize={22} fontWeight={700}>
                            Customer Details
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 0.3, borderColor: 'divider', marginTop: 4 }}>
                    <TabList onChange={handleChange}>
                        <Tab label="Info" value="1" />
                        <Tab label="Customer Orders" value="2" />
                        <Tab label="Credit Balance" value="4" />
                        <Tab label="Scans History" value="5" />
                    </TabList>
                </Box>
                <TabPanel value="1">
                    <CustomerInfo />
                </TabPanel>
                <TabPanel value="2">
                    <CustomerOrders user={user} /> {/* <PointsCollection pointsCollection={pointsCollection} setReload={setReload} /> */}
                </TabPanel>
                <TabPanel value="3">{/* <ConstantsCollection constantCollection={constantCollection} setReload={setReload}/> */}</TabPanel>
                <TabPanel value="4">
                    <CreditBalance user={user} />

                    {/* <Wallet /> */}
                </TabPanel>
                <TabPanel value="5">
                    <ScansHistory user={user}></ScansHistory>
                </TabPanel>
            </TabContext>
        </Grid>
    );
}
