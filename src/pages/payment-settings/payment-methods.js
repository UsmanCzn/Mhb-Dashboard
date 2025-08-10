import React, { useState, useEffect } from 'react';
import { Grid, Typography, Button, FormControl, InputLabel, Select, MenuItem, TextField, Box } from '@mui/material';
import { useFetchBrandsList } from 'features/BrandsTable/hooks/useFetchBrandsList';
import PaymentMethodsListing from './payment-methods-listing';
import { useNavigate,useLocation } from 'react-router-dom';
import paymentServices from 'services/paymentServices';
import { ServiceFactory } from 'services/index';
import { useAuth } from 'providers/authProvider';



const PaymentMethods = () => {

    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const queryBrandId = params.get('brandId');

    const { user, userRole, isAuthenticated } = useAuth();

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
        if (brandsList.length > 0) {
            let initialBrand = brandsList[0];
            if (queryBrandId) {
                const foundBrand = brandsList.find(b => String(b.id) === String(queryBrandId));
                if (foundBrand) {
                    initialBrand = foundBrand;
                }
            }
            setselectedBrand(initialBrand);
        }
        // eslint-disable-next-line
    }, [brandsList, location.search]);
    


    useEffect(() => {
        if(selectedBrand){
        fetchData(selectedBrand.id);
        }
    }, [selectedBrand]);
    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item xs="auto">
                            <Typography fontSize={22} fontWeight={700}>
                                Payment Methods
                            </Typography>
                        </Grid>
                        <Box sx={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                            <Grid item xs="auto">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    disabled={user?.isAccessRevoked}
                                    onClick={() => {
                                        // Add payment method logic here
                                        navigate(`/payments-settings/addEdit/${selectedBrand.id}`);
                                    }}
                                >
                                    Add Payment Method
                                </Button>
                            </Grid>
                            <Grid item xs="auto">
                                <FormControl fullWidth>
                                    <InputLabel id="branch-select-label">{'Brand'}</InputLabel>
                                    <Select
                                        labelId="branch-select-label"
                                        id="branch-select"
                                        value={selectedBrand}
                                        label={'Brand'}
                                        onChange={(event) => {
                                            setselectedBrand(event.target.value);
                                        }}
                                    >
                                        {brandsList.map((row, index) => (
                                            <MenuItem key={index} value={row}>
                                                {row?.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <PaymentMethodsListing methods={brandPayments} brand={selectedBrand} fetchData={fetchData} />
                </Grid>
            </Grid>
        </>
    );
};

export default PaymentMethods;
