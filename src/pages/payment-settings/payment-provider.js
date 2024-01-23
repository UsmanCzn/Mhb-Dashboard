import React, { useState, useEffect } from 'react';
import { Grid, Typography, Button, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { useFetchBrandsList } from 'features/BrandsTable/hooks/useFetchBrandsList';
import { useParams } from 'react-router-dom';
import paymentServices from 'services/paymentServices';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';

const Paymentprovider = () => {
    const [branchZero, setBranchZero] = useState([
        {
            id: 0,
            name: 'All Branches'
        }
    ]);

    const { id } = useParams();
    const navigate = useNavigate();

    const [data, setData] = useState({
        sandBoxKey: '',
        liveKey: '',
        sandboxApi: '',
        liveApi: '',
        CurrencyCode: '',
        merchantid: '',
        paymentid: '',
        paymentSystemName: ''
    });
    const PaymentsTypes = [
        { name: 'WALLET', id: 1 },
        { name: 'KNET', id: 2 },
        { name: 'VISA/MASTERCARD', id: 4 },
        { name: 'BENEFIT', id: 6 },
        { name: 'MADA', id: 7 },
        { name: 'Apple Pay', id: 9 }
    ];
    const [reload, setReload] = useState(false);
    const { brandsList } = useFetchBrandsList(reload);
    const [selectedBranch, setselectedBranch] = useState({});
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    useEffect(() => {
        if (brandsList[0]?.id) {
            setselectedBranch(brandsList[0]);
        }
        if (id) {
            getByid(id);
        }
    }, [brandsList]);

    const getByid = async (id) => {
        try {
            // Replace 'yourBrandId' with the actual brandId you want to pass
            const response = await paymentServices.GetPaymentById(id);
            const temp = { ...response.data.result };
            console.log(
                PaymentsTypes.find((e) => e.id == temp.paymentSystemId),
                'asdas'
            );
            setData({
                sandBoxKey: temp.sandBoxSecretKey,
                liveKey: temp.liveSecretKey,
                sandboxApi: temp.sandBoxServerDomain,
                liveApi: temp.liveServerDomain,
                CurrencyCode: temp.apiCurrencyCode,
                merchantid: temp.merchantId,
                paymentid: temp.paymentSystemId,
                merchantid: temp.merchantId,
                paymentSystemName: temp.paymentSystemName
            });
            console.log(response, 'getByid');
        } catch (error) {
            console.error('Error fetching brand payments:', error);
        }
    };

    const SubmitForm = async () => {
        if (!id) {
            try {
                const body = {
                    id: 0,
                    brandId: selectedBranch?.id,
                    paymentSystemName: data.paymentSystemName,
                    paymentSystemAr: data.paymentSystemName,
                    paymentSystemId: data.paymentid,
                    isUsedForTopUp: true,
                    isUsedForCheckOut: true,
                    livePublicKey: '',
                    liveSecretKey: data.liveKey,
                    sandBoxPubicKey: '',
                    sandBoxSecretKey: data.sandboxApi,
                    merchantId: data.merchantid,
                    apiCurrencyCode: data.CurrencyCode,
                    code: '',
                    liveServerDomain: data.liveApi,
                    sandBoxServerDomain: data.sandboxApi
                };

                const response = await paymentServices.CreateNewPaymentMethods(body);
                if (response) {
                    setData({
                        sandBoxKey: '',
                        liveKey: '',
                        sandboxApi: '',
                        liveApi: '',
                        CurrencyCode: '',
                        merchantid: '',
                        paymentid: '',
                        paymentSystemName: ''
                    });
                    enqueueSnackbar('Action Performed Successfully', {
                        variant: 'success'
                    });
                    navigate('/payments-settings/methods');
                }
            } catch (error) {
                console.error('Error fetching brand payments:', error);
            }
        } else {
        }
    };

    const card = (
        <>
            <CardContent>
                <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
                    Configure Payment Gateway
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Typography sx={{ fontSize: 14 }} color="text.primary">
                            SandBox Key
                        </Typography>
                        <TextField
                            id="outlined-basic"
                            fullWidth
                            variant="outlined"
                            value={data.sandBoxKey}
                            onChange={(e) => setData({ ...data, sandBoxKey: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Typography sx={{ fontSize: 14 }} color="text.primary">
                            Live Key
                        </Typography>
                        <TextField
                            id="outlined-basic"
                            fullWidth
                            variant="outlined"
                            required
                            value={data.liveKey}
                            onChange={(e) => setData({ ...data, liveKey: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Typography sx={{ fontSize: 14 }} color="text.primary">
                            SandBox Api Url
                        </Typography>
                        <TextField
                            id="outlined-basic"
                            fullWidth
                            variant="outlined"
                            value={data.liveApi}
                            onChange={(e) => setData({ ...data, liveApi: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Typography sx={{ fontSize: 14 }} color="text.primary">
                            Live Api Url
                        </Typography>
                        <TextField
                            id="outlined-basic"
                            fullWidth
                            variant="outlined"
                            value={data.sandboxApi}
                            onChange={(e) => setData({ ...data, sandboxApi: e.target.value })}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <Typography sx={{ fontSize: 14 }} color="text.primary">
                            Currency Code
                        </Typography>
                        <TextField
                            id="outlined-basic"
                            fullWidth
                            variant="outlined"
                            value={data.CurrencyCode}
                            onChange={(e) => setData({ ...data, CurrencyCode: e.target.value })}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <Typography sx={{ fontSize: 14 }} color="text.primary">
                            Merchant Id
                        </Typography>
                        <TextField
                            id="outlined-basic"
                            fullWidth
                            variant="outlined"
                            value={data.merchantid}
                            onChange={(e) => setData({ ...data, merchantid: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl fullWidth>
                            <Typography sx={{ fontSize: 14 }} color="text.primary">
                                Payements
                            </Typography>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={data.paymentid}
                                label={'payemntid'}
                                onChange={(e) => {
                                    console.log(e);
                                    setData({ ...data, paymentid: e.target.value });
                                }}
                            >
                                {PaymentsTypes.map((row, index) => {
                                    return (
                                        <MenuItem key={index} value={row.id}>
                                            {row?.name}
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </CardContent>
            <CardActions style={{ justifyContent: 'flex-end' }}>
                <Button
                    size="small"
                    variant="contained"
                    onClick={() => {
                        SubmitForm();
                    }}
                >
                    {id ? 'Update' : 'Save'}
                </Button>
            </CardActions>
        </>
    );

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item xs="auto">
                        <Typography variant="h4">Payment Provider</Typography>
                    </Grid>

                    <Grid item xs="auto">
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">{'Branch'}</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={selectedBranch}
                                label={'Branch'}
                                onChange={(event) => {
                                    setselectedBranch(event.target.value);
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
                </Grid>

                <Grid item xs={12} style={{ margin: '10px 0 0 0' }} alignItems="center" justifyContent="space-between">
                    <Card variant="outlined">{card}</Card>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Paymentprovider;
