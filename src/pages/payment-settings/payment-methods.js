import React, { useState, useEffect } from 'react';
import { Grid, Typography, Button, FormControl, InputLabel, Select, MenuItem, TextField, Box } from '@mui/material';
import { useFetchBrandsList } from 'features/BrandsTable/hooks/useFetchBrandsList';
import PaymentMethodsListing from './payment-methods-listing';
import { useNavigate } from 'react-router-dom';
import paymentServices from 'services/paymentServices';
import { ServiceFactory } from 'services/index';

const PaymentMethods = () => {
    const [data, setData] = useState({ sandBoxKey: '', liveKey: '', sandboxApi: '', liveApi: '', CurrencyCode: '' });
    const [reload, setReload] = useState(false);
    const [brandPayments, setBrandPayments] = useState([]);

    const navigate = useNavigate();
    const { brandsList } = useFetchBrandsList(reload);
    const [selectedBrand, setselectedBrand] = useState('');

    const fetchData = async (brandid) => {
        try {
            // Replace 'yourBrandId' with the actual brandId you want to pass
            const response = await paymentServices.getAllBrandPaymentByBrandId(brandid);
            setBrandPayments(response.data.result);
        } catch (error) {
            console.error('Error fetching brand payments:', error);
        }
    };

    useEffect(() => {
        // Check if brandsList has at least one item and selectedBrand is not set
        if (brandsList.length > 0) {
            const initialBrand = brandsList[0];
            setselectedBrand(initialBrand);
            fetchData(initialBrand.id);
        }
    }, [brandsList]);

    useEffect(() => {
        fetchData(selectedBrand.id);
    }, [selectedBrand]);
    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item xs="auto">
                            <Typography variant="h4">Payment Methods</Typography>
                        </Grid>
                        <Box sx={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                            <Grid item xs="auto"></Grid>
                            <Grid item xs="auto">
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">{'Branch'}</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={selectedBrand}
                                        label={'Branch'}
                                        onChange={(event) => {
                                            setselectedBrand(event.target.value);
                                        }}
                                    >
                                        {brandsList.map((row, index) => {
                                            return (
                                                <MenuItem key={index} value={row}>
                                                    {row?.name}
                                                </MenuItem>
                                            );
                                        })}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <PaymentMethodsListing methods={brandPayments} brand={selectedBrand} />
                </Grid>
            </Grid>
        </>
    );
};

export default PaymentMethods;
