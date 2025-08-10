import React, { useEffect, useState } from 'react';
import { Grid, Typography, Button, Box, TextField, InputLabel, MenuItem, Select, FormControl } from '@mui/material';
import customerService from 'services/customerService';
import { useParams } from 'react-router-dom';
import { useFetchBrandsList } from 'features/BrandsTable/hooks/useFetchBrandsList';

import UpdateCreditBalance from 'components/customers/updateCreditBalance';
import LinearProgress from '@mui/material/LinearProgress';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import { useSnackbar } from 'notistack';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const CreditBalance = (props) => {
    const { user } = props;

    const { cid } = useParams();

    const { brandsList } = useFetchBrandsList(true);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const [selectedBrand, setselectedBrand] = useState({});
    const [filteredBrand, setFilteredBrand] = useState([]);
    const [walletDetails, setWalletDetails] = useState([]);
    const [points, setPoints] = useState(0);
    const [reload, setReload] = useState(false);
    const [loading, setLoading] = useState(false);
    const [totalPoints, setTotalPoints] = useState(0);
    const [totalFreePoints, setTotalFreePoints] = useState(0);

    const [brandWallet, setBrandWallet] = useState({
        walletBalance: 0,
        creditBalance: 0,
        freeItems: 0,
        punches: 0,
        pointsEarned: 0
    });
    const [CreditBalance, setCreditBalance] = useState({
        creditBalance: 0,
        expiryDate: '',
        creditBalanceComment: ''
    });

    const [requestType, setRequestType] = useState();
    const [customerDetails, setCustomerDetails] = useState();
    // const [updateFreeItemModalOpen, setUpdateFreeItemModalOpen] = useState(false);
    const [updateCreditBalanceModal, setupdateCreditBalanceModalOpen] = useState(false);
    const formik = useFormik({
        initialValues: {
            points: ''
        },
        validationSchema: Yup.object({
            points: Yup.number().required('Points are required').min(0.01, 'Points must be greater than zero')
        }),
        onSubmit: (values) => {
            updateCutsomerPoints(values.points);
            setTimeout(() => {
                resetForm({ values: { points: '' } });
            }, 10);
        }
    });
    const itemFormik = useFormik({
        initialValues: {
            item: ''
        },
        validationSchema: Yup.object({
            item: Yup.number().required('Item are required').min(0.01, 'Items must be greater than zero')
        }),
        onSubmit: (values) => {
            updateCustomerItem(values.item);
            setTimeout(() => {
                resetForm({ values: { item: '' } });
            }, 10);
        }
    });
    // GET CREDIT DETAILS
    const GetCreditDetails = async () => {
        await customerService
            .getCreditDetailsByCustomerId(cid, selectedBrand.id)
            .then((res) => {
                setCreditBalance(res.data.result[0]);
                // setWalletDetails(res?.data?.result);
                setTotalFreePoints(res.data.result[0]?.freeItems);
            })
            .catch((err) => {
                console.log(err?.response?.data);
            });
    };

    // GET CUSTOMER POINTS
    const getCustomerPoints = async () => {
        try {
            const res = await customerService.getCustomerDetailV3(+cid, +selectedBrand.id);
            if (res) {
                setPoints(0);
                setTotalPoints(res.data.result.redeemablePoints);
                setCustomerDetails(res.data.result);
            }
        } catch (err) {
            console.log(err);
        }
    };

    // UPDATE CUSTOMER POINTS
    const updateCutsomerPoints = async (p) => {
        setLoading(true);
        try {
            const data = {
                id: 0,
                brandId: selectedBrand.id,
                customerId: +cid,
                increaseFreeItemsCount: requestType === 'item' ? +p : 0,
                increasePunchesCount: 0,
                pointsUsed: requestType === 'point' ? +p : 0,
                pointsEarned: 0,
                comments: '',
                customerId: customerDetails.id
            };
            const response = await customerService.updateUsedPoints(data);
            if (response) {
                setLoading(false);
                enqueueSnackbar('Request Has Been Genereated', {
                    variant: 'success'
                });
                getCustomerPoints();
            }
        } catch (err) {
            setLoading(false);
        }
    };
    // UPDATE CUSTOMER Free Drinks
    const updateCustomerItem = async (p) => {
        setLoading(true);
        console.log(p);

        try {
            const data = {
                id: 0,
                brandId: selectedBrand.id,
                customerId: +cid,
                increaseFreeItemsCount: +p ?? 0,
                increasePunchesCount: 0,
                pointsUsed: 0,
                pointsEarned: 0,
                comments: '',
                customerId: customerDetails.id
            };
            const response = await customerService.updateUsedPoints(data);
            if (response) {
                setLoading(false);

                enqueueSnackbar('Request Has Been Genereated', {
                    variant: 'success'
                });
                getCustomerPoints();
            }
        } catch (err) {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (selectedBrand && selectedBrand.id) {
            GetCreditDetails();
            getCustomerPoints();
        }
    }, [selectedBrand]);

    useEffect(() => {
        if (brandsList[0]?.id) {
            const temp = brandsList.filter((br) => br.companyId === user?.companyId);
            setFilteredBrand(temp);
            setselectedBrand(temp[0]);
        } else {
        }
    }, [brandsList]);
    return (
        <>
            {loading && (
                <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                </Box>
            )}
            <Grid container spacing={4}>
                <Grid item xs={12} sx={{ marginTop: '10px' }}>
                    <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item xs="auto">
                            <Typography fontSize={26} fontWeight={600}></Typography>
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
                                    {filteredBrand.map((row, index) => {
                                        return (
                                            <MenuItem key={index} value={row}>
                                                {row?.name}
                                            </MenuItem>
                                        );
                                    })}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12}>
                    <Grid container spacing={3} alignItems="center">
                        <Grid item xs={6} sm={4} md={3}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'start',
                                    gap: '12px',
                                    padding: '16px',
                                    border: '1px solid #e0e0e0',
                                    borderRadius: '8px',
                                    backgroundColor: '#f9f9f9'
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <AccessibilityNewIcon color="primary" />
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        Credit Balance:
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', gap: '10px' }}>
                                    <TextField
                                        id="outlined-basic"
                                        fullWidth
                                        label="Credit Balance"
                                        variant="outlined"
                                        value={CreditBalance?.creditBalance}
                                        InputProps={{
                                            readOnly: true
                                        }}
                                    />
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={6} sm={4} md={3}>
                            <Button
                                primary
                                variant="contained"
                                onClick={() => {
                                    setupdateCreditBalanceModalOpen(true);
                                }}
                            >
                                Update
                            </Button>
                        </Grid>
                        {/* <Grid item xs={3}>
                        <TextField
                            id="outlined-basic"
                            fullWidth
                            label="Expiry Date"
                            variant="outlined"
                            value={CreditBalance?.expiryDate}
                            InputProps={{
                                readOnly: true
                            }}
                        />
                    </Grid> */}
                        <Grid item xs={3} />
                        <Grid item xs={3}></Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12}>
                    <form onSubmit={formik.handleSubmit}>
                        <Grid container spacing={3} alignItems="center">
                            <Grid item xs={6} sm={4} md={3}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'start',
                                        gap: '12px',
                                        padding: '16px',
                                        border: '1px solid #e0e0e0',
                                        borderRadius: '8px',
                                        backgroundColor: '#f9f9f9'
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <AccessibilityNewIcon color="primary" />
                                        <Typography variant="subtitle1" fontWeight="bold">
                                            Total User Points: {totalPoints}
                                        </Typography>
                                    </Box>
                                    <TextField
                                        id="points"
                                        fullWidth
                                        label="Add New Points"
                                        variant="outlined"
                                        value={formik.values.points}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.points && Boolean(formik.errors.points)}
                                        helperText={formik.touched.points && formik.errors.points}
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={6} sm={4} md={3}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    onClick={() => setRequestType('point')}
                                    sx={{
                                        padding: '6px 16px',
                                        fontWeight: 'bold',
                                        fontSize: '0.875rem', // Adjusting text size to match smaller button
                                        textTransform: 'uppercase'
                                    }}
                                >
                                    Add New Points
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Grid>
                {selectedBrand?.showFreeDrinkFeature && (
                    <Grid item xs={12}>
                        <form onSubmit={itemFormik.handleSubmit}>
                            <Grid container spacing={3} alignItems="center">
                                <Grid item xs={6} sm={4} md={3}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'start',
                                            gap: '12px',
                                            padding: '16px',
                                            border: '1px solid #e0e0e0',
                                            borderRadius: '8px',
                                            backgroundColor: '#f9f9f9'
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <AccessibilityNewIcon color="primary" />
                                            <Typography variant="subtitle1" fontWeight="bold">
                                                Total Free Drinks: {totalFreePoints}
                                            </Typography>
                                        </Box>
                                        <TextField
                                            name="item"
                                            fullWidth
                                            label="Add Free Drinks"
                                            variant="outlined"
                                            value={itemFormik.values.item}
                                            onChange={itemFormik.handleChange}
                                            onBlur={itemFormik.handleBlur}
                                            error={itemFormik.touched.item && Boolean(itemFormik.errors.item)}
                                            helperText={itemFormik.touched.item && itemFormik.errors.item}
                                        />
                                    </Box>
                                </Grid>
                                <Grid item xs={6} sm={4} md={3}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        type="submit"
                                        sx={{
                                            padding: '6px 16px',
                                            fontWeight: 'bold',
                                            fontSize: '0.875rem',
                                            textTransform: 'uppercase'
                                        }}
                                    >
                                        Add Free Drinks
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Grid>
                )}

                {/* <Grid item xs={12}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            id="outlined-multiline-flexible"
                            label="commnets"
                            fullWidth
                            multiline
                            rows={4}
                            InputProps={{
                                readOnly: true
                            }}
                            variant="outlined"
                            value={CreditBalance?.creditBalanceComment}
                        />
                    </Grid>
                </Grid>
            </Grid> */}

                {/* <UpdateWallet
                modalOpen={updateModalOpen}
                setModalOpen={setUpdateModalOpen}
                cid={cid}
                setReload={setReload}
                prevData={brandWallet}
                brandName={brandsList?.find((obj) => obj?.id == selectedBrand?.id)?.name}
            />

            <UpdateFreeItems
                modalOpen={updateFreeItemModalOpen}
                setModalOpen={setUpdateFreeItemModalOpen}
                cid={cid}
                prevData={brandWallet}
                brandName={brandsList?.find((obj) => obj?.id == selectedBrand?.id)?.name}
            /> */}

                <UpdateCreditBalance
                    modalOpen={updateCreditBalanceModal}
                    setModalOpen={setupdateCreditBalanceModalOpen}
                    cid={cid}
                    setReload={setReload}
                    prevData={CreditBalance}
                    brandName={brandsList?.find((obj) => obj?.id == selectedBrand?.id)?.name}
                />
            </Grid>
        </>
    );
};

export default CreditBalance;
