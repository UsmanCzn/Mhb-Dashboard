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
    const [totalStamps, setTotalStamps] = useState(0);
    const [updateCreditBalanceModal, setupdateCreditBalanceModalOpen] = useState(false);

    // Avoid name clash with component name
    const [creditBalanceState, setCreditBalanceState] = useState({
        creditBalance: 0,
        expiryDate: '',
        creditBalanceComment: ''
    });

    const [customerDetails, setCustomerDetails] = useState();

    // Single modal controller (mode: 'points' | 'freeItems' | 'stamps')
    const [adjustModal, setAdjustModal] = useState({ open: false, mode: 'points' });

    const GetCreditDetails = async () => {
        try {
            const res = await customerService.getCreditDetailsByCustomerId(cid, selectedBrand.id);
            setCreditBalanceState(res.data.result[0]);
            setTotalFreePoints(res.data.result[0]?.freeItems);
            setTotalStamps(res.data.result[0]?.punches);
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
                enqueueSnackbar('Points request generated', { variant: 'success' });
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
                enqueueSnackbar('Free drinks request generated', { variant: 'success' });
                await getCustomerPoints();
                await GetCreditDetails();
            }
        } catch (err) {
            // optionally enqueue error
        } finally {
            setLoading(false);
        }
    };

    // Stamps update
    const updateCustomerStamps = async (count, comments = '') => {
        setLoading(true);
        try {
            const data = {
                id: 0,
                brandId: selectedBrand.id,
                increaseFreeItemsCount: 0,
                increasePunchesCount: +count ?? 0,
                pointsUsed: 0,
                pointsEarned: 0,
                comments,
                customerId: customerDetails.id
            };
            const response = await customerService.updateUsedPoints(data);
            if (response) {
                enqueueSnackbar('Stamps request generated', { variant: 'success' });
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
        } else if (result.mode === 'freeItems') {
            await updateCustomerItem(result.value, result.comments);
        } else if (result.mode === 'stamps') {
            await updateCustomerStamps(result.value, result.comments);
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

    <Card sx={{ p: { xs: 1.5, sm: 2 }, boxShadow: 3, borderRadius: 2 }}>
      <CardContent>
        <Grid container spacing={{ xs: 2, sm: 4 }}>

          {/* Brand select */}
          <Grid item xs={12}>
            <Grid
              container
              alignItems={{ xs: 'stretch', sm: 'center' }}
              justifyContent="space-between"
              spacing={2}
            >
              <Grid item xs={12} sm="auto">
                <Typography fontSize={{ xs: 20, sm: 26 }} fontWeight={600} />
              </Grid>

              <Grid item xs={12} sm={4} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel id="brand-select-label">Brand</InputLabel>
                  <Select
                    labelId="brand-select-label"
                    id="brand-select"
                    value={selectedBrand}
                    label="Brand"
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

          {/* Credit Balance */}
          <Grid item xs={12}>
            <Grid
              container
              spacing={2}
              alignItems="stretch"
            >
              <Grid item xs={12} sm={6} md={4}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1.5,
                    p: 2,
                    border: '1px solid #e0e0e0',
                    borderRadius: 2,
                    backgroundColor: '#fff',
                    height: '100%'
                  }}
                >
                  <Typography variant="subtitle1" fontWeight={600}>
                    Credit 
                  </Typography>

                  <TextField
                    fullWidth
                    size="small"
                    label="Credit "
                    value={creditBalanceState?.creditBalance?.toFixed(2) ?? '0.00'}
                    InputProps={{ readOnly: true }}
                  />
                </Box>
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                md={2}
                display="flex"
                alignItems="center"
              >
                <Button
                  size="small"
                  variant="contained"
                  fullWidth
                  onClick={() => setupdateCreditBalanceModalOpen(true)}
                >
                  Update
                </Button>
              </Grid>
            </Grid>
          </Grid>

          {/* Points */}
          <Grid item xs={12}>
            <Grid container spacing={2} alignItems="stretch">
              <Grid item xs={12} sm={6} md={4}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1.5,
                    p: 2,
                    border: '1px solid #e0e0e0',
                    borderRadius: 2,
                    backgroundColor: '#fff',
                    height: '100%'
                  }}
                >
                  <Typography variant="subtitle1" fontWeight={600}>
                    User Points: {totalPoints ?? 0}
                  </Typography>

                  <TextField
                    fullWidth
                    size="small"
                    label="Current Points"
                    value={totalPoints ?? 0}
                    InputProps={{ readOnly: true }}
                  />
                </Box>
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                md={2}
                display="flex"
                alignItems="center"
              >
                <Button
                  size="small"
                  variant="contained"
                  fullWidth
                  onClick={() => setAdjustModal({ open: true, mode: 'points' })}
                >
                  Update
                </Button>
              </Grid>
            </Grid>
          </Grid>

          {/* Free Drinks */}
          {selectedBrand?.showFreeDrinkFeature && (
            <Grid item xs={12}>
              <Grid container spacing={2} alignItems="stretch">
                <Grid item xs={12} sm={6} md={4}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1.5,
                      p: 2,
                      border: '1px solid #e0e0e0',
                      borderRadius: 2,
                      backgroundColor: '#fff',
                      height: '100%'
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight={600}>
                      Free Drinks: {totalFreePoints ?? 0}
                    </Typography>

                    <TextField
                      fullWidth
                      size="small"
                      label="Current Free Drinks"
                      value={totalFreePoints ?? 0}
                      InputProps={{ readOnly: true }}
                    />
                  </Box>
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={2}
                  display="flex"
                  alignItems="center"
                >
                  <Button
                    size="small"
                    variant="contained"
                    fullWidth
                    onClick={() =>
                      setAdjustModal({ open: true, mode: 'freeItems' })
                    }
                  >
                    Update
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          )}

                    {/* Stamps */}
          {selectedBrand?.showFreeDrinkFeature && (
            <Grid item xs={12}>
              <Grid container spacing={2} alignItems="stretch">
                <Grid item xs={12} sm={6} md={4}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1.5,
                      p: 2,
                      border: '1px solid #e0e0e0',
                      borderRadius: 2,
                      backgroundColor: '#fff',
                      height: '100%'
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight={600}>
                      Stamps: {totalStamps ?? 0}
                    </Typography>

                    <TextField
                      fullWidth
                      size="small"
                      label="Current Stamps"
                      value={totalStamps ?? 0}
                      InputProps={{ readOnly: true }}
                    />
                  </Box>
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={2}
                  display="flex"
                  alignItems="center"
                >
                  <Button
                    size="small"
                    variant="contained"
                    fullWidth
                    onClick={() =>
                      setAdjustModal({ open: true, mode: 'stamps' })
                    }
                  >
                    Update
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          )}

          {/* Modals */}
          <AdjustCustomerValueModal
            open={adjustModal.open}
            mode={adjustModal.mode}
            onClose={handleAdjustClose}
            prevData={{
              value: '',
              expiryDate: new Date(),
              comments: ''
            }}
          />

          <UpdateCreditBalance
            modalOpen={updateCreditBalanceModal}
            setModalOpen={setupdateCreditBalanceModalOpen}
            cid={cid}
            setReload={setReload}
            prevData={creditBalanceState}
            brandName={
              brandsList?.find((obj) => obj?.id === selectedBrand?.id)?.name
            }
            brand={
              brandsList?.find((obj) => obj?.id === selectedBrand?.id)
            }
          />
        </Grid>
      </CardContent>
    </Card>
  </>
);

};

export default CreditBalance;
