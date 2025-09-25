import React, { useEffect, useState } from 'react';
import { Typography, Grid, TextField, Button, Stack, Chip, Box,Card, CardContent } from '@mui/material';
import { useParams } from 'react-router-dom';
import { ServiceFactory } from 'services/index';
import moment from 'moment';
import UpdateCustomer from 'components/customers/updateCustomer';
import ConfirmationModal from 'components/confirmation-modal';
import UpdateIcon from '@mui/icons-material/Update';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';

const fieldMap = [
    { label: 'First Name', key: 'name' },
    { label: 'Last Name', key: 'surname' },
    { label: 'Email', key: 'displayEmailAddress', type: 'email' },
    { label: 'Phone', key: 'displayPhoneNumber' },
    { label: 'Country', key: 'country' }
];

const CustomerInfo = ({ setReload }) => {
    const { cid } = useParams();
    const [data, setData] = useState({
        name: '',
        surname: '',
        displayEmailAddress: '',
        password: '',
        displayPhoneNumber: '',
        gender: '',
        dateOfBirth: '',
        customerGroups: [],
        country: '',
        signupDate: ''
    });
    const [modalOpen, setModalOpen] = useState(false);
    const [reload2, setReload2] = useState(false);
    const customerServices = ServiceFactory.get('customer');
    const [loading, setLoading] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const handleCancelDelete = () => {
        setDeleteModalOpen(false);
    };

    const getCustomer = async () => {
        setLoading(true);
        try {
            const res = await customerServices.getCustomerDetail(cid);
            setData(res?.data?.result);
        } catch (err) {
            console.log(err?.response);
        }
        setLoading(false);
    };

    const convertCustomer = async () => {
        try {
            const res = await customerServices.ConvertCustomerToNormal(cid);
            setDeleteModalOpen(false);
            getCustomer();
            enqueueSnackbar('Customer converted to normal successfully!', { variant: 'success' });
        } catch (error) {
            enqueueSnackbar('Failed to convert customer.', { variant: 'error' });
        }
    };

    useEffect(() => {
        getCustomer();
    }, [reload2, cid]);

    if (loading) return <Typography>Loading customer data...</Typography>;

    return (
        <>
        <Card sx={{ p: 2, boxShadow: 3, borderRadius: 2 }}>
    <CardContent>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography variant="h5" gutterBottom>
                        Customer Information
                    </Typography>
                </Grid>

                {/* Main Details */}
                <Grid item xs={12}>
                    <Stack direction="row" spacing={2}>
                        {fieldMap.map((field) => (
                            <TextField
                                key={field.key}
                                label={field.label}
                                type={field.type || 'text'}
                                variant="outlined"
                                value={data[field.key] || ''}
                                fullWidth
                                InputProps={{ readOnly: true }}
                            />
                        ))}
                    </Stack>
                </Grid>

                {/* Gender, Birthday, Signup */}
                <Grid item xs={12}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <TextField label="Gender" value={data.gender || ''} variant="outlined" fullWidth InputProps={{ readOnly: true }} />
                        <TextField
                            label="Birthday"
                            value={data.dateOfBirth ? moment(data.dateOfBirth).format('DD-MMM-YYYY') : ''}
                            variant="outlined"
                            fullWidth
                            InputProps={{ readOnly: true }}
                        />
                        <TextField
                            label="Signup Date"
                            value={data.signupDate ? moment(data.signupDate).format('DD-MMM-YYYY') : ''}
                            variant="outlined"
                            fullWidth
                            InputProps={{ readOnly: true }}
                            disabled={!data.signupDate}
                        />
                    </Stack>
                </Grid>

                {/* Customer Groups */}
                <Grid item xs={12}>
                    <Typography variant="h6" mb={1}>
                        Customer Groups
                    </Typography>
                    <Stack direction="row" spacing={1}>
                        {(data.customerGroups || []).length > 0 ? (
                            data.customerGroups.map((group) => (
                                <Chip key={group.id || group.name} label={group.name} color="primary" variant="outlined" />
                            ))
                        ) : (
                            <Typography variant="body2" color="textSecondary">
                                No groups assigned
                            </Typography>
                        )}
                    </Stack>
                </Grid>
                {/* Sign Up Status */}
                {data?.AuthenticationSource && (
                    <Grid item xs={12}>
                        <Typography variant="h6" mb={1}>
                            Sign Up Source : {data?.AuthenticationSource}
                        </Typography>
                    </Grid>
                )}

                <Grid item xs={12}>
                    <Box display="flex" justifyContent="flex-end">
                        <Stack direction="row" spacing={2}>
                            <Button variant="contained" color="primary" startIcon={<UpdateIcon />} onClick={() => setModalOpen(true)}>
                                Update Customer
                            </Button>
                            {data?.isExternalAuth && (
                                <Button
                                    variant="contained"
                                    color="warning"
                                    startIcon={<PersonRemoveIcon />}
                                    onClick={() => setDeleteModalOpen(true)}
                                >
                                    Switch Customer to Email Sign-Up
                                </Button>
                            )}
                        </Stack>
                    </Box>
                </Grid>

                <UpdateCustomer modalOpen={modalOpen} setModalOpen={setModalOpen} setReload={setReload2} prevData={data} />
            </Grid>
             </CardContent>
             </Card>               
            <ConfirmationModal
                open={isDeleteModalOpen}
                onClose={handleCancelDelete}
                onConfirm={convertCustomer}
                statement={`Are you sure you want to switch this customer’s sign-up method to Email? `}
            />
        </>
    );
};

export default CustomerInfo;
