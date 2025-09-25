import React, { useEffect, useState } from 'react';
import { Grid, Typography, Button, Box, TextField, InputLabel, MenuItem, Select, FormControl,Card, CardContent } from '@mui/material';
import customerService from 'services/customerService';
import { useParams } from 'react-router-dom';
import { useFetchBrandsList } from 'features/BrandsTable/hooks/useFetchBrandsList';

import UpdateCreditBalance from 'components/customers/updateCreditBalance';
import AdjustCustomerValueModal from 'components/customers/AdjustCustomerValueModal'; // <-- new generic modal
import LinearProgress from '@mui/material/LinearProgress';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import { useSnackbar } from 'notistack';

const CreditBalance = (props) => {
    const { user } = props;
    const { cid } = useParams();
    const { brandsList } = useFetchBrandsList(true);
    const { enqueueSnackbar } = useSnackbar();

    const [selectedBrand, setselectedBrand] = useState({});
    const [filteredBrand, setFilteredBrand] = useState([]);
    const [walletDetails, setWalletDetails] = useState([]);
    const [reload, setReload] = useState(false);
    const [loading, setLoading] = useState(false);
    const [totalPoints, setTotalPoints] = useState(0);
    const [totalFreePoints, setTotalFreePoints] = useState(0);
    const [updateCreditBalanceModal, setupdateCreditBalanceModalOpen] = useState(false);

    // Avoid name clash with component name
    const [creditBalanceState, setCreditBalanceState] = useState({
        creditBalance: 0,
        expiryDate: '',
        creditBalanceComment: ''
    });

    const [customerDetails, setCustomerDetails] = useState();

    // Single modal controller (mode: 'points' | 'freeItems')
    const [adjustModal, setAdjustModal] = useState({ open: false, mode: 'points' });

    const GetCreditDetails = async () => {
        try {
            const res = await customerService.getCreditDetailsByCustomerId(cid, selectedBrand.id);
            setCreditBalanceState(res.data.result[0]);
            setTotalFreePoints(res.data.result[0]?.freeItems);
        } catch (err) {
            console.log(err?.response?.data);
        }
    };

    const getCustomerPoints = async () => {
        try {
            const res = await customerService.getCustomerDetailV3(+cid, +selectedBrand.id);
            if (res) {
                setTotalPoints(res.data.result.redeemablePoints);
                setCustomerDetails(res.data.result);
            }
        } catch (err) {
            console.log(err);
        }
    };

    // Points update (uses pointsUsed)
    const updateCustomerPoints = async (p, comments = '') => {
        setLoading(true);
        try {
            const data = {
                id: 0,
                brandId: selectedBrand.id,
                increaseFreeItemsCount: 0,
                increasePunchesCount: 0,
                pointsUsed: +p,
                pointsEarned: 0,
                comments,
                customerId: customerDetails.id
            };
            const response = await customerService.updateUsedPoints(data);
            if (response) {
                enqueueSnackbar('Points updated', { variant: 'success' });
                await getCustomerPoints();
            }
        } catch (err) {
            // optionally enqueue error
        } finally {
            setLoading(false);
        }
    };

    // Free items update
    const updateCustomerItem = async (count, comments = '') => {
        setLoading(true);
        try {
            const data = {
                id: 0,
                brandId: selectedBrand.id,
                increaseFreeItemsCount: +count ?? 0,
                increasePunchesCount: 0,
                pointsUsed: 0,
                pointsEarned: 0,
                comments,
                customerId: customerDetails.id
            };
            const response = await customerService.updateUsedPoints(data);
            if (response) {
                enqueueSnackbar('Free drinks updated', { variant: 'success' });
                await getCustomerPoints();
                await GetCreditDetails();
            }
        } catch (err) {
            // optionally enqueue error
        } finally {
            setLoading(false);
        }
    };

    // Single modal close handler
    const handleAdjustClose = async (result) => {
        setAdjustModal((prev) => ({ ...prev, open: false }));
        if (!result) return; // cancelled

        if (result.mode === 'points') {
            await updateCustomerPoints(result.value, result.comments);
        } else {
            await updateCustomerItem(result.value, result.comments);
        }
    };

    useEffect(() => {
        if (selectedBrand && selectedBrand.id) {
            GetCreditDetails();
            getCustomerPoints();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedBrand]);

    useEffect(() => {
        if (brandsList[0]?.id) {
            const temp = brandsList.filter((br) => br.companyId === user?.companyId);
            setFilteredBrand(temp);
            setselectedBrand(temp[0]);
        }
    }, [brandsList, user?.companyId]);

    return (
        <>
            {loading && (
                <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                </Box>
            )}
            <Card sx={{ p: 2, boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
            <Grid container spacing={4}>
                {/* Brand select */}
                <Grid item xs={12} sx={{ marginTop: '10px' }}>
                    <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item xs="auto">
                            <Typography fontSize={26} fontWeight={600}></Typography>
                        </Grid>

                        <Grid item xs="auto">
                            <FormControl fullWidth>
                                <InputLabel id="brand-select-label">{'Brand'}</InputLabel>
                                <Select
                                    labelId="brand-select-label"
                                    id="brand-select"
                                    value={selectedBrand}
                                    label={'Brand'}
                                    onChange={(event) => setselectedBrand(event.target.value)}
                                    renderValue={(val) => (val?.name ? val.name : '')}
                                >
                                    {filteredBrand.map((row, index) => (
                                        <MenuItem key={index} value={row}>
                                            {row?.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Grid>

                {/* Credit Balance card */}
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
                                    backgroundColor: '#ffff'
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {/* <AccessibilityNewIcon color="primary" /> */}
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        Credit Balance:
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', gap: '10px' }}>
                                    <TextField
                                        id="credit-balance-readonly"
                                        fullWidth
                                        label="Credit Balance"
                                        variant="outlined"
                                        value={creditBalanceState?.creditBalance?.toFixed(2)}
                                        InputProps={{ readOnly: true }}
                                    />
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={6} sm={4} md={3}>
                            <Button variant="contained" onClick={() => setupdateCreditBalanceModalOpen(true)}>
                                Update
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>

                {/* Points (read-only + Update) */}
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
                                    backgroundColor: '#ffff'
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        Total User Points: {totalPoints ?? 0}
                                    </Typography>
                                </Box>

                                <TextField
                                    id="current-points"
                                    fullWidth
                                    label="Current Points"
                                    variant="outlined"
                                    value={totalPoints ?? 0}
                                    InputProps={{ readOnly: true }}
                                />
                            </Box>
                        </Grid>

                        <Grid item xs={6} sm={4} md={3}>
                            <Button
                                variant="contained"
                                color="primary"
                                type="button"
                                onClick={() => setAdjustModal({ open: true, mode: 'points' })}
                                sx={{ padding: '6px 16px', fontSize: '0.875rem' }}
                            >
                                Update
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>

                {/* Free items (read-only + Update) */}
                {selectedBrand?.showFreeDrinkFeature && (
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
                                        backgroundColor: '#ffff'
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                       
                                        <Typography variant="subtitle1" fontWeight="bold">
                                            Total Free Drinks: {totalFreePoints ?? 0}
                                        </Typography>
                                    </Box>
                                    <TextField
                                        id="current-free-items"
                                        fullWidth
                                        label="Current Free Drinks"
                                        variant="outlined"
                                        value={totalFreePoints ?? 0}
                                        InputProps={{ readOnly: true }}
                                    />
                                </Box>
                            </Grid>

                            <Grid item xs={6} sm={4} md={3}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="button"
                                    onClick={() => setAdjustModal({ open: true, mode: 'freeItems' })}
                                    sx={{ padding: '6px 16px', fontSize: '0.875rem' }}
                                >
                                    Update
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                )}

                {/* Generic Adjust Modal (works for both) */}
                <AdjustCustomerValueModal
                    open={adjustModal.open}
                    mode={adjustModal.mode}
                    onClose={handleAdjustClose}
                    prevData={{
                        value: '',
                        expiryDate: new Date(), // used only when mode='points'
                        comments: ''
                    }}
                />

                {/* Credit Balance Modal */}
                <UpdateCreditBalance
                    modalOpen={updateCreditBalanceModal}
                    setModalOpen={setupdateCreditBalanceModalOpen}
                    cid={cid}
                    setReload={setReload}
                    prevData={creditBalanceState}
                    brandName={brandsList?.find((obj) => obj?.id === selectedBrand?.id)?.name}
                    brand={brandsList?.find((obj) => obj?.id === selectedBrand?.id)}
                />
            </Grid>
            </CardContent>
            </Card>
        </>
    );
};

export default CreditBalance;
