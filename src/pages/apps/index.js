import { Grid, Typography, Button } from '@mui/material';
import { TableControl, CustomersTable } from 'features';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import NewCustomer from 'components/customers/newCustomer';
import AppsTable from 'features/AppsTable/index';
import NewCompany from 'components/companies/newCompany';

export default function Apps() {
    const { type } = useParams();

    const navigate = useNavigate();
    const [modalOpen, setModalOpen] = useState(false);
    const [reload, setReload] = useState(false);
    const [update, setUpdate] = useState(false);
    const [updateData, setUpdateData] = useState({});

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item xs={6}>
                        <Typography fontSize={22} fontWeight={700}>
                            Companies
                        </Typography>
                    </Grid>
                    <Grid item xs={'auto'}>
                        <Button
                            size="small"
                            variant="contained"
                            sx={{ textTransform: 'capitalize' }}
                            onClick={() => {
                                navigate('/addEditCompany');
                                // setUpdate(false);
                                // setModalOpen(true);
                            }}
                        >
                            Add New App
                        </Button>
                    </Grid>
                    {/* <Grid item xs={6}>
                    <TableControl type="Customer"/> 
                </Grid> */}
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <AppsTable reload={reload} setUpdate={setUpdate} setUpdateData={setUpdateData} setModalOpen={setModalOpen} />
            </Grid>
            <NewCompany modalOpen={modalOpen} setModalOpen={setModalOpen} update={update} updateData={updateData} setReload={setReload} />
        </Grid>
    );
}
