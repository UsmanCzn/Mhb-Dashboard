import { Grid, Typography, Button } from '@mui/material';
import { TableControl, CustomersTable } from 'features';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import NewCustomer from 'components/customers/newCustomer';

export default function Customers() {
    const { type } = useParams();

    const navigate = useNavigate();
    const [modalOpen, setModalOpen] = useState(false);
    const [reload, setReload] = useState(false);

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4} lg={3}>
                <AnalyticEcommerce title="Today" count="18,800" percentage={27.4} />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
                <AnalyticEcommerce title="This month" count="35,078" percentage={27.4} />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
                <AnalyticEcommerce title="This Year" count="18,800" percentage={27.4} />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
                <AnalyticEcommerce title="All" count="35,078" percentage={27.4} />
            </Grid>

            <Grid item xs={12}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item xs={6}>
                        <Typography fontSize={22} fontWeight={700}>
                            Customers
                        </Typography>
                    </Grid>
                    <Grid item xs={'auto'}>
                        <Button size="small" variant="contained" sx={{ textTransform: 'capitalize' }} onClick={() => setModalOpen(true)}>
                            Add New Customer
                        </Button>
                    </Grid>
                    {/* <Grid item xs={6}>
                    <TableControl type="Customer"/>
                </Grid> */}
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <CustomersTable type="Customer" reload={reload} />
            </Grid>
            <NewCustomer modalOpen={modalOpen} setModalOpen={setModalOpen} setReload={setReload} />
        </Grid>
    );
}
