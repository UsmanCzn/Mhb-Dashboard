import React, { useEffect, useState } from 'react';
import { Grid, Typography, Button, Box, TextField, InputLabel, MenuItem, Select, FormControl } from '@mui/material';
import customerService from 'services/customerService';
import constants from 'helper/constants';
import { useParams } from 'react-router-dom';
import { useFetchBrandsList } from 'features/BrandsTable/hooks/useFetchBrandsList';
import UpdateWallet from 'components/customers/updateWalletBalance';
import UpdateFreeItems from 'components/customers/updateFreeItems';
import UpdateCreditBalance from 'components/customers/updateCreditBalance';
import LinearProgress from '@mui/material/LinearProgress';


const CreditBalance = () => {
    const { cid } = useParams();

    const { brandsList } = useFetchBrandsList(true);

    const [selectedBrand, setselectedBrand] = useState({});
    const [walletDetails, setWalletDetails] = useState([]);
    const [points, setPoints] = useState(0);
    const [reload, setReload] = useState(false);
    const [loading, setLoading] = useState(false);
    
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

    // const [updateModalOpen, setUpdateModalOpen] = useState(false);
    // const [updateFreeItemModalOpen, setUpdateFreeItemModalOpen] = useState(false);
    const [updateCreditBalanceModal, setupdateCreditBalanceModalOpen] = useState(false);
 
    // GET CREDIT DETAILS
    const GetCreditDetails = async () => {
        await customerService
            .getCreditDetailsByCustomerId(cid, selectedBrand.id)
            .then((res) => {
                setCreditBalance(res.data.result[0]);
                // setWalletDetails(res?.data?.result);
            })
            .catch((err) => {
                console.log(err?.response?.data);
            });
    };

    // GET CUSTOMER POINTS
    const getCustomerPoints= async()=>{
        try {
        const data= { userId: +cid, brandId: +selectedBrand.id}
        const res = await customerService.getUserPointsCountByUserIdandBrandId$(data)
            if (res) {
                setPoints(res.data.result)
            }
        } catch(err) {
            console.log(err);
        }
    }

    // UPDATE CUSTOMER POINTS
    const updateCutsomerPoints =async()=>{
        setLoading(true)
        try {
        const data = {
            pointAdded:+points,
            brandId:selectedBrand.id,
            customerId:+ cid,
        }
        const response = await customerService.addPointsForCustomer(data)
        if(response){
            console.log(response);
            setLoading(false)
        }
        }catch(err){
            setLoading(false)
        }
    }
    useEffect(() => {
        if (selectedBrand && selectedBrand.id) {
            GetCreditDetails();
            getCustomerPoints()
        }
    }, [selectedBrand]);

    useEffect(() => {
        if (brandsList[0]?.id) {
            setselectedBrand(brandsList[0]);
        } else {
        }
    }, [brandsList]);



    return (
        <>
        {loading && <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                    </Box>
        }
        <Grid container spacing={4}>
            <Grid item xs={12} sx={{marginTop:'10px'}}>
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
                                {brandsList.map((row, index) => {
                                    return <MenuItem value={row}>{row?.name}</MenuItem>;
                                })}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Grid>

            <Grid item xs={12}>
                <Grid container >
                    <Grid item xs={3}>
                    <Box sx={{ display: 'flex', gap: '10px'}}>   
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
                        <Button
                        primary
                        variant="contained"
                        onClick={() => {
                            setupdateCreditBalanceModalOpen(true);
                        }}
                    >
                        Update
                    </Button>
                    </Box>
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
                    <Grid item xs={3}>
                
                    </Grid>
                </Grid>
            </Grid>

            <Grid item xs={12}>
                <Grid item xs={3}>
                <Box sx={{ display: 'flex', gap: '10px'}}>
                <TextField
                    id="outlined-basic"
                    fullWidth
                    label="Points to Redeem"
                    variant="outlined"
                    value={points}
                    onChange={(e)=>{ setPoints(e.target.value)}}
                />
                <Button
                    primary
                    variant="contained"
                    onClick={() => {
                        updateCutsomerPoints()
                    }}
                >
                    Update
                </Button>
                </Box>
            </Grid>
            </Grid>

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
