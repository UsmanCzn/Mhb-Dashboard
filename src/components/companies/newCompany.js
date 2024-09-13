import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Grid, Button } from '@mui/material/index';
import Counter from 'components/companies/counter';
import Category from 'components/companies/dropDown';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { CloudUploadOutlined } from '@ant-design/icons';
import { MuiTelInput, matchIsValidTel } from 'mui-tel-input';
import { ServiceFactory } from 'services/index';
import fileService from 'services/fileService';
import { useSnackbar } from 'notistack';
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '70%',
    height: '80%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 1,
    overflow: 'scroll'
};

const NewCompany = ({ modalOpen, setModalOpen, update, updateData, setReload ,loadCompanies}) => {
    const [value, setValue] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [p1, setP1] = useState(null);
    const [logoUrl, setLogoUrl] = useState(null);
    const [imageChange, setImageChange] = useState(false);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const userServices = ServiceFactory.get('users');
    const [data, setData] = useState({
        name: '',
        phoneNumber: '',
        password: '',
        firstName: '',
        LastName: '',
        email: '',
        NoBrands: 2,
        NoBranches: 2,
        NoNotifications: 5,
        CategoryName: '',
        endSubDate: '',
        giftCardsLimit: 5,
        logo: ''
    });

    const createNewCompany = async (event) => {
        event.preventDefault();
        if(data.phoneNumber){
        let payload = {
            name: data.name,
            CategoryName: data.CategoryName,
            logoUrl: logoUrl,

            endSubscriptionDate: value,
            brandsLimit: data.NoBrands,
            branchesLimit: data.NoBranches,
            notificationsLimit: data.NoNotifications,
            giftCardsLimit: data.giftCardsLimit,
            adminUser: {
                userName: data.phoneNumber,
                name: data.firstName,
                surname: data.LastName,
                password: data.password,
                emailAddress: data.email,
                phoneNumber: data.phoneNumber
            }
        };

        await fileService
            .UploadCompanyLogoImage(p1)
            .then((res) => {
                payload.logoUrl = res.data?.result;
                setLogoUrl(res.data?.result);
            })
            .catch((err) => {
                console.log(err.response.data);
            });
        await userServices
            .createCompany(payload)
            .then((res) => {
                setModalOpen(false);
                setReload((prev) => !prev);
                loadCompanies()
            })
            .catch((err) => {
                console.log(err.response);
                if(err.response.data.error.validationErrors){
                enqueueSnackbar(err.response.data.error.validationErrors[0].message, {
                    variant: 'error',
                  });
                }
                  else{
                    enqueueSnackbar(err.response.data.error.message, {
                        variant: 'error',
                      });
                  }
            });}
            else{
                enqueueSnackbar('Phone Number is required', {
                    variant: 'error',
                  });
            }
    };

    const editCompany = async (event) => {
        event.preventDefault();
        const payload = {
            id: updateData?.id,
            name: data.name,
            CategoryName: data.CategoryName,
            logoUrl: logoUrl,
            endSubscriptionDate: value,
            brandsLimit: data.NoBrands,
            branchesLimit: data.NoBranches,
            notificationsLimit: data.NoNotifications,
            giftCardsLimit: data.giftCardsLimit
        };
        if (imageChange) {
            await fileService
                .UploadCompanyLogoImage(p1)
                .then((res) => {
                    setLogoUrl(res.data?.result);
                    payload.logoUrl = res.data?.result;
                })
                .catch((err) => {
                    console.log(err.response.data);
                    enqueueSnackbar((err.response.data.error.validationErrors && err.response.data.error.validationErrors[0].message) || err.response.data.error.message, {
                        variant: 'error',
                      });
                });
            await userServices
                .UpdateCompany(payload)
                .then((res) => {
   
                    setReload((prev) => !prev);
                    setModalOpen(false);
                })
                .catch((err) => {
                    console.log(err.response);
                    enqueueSnackbar((err.response.data.error.validationErrors && err.response.data.error.validationErrors[0].message) || err.response.data.error.message, {
                        variant: 'error',
                      });
                });
        } else {
            const payload = {
                id: updateData?.id,
                name: data.name,
                CategoryName: data.CategoryName,
                logoUrl: updateData?.logoUrl,
                endSubscriptionDate: value,
                brandsLimit: data.NoBrands,
                branchesLimit: data.NoBranches,
                notificationsLimit: data.NoNotifications,
                giftCardsLimit: data.giftCardsLimit
            };
            await userServices
                .UpdateCompany(payload)
                .then((res) => {
                    setReload((prev) => !prev);
                    setModalOpen(false);
                })
                .catch((err) => {
                    console.log(err.response);
                    enqueueSnackbar((err.response.data.error.validationErrors && err.response.data.error.validationErrors[0].message) || err.response.data.error.message, {
                        variant: 'error',
                      });
                });
        }
    };

    useEffect(() => {
        if (update) {
            setValue(updateData.formattedEndSubscriptionDate);
            setData({
                ...data,
                name: updateData?.name,
                phoneNumber: updateData?.adminUser?.phoneNumber,
                endSubscriptionDate: updateData?.formattedEndSubscriptionDate,
                NoBrands: updateData?.brandsLimit,
                NoBranches: updateData?.branchesLimit,
                NoNotifications: updateData?.notificationsLimit,
                CategoryName: updateData?.categoryName,
                logoUrl: updateData?.logoUrl,
                giftCardsLimit: updateData.giftCardsLimit
            });
        } else {
            setValue(Date());
            setData({
                ...data,
                name: '',
                phoneNumber: '',
                endSubscriptionDate: '',
                NoBrands: '0',
                NoBranches: '0',
                NoNotifications: '0',
                CategoryName: '',
                logoUrl: '',
                giftCardsLimit: '0'
            });
        }
    }, [update, updateData]);

    const setImage = () => {
        if (update) {
            return (
                <>
                    <img src={selectedFile|| updateData.logoUrl} alt="logo" height={100}></img>
                </>
            );
        } else {
            return (
                <>
                    <CloudUploadOutlined style={{ fontSize: '26px', color: '#08c' }} />
                    <Typography variant="h7">Drop file here or click to upload</Typography>
                </>
            );
        }
    };

    return (
        <Modal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <form onSubmit={update ? editCompany : createNewCompany}>
                <Box sx={style}>
                    <Grid container spacing={4}>
                        <Grid item>
                            <Typography variant="h4">{update ? 'Edit App' : 'Create new App'}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container spacing={2}>
                                <Grid item xs={4}>
                                    {
                                        <TextField
                                            id="outlined-basic"
                                            fullWidth
                                            label="Company Name"
                                            variant="outlined"
                                            value={data.name}
                                            onChange={(e) => setData({ ...data, name: e.target.value })}
                                            required
                                        />
                                    }
                                </Grid>
                                <Grid item xs={4}>
                                    {update ? null : (
                                        <MuiTelInput
                                            value={data.phoneNumber}
                                            label="Phone Number"
                                            fullWidth
                                            defaultCountry="KW"
                                            required
                                            onChange={(value, info) => setData({ ...data, phoneNumber: info.numberValue })}
                                        />
                                    )}
                                </Grid>
                                <Grid item xs={4}>
                                    {update ? null : (
                                        <TextField
                                            id="outlined-basic"
                                            fullWidth
                                            label="Password"
                                            variant="outlined"
                                            type="password"
                                            required
                                            value={data.password}
                                            onChange={(e) => setData({ ...data, password: e.target.value })}
                                        />
                                    )}
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container spacing={2}>
                                <Grid item xs={4}>
                                    {update ? null : (
                                        <TextField
                                            id="outlined-basic"
                                            fullWidth
                                            label="First Name"
                                            variant="outlined"
                                            required
                                            value={data.firstName}
                                            onChange={(e) => setData({ ...data, firstName: e.target.value })}
                                        />
                                    )}
                                </Grid>
                                <Grid item xs={4}>
                                    {update ? null : (
                                        <TextField
                                            id="outlined-basic"
                                            fullWidth
                                            label="Last Number"
                                            variant="outlined"
                                            required
                                            value={data.LastName}
                                            onChange={(e) => setData({ ...data, LastName: e.target.value })}
                                        />
                                    )}
                                </Grid>
                                <Grid item xs={4}>
                                    {update ? null : (
                                        <TextField
                                            id="outlined-basic"
                                            fullWidth
                                            label="Email"
                                            variant="outlined"
                                            required
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData({ ...data, email: e.target.value })}
                                        />
                                    )}
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={12}>
                            <Grid container spacing={2}>
                                <Grid item xs={4}>
                                    <Counter title="Total Number of Brands" value="NoBrands" data={data} setData={setData} />
                                </Grid>
                                <Grid item xs={4}>
                                    <Counter title="Total Number of Branches" value="NoBranches" data={data} setData={setData} />
                                </Grid>
                                <Grid item xs={4}>
                                    <Counter title="Total Number of Notifications" value="NoNotifications" data={data} setData={setData} />
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={12}>
                            <Grid container spacing={2}>
                                <Grid item xs={4}>
                                    <Category title="Category" data={data} setData={setData} />
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography required variant="h7">
                                        End Subscription Date
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
                                    <Counter title="Limit Total Gift cards" value="giftCardsLimit" data={data} setData={setData} />
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
                                        {setImage()}

                                        <input
                                            type="file"
                                            required={!update}
                                            accept=".png, .jpeg, .jpg"
                                            onChange={async (e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onload = function (e) {
                                                        // Set the image source to the data URL generated by FileReader
                                        
                                                      
                                                      setSelectedFile(e.target.result)
                                                    };
                                                    reader.readAsDataURL(file); // Reads the file as a data URL
                                                }
                                                setImageChange(true);
                                                setP1(e.currentTarget.files[0]);
                                            }}
                                        />
                                    </Box>
                                </Grid>
                            </Grid>
                        </Grid>

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
                                        <Button primay variant="contained" type="Submit">
                                            {update ? 'Edit App' : 'Create new App'}
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
