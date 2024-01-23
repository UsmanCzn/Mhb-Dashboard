import React, { useEffect, useState } from 'react';
import { Grid, Typography, Button, Box, TextField, InputLabel, MenuItem, Select, FormControl } from '@mui/material';
import customerService from 'services/customerService';
import constants from 'helper/constants';
import { useParams } from 'react-router-dom';
import { useFetchBrandsList } from 'features/BrandsTable/hooks/useFetchBrandsList';
import UpdateWallet from 'components/customers/updateWalletBalance';
import UpdateFreeItems from 'components/customers/updateFreeItems';
import UpdateCreditBalance from 'components/customers/updateCreditBalance';

const CreditBalance = () => {
    const { cid } = useParams();

    const { brandsList } = useFetchBrandsList(true);

    const [selectedBrand, setselectedBrand] = useState({});
    const [walletDetails, setWalletDetails] = useState([]);
    const [reload, setReload] = useState(false);
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
                console.log(res?.data?.result[0], 'wallet dd');
                setCreditBalance(res.data.result[0]);
                // setWalletDetails(res?.data?.result);
            })
            .catch((err) => {
                console.log(err?.response?.data);
            });
    };
    useEffect(() => {
        if (selectedBrand && selectedBrand.id) {
            GetCreditDetails();
        }
    }, [selectedBrand]);

    useEffect(() => {
        if (brandsList[0]?.id) {
            console.log(brandsList[0]?.id, 'gugygyuguygyu');
            setselectedBrand(brandsList[0]);
        } else {
            console.log('now goes to zero ', 'sb');
        }
    }, [brandsList]);

    useEffect(() => {
        // GetCreditDetails();
    }, [reload]);

    return (
        <Grid container spacing={4}>
            <Grid item xs={12}>
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
                <Grid container spacing={2}>
                    <Grid item xs={3}>
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
    );
};

export default CreditBalance;
