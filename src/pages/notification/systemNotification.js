import React, { useState } from 'react';
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
  FormControlLabel,
  Box
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import userServices from 'services/userServices';
import userManagementService from 'services/userManagementService';

const SystemNotification = () => {
  const { enqueueSnackbar } = useSnackbar();
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
    validationSchema: Yup.object({
      entityId: Yup.number().required('Entity ID is required'),
      entityTypeId: Yup.number().required('Entity Type ID is required'),
      notificationTitle: Yup.string().required('Notification title is required'),
      notificationMessage: Yup.string().required('Notification message is required')
    }),
    onSubmit: () => {
      submitForm();
    }
  });

  const submitForm = async () => {
    try {
      const response = await userServices.createSystemNotifications(formik.values);
      if (response) {
        formik.resetForm();
        enqueueSnackbar('Notification Sent', { variant: 'success' });
      }
    } catch (error) {
      enqueueSnackbar('Error sending notification', { variant: 'error' });
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
      if (type === 1) response = await userManagementService.GetAllCompaniesUM();
      else if (type === 2) response = await userManagementService.GetBrandsForCurrentUserUM();
      else if (type === 3) response = await userManagementService.GetBranchesForCurrentUserUM();

      if (response) setEntity(response.data.result);
    } catch (error) {
      console.error('Error fetching entities', error);
    }
  };

  return (
    <Box component="form" onSubmit={formik.handleSubmit} sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card
            variant="outlined"
            sx={{
              borderRadius: 2,
              boxShadow: 2,
              borderColor: 'divider'
            }}
          >
            <CardContent>
              <Typography fontSize={22} fontWeight={700} mb={2}>
                Create Notifications
              </Typography>

              <Grid container spacing={2}>
                {/* Entity Type */}
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="entityTypeId-label">Entity Type</InputLabel>
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

                {/* Entity */}
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="entityId-label">Entity</InputLabel>
                    <Select
                      labelId="entityId-label"
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
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    size="small"
                    id="notificationTitle"
                    name="notificationTitle"
                    label="Notification Title"
                    value={formik.values.notificationTitle}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.notificationTitle && Boolean(formik.errors.notificationTitle)}
                    helperText={formik.touched.notificationTitle && formik.errors.notificationTitle}
                  />
                </Grid>

                {/* Notification Message */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    size="small"
                    id="notificationMessage"
                    name="notificationMessage"
                    label="Notification Message"
     
                    value={formik.values.notificationMessage}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.notificationMessage && Boolean(formik.errors.notificationMessage)}
                    helperText={formik.touched.notificationMessage && formik.errors.notificationMessage}
                  />
                </Grid>

                {/* Sticky Toggle */}
                <Grid item xs={12} md={6}>
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
              </Grid>
            </CardContent>

            <CardActions sx={{ px: 2, pb: 2 }}>
              <Button type="submit" variant="contained" color="primary">
                Submit
              </Button>
              <Button type="reset" variant="outlined" color="secondary" onClick={() => formik.resetForm()}>
                Reset
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SystemNotification;
