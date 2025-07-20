import React, { useState, useEffect } from 'react';
import {
    Grid,
    Typography,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormControlLabel,
    TextField,
    Box,
    Switch,
    Checkbox
} from '@mui/material';
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
import LinearProgress from '@mui/material/LinearProgress';

const AddPaymentMethod = () => {
    const [branchZero, setBranchZero] = useState([
        {
            id: 0,
            name: 'All Branches'
        }
    ]);
    const [payments, setpayments] = useState(null);
    const [visibleFields, setVisibleFields] = useState([]);
    const [validationSchema, setValidationSchema] = useState(Yup.object({}));
    const { id, bid } = useParams();
    const navigate = useNavigate();
    const gatewayOptions = [
        { title: 'Tap', value: 1 },
        // { title: 'Ottu', value: 2 }, Usman 16-0-2025 (Not Integrated with brand)
        { title: 'Tehseeel', value: 3 },
        { title: 'Square', value: 4 },
        // { title: 'Checkout', value: 5 },Usman 16-0-2025 (Not Integrated with brand) No Idea
        { title: 'MyFatoorah', value: 6 },
        { title: 'Hesabi', value: 7 },
        { title: 'SkipCash', value: 8},
    ];
    const formik = useFormik({
        initialValues: {
            // New fields
            apiCheckOutUrl: '',
            apiTopUpUrl: '',
            currencyCode: '',
            gateway: 1,
            hesabiMerchantCode: '',
            hesabiMerchantIv: '',
            hesabiPAYMENTURL: '',
            isHidden: false,
            liveApiUrl: '',
            liveKey: '',
            locationId: '',
            merchantId: '',
            paymentId: '',
            paymentImageUrl: '',
            paymentSystemName: '',
            paymentSystemNative: '',
            paymentTrackingInfoUrl: '',
            redirectCheckOutUrl: '',
            redirectTopUpUrl: '',
            sandBoxServerDomain: '',
            sandBoxSecretKey: '',
            supplierShare: 0,
            tehseeelAppUrl: '',
            tehseeelCCAPI: '',
            tehseeelKnetAPI: '',
            tehseeelpwd: '',
            tehseeelsecret: '',
            tehseeeluid: '',
            // Added fields:
            ShowOnWeb: false,
            ShowOnIOS: false,
            ShowOnAndroid: false
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            console.log('Form values:', values);
            SubmitForm(values);
        }
    });

    const PaymentsTypes = [
        { name: 'Wallet', id: 1, arabicName: 'محفظة' },
        { name: 'KNET', id: 2, arabicName: 'ك نت' },
        { name: 'VISA/MASTER CARD', id: 3, arabicName: 'بطاقة ائتمان' },
        { name: 'BENEFIT', id: 4, arabicName: 'بنفت' },
        { name: 'Mada', id: 5, arabicName: 'مادہ' },
        { name: 'Square', id: 6, arabicName: 'مربع' },
        { name: 'ApplePay', id: 7, arabicName: 'ApplePay' },
        { name: 'GooglePay', id: 8, arabicName: 'GooglePay' },
        { name: 'CASH', id: 9, arabicName: 'CASH' },
        { name: 'SkipCash', id: 10, arabicName: 'SkipCash' },
    ];
    const [loading, setLoading] = useState(false);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const getByid = async (id) => {
        try {
            const response = await paymentServices.GetPaymentById(id);
            const temp = { ...response.data.result };
            setpayments(temp);
            formik.setValues({
                sandBoxSecretKey: temp.sandBoxSecretKey,
                liveSecretKey: temp.liveSecretKey,
                sandBoxServerDomain: temp.sandBoxServerDomain,
                liveServerDomain: temp.liveServerDomain,
                currencyCode: temp.apiCurrencyCode,
                merchantId: temp.merchantId,
                paymentId: temp.paymentSystemId,
                gateway: temp.gatewayId,
                paymentSystemName: temp.paymentSystemName,
                // New fields
                apiCheckOutUrl: temp.apiCheckOutUrl,
                livePublicKey: temp.livePublicKey,
                apiTopUpUrl: temp.apiTopUpUrl,
                hesabiMerchantCode: temp.hesabiMerchantCode,
                hesabiMerchantIv: temp.hesabiMerchantIv,
                hesabiPAYMENTURL: temp.hesabiPAYMENTURL,
                isHidden: temp.isHidden,
                locationId: temp.locationId,
                paymentSystemNative: temp.paymentSystemNative,
                paymentImageUrl: temp.paymentImageUrl,
                paymentTrackingInfoUrl: temp.paymentTrackingInfoUrl,
                redirectCheckOutUrl: temp.redirectCheckOutUrl,
                redirectTopUpUrl: temp.redirectTopUpUrl,
                supplierShare: temp.supplierShare,
                supplierCode: temp.supplierCode,
                tehseeelAppUrl: temp.tehseeelAppUrl,
                tehseeelCCAPI: temp.tehseeelCCAPI,
                tehseeelKnetAPI: temp.tehseeelKnetAPI,
                tehseeelpwd: temp.tehseeelpwd,
                tehseeelsecret: temp.tehseeelsecret,
                tehseeeluid: temp.tehseeeluid,
                // Add the flag values if they exist, default false if not
                ShowOnWeb: temp.showOnWeb ?? false,
                ShowOnIOS: temp.showOnIOS ?? false,
                ShowOnAndroid: temp.showOnAndroid ?? false,
            });
            setLoading(false);
            console.log(response, 'getByid');
        } catch (error) {
            console.error('Error fetching brand payments:', error);
        }
    };
    useEffect(() => {
        if (id) {
            setLoading(true);
            getByid(id);
        }
    }, [id]);
    const handleSubmit = async () => {
        const errors = await formik.validateForm();
        if (Object.keys(errors).length > 0) {
            console.log('Validation errors:', errors);
            formik.setTouched(errors);
        } else {
            formik.handleSubmit();
        }
    };

    useEffect(() => {
        const updateFields = () => {
            let requiredFields = [];
            let schema = Yup.object({
                merchantId: Yup.string().required('Merchant ID is required'),
                currencyCode: Yup.string().required('Currency Code is required'),
                paymentId: Yup.string().required('Payment Type is required'),
                gateway: Yup.number().required('Gateway is required'),
                // Optional: add flags to validation if needed
              
            });

            switch (formik.values.gateway) {
                case 1: // Tap
                    requiredFields = [
                        { field: 'liveSecretKey', label: 'Live Secret Key' },
                        { field: 'liveServerDomain', label: 'Live Server Domain' },
                        { field: 'sandBoxSecretKey', label: 'Sandbox Secret Key' },
                        { field: 'sandBoxServerDomain', label: 'Sandbox Server Domain' }
                    ];
                    schema = schema.shape({
                        liveSecretKey: Yup.string().required('Live Secret Key is required'),
                        liveServerDomain: Yup.string().required('Live Server Domain is required'),
                        sandBoxSecretKey: Yup.string().required('Sandbox Secret Key is required'),
                        sandBoxServerDomain: Yup.string().required('Sandbox Server Domain is required')
                    });
                    break;

                case 3: // Tehseeel
                    requiredFields = [
                        { field: 'liveServerDomain', label: 'Live Server Domain' },
                        { field: 'tehseeelAppUrl', label: 'Tehseeel App URL' },
                        { field: 'apiCheckOutUrl', label: 'API Checkout URL' },
                        { field: 'paymentTrackingInfoUrl', label: 'Payment Tracking Info URL' },
                        { field: 'tehseeelKnetAPI', label: 'Tehseeel Knet API' },
                        { field: 'tehseeelpwd', label: 'Tehseeel Password' },
                        { field: 'tehseeelsecret', label: 'Tehseeel Secret' },
                        { field: 'tehseeeluid', label: 'Tehseeel UID' }
                    ];
                    schema = schema.shape({
                        liveServerDomain: Yup.string().required('Live Server Domain is required'),
                        tehseeelAppUrl: Yup.string().required('Tehseeel App URL is required'),
                        apiCheckOutUrl: Yup.string().required('API Checkout URL is required'),
                        paymentTrackingInfoUrl: Yup.string().required('Payment Tracking Info URL is required'),
                        tehseeelKnetAPI: Yup.string().required('Tehseeel Knet API is required'),
                        tehseeelpwd: Yup.string().required('Tehseeel Password is required'),
                        tehseeelsecret: Yup.string().required('Tehseeel Secret is required'),
                        tehseeeluid: Yup.string().required('Tehseeel UID is required')
                    });
                    break;

                case 4: // Square
                    requiredFields = [
                        { field: 'livePublicKey', label: 'Live Public Key' },
                        { field: 'liveSecretKey', label: 'Live Secret Key' },
                        { field: 'locationId', label: 'Location ID' }
                    ];
                    schema = schema.shape({
                        livePublicKey: Yup.string().required('Live Public Key is required'),
                        liveSecretKey: Yup.string().required('Live Secret Key is required'),
                        locationId: Yup.string().required('Location ID is required')
                    });
                    break;

                case 6: // MyFatoorah
                    requiredFields = [
                        { field: 'liveSecretKey', label: 'Live Secret Key' },
                        { field: 'liveServerDomain', label: 'Live Server Domain' },
                        { field: 'apiCheckOutUrl', label: 'API Checkout URL' },
                        { field: 'sandBoxSecretKey', label: 'Sandbox Secret Key' },
                        { field: 'sandBoxServerDomain', label: 'Sandbox Server Domain' },
                        { field: 'supplierCode', label: 'Supplier Code' },
                        { field: 'supplierShare', label: 'Supplier Share' }
                    ];
                    schema = schema.shape({
                        liveSecretKey: Yup.string().required('Live Secret Key is required'),
                        liveServerDomain: Yup.string().required('Live Server Domain is required'),
                        apiCheckOutUrl: Yup.string().required('API Checkout URL is required'),
                        sandBoxSecretKey: Yup.string().required('Sandbox Secret Key is required'),
                        sandBoxServerDomain: Yup.string().required('Sandbox Server Domain is required'),
                        supplierCode: Yup.string().required('Supplier Code is required'),
                        supplierShare: Yup.number().required('Supplier Share is required').min(0)
                    });
                    break;

                case 7: // Hesabi
                    requiredFields = [
                        { field: 'liveSecretKey', label: 'Live Secret Key' },
                        { field: 'liveServerDomain', label: 'Live Server Domain' },
                        { field: 'apiCheckOutUrl', label: 'API Checkout URL' },
                        { field: 'hesabiPAYMENTURL', label: 'Hesabi PAYMENT URL' },
                        { field: 'hesabiMerchantIv', label: 'Hesabi Merchant IV' },
                        { field: 'hesabiMerchantCode', label: 'Hesabi Merchant Code' },
                        { field: 'sandBoxServerDomain', label: 'Sandbox Server Domain' }
                    ];
                    schema = schema.shape({
                        liveSecretKey: Yup.string().required('Live Secret Key is required'),
                        liveServerDomain: Yup.string().required('Live Server Domain is required'),
                        apiCheckOutUrl: Yup.string().required('API Checkout URL is required'),
                        hesabiPAYMENTURL: Yup.string().required('Hesabi PAYMENT URL is required'),
                        merchantId: Yup.string().required('Merchant ID is required'),
                        hesabiMerchantIv: Yup.string().required('Hesabi Merchant IV is required'),
                        hesabiMerchantCode: Yup.string().required('Hesabi Merchant Code is required'),
                        sandBoxServerDomain: Yup.string().required('Sandbox Server Domain is required')
                    });
                    break;

                default:
                    break;
            }

            setVisibleFields(requiredFields);
            setValidationSchema(schema);

            // Reset form while keeping mandatory fields
            if (!id) {
                formik.resetForm({
                    values: { gateway: formik.values.gateway }
                });
            }
        };

        updateFields();
    }, [formik.values.gateway]);

    const SubmitForm = async (values) => {
        console.log(values);

        if (!id) {
            try {
                const body = {
                    apiCurrencyCode: values.currencyCode,
                    brandId: bid,
                    code: values.currencyCode,
                    gatewayId: values.gateway,
                    id: 0,
                    isUsedForCheckOut: true,
                    isUsedForTopUp: true,
                    livePublicKey: values.livePublicKey,
                    liveSecretKey: values.liveSecretKey,
                    liveServerDomain: values.liveServerDomain,
                    merchantId: values.merchantId,
                    paymentSystemAr: values.paymentSystemName,
                    paymentSystemId: values.paymentId,
                    paymentSystemName: values.paymentSystemName,
                    sandBoxPubicKey: '',
                    sandBoxSecretKey: values.sandBoxSecretKey,
                    sandBoxServerDomain: values.sandBoxServerDomain,
                    //NEW VALUES
                    apiCheckOutUrl: values.apiCheckOutUrl,
                    apiTopUpUrl: values.apiTopUpUrl,
                    hesabiMerchantCode: values.hesabiMerchantCode,
                    hesabiMerchantIv: values.hesabiMerchantIv,
                    hesabiPAYMENTURL: values.hesabiPAYMENTURL,
                    isHidden: values.isHidden,
                    locationId: values.locationId,
                    paymentSystemNative: values.paymentSystemNative,
                    paymentImageUrl: values.paymentImageUrl,
                    paymentTrackingInfoUrl: values.paymentTrackingInfoUrl,
                    redirectCheckOutUrl: values.redirectCheckOutUrl,
                    redirectTopUpUrl: values.redirectTopUpUrl,
                    supplierShare: values.supplierShare,
                    supplierCode: values.supplierCode,
                    tehseeelAppUrl: values.tehseeelAppUrl,
                    tehseeelCCAPI: values.tehseeelCCAPI,
                    tehseeelKnetAPI: values.tehseeelKnetAPI,
                    tehseeelpwd: values.tehseeelpwd,
                    tehseeelsecret: values.tehseeelsecret,
                    tehseeeluid: values.tehseeeluid,
                    // Flags
                    ShowOnWeb: values.ShowOnWeb,
                    ShowOnIOS: values.ShowOnIOS,
                    ShowOnAndroid: values.ShowOnAndroid
                };
                
                const response = await paymentServices.CreateNewPaymentMethods(body);
                if (response) {
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
                ...payments,
                id: 0,
                brandId: bid,
                paymentSystemName: values.paymentSystemName,
                paymentSystemAr: values.paymentSystemName,
                paymentSystemId: values.paymentId,
                isUsedForTopUp: true,
                isUsedForCheckOut: true,
                livePublicKey: values.livePublicKey,
                liveSecretKey: values.liveSecretKey,
                sandBoxPubicKey: '',
                sandBoxSecretKey: values.sandBoxSecretKey,
                merchantId: values.merchantId,
                apiCurrencyCode: values.CurrencyCode,
                code: values.currencyCode,
                liveServerDomain: values.liveServerDomain,
                sandBoxServerDomain: values.sandBoxServerDomain,
                gatewayId: values.gateway,
                // New fields
                apiCheckOutUrl: values.apiCheckOutUrl,
                apiTopUpUrl: values.apiTopUpUrl,
                hesabiMerchantCode: values.hesabiMerchantCode,
                hesabiMerchantIv: values.hesabiMerchantIv,
                hesabiPAYMENTURL: values.hesabiPAYMENTURL,
                isHidden: values.isHidden,
                locationId: values.locationId,
                paymentSystemNative: values.paymentSystemNative,
                paymentImageUrl: values.paymentImageUrl,
                paymentTrackingInfoUrl: values.paymentTrackingInfoUrl,
                redirectCheckOutUrl: values.redirectCheckOutUrl,
                redirectTopUpUrl: values.redirectTopUpUrl,
                supplierShare: values.supplierShare,
                supplierCode: values.supplierCode,
                tehseeelAppUrl: values.tehseeelAppUrl,
                tehseeelCCAPI: values.tehseeelCCAPI,
                tehseeelKnetAPI: values.tehseeelKnetAPI,
                tehseeelpwd: values.tehseeelpwd,
                tehseeelsecret: values.tehseeelsecret,
                tehseeeluid: values.tehseeeluid,
                // Flags
                ShowOnWeb: values.ShowOnWeb,
                ShowOnIOS: values.ShowOnIOS,
                ShowOnAndroid: values.ShowOnAndroid
            };
            body.id = +id;
 
            const response = await paymentServices.UpdatePaymentMethods(body);
            if (response) {
                enqueueSnackbar('Action Performed Successfully', {
                    variant: 'success'
                });
                navigate('/payments-settings/methods');
            }
        }
    };

    return (
        <Card variant="outlined">
            <form onSubmit={formik.handleSubmit}>
                <CardContent>
                    <Typography fontSize={22} fontWeight={700}>
                        Configure Payment Gateway
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <InputLabel id="paymentId-label">Payments Gateways</InputLabel>
                                <Select
                                    name="gateway"
                                    labelId="paymentId-label"
                                    value={formik.values.gateway}
                                    onChange={formik.handleChange}
                                >
                                    {gatewayOptions.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.title}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth error={formik.touched.paymentId && Boolean(formik.errors.paymentId)}>
                                <InputLabel id="paymentMethods-label">Payments Methods</InputLabel>
                                <Select
                                    id="paymentId"
                                    name="paymentId"
                                    labelId="paymentMethods-label"
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
                            <TextField
                                label="Merchant ID"
                                name="merchantId"
                                fullWidth
                                value={formik.values['merchantId'] || ''}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched['merchantId'] && Boolean(formik.errors['merchantId'])}
                                helperText={formik.touched['merchantId'] && formik.errors['merchantId']}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Currency Code"
                                name="currencyCode"
                                fullWidth
                                value={formik.values['currencyCode'] || ''}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched['currencyCode'] && Boolean(formik.errors['currencyCode'])}
                                helperText={formik.touched['currencyCode'] && formik.errors['currencyCode']}
                            />
                        </Grid>

        

                        {visibleFields.map((field, index) => (
                            <Grid item xs={6} key={index}>
                                <TextField
                                    name={field.field}
                                    label={field.label}
                                    fullWidth
                                    value={formik.values[field.field] || ''}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched[field.field] && Boolean(formik.errors[field.field])}
                                    helperText={formik.touched[field.field] && formik.errors[field.field]}
                                />
                            </Grid>
                        ))}
                                        {/* ShowOnWeb / ShowOnIOS / ShowOnAndroid Checkboxes */}
                                        <Grid item xs={12}>
                            <Box display="flex" gap={4}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={formik.values.ShowOnWeb}
                                            name="ShowOnWeb"
                                            onChange={e => formik.setFieldValue("ShowOnWeb", e.target.checked)}
                                            color="primary"
                                        />
                                    }
                                    label="Show on Web"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={formik.values.ShowOnIOS}
                                            name="ShowOnIOS"
                                            onChange={e => formik.setFieldValue("ShowOnIOS", e.target.checked)}
                                            color="primary"
                                        />
                                    }
                                    label="Show on iOS"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={formik.values.ShowOnAndroid}
                                            name="ShowOnAndroid"
                                            onChange={e => formik.setFieldValue("ShowOnAndroid", e.target.checked)}
                                            color="primary"
                                        />
                                    }
                                    label="Show on Android"
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
                <CardActions style={{ justifyContent: 'flex-end' }}>
                    <Button onClick={handleSubmit} size="small" variant="contained">
                        Save
                    </Button>
                </CardActions>
            </form>
        </Card>
    );
};

export default AddPaymentMethod;
