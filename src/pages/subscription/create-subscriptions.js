import React, { useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import { TextField, MenuItem, Button, Grid, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import * as Yup from 'yup';
import customerService from 'services/customerService';
import membershipService from 'services/membership.service';
import { useSnackbar } from 'notistack';

const MembershipFormModal = ({ open, onClose }) => {
    const validationSchema = Yup.object({
        companyId: Yup.number().required('Company is required'),
        phoneNumber: Yup.string().matches(/^\d+$/, 'Phone number must contain only numbers').required('Phone number is required'),
        emailAddress: Yup.string().email('Enter a valid email').required('Email is required'),
        memberShipTypeId: Yup.number().required('Membership type is required')
    });

    const [companies, setCompanies] = useState([]);
    const [types, setTypes] = useState([]);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    
    useEffect(() => {
        getCompanies();
        getMembershipTypes();
    }, []);

    const getCompanies = async () => {
        try {
            const res = await customerService.getComapniesByUserRole();
            if (res) {
                setCompanies(res.data.result);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const getMembershipTypes = async () => {
        try {
            const res = await membershipService.getAllMembershipTypesMaster();
            if (res) {
                setTypes(res.data.result);
            }
        } catch (err) {
            console.log(err);
        }
    };
    const CreateMemberShipForCompanies = async (values) => {
        try {
            const res = await membershipService.CreateMembership(values);
            if (res) {
                enqueueSnackbar('Membership has been created Successfully', {
                    variant: 'success'
                });
                onClose();
            }
        } catch (err) {
            console.log(err);
            enqueueSnackbar(err.response.data.error.message, {
                variant: 'error'
            });
            onClose();
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Create Membership</DialogTitle>
            <DialogContent>
                <Formik
                    initialValues={{
                        companyId: '',
                        phoneNumber: '',
                        emailAddress: '',
                        memberShipTypeId: ''
                    }}
                    validationSchema={validationSchema}
                    onSubmit={(values) => {
                        console.log('Form values:', values);
                        CreateMemberShipForCompanies(values);
                        // Close the modal after submission
                    }}
                >
                    {({ errors, touched, handleChange, values, handleSubmit }) => (
                        <Form id="membership-form" onSubmit={handleSubmit}>
                            <Grid container spacing={2} mt={2}>
                                {/* Company ID */}
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        select
                                        label="Company"
                                        name="companyId"
                                        value={values.companyId}
                                        onChange={handleChange}
                                        error={touched.companyId && Boolean(errors.companyId)}
                                        helperText={touched.companyId && errors.companyId}
                                        fullWidth
                                    >
                                        {companies.map((option) => (
                                            <MenuItem key={option.id} value={option.id}>
                                                {option.name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>

                                {/* Phone Number */}
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Phone Number"
                                        name="phoneNumber"
                                        value={values.phoneNumber}
                                        onChange={handleChange}
                                        error={touched.phoneNumber && Boolean(errors.phoneNumber)}
                                        helperText={touched.phoneNumber && errors.phoneNumber}
                                        fullWidth
                                    />
                                </Grid>

                                {/* Email Address */}
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Email Address"
                                        name="emailAddress"
                                        value={values.emailAddress}
                                        onChange={handleChange}
                                        error={touched.emailAddress && Boolean(errors.emailAddress)}
                                        helperText={touched.emailAddress && errors.emailAddress}
                                        fullWidth
                                    />
                                </Grid>

                                {/* Membership Type ID */}
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        select
                                        label="Membership Type"
                                        name="memberShipTypeId"
                                        value={values.memberShipTypeId}
                                        onChange={handleChange}
                                        error={touched.memberShipTypeId && Boolean(errors.memberShipTypeId)}
                                        helperText={touched.memberShipTypeId && errors.memberShipTypeId}
                                        fullWidth
                                    >
                                        {types.map((option) => (
                                            <MenuItem key={option.id} value={option.id}>
                                                {option.name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                            </Grid>
                        </Form>
                    )}
                </Formik>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Cancel
                </Button>
                <Button type="submit" form="membership-form" variant="contained" color="primary">
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default MembershipFormModal;
