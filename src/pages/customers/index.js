import { Grid, Typography, Button } from '@mui/material';
import { TableControl, CustomersTable } from 'features';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import NewCustomer from 'components/customers/newCustomer';

export default function Customers() {
    const { type } = useParams();
    const [Stats, setStats] = useState({totalDaily:0,totalMonthly:0,totalYearly:0,totalCount:0})
    const navigate = useNavigate();
    const [modalOpen, setModalOpen] = useState(false);
    const [reload, setReload] = useState(false);

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={3} md={3} lg={3}>
                <AnalyticEcommerce title="Today" count={Stats.totalDaily} percentage={27.3} />
            </Grid>
            <Grid item xs={12} sm={3} md={3} lg={3}>
                <AnalyticEcommerce title="This month" count={Stats.totalMonthly} percentage={27.3} />
            </Grid>
            <Grid item xs={12} sm={3} md={3} lg={3}>
                <AnalyticEcommerce title="This Year" count={Stats.totalYearly} percentage={27.3} />
            </Grid>
            <Grid item xs={12} sm={3} md={3} lg={3}>
                <AnalyticEcommerce title="All" count={Stats.totalCount} percentage={27.4} />
            </Grid>


            <Grid item xs={12}>
                <CustomersTable type="Customer" reload={reload} setCustomerStats={setStats} modalOpen={modalOpen} setModalOpen={setModalOpen} />
            </Grid>
            <NewCustomer modalOpen={modalOpen} setModalOpen={setModalOpen} setReload={setReload} />
        </Grid>
    );
}
