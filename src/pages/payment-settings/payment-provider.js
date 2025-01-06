import React, { useState, useEffect } from 'react';
import { Grid, Typography, Button, FormControl, InputLabel, Select, MenuItem, TextField, Avatar, Switch } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { useFetchBrandsList } from 'features/BrandsTable/hooks/useFetchBrandsList';
import { useParams } from 'react-router-dom';
import paymentServices from 'services/paymentServices';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import PaymentGateway from './payment-gateway';

const Paymentprovider = () => {
    const [paymentGateways, setPaymentGateways] = useState([]);
    const fetchData = async (brandid) => {
        try {
            // Replace 'yourBrandId' with the actual brandId you want to pass
            const response = await paymentServices.getAllBrandPaymentByBrandId(brandid);
            const paymentMethodsByGateway = gatewayOptions.map((gateway) => {
                const methods = response.data.result.filter((method) => method.gatewayId === gateway.value);
                return {
                    gateway: gateway.title,
                    methods: methods
                };
            });
            console.log(paymentMethodsByGateway, 'poiopi');
            setPaymentGateways(paymentMethodsByGateway);
        } catch (error) {
            console.error('Error fetching brand payments:', error);
        }
    };

    const { id } = useParams();
    const navigate = useNavigate();
    const gatewayOptions = [
        { title: 'Tap', value: 1 },
        { title: 'Ottu', value: 2 },
        { title: 'Tehseeel', value: 3 },
        { title: 'Square', value: 4 },
        { title: 'Checkout', value: 5 },
        { title: 'MyFatoorah', value: 6 },
        { title: 'Hesabi', value: 7 }
    ];
    const formik = useFormik({
        initialValues: {
            sandBoxKey: '',
            liveKey: '',
            sandBoxApiUrl: '',
            liveApiUrl: '',
            currencyCode: '',
            merchantId: '',
            paymentId: '',
            gateway: 1
        },
        validationSchema: Yup.object({
            sandBoxKey: Yup.string().required('Sandbox Key is required'),
            liveKey: Yup.string().required('Live Key is required'),
            sandBoxApiUrl: Yup.string().required('Sandbox API URL is required'),
            liveApiUrl: Yup.string().required('Live API URL is required'),
            currencyCode: Yup.string().required('Currency Code is required'),
            merchantId: Yup.string().required('Merchant ID is required'),
            paymentId: Yup.string().required('Payment Type is required'),
            gateway: Yup.number().required('Gateway is required')
        }),
        onSubmit: (values) => {
            console.log('Form values:', values);
            SubmitForm(values);
        }
    });
    const paymentMethods = [
        { id: 1, name: 'Knet', logo: 'knet-logo-url' },
        { id: 2, name: 'Apple Pay', logo: 'apple-pay-logo-url' },
        { id: 3, name: 'Visa/Master', logo: 'visa-master-logo-url' },
        { id: 4, name: 'Google Pay', logo: 'google-pay-logo-url' }
    ];
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
    const [selectedBrand, setselectedBrand] = useState('');
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    useEffect(() => {
        if (brandsList[0]?.id) {
            setselectedBrand(brandsList[0]);
            fetchData(brandsList[0]?.id);
        }
        if (id) {
            getByid(id);
        }
    }, [brandsList]);

    useEffect(() => {
        fetchData(selectedBrand.id);
    }, [selectedBrand]);

    const SubmitForm = async (values) => {
        if (!id) {
            try {
                const body = {
                    id: 0,
                    brandId: selectedBrand?.id,
                    paymentSystemName: values.paymentSystemName,
                    paymentSystemAr: values.paymentSystemName,
                    paymentSystemId: values.paymentid,
                    isUsedForTopUp: true,
                    isUsedForCheckOut: true,
                    livePublicKey: '',
                    liveSecretKey: values.liveKey,
                    sandBoxPubicKey: '',
                    sandBoxSecretKey: values.sandBoxKey,
                    merchantId: values.merchantid,
                    apiCurrencyCode: values.CurrencyCode,
                    code: '',
                    liveServerDomain: values.liveApi,
                    sandBoxServerDomain: values.sandboxApi,
                    gatewayId: values.gateway
                };
                const response = await paymentServices.CreateNewPaymentMethods(body);
                if (response) {
                    // setData({
                    //     sandBoxKey: '',
                    //     liveKey: '',
                    //     sandboxApi: '',
                    //     liveApi: '',
                    //     CurrencyCode: '',
                    //     merchantid: '',
                    //     paymentid: '',
                    //     paymentSystemName: ''
                    // });
                    formik.reset();
                    enqueueSnackbar('Action Performed Successfully', {
                        variant: 'success'
                    });
                    navigate('/payments-settings/methods');
                }
            } catch (error) {
                console.error('Error fetching brand payments:', error);
            }
        } else {
            const body = {
                id: 0,
                brandId: selectedBrand?.id,
                paymentSystemName: values.paymentSystemName,
                paymentSystemAr: values.paymentSystemName,
                paymentSystemId: values.paymentid,
                isUsedForTopUp: true,
                isUsedForCheckOut: true,
                livePublicKey: '',
                liveSecretKey: values.liveKey,
                sandBoxPubicKey: '',
                sandBoxSecretKey: values.sandBoxKey,
                merchantId: values.merchantid,
                apiCurrencyCode: values.CurrencyCode,
                code: '',
                liveServerDomain: values.liveApi,
                sandBoxServerDomain: values.sandboxApi
            };
            body.id = id;
            const response = await paymentServices.UpdatePaymentMethods(body);
            if (response) {
                enqueueSnackbar('Action Performed Successfully', {
                    variant: 'success'
                });
                // navigate('/payments-settings/methods');
            }
        }
    };

    const card = (
        <>
            <form onSubmit={formik.handleSubmit}>
                <CardContent>
                    <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
                        Configure Payment Gateway
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Typography sx={{ fontSize: 14 }} color="text.primary">
                                Sandbox Key
                            </Typography>
                            <TextField
                                id="sandBoxKey"
                                name="sandBoxKey"
                                fullWidth
                                variant="outlined"
                                value={formik.values.sandBoxKey}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.sandBoxKey && Boolean(formik.errors.sandBoxKey)}
                                helperText={formik.touched.sandBoxKey && formik.errors.sandBoxKey}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Typography sx={{ fontSize: 14 }} color="text.primary">
                                Live Key
                            </Typography>
                            <TextField
                                id="liveKey"
                                name="liveKey"
                                fullWidth
                                variant="outlined"
                                value={formik.values.liveKey}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.liveKey && Boolean(formik.errors.liveKey)}
                                helperText={formik.touched.liveKey && formik.errors.liveKey}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Typography sx={{ fontSize: 14 }} color="text.primary">
                                Sandbox API URL
                            </Typography>
                            <TextField
                                id="sandBoxApiUrl"
                                name="sandBoxApiUrl"
                                fullWidth
                                variant="outlined"
                                value={formik.values.sandBoxApiUrl}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.sandBoxApiUrl && Boolean(formik.errors.sandBoxApiUrl)}
                                helperText={formik.touched.sandBoxApiUrl && formik.errors.sandBoxApiUrl}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Typography sx={{ fontSize: 14 }} color="text.primary">
                                Live API URL
                            </Typography>
                            <TextField
                                id="liveApiUrl"
                                name="liveApiUrl"
                                fullWidth
                                variant="outlined"
                                value={formik.values.liveApiUrl}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.liveApiUrl && Boolean(formik.errors.liveApiUrl)}
                                helperText={formik.touched.liveApiUrl && formik.errors.liveApiUrl}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Typography sx={{ fontSize: 14 }} color="text.primary">
                                Currency Code
                            </Typography>
                            <TextField
                                id="currencyCode"
                                name="currencyCode"
                                fullWidth
                                variant="outlined"
                                value={formik.values.currencyCode}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.currencyCode && Boolean(formik.errors.currencyCode)}
                                helperText={formik.touched.currencyCode && formik.errors.currencyCode}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Typography sx={{ fontSize: 14 }} color="text.primary">
                                Merchant ID
                            </Typography>
                            <TextField
                                id="merchantId"
                                name="merchantId"
                                fullWidth
                                variant="outlined"
                                value={formik.values.merchantId}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.merchantId && Boolean(formik.errors.merchantId)}
                                helperText={formik.touched.merchantId && formik.errors.merchantId}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth error={formik.touched.paymentId && Boolean(formik.errors.paymentId)}>
                                <Typography sx={{ fontSize: 14 }} color="text.primary">
                                    Payments
                                </Typography>
                                <Select
                                    id="paymentId"
                                    name="paymentId"
                                    value={formik.values.paymentId}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                >
                                    {PaymentsTypes.map((row, index) => (
                                        <MenuItem key={index} value={row.id}>
                                            {row?.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {formik.touched.paymentId && formik.errors.paymentId && (
                                    <Typography color="error" variant="body2">
                                        {formik.errors.paymentId}
                                    </Typography>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth error={formik.touched.gateway && Boolean(formik.errors.gateway)}>
                                <Typography sx={{ fontSize: 14 }} color="text.primary">
                                    Gateway
                                </Typography>
                                <Select
                                    id="gateway"
                                    name="gateway"
                                    value={formik.values.gateway}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                >
                                    {gatewayOptions.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.title}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {formik.touched.gateway && formik.errors.gateway && (
                                    <Typography color="error" variant="body2">
                                        {formik.errors.gateway}
                                    </Typography>
                                )}
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} sx={{ marginTop: '10px' }}>
                        {paymentMethods.map((method) => (
                            <Grid item xs={12} sm={6} md={3} key={method.id}>
                                <Card
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '1px',
                                        boxShadow: 'none',
                                        border: '1px solid #ccc',
                                        borderRadius: '8px'
                                    }}
                                >
                                    <img src={method.logo} alt="paymentmethod" sx={{ width: 40, height: 40, marginRight: 2 }} />
                                    <CardContent sx={{ flex: 1 }}>
                                        <Typography variant="subtitle1">{method.name}</Typography>
                                    </CardContent>
                                    <Switch defaultChecked />
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </CardContent>
                {/* <CardActions style={{ justifyContent: 'flex-end' }}>
                    <Button type="submit" size="small" variant="contained">
                        {id ? 'Update' : 'Save'}
                    </Button>
                </CardActions> */}
            </form>
        </>
    );

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item xs="auto">
                        <Typography fontSize={22} fontWeight={700}>
                            Payment Provider
                        </Typography>
                    </Grid>

                    <Grid item xs="auto">
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">{'Brand'}</InputLabel>
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
                </Grid>

                <Grid item xs={12} style={{ margin: '10px 0 0 0' }} alignItems="center" justifyContent="space-between">
                    {paymentGateways.map((e) => (
                        <Grid item xs={12} key={e.id}>
                            {e.methods.length > 0 && <PaymentGateway paymentGateway={e} brand={selectedBrand} />}
                        </Grid>
                    ))}
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Paymentprovider;
