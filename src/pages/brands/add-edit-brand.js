import React, { useState, useEffect, useRef } from 'react';
import { Formik, Form, Field } from 'formik';
import {
    TextField,
    MenuItem,
    Button,
    Grid,
    Typography,
    Box,
    Tabs,
    Tab,
    AppBar,
    Card,
    FormControlLabel,
    Switch,
    Paper
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { CloudUploadOutlined } from '@ant-design/icons';
import { ServiceFactory } from 'services/index';
import brandServices from 'services/brandServices';
import fileService from 'services/fileService';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import LinearProgress from '@mui/material/LinearProgress';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import theme
import { QRCodeCanvas } from 'qrcode.react';
import { useFetchBranchList } from '../../features/BranchesTable/hooks/useFetchBranchesList';
import { useAuth } from '../../providers/authProvider';
import { TimeZonesList,formatOffset } from '../../helper/constants';
import pluginService from "services/pluginService";


function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

const FormComponent = () => {
    const { user, userRole, isAuthenticated } = useAuth();

    const initialValues = {
        brandName: '',
        brandNameNative: '',
        brandTimeZone: 1,
        company: '',
        contactEmail: '',
        currency: '',
        currencyDecimal: 0,
        emailAddress: '',
        facebookURL: '',
        tiktokURL: '',
        initialCreditBalance: 0,
        initialCreditBalanceExpiry: null,
        initialCustomerBalance: 0,
        instagramURL: '',
        
        phoneNumber: '',
        points: 0,
        reportInterval: 1,
        secondaryLanguage: '',
        showFreeDrinkFeature: false,
        enableGrubTech: false,
        enableFoodics: false,
        twitterURL: '',
        useQRCode: false,
        walletSubtitle: '',
        walletSubtitleNative: '',
        menuView: false,
        menuOrdering: false,
        primaryThemeColor: '#7ac590',
        playStoreUrl: '',
        appleStoreUrl: '',
        privacyPolicy: '',
        termsAndConditions: '',
        titleNameForDriveThru: '',
        titleNameForPickUp: '',
        titleNameForDriveThruNative: '',
        titleNameForPickUpNative: '',
        showMacros:false
    };
    const timeZonesSorted = [...TimeZonesList].sort((a, b) => a.value - b.value || a.name.localeCompare(b.name));

    const [initialFormValues, setInitialFormValues] = useState(initialValues); // State to store form values
    const [loading, setloading] = useState(false);
    const navigate = useNavigate();
    const brandsService = ServiceFactory.get('brands');
    const userService = ServiceFactory.get('users');
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const { id } = useParams();
    const { branchesList, fetchBranchesList, totalRowCount } = useFetchBranchList({ reload: false });
    const filteredBranchList = branchesList.filter((e) => e.brandId == id && !e?.ishide);
    const validationSchemas = [
        // Tab 0: Basic Info
        Yup.object({
            brandName: Yup.string().required('Brand Name is required'),
            company: Yup.string().required('Company is required'),
            currency: Yup.string().required('Currency is required'),
            currencyDecimal: Yup.number(),
            // brandNameNative: Yup.string().required('Brand Name (Native) is required'),
            // secondaryLanguage: Yup.string().required('Secondary Language is required'),
            // phoneNumber: Yup.string().required('Phone Number is required'),
            // emailAddress: Yup.string().email('Invalid email format').required('Email Address is required'),

            // reportInterval: Yup.string().required('Report Interval is required'),
            // brandTimeZone: Yup.string().required('Brand Time Zone is required')
        }),
        // Tab 1: Rewards
        Yup.object({}),
        // Tab 2: Settings
        Yup.object({}),
        // Tab 3: Social Links
        Yup.object({
            // contactEmail: Yup.string().email('Invalid email format'),
            // facebookURL: Yup.string().url('Invalid URL'),
            // instagramURL: Yup.string().url('Invalid URL'),
            // twitterURL: Yup.string().url('Invalid URL')
        }),
        // Tab 4: Logo
        Yup.object({})
    ];
    const [tabValue, setTabValue] = useState(0);
    const [dateValue, setDateValue] = useState(new Date());
    const [companies, setCompanies] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [currencies, setCurrencies] = useState([]);
    const [IsMenuViewPaid, setIsMenuViewPaid] = useState(false);
    const [IsOrderingPaid, setIsOrderingPaid] = useState(false);
    const [pluginOrders, setPluginOrders] = useState([]);


    const [selectedBrand, setSelectedBrand] = useState('');
    const [brand, setBrand] = useState();
    const [p1, setP1] = useState(null);
    const qrRef = useRef(null);
    const branchRefs = useRef({});
    useEffect(() => {
        getCompanies();
        getLanguages();
        getCurrencies();
        getPluginsOrders();
    }, []);
    useEffect(() => {
        if (id) {
            getAllBrands();
        }
    }, [id, currencies]);

    const downloadQRCode = (ref, filename = 'qr-code.png') => {
        const canvas = ref; // no .current here
        if (canvas) {
            const url = canvas.toDataURL('image/png');
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
        }
    };
    
    const mainSiteURL = selectedBrand
        ? `https://menu.avorewards.com/menu/${selectedBrand?.name.replace(/\s/g, '')}/${selectedBrand.id}`
        : '';

    const changeTerms = (html) => {
        setInitialFormValues((prev) => ({
            ...prev,
            termsAndConditions: html
        }));
    };

    const changePrivacy = (html) => {
        setInitialFormValues((prev) => ({
            ...prev,
            privacyPolicy: html
        }));
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleBackChange = (event, newValue) => {
        setTabValue((prev) => prev - 1);
    };
    
    const handleNext = async (validateForm, setTouched, isValid) => {
        const errors = await validateForm();
        if (Object.keys(errors).length === 0) {
            setTabValue((prev) => prev + 1); // Move to the next tab if no validation errors
        } else {
            setTouched(errors); // Mark all fields as touched to display validation errors
        }
    };

    const getCompanies = async () => {
        await userService
            .GetAllCompanies()
            .then((res) => {
                setCompanies(res?.data?.result);
            })
            .catch((err) => {
                console.log(err?.data);
            });
    };

const getPluginsOrders = async () => {
    try {
        const orders = await pluginService.getPluginOrders(id);

        // Safely normalize to an array
        const items = Array.isArray(orders?.items) ? orders.items : [];

        console.log('Plugin Orders:', items);
        setPluginOrders(items);

        // Check if TABLE ORDERING is paid (at least one match)
        const isTableOrderingPaid = items.some(
            (item) =>
                item?.name === 'TABLE ORDERING' &&
                item?.isPaid === true
        );
        setIsOrderingPaid(isTableOrderingPaid);

        // Check if MENU VIEW is paid (at least one match)
        const isMenuViewPaid = items.some(
            (item) =>
                item?.name === 'MENU VIEW' &&
                item?.isPaid === true
        );
        setIsMenuViewPaid(isMenuViewPaid);

    } catch (error) {
        console.error('Failed to fetch plugin orders:', error);

        // On error, safest default is: they are NOT paid/locked
        setPluginOrders([]);
        setIsOrderingPaid(false);
        setIsMenuViewPaid(false);
    }
};

    const getLanguages = async () => {
        await brandsService
            .getLanguages()
            .then((res) => {
                setLanguages(res?.data?.result);
            })
            .catch((err) => {
                console.log(err?.data);
            });
    };
    const getCurrencies = async () => {
        await brandsService
            .getCurrencies()
            .then((res) => {
                setCurrencies(res?.data?.result);
            })
            .catch((err) => {
                console.log(err?.data);
            });
    };
    const getAllBrands = async () => {
        setloading(true);

        try {
            const response = await brandServices.getAllBrands();
            const brands = response.data.result;
            const selectedBrand = brands.find((e) => e.id === +id); // Replace `id` with the actual route param or identifier
            // Populate the form fields with the selected brand data
            setSelectedBrand(selectedBrand);
            if (selectedBrand) {
                setBrand(selectedBrand);
                setloading(false);

                // Update the form values
                setInitialFormValues({
                    brandName: selectedBrand?.name || '',
                    brandNameNative: selectedBrand?.nativeName || '',
                    company: selectedBrand.companyId?.toString() || '',
                    secondaryLanguage: selectedBrand?.applicationLanguage || '',
                    phoneNumber: selectedBrand?.phoneNumber || '',
                    emailAddress: selectedBrand?.emailAddress || '',
                    currency: currencies.find((e) => e.name === selectedBrand?.currency)?.id || '',
                    currencyDecimal: selectedBrand?.currencyDecimals || 0,
                    reportInterval: selectedBrand?.reportInterval || 1,
                    brandTimeZone: selectedBrand?.brandTimeZone || 1,
                    walletSubtitle: selectedBrand?.walletSubTitle || '',
                    walletSubtitleNative: selectedBrand?.walletSubTitleNative || '',
                    points: selectedBrand?.pointsForWalletReplenishment || 0,
                    initialCustomerBalance: selectedBrand?.initialCustomerBalance || 0,
                    initialCreditBalance: selectedBrand?.freeItems || 0,
                    initialCreditBalanceExpiry: null,
                    contactEmail: selectedBrand?.contactUsEmailAddress || '',
                    facebookURL: selectedBrand?.socialFacebookUrl || '',
                    tiktokURL: selectedBrand?.socialTikTokUrl || '',
                    instagramURL: selectedBrand?.socialInstaUrl || '',
                    twitterURL: selectedBrand?.socialTwitterUrl || '',
                    playStoreUrl: selectedBrand?.playStoreUrl || '',
                    appleStoreUrl: selectedBrand?.appleStoreUrl || '',
                    useQRCode: selectedBrand?.showQrCode || false,
                    showFreeDrinkFeature: selectedBrand.showFreeDrinkFeature || false,
                    enableGrubTech: selectedBrand.enableGrubTech || false,
                    enableFoodics: selectedBrand.enableFoodics || false,
                    menuView: selectedBrand?.menuView || false,
                    menuOrdering: selectedBrand?.menuOrdering || false,
                    primaryThemeColor: selectedBrand?.primaryThemeColor,
                    privacyPolicy: selectedBrand?.privacyPolicy,
                    termsAndConditions: selectedBrand?.termsAndConditions,
                    titleNameForDriveThru: selectedBrand?.titleNameForDriveThru || '',
                    titleNameForPickUp: selectedBrand?.titleNameForPickUp || '',
                    titleNameForDriveThruNative: selectedBrand?.titleNameForDriveThruNative || '',
                    titleNameForPickUpNative: selectedBrand?.titleNameForPickUpNative || '',
                    showMacros: selectedBrand?.showMacros || false
                });
            } else {
                enqueueSnackbar('Brand not found.', { variant: 'error' });
            }
        } catch (error) {
            console.error(error);
        }
    };
    // titleNameForDriveThru
    // titleNameForPickUp
    // titleNameForDriveThruNative
    // titleNameForPickUpNative

    const createNewBrand = async (value) => {
        // Check if p1 (logo file) is provided
        if (!p1) {
            enqueueSnackbar('Please upload a brand logo before submitting.', {
                variant: 'error'
            });
            return; // Exit the function if logo is missing
        }

        const data = {}; // Initialize data if needed
        setloading(true);
        const payload = {
            ...data,
            brandManager: {
                userName: '',
                name: '',
                surname: '',
                password: '',
                address: '',
                emailAddress: '',
                phoneNumber: ''
            },

            aboutApplication: '',
            aboutApplicationNative: '',
            applicationLanguage: value?.secondaryLanguage,
            brandTimeZone: value?.brandTimeZone,
            companyId: value.company,
            contactUsEmailAddress: value?.contactEmail,
            currency: value.currency,
            currencyDecimals: value.currencyDecimal,
            currencyId: value.currency,
            emailAddress: '',
            faq: '',
            faqNative: '',
            freeItems: 0,
            initialCustomerBalance: value.initialCustomerBalance,
            logoUrl: '',
            minimumTopUpValue: 0,
            name: value.brandName,
            nativeName: value?.brandNameNative,
            // notificationBalance: value?.notificationBalance,
            phoneNumber: value?.phoneNumber,
            pointsForWalletReplenishment: value.points,
            privacyPolicy: '',
            privacyPolicyNative: '',
            reportInterval: value?.reportInterval,
            showFreeDrinkFeature: value?.showFreeDrinkFeature,
            enableGrubTech: value?.enableGrubTech,
            enableFoodics: value?.enableFoodics,
            socialFacebookUrl: value?.facebookURL,
            socialTikTokUrl: value?.tiktokURL,
            socialInstaUrl: value?.instagramURL,
            socialTwitterUrl: value?.twitterURL,
            termsAndConditions: value?.termsAndConditions,
            termsAndConditionsNative: '',
            useTopUpValues: true,
            walletSubTitle: value?.walletSubtitle,
            walletSubTitleNative: value?.walletSubtitleNative,
            menuView: value?.menuView,
            menuOrdering: value?.menuOrdering,
            primaryThemeColor: value?.primaryThemeColor,
            playStoreUrl: value?.playStoreUrl || '',
            appleStoreUrl: value?.appleStoreUrl || '',
            titleNameForDriveThru: value?.titleNameForDriveThru || '',
            titleNameForPickUp: value?.titleNameForPickUp || '',
            titleNameForDriveThruNative: value?.titleNameForDriveThruNative || '',
            titleNameForPickUpNative: value?.titleNameForPickUpNative || '',
            showMacros: value?.showMacros || false,
            showQrCode: value?.useQRCode ||false
        };

        try {
            // Upload logo
            const logoResponse = await fileService.UploadBrandLogoImage(p1);
            payload.logoUrl = logoResponse.data?.result;

            // Create brand
            const brandResponse = await brandServices.createBrand(payload);
            setloading(false);
            enqueueSnackbar('Brand Created Successfully', {
                variant: 'success'
            });
            navigate('/brands');
        } catch (error) {
            console.error(error.response?.data);
            if (error.response?.data) {
                enqueueSnackbar(
                    error?.response?.data?.error?.validationErrors?.[0]?.message ||
                        error.response?.data?.error?.message ||
                        'An error occurred while saving the Brand.',
                    {
                        variant: 'error'
                    }
                );
            }
        }
    };
    const updateBrand = async (value) => {
        // Check if logo file is provided
        setloading(true);
        const payload = {
            ...brand,
            ...value,
            brandManager: [
                {
                    ...value.brandManager
                }
            ],
            applicationLanguage: value?.secondaryLanguage,
            brandTimeZone: value?.brandTimeZone,
            companyId: value.company,
            contactUsEmailAddress: value?.contactEmail,
            // currency: value.currency,
            currencyDecimals: value.currencyDecimal,
            currencyId: value.currency,
            initialCustomerBalance: value.initialCustomerBalance,
            pointsForWalletReplenishment: value.points,
            showFreeDrinkFeature: value?.showFreeDrinkFeature,
            enableFoodics: value?.enableFoodics,
            enableGrubTech: value?.enableGrubTech,
            socialFacebookUrl: value?.facebookURL,
            socialTikTokUrl: value?.tiktokURL,
            socialInstaUrl: value?.instagramURL,
            socialTwitterUrl: value?.twitterURL,
            walletSubTitle: value?.walletSubtitle,
            walletSubTitleNative: value?.walletSubtitleNative,
            menuView: value?.menuView,
            menuOrdering: value?.menuOrdering,
            primaryThemeColor: value?.primaryThemeColor,
            playStoreUrl: value?.playStoreUrl,
            appleStoreUrl: value?.appleStoreUrl,
            titleNameForDriveThru: value?.titleNameForDriveThru || '',
            titleNameForPickUp: value?.titleNameForPickUp || '',
            titleNameForDriveThruNative: value?.titleNameForDriveThruNative || '',
            titleNameForPickUpNative: value?.titleNameForPickUpNative || '',
            showMacros: value?.showMacros || false,
            showQrCode: value?.useQRCode ||false
        };

        try {
            // Upload logo
            if (p1) {
                const logoResponse = await fileService.UploadBrandLogoImage(p1);
                payload.logoUrl = logoResponse.data?.result;
            }
            // Update brand
            const brandResponse = await brandServices.UpdateBrand(payload);
            setloading(false);

            enqueueSnackbar('Brand Updated Successfully', {
                variant: 'success'
            });
            navigate('/brands'); // Redirect to the brands page after update
        } catch (error) {
            enqueueSnackbar(error?.response?.data?.error?.validationErrors?.[0]?.message || 'An error occurred while saving the Brand.', {
                variant: 'error'
            });
            // console.error(error.response?.data);
            // enqueueSnackbar('Failed to update the brand. Please try again.', {
            //     variant: 'error'
            // });
        } finally {
        }
    };

    const handleCopy = (text, e) => {
        navigator.clipboard.writeText(text);
      
        const button = e.currentTarget;
        const originalText = button.innerText;
        button.innerText = 'Copied!';
      
        setTimeout(() => {
          button.innerText = originalText;
        }, 1500);
      };
      
    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Typography variant="h4">{id ? 'Edit  Brand' : 'Create Brand'}</Typography>
            </Grid>
            <Grid item xs={12}>
                <Card>
                    {loading && (
                        <Box sx={{ width: '100%' }}>
                            <LinearProgress />
                        </Box>
                    )}
                    <Formik
                        initialValues={initialFormValues}
                        validationSchema={validationSchemas[tabValue]}
                        enableReinitialize={true}
                        onSubmit={(values) => {
                            if (tabValue < validationSchemas.length - 1) {
                                setTabValue((prev) => prev + 1); // Move to the next tab on valid submit
                            } else {
                                if (!id) {
                                    createNewBrand(values);
                                } else {
                                    updateBrand(values);
                                }
                            }
                        }}
                    >
                        {({ values, handleChange, errors, touched, validateForm, isValid, setFieldValue, setTouched }) => (
                            <Form>
                                <Box sx={{ flexGrow: 1 }}>
                                    <Tabs value={tabValue} onChange={handleTabChange} aria-label="basic tabs example">
                                        <Tab label="Basic Info" disabled={!id && tabValue !== 0} />
                                        <Tab label="Rewards" disabled={!id && tabValue !== 1} />
                                        <Tab label="Settings" disabled={!id && tabValue !== 2} />
                                        <Tab label="Social Links" disabled={!id && tabValue !== 3} />
                                        <Tab label="Logo" disabled={!id && tabValue !== 4} />
                                    </Tabs>
                                    {/* BASIC INFO START */}
                                    <TabPanel value={tabValue} index={0}>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12} container justifyContent="flex-end">
                                                <Button
                                                    type="button"
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => handleNext(validateForm, setTouched, isValid)}
                                                    disabled={!isValid}
                                                    sx={{ minWidth: '120px' }}
                                                >
                                                    Next
                                                </Button>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Field
                                                    as={TextField}
                                                    name="brandName"
                                                    label="Brand Name*"
                                                    fullWidth
                                                    variant="outlined"
                                                    onChange={handleChange}
                                                    error={touched.brandName && Boolean(errors.brandName)}
                                                    helperText={touched.brandName && errors.brandName}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Field
                                                    as={TextField}
                                                    name="brandNameNative"
                                                    label="Brand Name (Native)"
                                                    fullWidth
                                                    variant="outlined"
                                                    onChange={handleChange}
                                                    error={touched.brandNameNative && Boolean(errors.brandNameNative)}
                                                    helperText={touched.brandNameNative && errors.brandNameNative}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Field
                                                    as={TextField}
                                                    name="company"
                                                    label="Company*"
                                                    select
                                                    fullWidth
                                                    variant="outlined"
                                                    onChange={handleChange}
                                                    error={touched.company && Boolean(errors.company)}
                                                    helperText={touched.company && errors.company}
                                                >
                                                    {companies.map((e) => (
                                                        <MenuItem key={e.id} value={e.id}>
                                                            {e.name}
                                                        </MenuItem>
                                                    ))}
                                                </Field>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Field
                                                    as={TextField}
                                                    name="secondaryLanguage"
                                                    label="Secondary Language"
                                                    select
                                                    fullWidth
                                                    variant="outlined"
                                                    onChange={handleChange}
                                                    error={touched.secondaryLanguage && Boolean(errors.secondaryLanguage)}
                                                    helperText={touched.secondaryLanguage && errors.secondaryLanguage}
                                                >
                                                    {languages.map((e) => (
                                                        <MenuItem key={e.name} value={e.name}>
                                                            {e.displayName}
                                                        </MenuItem>
                                                    ))}
                                                </Field>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Field
                                                    as={TextField}
                                                    name="phoneNumber"
                                                    label="Phone Number"
                                                    fullWidth
                                                    variant="outlined"
                                                    onChange={handleChange}
                                                    error={touched.phoneNumber && Boolean(errors.phoneNumber)}
                                                    helperText={touched.phoneNumber && errors.phoneNumber}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Field
                                                    as={TextField}
                                                    name="emailAddress"
                                                    label="Email Address"
                                                    fullWidth
                                                    variant="outlined"
                                                    onChange={handleChange}
                                                    error={touched.emailAddress && Boolean(errors.emailAddress)}
                                                    helperText={touched.emailAddress && errors.emailAddress}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Field
                                                    as={TextField}
                                                    name="currency"
                                                    label="Currency*"
                                                    select
                                                    fullWidth
                                                    variant="outlined"
                                                    onChange={handleChange}
                                                    error={touched.currency && Boolean(errors.currency)}
                                                    helperText={touched.currency && errors.currency}
                                                >
                                                    {currencies.map((e) => (
                                                        <MenuItem key={e.id} value={e.id}>
                                                            {e.name}
                                                        </MenuItem>
                                                    ))}
                                                </Field>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Field
                                                    as={TextField}
                                                    name="currencyDecimal"
                                                    label="Currency Decimal"
                                                    fullWidth
                                                    type="number"
                                                    variant="outlined"
                                                    onChange={handleChange}
                                                    error={touched.currencyDecimal && Boolean(errors.currencyDecimal)}
                                                    helperText={touched.currencyDecimal && errors.currencyDecimal}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Field
                                                    as={TextField}
                                                    name="reportInterval"
                                                    label="Report Interval"
                                                    select
                                                    fullWidth
                                                    variant="outlined"
                                                    onChange={handleChange}
                                                    error={touched.reportInterval && Boolean(errors.reportInterval)}
                                                    helperText={touched.reportInterval && errors.reportInterval}
                                                >
                                                    <MenuItem value="1">Weekly</MenuItem>
                                                    <MenuItem value="2">Monthly</MenuItem>
                                                </Field>
                                            </Grid>
                                            {/* TimeZone */}
                                            <Grid item xs={12} sm={6}>
                                            <Field
                                                as={TextField}
                                                name="brandTimeZone"
                                                label="Brand Time Zone"
                                                select
                                                fullWidth
                                                variant="outlined"
                                                // If you're already using Formik’s handleChange/touched/errors, this is enough
                                            >
                                                {timeZonesSorted.map(tz => (
                                                <MenuItem key={tz.code} value={tz.value}>
                                                    {formatOffset(tz.value)} — {tz.name} ({tz.code})
                                                </MenuItem>
                                                ))}
                                            </Field>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Field
                                                    as={TextField}
                                                    name="titleNameForDriveThru"
                                                    label="Drive-Thru Title"
                                                    fullWidth
                                                    variant="outlined"
                                                    onChange={handleChange}
                                                    error={touched.titleNameForDriveThru && Boolean(errors.titleNameForDriveThru)}
                                                    helperText={touched.titleNameForDriveThru && errors.titleNameForDriveThru}
                                                />
                                            </Grid>

                                            <Grid item xs={12} sm={6}>
                                                <Field
                                                    as={TextField}
                                                    name="titleNameForPickUp"
                                                    label="Pickup Title"
                                                    fullWidth
                                                    variant="outlined"
                                                    onChange={handleChange}
                                                    error={touched.titleNameForPickUp && Boolean(errors.titleNameForPickUp)}
                                                    helperText={touched.titleNameForPickUp && errors.titleNameForPickUp}
                                                />
                                            </Grid>

                                            <Grid item xs={12} sm={6}>
                                                <Field
                                                    as={TextField}
                                                    name="titleNameForDriveThruNative"
                                                    label="Drive-Thru Title (Native)"
                                                    fullWidth
                                                    variant="outlined"
                                                    onChange={handleChange}
                                                    error={
                                                        touched.titleNameForDriveThruNative && Boolean(errors.titleNameForDriveThruNative)
                                                    }
                                                    helperText={touched.titleNameForDriveThruNative && errors.titleNameForDriveThruNative}
                                                />
                                            </Grid>

                                            <Grid item xs={12} sm={6}>
                                                <Field
                                                    as={TextField}
                                                    name="titleNameForPickUpNative"
                                                    label="Pickup Title (Native)"
                                                    fullWidth
                                                    variant="outlined"
                                                    onChange={handleChange}
                                                    error={touched.titleNameForPickUpNative && Boolean(errors.titleNameForPickUpNative)}
                                                    helperText={touched.titleNameForPickUpNative && errors.titleNameForPickUpNative}
                                                />
                                            </Grid>
                                        </Grid>
                                    </TabPanel>
                                    {/* BASIC INFO END */}
                                    {/* REWARD START */}
                                    <TabPanel value={tabValue} index={1}>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12} container justifyContent="space-between" alignItems="center" spacing={2}>
                                                <Grid item>
                                                    <Button
                                                        type="button"
                                                        variant="outlined"
                                                        color="secondary"
                                                        onClick={() => handleBackChange(validateForm, setTouched, isValid)}
                                                        disabled={tabValue === 0} // Disable Back button on the first tab
                                                        sx={{ minWidth: '120px' }} // Consistent button size
                                                    >
                                                        Back
                                                    </Button>
                                                </Grid>
                                                <Grid item>
                                                    <Button
                                                        type="button"
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={() => handleNext(validateForm, setTouched, isValid)}
                                                        disabled={!isValid && tabValue < validationSchemas.length - 1} // Allow submission on the last tab
                                                        sx={{ minWidth: '120px' }} // Consistent button size
                                                    >
                                                        {tabValue === validationSchemas.length - 1 ? 'Submit' : 'Next'}{' '}
                                                        {/* Dynamically change label */}
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Field
                                                    as={TextField}
                                                    name="walletSubtitle"
                                                    label="Wallet Subtitle"
                                                    fullWidth
                                                    variant="outlined"
                                                    onChange={handleChange}
                                                    error={touched.walletSubtitle && Boolean(errors.walletSubtitle)}
                                                    helperText={touched.walletSubtitle && errors.walletSubtitle}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Field
                                                    as={TextField}
                                                    name="walletSubtitleNative"
                                                    label="Wallet Subtitle (Native)"
                                                    fullWidth
                                                    variant="outlined"
                                                    onChange={handleChange}
                                                    error={touched.walletSubtitleNative && Boolean(errors.walletSubtitleNative)}
                                                    helperText={touched.walletSubtitleNative && errors.walletSubtitleNative}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Field
                                                    as={TextField}
                                                    name="points"
                                                    label="Points"
                                                    fullWidth
                                                    variant="outlined"
                                                    onChange={handleChange}
                                                    error={touched.points && Boolean(errors.points)}
                                                    helperText={touched.points && errors.points}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Field
                                                    as={TextField}
                                                    name="initialCustomerBalance"
                                                    label="Initial Customer Balance"
                                                    fullWidth
                                                    variant="outlined"
                                                    onChange={handleChange}
                                                    error={touched.initialCustomerBalance && Boolean(errors.initialCustomerBalance)}
                                                    helperText={touched.initialCustomerBalance && errors.initialCustomerBalance}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Field
                                                    as={TextField}
                                                    name="initialCreditBalance"
                                                    label="Initial Credit Balance"
                                                    fullWidth
                                                    variant="outlined"
                                                    onChange={handleChange}
                                                    error={touched.initialCreditBalance && Boolean(errors.initialCreditBalance)}
                                                    helperText={touched.initialCreditBalance && errors.initialCreditBalance}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <DatePicker
                                                        label="Initial Credit Balance Expiry"
                                                        value={dateValue}
                                                        onChange={(newValue) => {
                                                            setDateValue(newValue);
                                                            setFieldValue('initialCreditBalanceExpiry', newValue);
                                                        }}
                                                        renderInput={(params) => <TextField fullWidth {...params} />}
                                                    />
                                                </LocalizationProvider>
                                            </Grid>
                                        </Grid>
                                    </TabPanel>
                                    {/* REWARD END */}
                                    {/* SETTINGS  START */}
                                    <TabPanel value={tabValue} index={2}>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12} container justifyContent="space-between" alignItems="center" spacing={2}>
                                                <Grid item>
                                                    <Button
                                                        type="button"
                                                        variant="outlined"
                                                        color="secondary"
                                                        onClick={() => handleBackChange(validateForm, setTouched, isValid)}
                                                        disabled={tabValue === 0} // Disable Back button on the first tab
                                                        sx={{ minWidth: '120px' }} // Consistent button size
                                                    >
                                                        Back
                                                    </Button>
                                                </Grid>
                                                <Grid item>
                                                    <Button
                                                        type="button"
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={() => handleNext(validateForm, setTouched, isValid)}
                                                        disabled={!isValid && tabValue < validationSchemas.length - 1} // Allow submission on the last tab
                                                        sx={{ minWidth: '120px' }} // Consistent button size
                                                    >
                                                        {tabValue === validationSchemas.length - 1 ? 'Submit' : 'Next'}{' '}
                                                        {/* Dynamically change label */}
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <FormControlLabel
                                                    control={
                                                        <Field name="useQRCode">
                                                            {({ field }) => <Switch {...field} checked={field.value} />}
                                                        </Field>
                                                    }
                                                    label="Use QR Code"
                                                />

                                                <FormControlLabel
                                                    control={
                                                        <Field name="showMacros">
                                                            {({ field }) => <Switch {...field} checked={field.value} />}
                                                        </Field>
                                                    }
                                                    label="Show Macros"
                                                />

                                                <FormControlLabel
                                                    control={
                                                        <Field name="showFreeDrinkFeature">
                                                            {({ field }) => <Switch {...field} checked={field.value} />}
                                                        </Field>
                                                    }
                                                    label="Free Drinks"
                                                />
                                                <FormControlLabel
                                                    control={
                                                        <Field name="enableGrubTech">
                                                            {({ field }) => <Switch {...field} checked={field.value} />}
                                                        </Field>
                                                    }
                                                    label="Enable Grub Tech"
                                                />
                                                <FormControlLabel
                                                    control={
                                                        <Field name="enableFoodics">
                                                            {({ field }) => <Switch {...field} checked={field.value} />}
                                                        </Field>
                                                    }
                                                    label="Enable Foodics"
                                                />

                                                <FormControlLabel
                                                    control={
                                                        <Field name="menuView">
                                                            {({ field }) => <Switch {...field}
                                                            checked={field.value} />}
                                                        </Field>
                                                    }
                                                    label="Menu Viewing"
                                                />

                                                <FormControlLabel
                                                    control={
                                                        <Field name="menuOrdering">
                                                            {({ field }) => <Switch {...field}
                                                            checked={field.value} />}
                                                        </Field>
                                                    }
                                                    label="Table Ordering"
                                                />

                                                <>
                                                    {values.menuView && (
                                                        <Grid container spacing={4} mt={2}>
                                                            {/* Brand Section */}
                                                            <Grid item xs={12}>
                                                                <Paper
                                                                    elevation={3}
                                                                    style={{
                                                                        padding: '24px',
                                                                        borderRadius: '12px',
                                                                        backgroundColor: '#ffffff'
                                                                    }}
                                                                >
                                                                    <Typography variant="h6" gutterBottom>
                                                                        Main Brand QR Code
                                                                    </Typography>

                                                                    <Grid container spacing={2} alignItems="center">
                                                                        {/* Color Picker */}
                                                                        <Grid item xs={12} sm={6} md={3}>
                                                                            <TextField
                                                                                label="Menu Highlight Color"
                                                                                name="primaryThemeColor"
                                                                                type="color"
                                                                                value={values.primaryThemeColor}
                                                                                onChange={handleChange}
                                                                                fullWidth
                                                                                InputLabelProps={{ shrink: true }}
                                                                            />
                                                                        </Grid>

                                                                        {/* Main Site URL with Copy */}
                                                                        <Grid item xs={12} sm={9}>
                                                                            <Paper
                                                                                elevation={0}
                                                                                style={{
                                                                                    display: 'flex',
                                                                                    alignItems: 'center',
                                                                                    justifyContent: 'space-between',
                                                                                    padding: '10px 12px',
                                                                                    borderRadius: '6px',
                                                                                    background: '#ffffff',
                                                                                    border: '1px solid #e5e7eb',
                                                                                    overflow: 'hidden'
                                                                                }}
                                                                            >
                                                                                <span
                                                                                    style={{
                                                                                        fontSize: '0.875rem',
                                                                                        flex: 1,
                                                                                        overflow: 'hidden',
                                                                                        whiteSpace: 'nowrap',
                                                                                        textOverflow: 'ellipsis',
                                                                                        textAlign: 'left'
                                                                                    }}
                                                                                    title={mainSiteURL}
                                                                                >
                                                                                    {mainSiteURL}
                                                                                </span>
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={(e) => handleCopy(mainSiteURL, e)}
                                                                                    style={{
                                                                                        marginLeft: '12px',
                                                                                        padding: '6px 12px',
                                                                                        backgroundColor: '#2563eb',
                                                                                        color: '#fff',
                                                                                        border: 'none',
                                                                                        borderRadius: '4px',
                                                                                        cursor: 'pointer'
                                                                                    }}
                                                                                >
                                                                                    Copy
                                                                                </button>
                                                                            </Paper>
                                                                        </Grid>

                                                                        {/* QR Code */}
                                                                        <Grid
                                                                            item
                                                                            xs={12}
                                                                            style={{ textAlign: 'center', marginTop: '20px' }}
                                                                        >
                                                                            <QRCodeCanvas ref={qrRef} value={mainSiteURL} size={256} />
                                                                        </Grid>

                                                                        {/* Download Button */}
                                                                        <Grid
                                                                            item
                                                                            xs={12}
                                                                            style={{ textAlign: 'center', marginTop: '1rem' }}
                                                                        >
                                                                            <button
                                                                                onClick={() =>
                                                                                    downloadQRCode(qrRef.current, 'brand-qr-code.png')
                                                                                }
                                                                                style={{
                                                                                    padding: '10px 20px',
                                                                                    backgroundColor: '#2563eb',
                                                                                    color: '#ffffff',
                                                                                    borderRadius: '8px',
                                                                                    border: 'none',
                                                                                    cursor: 'pointer'
                                                                                }}
                                                                                type="button"
                                                                            >
                                                                                Download Brand QR Code
                                                                            </button>
                                                                        </Grid>
                                                                    </Grid>
                                                                </Paper>
                                                            </Grid>

                                                            {/* Branch Section */}
                                                            <Grid item xs={12}>
                                                                <Typography variant="h6" gutterBottom>
                                                                    Branches QR Codes
                                                                </Typography>
                                                                <Grid container spacing={4}>
                                                                    {filteredBranchList.map((branch) => {
                                                                        const branchSiteURL = `https://menu.avorewards.com/menu/${selectedBrand?.name.replace(
                                                                            /\s/g,
                                                                            ''
                                                                        )}/${selectedBrand?.id}?branch=${branch.name.replace(
                                                                            /\s/g,
                                                                            ''
                                                                        )}&branchId=${branch.id}`;

                                                                        return (
                                                                            <Grid item xs={12} sm={6} md={4} key={branch.id}>
                                                                                <Paper
                                                                                    elevation={2}
                                                                                    style={{
                                                                                        padding: '20px',
                                                                                        borderRadius: '10px',
                                                                                        textAlign: 'center',
                                                                                        backgroundColor: '#ffffff'
                                                                                    }}
                                                                                >
                                                                                    <Typography variant="subtitle1" gutterBottom>
                                                                                        {branch.name}
                                                                                    </Typography>

                                                                                    {/* URL Display with Copy Button */}
                                                                                    <Typography variant="subtitle2" gutterBottom>
                                                                                        Branch Site URL
                                                                                    </Typography>
                                                                                    <Paper
                                                                                        elevation={0}
                                                                                        style={{
                                                                                            display: 'flex',
                                                                                            alignItems: 'center',
                                                                                            justifyContent: 'space-between',
                                                                                            padding: '8px 10px',
                                                                                            borderRadius: '6px',
                                                                                            background: '#ffffff',
                                                                                            border: '1px solid #e5e7eb', // Light gray border
                                                                                            marginBottom: '12px'
                                                                                        }}
                                                                                    >
                                                                                        <span
                                                                                            style={{
                                                                                                fontSize: '0.875rem',
                                                                                                flex: 1,
                                                                                                overflow: 'hidden',
                                                                                                whiteSpace: 'nowrap',
                                                                                                textOverflow: 'ellipsis',
                                                                                                textAlign: 'left'
                                                                                            }}
                                                                                            title={branchSiteURL} // Tooltip on hover
                                                                                        >
                                                                                            {branchSiteURL}
                                                                                        </span>
                                                                                        <button
                                                                                            onClick={(e) => handleCopy(branchSiteURL, e)}
                                                                                            style={{
                                                                                                marginLeft: '12px',
                                                                                                padding: '6px 10px',
                                                                                                backgroundColor: '#2563eb',
                                                                                                color: '#fff',
                                                                                                border: 'none',
                                                                                                borderRadius: '4px',
                                                                                                cursor: 'pointer'
                                                                                            }}
                                                                                            type="button"
                                                                                        >
                                                                                            Copy
                                                                                        </button>
                                                                                    </Paper>

                                                                                    {/* QR Code */}
                                                                                    <QRCodeCanvas
                                                                                        ref={(el) => (branchRefs.current[branch.id] = el)}
                                                                                        value={branchSiteURL}
                                                                                        size={200}
                                                                                    />

                                                                                    {/* Download QR Button */}
                                                                                    <div style={{ marginTop: '12px' }}>
                                                                                        <button
                                                                                            onClick={() =>
                                                                                                downloadQRCode(
                                                                                                    branchRefs.current[branch.id],
                                                                                                    `branch-${branch.id}-qr-code.png`
                                                                                                )
                                                                                            }
                                                                                            style={{
                                                                                                padding: '8px 16px',
                                                                                                backgroundColor: '#16a34a',
                                                                                                color: '#ffffff',
                                                                                                borderRadius: '6px',
                                                                                                border: 'none',
                                                                                                cursor: 'pointer'
                                                                                            }}
                                                                                            type="button"
                                                                                        >
                                                                                            Download QR
                                                                                        </button>
                                                                                    </div>
                                                                                </Paper>
                                                                            </Grid>
                                                                        );
                                                                    })}
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                    )}
                                                </>
                                            </Grid>
                                        </Grid>
                                        {/* SETTING END */}
                                    </TabPanel>
                                    {/* SETTINGS END */}

                                    {/* Social Links Tab */}
                                    <TabPanel value={tabValue} index={3}>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12} container justifyContent="space-between" alignItems="center" spacing={2}>
                                                <Grid item>
                                                    <Button
                                                        type="button"
                                                        variant="outlined"
                                                        color="secondary"
                                                        onClick={() => handleBackChange(validateForm, setTouched, isValid)}
                                                        disabled={tabValue === 0} // Disable Back button on the first tab
                                                        sx={{ minWidth: '120px' }} // Consistent button size
                                                    >
                                                        Back
                                                    </Button>
                                                </Grid>
                                                <Grid item>
                                                    <Button
                                                        type="button"
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={() => handleNext(validateForm, setTouched, isValid)}
                                                        disabled={!isValid && tabValue < validationSchemas.length - 1} // Allow submission on the last tab
                                                        sx={{ minWidth: '120px' }} // Consistent button size
                                                    >
                                                        {tabValue === validationSchemas.length - 1 ? 'Submit' : 'Next'}{' '}
                                                        {/* Dynamically change label */}
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Field
                                                    as={TextField}
                                                    name="contactEmail"
                                                    label="Contact Us Email Address"
                                                    fullWidth
                                                    variant="outlined"
                                                    onChange={handleChange}
                                                    error={touched.contactEmail && Boolean(errors.contactEmail)}
                                                    helperText={touched.contactEmail && errors.contactEmail}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Field
                                                    as={TextField}
                                                    name="facebookURL"
                                                    label="Facebook URL"
                                                    fullWidth
                                                    variant="outlined"
                                                    onChange={handleChange}
                                                    error={touched.facebookURL && Boolean(errors.facebookURL)}
                                                    helperText={touched.facebookURL && errors.facebookURL}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Field
                                                    as={TextField}
                                                    name="tiktokURL"
                                                    label="Tiktok URL"
                                                    fullWidth
                                                    variant="outlined"
                                                    onChange={handleChange}
                                                    error={touched.tiktokURL && Boolean(errors.tiktokURL)}
                                                    helperText={touched.tiktokURL && errors.tiktokURL}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Field
                                                    as={TextField}
                                                    name="instagramURL"
                                                    label="Instagram URL"
                                                    fullWidth
                                                    variant="outlined"
                                                    onChange={handleChange}
                                                    error={touched.instagramURL && Boolean(errors.instagramURL)}
                                                    helperText={touched.instagramURL && errors.instagramURL}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Field
                                                    as={TextField}
                                                    name="twitterURL"
                                                    label="Twitter URL"
                                                    fullWidth
                                                    variant="outlined"
                                                    onChange={handleChange}
                                                    error={touched.twitterURL && Boolean(errors.twitterURL)}
                                                    helperText={touched.twitterURL && errors.twitterURL}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Field
                                                    as={TextField}
                                                    name="appleStoreUrl"
                                                    label="Apple Store Url"
                                                    fullWidth
                                                    variant="outlined"
                                                    onChange={handleChange}
                                                    error={touched.appleStoreUrl && Boolean(errors.appleStoreUrl)}
                                                    helperText={touched.appleStoreUrl && errors.appleStoreUrl}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Field
                                                    as={TextField}
                                                    name="playStoreUrl"
                                                    label="Play Store Url"
                                                    fullWidth
                                                    variant="outlined"
                                                    onChange={handleChange}
                                                    error={touched.playStoreUrl && Boolean(errors.playStoreUrl)}
                                                    helperText={touched.playStoreUrl && errors.playStoreUrl}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}></Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Field
                                                    as={TextField}
                                                    name="termsAndConditions"
                                                    label="Terms and Conditions"
                                                    fullWidth
                                                    variant="outlined"
                                                    multiline
                                                    onChange={handleChange}
                                                    error={touched.termsAndConditions && Boolean(errors.termsAndConditions)}
                                                    helperText={touched.termsAndConditions && errors.termsAndConditions}
                                                />
                                            </Grid>

                                            <Grid item xs={12} sm={6}>
                                                <Field
                                                    as={TextField}
                                                    name="privacyPolicy"
                                                    label="Privacy Policy"
                                                    fullWidth
                                                    variant="outlined"
                                                    multiline
                                                    onChange={handleChange}
                                                    error={touched.privacyPolicy && Boolean(errors.privacyPolicy)}
                                                    helperText={touched.privacyPolicy && errors.privacyPolicy}
                                                />
                                            </Grid>
                                        </Grid>
                                    </TabPanel>
                                    {/* SOCIAL END */}
                                    <TabPanel value={tabValue} index={4}>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12} container                 justifyContent="space-between"
                                        alignItems="center" spacing={2}>
                                                <Grid item>
                                                    <Button
                                                        type="button"
                                                        variant="outlined"
                                                        color="secondary"
                                                        onClick={() => handleBackChange(validateForm, setTouched, isValid)}
                                                        disabled={tabValue === 0} // Disable Back button on the first tab
                                                        sx={{ minWidth: '120px' }} // Consistent button size
                                                    >
                                                        Back
                                                    </Button>
                                                </Grid>
                                                <Grid item>
                                                    <Button
                                                        type="submit"
                                                        variant="contained"
                                                        color="primary"
                                                        disabled={user?.isAccessRevoked}
                                                        sx={{ minWidth: '120px' }} // Consistent button size
                                                    >
                                                        {tabValue === validationSchemas.length - 1 ? 'Submit' : 'Next'}{' '}
                                                        {/* Dynamically change label */}
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Grid container>
                                                    <Grid item xs={4}>
                                                        <Typography variant="h7">Upload Logo</Typography>
                                                    </Grid>
                                                    <Grid item xs={8} />

                                                    <Grid item xs={12}>
                                                        <Box
                                                            sx={{
                                                                width: '60%',
                                                                height: 200,
                                                                display: 'flex',
                                                                justifyContent: 'center',
                                                                flexDirection: 'column',
                                                                alignItems: 'center',
                                                                mt: 2,
                                                                backgroundColor: '#eee',
                                                                ml: '20%'
                                                            }}
                                                        >
                                                            {!p1 && brand && brand.logoUrl && (
                                                                <img
                                                                    src={brand?.logoUrl}
                                                                    style={{
                                                                        width: 100,
                                                                        height: 70
                                                                    }}
                                                                    alt="img"
                                                                />
                                                            )}
                                                            <CloudUploadOutlined style={{ fontSize: '26px', color: '#08c' }} />

                                                            <input
                                                                type="file"
                                                                onChange={async (e) => {
                                                                    setP1(e.currentTarget.files[0]);
                                                                }}
                                                            />
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                            </Grid>

                                        </Grid>
                                    </TabPanel>

                                    {/* Add other TabPanel components for the other tabs (Rewards, Settings, etc.) */}
                                </Box>
                            </Form>
                        )}
                    </Formik>
                </Card>
            </Grid>
        </Grid>
    );
};

export default FormComponent;
