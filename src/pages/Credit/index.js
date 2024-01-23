import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Grid, Typography, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import CreditRequestTable from 'features/CreditRequestTable/index';
const Credit = () => {
    return (
        <>
            <Grid item xs={12}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item xs={6}>
                        <Typography fontSize={26} variant="h5">
                            Credits Request
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
            <CreditRequestTable />
            <Grid item xs={12}></Grid>
        </>
    );
};

export default Credit;
