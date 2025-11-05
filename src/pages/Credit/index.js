import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Grid, Typography, Button, FormControl, InputLabel, Select, MenuItem, Box} from '@mui/material';
import CreditRequestTable from 'features/CreditRequestTable/index';
import PointsRequestTable from 'features/PointsRequestTable/index';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import CustomerNotification from '../customer-notification/customer-notifcation';
import FreeDrinksRequest from './free-drinks-request';
import ScanRequest from './scans-request';
import RefundRequest from './refund-request';
import { useAuth } from 'providers/authProvider';

const Credit = () => {
    const { user, userRole, isAuthenticated } = useAuth();

    const [value, setValue] = React.useState('1');
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    return (
        <>
            <Grid item xs={12}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item xs={6}>
                        <Typography fontSize={22} fontWeight={700}>
                            All Requests
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange} aria-label="lab API tabs example">
                        <Tab label="Credit Request" value="1" />
                        <Tab label="Points Request" value="2" />
                        <Tab label="Notification Request" value="3" />
                        <Tab label="Free Drinks Request" value="4" />
                        <Tab label="Remove Scan Request" value="5" />
                        <Tab label="Refund Request" value="6" />
                    </TabList>
                </Box>
                <TabPanel value="1">
                    <CreditRequestTable user={user} />
                </TabPanel>
                <TabPanel value="2">
                    <PointsRequestTable user={user} />
                </TabPanel>
                <TabPanel value="3">
                    <CustomerNotification user={user} />
                </TabPanel>
                <TabPanel value="4">
                    <FreeDrinksRequest user={user} />
                </TabPanel>
                <TabPanel value="5">
                    <ScanRequest user={user} />
                </TabPanel>
                <TabPanel value="6">
                    <RefundRequest user={user} />
                </TabPanel>
            </TabContext>
            <Grid item xs={12}></Grid>
        </>
    );
};

export default Credit;
