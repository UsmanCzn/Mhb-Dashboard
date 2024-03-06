import React, { useEffect, useState } from 'react';
import {
    Modal,
    Box,
    Typography,
    TextField,
    Grid,
    Button,
    Switch,
    RadioGroup,
    FormControlLabel,
    Radio,
    FormControl,
    FormLabel
} from '@mui/material/index';
import DropDown from 'components/dropdown';
import { useParams } from 'react-router-dom';
import { ServiceFactory } from 'services/index';
import moment from 'moment';
import UpdateCustomer from 'components/customers/updateCustomer';

const CustomerInfo = ({ setReload }) => {
    const { cid } = useParams();
    const [data, setData] = useState({
        name: '',
        surname: '',
        emailAddress: '',
        password: '',
        phoneNumber: '',
        gender: '',
        dateOfBirth: new Date(),
        customerGroups: [],
        country:""
    });
    const [modalOpen, setModalOpen] = useState(false);
    const [reload2, setReload2] = useState(false);
    const [countries, setCountries] = useState([]);
    const [groups, setGroups] = useState([]);
    const customerServices = ServiceFactory.get('customer');

    const getCustomer = async () => {
        await customerServices
            .getCustomerDetail(cid)
            .then((res) => {
                setData(res?.data?.result);
                console.log(res?.data?.result,"customer");
            })
            .catch((err) => {
                console.log(err?.response);
            });
    };

    const getCountries = async () => {
        await customerServices
            .getCountries()
            .then((res) => {
                setCountries(res?.data?.result);
            })
            .catch((err) => {
                console.log(err?.data);
            });
    };
    useEffect(() => {
        getCustomer();
        getCountries();
    }, [reload2]);

    return (
        <Grid container spacing={4}>
            <Grid item xs={12}>
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <TextField
                            id="outlined-basic"
                            fullWidth
                            label="First Name"
                            variant="outlined"
                            value={data.name}
                            onChange={(e) => setData({ ...data, name: e.target.value })}
                            InputProps={{
                                readOnly: true
                            }}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            id="outlined-basic"
                            fullWidth
                            label="Last Name"
                            variant="outlined"
                            value={data.surname}
                            onChange={(e) => setData({ ...data, surname: e.target.value })}
                            InputProps={{
                                readOnly: true
                            }}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            id="outlined-basic"
                            fullWidth
                            label="Email"
                            type="email"
                            variant="outlined"
                            value={data.emailAddress}
                            onChange={(e) => setData({ ...data, emailAddress: e.target.value })}
                            InputProps={{
                                readOnly: true
                            }}
                        />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={4}>
                        <Typography variant="h6">Gender : {data?.gender}</Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            id="outlined-basic"
                            fullWidth
                            label="Birthday"
                            variant="outlined"
                            value={moment(data.dateOfBirth).format('DD-MMM-YYYY')}
                            InputProps={{
                                readOnly: true
                            }}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            id="outlined-basic"
                            fullWidth
                            label="Country"
                            variant="outlined"
                            value={data?.country}
                            InputProps={{
                                readOnly: true
                            }}
                        />
                    </Grid>
                </Grid>
            </Grid>

            <Grid item xs={12}>
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <TextField
                            id="outlined-basic"
                            fullWidth
                            label="Phone"
                            variant="outlined"
                            required
                            value={data.phoneNumber}
                            onChange={(e) => setData({ ...data, phoneNumber: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField id="outlined-basic" fullWidth label="Signup date" variant="outlined" disabled />
                    </Grid>
                </Grid>
            </Grid>

            <Grid item xs={12}>
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                                <Typography variant="h6">Customer Groups</Typography>
                            </Grid>
                            {data?.customerGroups?.map((obj) => {
                                return (
                                    <Grid item xs="auto">
                                        {' '}
                                        <Typography variant="h6" px={2} mr={1} border={0.6} borderRadius={1}>
                                            {obj?.name}
                                        </Typography>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            {/* Footer */}

            <Grid item xs={12}>
                <Grid container>
                    <Grid item xs={8} />
                    <Grid container spacing={2} justifyContent="flex-end">
                        <Grid item>
                            <Button primay variant="contained" type="Submit" onClick={() => setModalOpen(true)}>
                                Update Customer
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            <UpdateCustomer modalOpen={modalOpen} setModalOpen={setModalOpen} setReload={setReload2} prevData={data} />
        </Grid>
    );
};

export default CustomerInfo;
