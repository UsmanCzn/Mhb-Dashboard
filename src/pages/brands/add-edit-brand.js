import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import { TextField, MenuItem, Button, Grid, Typography, Box, Tabs, Tab, AppBar, Card } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

const FormComponent = () => {
    const initialValues = {
        brandName: '',
        companyNameNative: '',
        company: '',
        secondaryLanguage: '',
        phoneNumber: '',
        emailAddress: '',
        currency: '',
        currencyDecimal: '',
        reportInterval: '',
        brandTimeZone: '',
        walletSubtitle: '',
        walletSubtitleNative: '',
        points: '',
        initialCustomerBalance: '',
        initialCreditBalance: '',
        initialCreditBalanceExpiry: null
    };
    const [tabValue, setTabValue] = useState(0);
    const [dateValue, setDateValue] = useState(new Date());

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <Card>
            <Formik
                initialValues={initialValues}
                onSubmit={(values) => {
                    console.log('Form data', values);
                }}
            >
                {({ values, handleChange }) => (
                    <Form>
                        <Box sx={{ flexGrow: 1 }}>
                            <Tabs value={tabValue} onChange={handleTabChange} aria-label="basic tabs example">
                                <Tab label="Basic Info" />
                                <Tab label="Rewards" />
                                <Tab label="Settings" />
                                <Tab label="Social Links" />
                                <Tab label="Logo" />
                            </Tabs>

                            <TabPanel value={tabValue} index={0}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            as={TextField}
                                            name="brandName"
                                            label="Brand Name"
                                            fullWidth
                                            variant="outlined"
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            as={TextField}
                                            name="companyNameNative"
                                            label="Company Name (Native)"
                                            fullWidth
                                            variant="outlined"
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            as={TextField}
                                            name="company"
                                            label="Company"
                                            select
                                            fullWidth
                                            variant="outlined"
                                            onChange={handleChange}
                                        >
                                            <MenuItem value="company1">Company 1</MenuItem>
                                            <MenuItem value="company2">Company 2</MenuItem>
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
                                        >
                                            <MenuItem value="english">English</MenuItem>
                                            <MenuItem value="spanish">Spanish</MenuItem>
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
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            as={TextField}
                                            name="currency"
                                            label="Currency"
                                            select
                                            fullWidth
                                            variant="outlined"
                                            onChange={handleChange}
                                        >
                                            <MenuItem value="usd">USD</MenuItem>
                                            <MenuItem value="eur">EUR</MenuItem>
                                        </Field>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            as={TextField}
                                            name="currencyDecimal"
                                            label="Currency Decimal"
                                            fullWidth
                                            variant="outlined"
                                            onChange={handleChange}
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
                                        >
                                            <MenuItem value="daily">Daily</MenuItem>
                                            <MenuItem value="weekly">Weekly</MenuItem>
                                        </Field>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            as={TextField}
                                            name="brandTimeZone"
                                            label="Brand Time Zone"
                                            select
                                            fullWidth
                                            variant="outlined"
                                            onChange={handleChange}
                                        >
                                            <MenuItem value="pst">PST</MenuItem>
                                            <MenuItem value="est">EST</MenuItem>
                                        </Field>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button type="submit" variant="contained" color="primary">
                                            Next
                                        </Button>
                                    </Grid>
                                </Grid>
                            </TabPanel>
                            <TabPanel value={tabValue} index={1}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            as={TextField}
                                            name="walletSubtitle"
                                            label="Wallet Subtitle"
                                            fullWidth
                                            variant="outlined"
                                            onChange={handleChange}
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
                                    <Grid item xs={12}>
                                        <Button type="submit" variant="contained" color="primary">
                                            Next
                                        </Button>
                                    </Grid>
                                </Grid>
                            </TabPanel>

                            {/* Add other TabPanel components for the other tabs (Rewards, Settings, etc.) */}
                        </Box>
                    </Form>
                )}
            </Formik>
        </Card>
    );
};

export default FormComponent;
