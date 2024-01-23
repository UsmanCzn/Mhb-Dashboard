import React, { useState, useEffect } from 'react';
import { Grid, Typography, Button, FormControl, InputLabel, Select, MenuItem, TextField, Box } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import UploadFile from '../../components/Upload-File/upload-file';

const AddPaymentMethod = () => {
    const [data, setData] = useState({ method: '', gateway: '', sortOrder: 0 });
    const [PaymentMethods, setPaymentMethods] = useState([]);

    const card = (
        <>
            <CardContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <UploadFile />
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">{'Payment Method'}</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={data?.method}
                                label={'Payment Method'}
                                onChange={(event) => {
                                    setData({ ...data, method: e.target.value });
                                }}
                            >
                                {PaymentMethods.map((row, index) => {
                                    return (
                                        <MenuItem key={index} value={row}>
                                            {row?.name}
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            id="outlined-basic"
                            fullWidth
                            label="Sort Order"
                            variant="outlined"
                            required
                            value={data?.sortOrder}
                            onChange={(e) => setData({ ...data, sortOrder: e.target.value })}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">{'Payment Gateway'}</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={data?.gateway}
                                label={'Payment Gateway'}
                                onChange={(event) => {
                                    setData({ ...data, method: e.target.value });
                                }}
                            >
                                {PaymentMethods.map((row, index) => {
                                    return (
                                        <MenuItem key={index} value={row}>
                                            {row?.name}
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </CardContent>
            <CardActions style={{ justifyContent: 'flex-end' }}>
                <Button size="small" variant="contained">
                    Save
                </Button>
            </CardActions>
        </>
    );
    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Grid item xs="auto">
                    <Typography variant="h4">Add New Payment Methods</Typography>
                </Grid>
                <Grid item>
                    <Card variant="outlined">{card}</Card>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default AddPaymentMethod;
