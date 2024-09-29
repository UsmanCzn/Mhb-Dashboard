import React, { useState, useEffect, useMemo } from 'react';
import {
    Grid,
    Typography,
    Button,
    Box,
    FormControl,
    InputLabel,
    Menu,
    MenuItem,
    Select,
    Avatar,
    Card,
    CardContent,
    TextField,
    CardActions
} from '@mui/material';
import UploadFile from 'components/Upload-File/upload-file';
import { ServiceFactory } from 'services/index';
import { useAuth } from 'providers/authProvider';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TextareaAutosize as BaseTextareaAutosize } from '@mui/base/TextareaAutosize';

const CreateNotification = () => {
    const initialData = {
        brandId: 0,
        ImageUrl: '',
        title: '',
        customerGroups: [],
        date: new Date(),
        description: ''
    };
    const customerService = ServiceFactory.get('customer');
    const [Image, setImage] = useState(null);
    const [customerGroup, setCustomerGroup] = useState([]);
    const [ViewImage, setViewImage] = useState(null);
    const [formData, setFormData] = useState(initialData);
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const getCutsomerGroups = async () => {
        const response = await customerService.GetCustomersGroups();
        if (response) {
            const tempGroup = response.data.result.data.data.filter((group) => group.type === 'Base');
            setCustomerGroup(tempGroup);
        }
    };
    useEffect(() => {
        getCutsomerGroups();
    }, []);
    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography fontSize={22} fontWeight={700}>
                                Create Notifications
                            </Typography>
                            <Grid container spacing={2} marginTop={1}>
                                <Grid item xs={12}>
                                    <UploadFile Image={ViewImage} setImage={setImage} />
                                </Grid>

                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        required
                                        margin="dense"
                                        id="name"
                                        name="Name"
                                        label="Title"
                                        type="text"
                                        value=""
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={6} marginTop={1}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs} localeText={{ start: 'Check-in', end: 'Check-out' }}>
                                        <DatePicker
                                            label="Date"
                                            renderInput={(params) => <TextField fullWidth {...params} error={false} />}
                                            value={formData.date}
                                            onChange={(newValue) => {
                                                setFormData({
                                                    ...formData,
                                                    date: newValue
                                                });
                                            }}
                                        />
                                    </LocalizationProvider>
                                </Grid>
                                <Grid item xs={6}>
                                    <FormControl fullWidth sx={{ mt: 1 }}>
                                        <InputLabel id="demo-simple-select-label">Customer Group</InputLabel>
                                        <Select
                                            fullWidth
                                            margin="dense"
                                            multiple
                                            id="customerGroupId"
                                            name="customerGroupId"
                                            value={formData.customerGroups}
                                            onChange={(e) => {
                                                console.log(e.target.value);
                                                setFormData({ ...formData, customerGroups: e.target.value });
                                            }}
                                        >
                                            {customerGroup.map((group, index) => {
                                                return (
                                                    <MenuItem key={index} value={group.id}>
                                                        {group.name}
                                                    </MenuItem>
                                                );
                                            })}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        id="outlined-multiline-static"
                                        label="Multiline"
                                        multiline
                                        fullWidth
                                        rows={4}
                                        defaultValue="Default Value"
                                    />
                                </Grid>
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
        </>
    );
};

export default CreateNotification;
