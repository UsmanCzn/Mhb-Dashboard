import React, { useState, useEffect } from 'react';
import { Grid, Typography, Button, FormControl, InputLabel, Select, MenuItem, TextField, Avatar, Switch } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import DefaultImg from '../../assets/images/users/default-image.png';
import Knet from '../../assets/images/users/knet.png';
import ApplePay from '../../assets/images/users/ApplePay.png';
import GooglePay from '../../assets/images/users/GooglePay.png';
import MasterVisa from '../../assets/images/users/MasterVisa.png';
import Amex from '../../assets/images/users/amex.png';
import paymentServices from 'services/paymentServices';
const PaymentGateway = ({ paymentGateway, brand }) => {
    const [methods, setMethods] = useState(paymentGateway?.methods || []);
    useEffect(() => {}, [brand]);

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

    const paymentMethodImage = (type) => {
        const images = {
            KNET: Knet,
            ApplePay: ApplePay,
            GOOGLEPAY: GooglePay,
            APPLEPAY: ApplePay
        };

        return images[type] || DefaultImg;
    };
    const onChangeMethod = (checked, index) => {
        const updatedMethods = methods.map((method, idx) => (idx === index ? { ...method, isHidden: !checked } : method));
        const method = updatedMethods[index];
        updateMethod(method);
        setMethods(updatedMethods);
    };
    const updateMethod = async (method) => {
        const body = {
            id: 0,
            brandId: brand?.id,
            paymentSystemName: method.paymentSystemName,
            paymentSystemAr: method.paymentSystemName,
            paymentSystemId: method.paymentid,
            isUsedForTopUp: true,
            isUsedForCheckOut: true,
            livePublicKey: '',
            liveSecretKey: method.liveKey,
            sandBoxPubicKey: '',
            sandBoxSecretKey: method.sandBoxKey,
            merchantId: method.merchantid,
            apiCurrencyCode: method.CurrencyCode,
            code: '',
            liveServerDomain: method.liveApi,
            sandBoxServerDomain: method.sandboxApi,
            id: method.id
        };
        return;
        const response = await paymentServices.UpdatePaymentMethods(body);
        console.log(response);

        // if (response) {
        //     enqueueSnackbar('Action Performed Successfully', {
        //         variant: 'success'
        //     });
        // }
    };
    const paymentMethods = [
        { id: 1, name: 'Knet', logo: 'knet-logo-url' },
        { id: 2, name: 'Apple Pay', logo: 'apple-pay-logo-url' },
        { id: 3, name: 'Visa/Master', logo: 'visa-master-logo-url' },
        { id: 4, name: 'Google Pay', logo: 'google-pay-logo-url' }
    ];
    const PaymentsTypes = [
        { name: 'Wallet', id: 1, arabicName: 'محفظة' },
        { name: 'KNET', id: 2, arabicName: 'ك نت' },
        { name: 'VISA/MASTER CARD', id: 3, arabicName: 'بطاقة ائتمان' },
        { name: 'BENEFIT', id: 4, arabicName: 'بنفت' },
        { name: 'Mada', id: 5, arabicName: 'مادہ' },
        { name: 'Square', id: 6, arabicName: 'مربع' },
        { name: 'ApplePay', id: 7, arabicName: 'ApplePay' },
        { name: 'GooglePay', id: 8, arabicName: 'GooglePay' },
        { name: 'CASH', id: 9, arabicName: 'CASH' }
      ];
      
    return (
        <Card variant="outlined" sx={{ marginTop: '10px' }}>
            <>
                <form onSubmit={formik.handleSubmit}>
                    <CardContent>
                        <Typography sx={{ fontSize: 18 }} color="text.primary" gutterBottom>
                            {paymentGateway.gateway} Payment Gateway
                        </Typography>

                        <Grid container spacing={2} sx={{ marginTop: '10px' }}>
                            {methods.map((method, index) => (
                                <Grid item xs={12} sm={6} md={3} key={index}>
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
                                        <img
                                            src={paymentMethodImage(method?.paymentSystemName)}
                                            alt="paymentmethod"
                                            style={{ width: '120px', height: '50px', marginLeft: '10px' }}
                                            // sx={{ width: 20, height: 20 }}
                                        />
                                        <CardContent sx={{ flex: 1 }}>
                                            <Typography variant="subtitle1">{method.paymentSystemName}</Typography>
                                        </CardContent>
                                        <Switch
                                            checked={!method.isHidden}
                                            onChange={(e) => {
                                                onChangeMethod(e.target.checked, index);
                                            }}
                                        />
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
        </Card>
    );
};

export default PaymentGateway;
