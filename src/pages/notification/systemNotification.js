import React, { useState, useEffect } from 'react';
import {
    Grid,
    Typography,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Card,
    CardContent,
    TextField,
    CardActions,
    Switch,
    FormControlLabel
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ServiceFactory } from 'services/index';
import { useBranches } from 'providers/branchesProvider';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useSnackbar } from 'notistack';
import userServices from 'services/userServices';
import userManagementService from 'services/userManagementService';

const SystemNotification = () => {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [Entity, setEntity] = useState([]);

    const entityType = [
        { value: 1, title: 'Company' },
        { value: 2, title: 'Brand' },
        { value: 3, title: 'Branch' }
    ];
    const formik = useFormik({
        initialValues: {
            entityId: 0,
            entityTypeId: 0,
            notificationTitle: '',
            notificationMessage: '',
            notificationTitleNative: '',
            notificationMessageNative: '',
            comments: '',
            isStickyNotification: false
        },

        // Validation schema using Yup
        validationSchema: Yup.object({
            entityId: Yup.number().required('Entity ID is required'),
            entityTypeId: Yup.number().required('Entity Type ID is required'),
            notificationTitle: Yup.string().required('Notification title is required'),
            notificationTitleNative: Yup.string(),
            notificationMessage: Yup.string().required('Notification message is required'),
            notificationMessageNative: Yup.string(),
            comments: Yup.string()
        }),

        // Submit handler
        onSubmit: (values) => {
            console.log('Form Submitted:', values);
            // Handle form submission logic here, e.g., API call
            submitForm();
        }
    });

    const submitForm = async () => {
        console.log(formik.values);
        try {
            const response = await userServices.createSystemNotifications(formik.values);
            if (response) {
                console.log(response);
                formik.resetForm();
                enqueueSnackbar('Notification Sent', {
                    variant: 'success'
                });
            }
        } catch (error) {
            enqueueSnackbar(err.response.data.error.message, {
                variant: 'error'
            });
            console.log(error);
        }
    };

    const handleEntityTypeChange = (event) => {
        formik.setFieldValue('entityTypeId', event.target.value);
        formik.setFieldValue('entityId', 0);
        getDesiredEntity(event.target.value);
    };


    const getDesiredEntity = async (type) => {
        try {
            let response = null;
            if (type == 1) {
                response = await userManagementService.GetAllCompaniesUM();
            } else if (type == 2) {
                response = await userManagementService.GetBrandsForCurrentUserUM();
            } else if (type == 3) {
                response = await userManagementService.GetBranchesForCurrentUserUM();
            }
            if (response) {
                setEntity(response.data.result);
                return response.data.result;
            }
        } catch (error) {
            console.error('Error fetching user roles', error);
        }
    };

    return (
        <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography fontSize={22} fontWeight={700}>
                                Create Notifications
                            </Typography>
                            <Grid container spacing={2} marginTop={1}>
                                {/* Entity Type ID (Select) */}
                                <Grid item xs={6}>
                                    <FormControl fullWidth margin="dense" required>
                                        <InputLabel id="entityTypeId-label">Entity Type ID</InputLabel>
                                        <Select
                                            labelId="entityTypeId-label"
                                            id="entityTypeId"
                                            name="entityTypeId"
                                            value={formik.values.entityTypeId}
                                            onChange={handleEntityTypeChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.entityTypeId && Boolean(formik.errors.entityTypeId)}
                                        >
                                            {entityType.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.title}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {formik.touched.entityTypeId && formik.errors.entityTypeId && (
                                            <Typography color="error" variant="caption">
                                                {formik.errors.entityTypeId}
                                            </Typography>
                                        )}
                                    </FormControl>
                                </Grid>
                                {/* Entity ID */}
                                <Grid item xs={6}>
                                    <FormControl fullWidth margin="dense" required>
                                        <InputLabel id="entityTypeId-label">Entity</InputLabel>
                                        <Select
                                            labelId="entityId"
                                            id="entityId"
                                            name="entityId"
                                            value={formik.values.entityId}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.entityId && Boolean(formik.errors.entityId)}
                                        >
                                            {Entity.map((option) => (
                                                <MenuItem key={option.id} value={option.id}>
                                                    {option.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {formik.touched.entityId && formik.errors.entityId && (
                                            <Typography color="error" variant="caption">
                                                {formik.errors.entityId}
                                            </Typography>
                                        )}
                                    </FormControl>
                                </Grid>

                                {/* Notification Title */}
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        required
                                        margin="dense"
                                        id="notificationTitle"
                                        name="notificationTitle"
                                        label="Notification Title"
                                        type="text"
                                        value={formik.values.notificationTitle}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.notificationTitle && Boolean(formik.errors.notificationTitle)}
                                        helperText={formik.touched.notificationTitle && formik.errors.notificationTitle}
                                    />
                                </Grid>

                                {/* Notification Native Title */}
                                {/* <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        required
                                        margin="dense"
                                        id="notificationTitleNative"
                                        name="notificationTitleNative"
                                        label="Notification Native Title"
                                        type="text"
                                        value={formik.values.notificationTitleNative}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.notificationTitleNative && Boolean(formik.errors.notificationTitleNative)}
                                        helperText={formik.touched.notificationTitleNative && formik.errors.notificationTitleNative}
                                    />
                                </Grid> */}
                                {/* Notification Message */}
                                <Grid item xs={6}>
                                    <TextField
                                        id="notificationMessage"
                                        label="Notification Message"
                                        multiline
                                        fullWidth
                                        rows={4}
                                        value={formik.values.notificationMessage}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.notificationMessage && Boolean(formik.errors.notificationMessage)}
                                        helperText={formik.touched.notificationMessage && formik.errors.notificationMessage}
                                    />
                                </Grid>

                                {/* Notification Message Native */}
                                {/* <Grid item xs={6}>
                                    <TextField
                                        id="notificationMessageNative"
                                        label="Notification Message Native"
                                        multiline
                                        fullWidth
                                        rows={4}
                                        value={formik.values.notificationMessageNative}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.notificationMessageNative && Boolean(formik.errors.notificationMessageNative)}
                                        helperText={formik.touched.notificationMessageNative && formik.errors.notificationMessageNative}
                                    />
                                </Grid> */}
                                {/* Is Sticky Notification Toggle */}
                                <Grid item xs={6}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={formik.values.isStickyNotification}
                                                onChange={formik.handleChange}
                                                name="isStickyNotification"
                                                color="primary"
                                            />
                                        }
                                        label="Sticky Notification"
                                    />
                                </Grid>

                                {/* Comments  */}
                                {/* <Grid item xs={6}>
                                    <TextField
                                        id="comments"
                                        label="Comments"
                                        multiline
                                        fullWidth
                                        rows={4}
                                        value={formik.values.comments}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.comments && Boolean(formik.errors.comments)}
                                        helperText={formik.touched.comments && formik.errors.comments}
                                    />
                                </Grid> */}
                            </Grid>
                        </CardContent>
                        <CardActions>
                            <Button type="submit" variant="contained" color="primary">
                                Submit
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>
        </form>
    );
};

export default SystemNotification;
