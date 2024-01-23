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

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { CloudUploadOutlined } from '@ant-design/icons';
import { ServiceFactory } from 'services/index';
import constants from 'helper/constants';
import { useParams } from '../../../node_modules/react-router-dom/dist/index';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '70%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 1,
    overflow: 'scroll'
};

const UpdateCreditBalance = ({ modalOpen, setModalOpen, setReload, prevData }) => {
    const [data, setData] = useState({
        creditBalance: 0,
        expiryDate: '',
        commnets: ''
    });
    const { cid } = useParams();
    const customerServices = ServiceFactory.get('customer');

    useEffect(() => {}, []);

    useEffect(() => {
        setData({
            ...data,
            creditBalance: prevData?.creditBalance,
            expiryDate: prevData?.expiryDate,
            commnets: prevData?.commnets
        });
    }, [prevData]);

    const UpdateCreditBalance = async (event) => {
        event.preventDefault();

        let payload = {
            ...data,
            id: prevData?.id,
            increaseBalanceAmount: data.creditBalance,
            expiryDate: data.expiryDate,
            walletComments: data.commnets,
            brandId: +prevData.brandId,
            customerId: +cid
        };

        await customerServices
            .UpdateCreditBalance(payload)
            .then((res) => {
                console.log(res?.data);
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setReload((prev) => !prev);
                setModalOpen(false);
            });
    };

    return (
        <Modal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <form onSubmit={UpdateCreditBalance}>
                <Box sx={style}>
                    <Grid container spacing={4}>
                        <Grid item>
                            <Typography variant="h4">Update Credit Balance</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container spacing={2}>
                                <Grid item xs={4}>
                                    <TextField
                                        id="outlined-basic"
                                        fullWidth
                                        label="Credit Balance"
                                        variant="outlined"
                                        required
                                        value={data.creditBalance}
                                        onChange={(e) => setData({ ...data, creditBalance: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            label="Credit Balance Expiry"
                                            value={data.expiryDate}
                                            onChange={(newValue) => {
                                                setData({
                                                    ...data,
                                                    expiryDate: newValue
                                                });
                                            }}
                                            renderInput={(params) => <TextField fullWidth {...params} />}
                                        />
                                    </LocalizationProvider>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container spacing={2}></Grid>
                        </Grid>

                        <Grid item xs={12}>
                            <Grid container spacing={2}>
                                {/* <Grid item xs={4}>
                <TextField id="outlined-basic" fullWidth label="Password" type="password" variant="outlined" required 
                  value={data.password}
                  onChange={(e) => setData({ ...data, password: e.target.value })}
                />
              </Grid> */}
                                <Grid item xs={12}>
                                    <TextField
                                        id="outlined-multiline-flexible"
                                        label="commnets"
                                        fullWidth
                                        multiline
                                        rows={4}
                                        InputProps={{
                                            readOnly: false
                                        }}
                                        variant="outlined"
                                        value={data?.commnets}
                                        onChange={(e) => setData({ ...data, commnets: e.target.value })}
                                    />
                                    {/* <TextField id="outlined-basic" fullWidth label="Wallet Subtitle" variant="outlined" /> */}
                                </Grid>
                            </Grid>
                        </Grid>

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
                                        <Button primay variant="contained" type="Submit">
                                            Update Customer
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

export default UpdateCreditBalance;
