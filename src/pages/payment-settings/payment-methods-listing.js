import React, { useState, useEffect } from 'react';
import { Grid, Typography, Button, FormControl, InputLabel, Select, MenuItem, TextField, Box } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Switch from '@mui/material/Switch';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import DefaultImg from '../../assets/images/users/default-image.png';
import IconButton from '@mui/material/IconButton';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import ConfirmationModal from '../../components/confirmation-modal';
import paymentServices from 'services/paymentServices';
import { useSnackbar } from 'notistack';
import { ReversedPayementGateWayEnum } from '../../helper/constants';

const PaymentMethodsListing = (props) => {
    console.log(ReversedPayementGateWayEnum);
    const { methods, brand } = props;
    const [PaymentMehtods, setPaymentMehtods] = useState([]);
    const [selectedItem, setSelectedItem] = useState('');
    const navigate = useNavigate();
    const [isConfirmationOpen, setConfirmationOpen] = useState(false);

    const handleOpenConfirmation = (item) => {
        setSelectedItem(item);
        setConfirmationOpen(true);
    };
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const handleCloseConfirmation = () => {
        setConfirmationOpen(false);
    };

    const deletePaymentMethods = async () => {
        try {
            const response = await paymentServices.DeletePayment(selectedItem?.id);
            if (response) {
                enqueueSnackbar('BrandPayment Deleted Successfully', {
                    variant: 'success'
                });
                const tempMethods = PaymentMehtods.filter((ele) => ele.id !== selectedItem?.id);
                setPaymentMehtods(tempMethods);
            }
        } catch (error) {}
    };

    const handleConfirmAction = () => {
        deletePaymentMethods(selectedItem);
        handleCloseConfirmation();
    };
    useEffect(() => {
        const tempMethods = methods.map((ele) => {
            console.log(ele);
            return {
                image: '',
                name: ele?.paymentSystemName,
                paymentGatewayName: ReversedPayementGateWayEnum[brand.defaultPaymentGateway],
                isActive: true,
                id: ele?.id,
                paymentSystemId: ele?.paymentSystemId
            };
        });
        setPaymentMehtods([...tempMethods]);
    }, [methods]);

    const handleToggle = () => {};

    const card = (
        <>
            <CardContent>
                <Grid container spacing={2}>
                    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                        {PaymentMehtods.map((method, index) => {
                            return (
                                <ListItem key={index} alignItems="flex-start">
                                    <Box
                                        sx={{
                                            width: '100%',
                                            padding: '10px',
                                            border: 1,
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            borderColor: '#d9d9d9',
                                            borderRadius: 1
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                            <img
                                                style={{ width: '80px', height: '50px' }}
                                                alt="payment methods"
                                                src={method.image || DefaultImg}
                                            />
                                            <Typography variant="h5" sx={{ color: 'black' }}>
                                                {method.name}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
                                            <Typography variant="h5" sx={{ color: 'black' }}>
                                                {method?.paymentGatewayName}
                                            </Typography>
                                            {/* <Switch edge="end" onChange={handleToggle(event)} checked={method.isActive} /> */}
                                            <IconButton
                                                aria-label="Example"
                                                sx={{ backgroundColor: '#1890ff', color: 'white' }}
                                                onClick={() => {
                                                    navigate(`/payments-settings/providers/${method.id}`);
                                                }}
                                            >
                                                <ModeEditOutlineOutlinedIcon sx={{ cursor: 'pointer' }} />
                                            </IconButton>
                                            <IconButton
                                                sx={{ backgroundColor: '#ff1818', color: 'white' }}
                                                aria-label="Example"
                                                onClick={() => handleOpenConfirmation(method)}
                                            >
                                                <DeleteOutlineOutlinedIcon />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                </ListItem>
                            );
                        })}
                    </List>
                </Grid>
            </CardContent>
            <CardActions style={{ justifyContent: 'flex-end' }}></CardActions>
            <ConfirmationModal
                open={isConfirmationOpen}
                onClose={handleCloseConfirmation}
                onConfirm={handleConfirmAction}
                statement="Are you sure you want to perform this action?"
            />
        </>
    );

    return <Card variant="outlined">{card}</Card>;
};

export default PaymentMethodsListing;
