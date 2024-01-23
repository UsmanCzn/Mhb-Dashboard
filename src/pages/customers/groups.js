import { Grid, Typography, InputLabel, FormControl, Select, MenuItem, Button } from '@mui/material';
import { TableControl, CustomersTable } from 'features';
import React, { useState, useEffect } from 'react';

import CustomerGroupTable from 'features/Customers/customerGroups/groupTable';

import { useNavigate, useParams } from 'react-router-dom';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import NewCustomer from 'components/customers/newCustomer';
import TierTable from 'features/Customers/TierTable/tierTable';
import { useFetchBrandsList } from 'features/BrandsTable/hooks/useFetchBrandsList';

export default function CustomerGroups() {
    const { type } = useParams();

    const navigate = useNavigate();
    const [modalOpen, setModalOpen] = useState(false);
    const [reload, setReload] = useState(false);

    const [newModal, setNewModal] = useState(false);
    const hideModal = (value) => {
        setNewModal(value);
    };

    const reloadData = (value) => {
        setReload(value);
    };

    const { brandsList } = useFetchBrandsList(reload);

    const [selectedBrand, setselectedBrand] = useState({});

    useEffect(() => {
        if (brandsList[0]?.id) {
            setselectedBrand(brandsList[0]);
        } else {
            console.log('now goes to zero ', 'sb');
        }
    }, [brandsList]);

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item xs={6}>
                        <Typography fontSize={22} fontWeight={700}>
                            Customer Groups
                        </Typography>
                    </Grid>
                    <Grid item xs="auto">
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">{'Brand'}</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={selectedBrand}
                                label={'Brand'}
                                onChange={(event) => {
                                    setselectedBrand(event.target.value);
                                }}
                            >
                                {brandsList.map((row, index) => {
                                    return <MenuItem value={row}>{row?.name}</MenuItem>;
                                })}
                            </Select>
                        </FormControl>
                    </Grid>
                    {/* <Grid item xs={6}>
                        <TableControl type="Customer" />
                    </Grid> */}
                </Grid>
            </Grid>

            <Grid item xs={12}>
                <CustomerGroupTable type="Customer" reload={reload} selectedBrand={selectedBrand} setReload={reloadData} />
            </Grid>
        </Grid>
    );
}
