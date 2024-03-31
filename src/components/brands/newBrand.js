import React, { useEffect, useState } from 'react';
import { Modal, Box, Typography, TextField, Grid, Button, Switch, Select, MenuItem, FormControl, InputLabel } from '@mui/material/index';
import DropDown from 'components/dropdown';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { CloudUploadOutlined } from '@ant-design/icons';
import { ServiceFactory } from 'services/index';
import MUIRichTextEditor from 'mui-rte';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import brandServices from 'services/brandServices';
import fileService from 'services/fileService';
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '70%',
    height: '90%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 1,
    overflow: 'scroll'
};

const NewCompany = ({ modalOpen, setModalOpen, update, updateData }) => {
    const [p1, setP1] = useState(null);
    const [p2, setP2] = useState(null);
    const intialData = {
        name: '',
        nativeName: '',
        logoUrl: '',
        emailAddress: '',
        phoneNumber: '',
        currency: '',
        reportInterval: 0,
        applicationLanguage: 'en',
        walletSubTitle: '',
        walletSubTitleNative: '',
        companyId: 0,
        brandManager: {
            userName: '',
            name: '',
            surname: '',
            password: '',
            address: '',
            emailAddress: '',
            phoneNumber: ''
        },
        aboutApplicationNative: '',
        privacyPolicyNative: '',
        faqNative: '',
        termsAndConditionsNative: '',
        aboutApplication: '',
        currencyDecimals: 0,
        privacyPolicy: '',
        faq: '',
        initialCustomerBalance: 0,
        freeItems: 0,
        useTopUpValues: true,
        minimumTopUpValue: 0,
        brandTimeZone: 0,
        socialFacebookUrl: '',
        socialInstaUrl: '',
        socialTwitterUrl: '',
        contactUsEmailAddress: '',
        termsAndConditions: '',
        currencyId: 1,
        pointsForWalletReplenishment: 0
    }

    const [value, setValue] = React.useState(new Date());

    const brandsService = ServiceFactory.get('brands');
    const userService = ServiceFactory.get('users');

    const [companies, setCompanies] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [currencies, setCurrencies] = useState([]);
    const handleChange = (event) => {
        setData({ ...data, currency: event.target.value });
    };
    const [data, setData] = useState(intialData);

    const myTheme = createTheme({
        // Set up your custom MUI theme here
    });
    const createNewBrand = async (event) => {
        event.preventDefault();

        data.brandManager.userName = data?.brandManager?.phoneNumber;
        let payload = {
            ...data
        };
        await fileService
            .UploadBrandLogoImage(p1)
            .then((res) => {
                payload.logoUrl = res.data?.result;
            })
            .catch((err) => {
                console.log(err.response.data);
            });


        await brandServices
            .createBrand(payload)
            .then((res) => {
                console.log(res?.data, 'brand created');
            })
            .catch((err) => {
                console.log(err?.response?.data);
            })
            .finally(() => {
                setModalOpen(false);
            });
    };
    const updateBrand = async (event) => {
        event.preventDefault();

        data.brandManager.userName = data?.brandManager?.phoneNumber;
        let payload = {
            ...data,
            brandManager: [
                {
                    ...data?.brandManager
                }
            ]
        };
        await fileService
            .UploadBrandLogoImage(p1)
            .then((res) => {
                payload.logoUrl = res.data?.result;
            })
            .catch((err) => {
                console.log(err.response.data);
            });

        await brandServices
            .UpdateBrand(payload)
            .then((res) => {
                console.log(res?.data, 'brand updated');
            })
            .catch((err) => {
                console.log(err?.response?.data);
            })
            .finally(() => {
                setModalOpen(false);
            });
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
    useEffect(() => {
        getCompanies();
        getLanguages();
        getCurrencies();
    }, []);
    useEffect(() => {
        if (update) {
            setData({
                ...data,
                id: updateData?.id,
                currency: updateData?.currency,
                name: updateData?.name,
                nativeName: updateData?.nativeName,
                logoUrl: updateData?.logoUrl,
                emailAddress: updateData?.emailAddress,
                phoneNumber: updateData?.phoneNumber,
                reportInterval: updateData?.reportInterval,
                applicationLanguage: updateData?.applicationLanguage,
                walletSubTitle: updateData?.walletSubTitle,
                walletSubTitleNative: updateData?.walletSubTitle,
                companyId: updateData?.companyId,
                brandManager: {
                    userName: updateData?.brandManager?.userName,
                    name: updateData?.brandManager?.name,
                    surname: updateData?.brandManager?.surname,
                    password: updateData?.brandManager?.password,
                    address: updateData?.brandManager?.address,
                    emailAddress: updateData?.brandManager?.emailAddress,
                    phoneNumber: updateData?.brandManager?.phoneNumber
                },
                aboutApplicationNative: updateData?.aboutApplication,
                privacyPolicyNative: updateData?.privacyPolicyNative,
                faqNative: updateData?.faqNative,
                termsAndConditionsNative: updateData?.termsAndConditionsNative,
                aboutApplication: updateData?.aboutApplication,
                currencyDecimals: updateData?.currencyDecimals,
                privacyPolicy: updateData?.privacyPolicy,
                faq: updateData?.faq,
                initialCustomerBalance: updateData?.initialCustomerBalance,
                freeItems: updateData?.freeItems,
                useTopUpValues: updateData?.useTopUpValues,
                minimumTopUpValue: updateData?.minimumTopUpValue,
                brandTimeZone: updateData?.brandTimeZone,
                socialFacebookUrl: updateData?.socialFacebookUrl,
                socialInstaUrl: updateData?.socialInstaUrl,
                socialTwitterUrl: updateData?.socialTwitterUrl,
                contactUsEmailAddress: updateData?.contactUsEmailAddress,
                termsAndConditions: updateData?.termsAndConditions,
                currencyId: updateData?.currencyId,
                pointsForWalletReplenishment: updateData?.pointsForWalletReplenishment
            });
        }
        else{
            setData(intialData)
        }
    }, [update, updateData]);

    return (
        <Modal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <form onSubmit={update ? updateBrand : createNewBrand}>
                <Box sx={style}>
                    <Grid container spacing={4}>
                        <Grid item>
                            <Typography variant="h4"> {update ? 'Edit Brand' : 'Create new Brand'}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container spacing={2}>
                                <Grid item xs={4}>
                                    <TextField
                                        fullWidth
                                        label="Brand Name"
                                        variant="outlined"
                                        required
                                        value={data.name}
                                        onChange={(e) => setData({ ...data, name: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        fullWidth
                                        label="Brand Native Name"
                                        variant="outlined"
                                        required
                                        value={data.nativeName}
                                        onChange={(e) => setData({ ...data, nativeName: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    {/* <TextField   fullWidth label="Password" variant="outlined" /> */}
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container spacing={2}>
                                <Grid item xs={4}>
                                    <DropDown
                                        title="Company"
                                        list={companies}
                                        data={data}
                                        setData={setData}
                                        keyo={'companyId'}
                                        type="company"
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <DropDown
                                        title="Second Language"
                                        list={languages}
                                        data={data}
                                        setData={setData}
                                        keyo={'applicationLanguage'}
                                        type="language"
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <FormControl fullWidth>
                                        <InputLabel htmlFor="currency-select">Currency</InputLabel>
                                        <Select label={'Currency'} value={data.currency} sx={{ width: '100%' }} onChange={handleChange}>
                                            {currencies.map((item) => (
                                                <MenuItem key={item.id} value={item.name}>
                                                    {item.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    {/* <DropDown
                                        title="Currency"
                                        list={currencies}
                                        data={data}
                                        setData={setData}
                                        keyo={'currencyId'}
                                        type="currency"
                                    /> */}
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={12}>
                            <Grid container spacing={2}>
                                <Grid item xs={4}>
                                    <TextField
                                        fullWidth
                                        label="Points"
                                        type="number"
                                        variant="outlined"
                                        value={data.pointsForWalletReplenishment}
                                        onChange={(e) => setData({ ...data, pointsForWalletReplenishment: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        fullWidth
                                        label="Brand Phone"
                                        variant="outlined"
                                        value={data.phoneNumber}
                                        onChange={(e) => setData({ ...data, phoneNumber: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <DropDown
                                        title="Report Interval"
                                        list={[
                                            {
                                                name: 'Weekly',
                                                id: 1
                                            },
                                            {
                                                id: 2,
                                                name: 'monthly'
                                            }
                                        ]}
                                        data={data}
                                        setData={setData}
                                        keyo={'reportInterval'}
                                        type="normal"
                                    />
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={12}>
                            <Grid container spacing={2}>
                                <Grid item xs={4}>
                                    <TextField
                                        fullWidth
                                        label="Currency decimals"
                                        variant="outlined"
                                        type="number"
                                        value={data.currencyDecimals}
                                        onChange={(e) => setData({ ...data, currencyDecimals: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        fullWidth
                                        label="Wallet Subtitle"
                                        variant="outlined"
                                        value={data.walletSubTitle}
                                        onChange={(e) => setData({ ...data, walletSubTitle: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        fullWidth
                                        label="Brand Email"
                                        variant="outlined"
                                        type="email"
                                        value={data.emailAddress}
                                        onChange={(e) => setData({ ...data, emailAddress: e.target.value })}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={12}>
                            <Grid container spacing={2}>
                                <Grid item xs={4}>
                                    <TextField
                                        fullWidth
                                        label="Wallet Subtitle Native"
                                        variant="outlined"
                                        value={data.walletSubTitleNative}
                                        onChange={(e) => setData({ ...data, walletSubTitleNative: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        fullWidth
                                        label="Initial Customer balance"
                                        type="number"
                                        variant="outlined"
                                        value={data.initialCustomerBalance}
                                        onChange={(e) => setData({ ...data, initialCustomerBalance: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField fullWidth label="Initial Credit balance" variant="outlined" />
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={12}>
                            <Grid container spacing={2}>
                                <Grid item xs={4}>
                                    <Typography required variant="h7">
                                        Initial Credit Balance Expiry
                                    </Typography>
                                    <Box
                                        sx={{
                                            width: '100%',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            mt: 2
                                        }}
                                    >
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                label="Pick date"
                                                value={value}
                                                onChange={(newValue) => {
                                                    setValue(newValue);
                                                }}
                                                renderInput={(params) => <TextField fullWidth {...params} />}
                                            />
                                        </LocalizationProvider>
                                    </Box>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography required variant="h7">
                                        Use Qr Code
                                    </Typography>
                                    <Box
                                        sx={{
                                            width: '100%',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            mt: 2
                                        }}
                                    >
                                        <Switch defaultChecked />
                                    </Box>
                                </Grid>
                                <Grid item xs={4}></Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={12}>
                            <Grid container spacing={2}>
                                <Grid item xs={4}>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        label="Initial Customer Free Items"
                                        variant="outlined"
                                        value={data.freeItems}
                                        onChange={(e) => setData({ ...data, freeItems: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        fullWidth
                                        label="Contact Us Email Address"
                                        variant="outlined"
                                        type="email"
                                        value={data.contactUsEmailAddress}
                                        onChange={(e) => setData({ ...data, contactUsEmailAddress: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={4}></Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={12}>
                            <Grid container spacing={2}>
                                <Grid item xs={4}>
                                    <TextField
                                        fullWidth
                                        label="Facebook Url"
                                        variant="outlined"
                                        value={data.socialFacebookUrl}
                                        onChange={(e) => setData({ ...data, socialFacebookUrl: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        fullWidth
                                        label="Instagram Url"
                                        variant="outlined"
                                        value={data.socialInstaUrl}
                                        onChange={(e) => setData({ ...data, socialInstaUrl: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        fullWidth
                                        label="Twitter Url"
                                        variant="outlined"
                                        value={data.socialTwitterUrl}
                                        onChange={(e) => setData({ ...data, socialTwitterUrl: e.target.value })}
                                    />
                                </Grid>
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
                                        <img
                                            src={updateData?.logoUrl}
                                            style={{
                                                width: 100,
                                                height: 70
                                            }}
                                            alt="img"
                                        />
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

                        <Grid item xs={12}>
                            <Grid container>
                                <Grid item xs={4}>
                                    <Typography variant="h7">Upload Banner</Typography>
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
                                        <CloudUploadOutlined style={{ fontSize: '26px', color: '#08c' }} />

                                        <input
                                            type="file"
                                            onChange={async (e) => {
                                                setP2(e.currentTarget.files[0]);
                                            }}
                                        />
                                    </Box>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={12}></Grid>

                        <Grid item xs={12}>
                            <Box
                                sx={{
                                    width: 1,
                                    height: 400,
                                    border: 1,
                                    borderRadius: 2,
                                    px: 2
                                }}
                            >
                                <MUIRichTextEditor label="Frequently Asked Questions ..." inlineToolbar={true} />
                            </Box>
                        </Grid>

                        <Grid item xs={12}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant="h7">Brand Time Zone</Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <DropDown
                                        title="Select Time Zone"
                                        list={[
                                            { id: 1, name: 'GreenWich' },
                                            { id: 2, name: 'Universal 2' }
                                        ]}
                                        data={data}
                                        setData={setData}
                                        keyo={'brandTimeZone'}
                                        type="normal"
                                    />
                                </Grid>
                                <Grid item xs={4}></Grid>
                            </Grid>
                        </Grid>

                        {/* <Grid item xs={12}>
                            <Grid item xs={12}>
                                <Typography variant="h7">Brand User</Typography>
                            </Grid>
                        </Grid>

                        <Grid item xs={12}>
                            <Grid container spacing={2}>
                                <Grid item xs={4}>
                                    <TextField
                                        fullWidth
                                        label="First Name"
                                        variant="outlined"
                                        required
                                        value={data.brandManager?.name}
                                        onChange={(e) =>
                                            setData({
                                                ...data,
                                                brandManager: {
                                                    ...data.brandManager,
                                                    name: e.target.value
                                                }
                                            })
                                        }
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        fullWidth
                                        label="Last name"
                                        variant="outlined"
                                        required
                                        value={data.brandManager?.surname}
                                        onChange={(e) =>
                                            setData({
                                                ...data,
                                                brandManager: {
                                                    ...data.brandManager,
                                                    surname: e.target.value
                                                }
                                            })
                                        }
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        variant="outlined"
                                        type="email"
                                        required
                                        value={data.brandManager?.emailAddress}
                                        onChange={(e) =>
                                            setData({
                                                ...data,
                                                brandManager: {
                                                    ...data.brandManager,
                                                    emailAddress: e.target.value
                                                }
                                            })
                                        }
                                    />
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={12}>
                            <Grid container spacing={2}>
                                <Grid item xs={4}>
                                    <TextField
                                        fullWidth
                                        label="Phone number"
                                        variant="outlined"
                                        required
                                        value={data.brandManager?.phoneNumber}
                                        onChange={(e) =>
                                            setData({
                                                ...data,
                                                brandManager: {
                                                    ...data.brandManager,
                                                    phoneNumber: e.target.value
                                                }
                                            })
                                        }
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        fullWidth
                                        label="Password"
                                        variant="outlined"
                                        required
                                        type="password"
                                        value={data.brandManager?.password}
                                        onChange={(e) =>
                                            setData({
                                                ...data,
                                                brandManager: {
                                                    ...data.brandManager,
                                                    password: e.target.value
                                                }
                                            })
                                        }
                                    />
                                </Grid>
                                <Grid item xs={4}></Grid>
                            </Grid>
                        </Grid> */}

                        {/* Footer */}

                        <Grid item xs={12}>
                            <Grid container>
                                <Grid item xs={8} />
                                <Grid container spacing={2} justifyContent="flex-end">
                                    <Grid item>
                                        <Button variant="outlined" onClick={() => setModalOpen(false)}>
                                            Cancel
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Button primay variant="contained" type="submit">
                                            {' '}
                                            {update ? 'Save' : 'Create new Brand'}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </form>
        </Modal>
    );
};

export default NewCompany;
