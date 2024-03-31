import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Grid, Typography, Button, FormControl, InputLabel, Select, MenuItem, Box} from '@mui/material';
import CreditRequestTable from 'features/CreditRequestTable/index';
import PointsRequestTable from 'features/PointsRequestTable/index';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

const Credit = () => {
    const [value, setValue] = React.useState('1');
    const handleChange = (event, newValue) => {
        setValue(newValue);
      };
    return (
        <>
            <Grid item xs={12}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item xs={6}>
                        <Typography fontSize={26} variant="h5">
                            All  Requests 
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
            <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList  onChange={handleChange}  aria-label="lab API tabs example">
                <Tab label="Credit Request" value="1" />
                <Tab label="Points Request" value="2" />
                </TabList>
            </Box>
            <TabPanel value="1"><CreditRequestTable /></TabPanel>
            <TabPanel value="2"><PointsRequestTable/></TabPanel>
            </TabContext>
            <Grid item xs={12}></Grid>
        </>
    );
};

export default Credit;
