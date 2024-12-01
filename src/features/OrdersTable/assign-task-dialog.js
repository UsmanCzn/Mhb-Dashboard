import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, Typography, Box, Button, IconButton, LinearProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import orderServices from 'services/orderServices';

const AssignTaskDialog = ({ open, onClose, onAssignTask, selectedOrder }) => {
    const [fareDetails, setFareDetails] = useState();
    const [loading, setloading] = useState(false);

    useEffect(() => {
        if (open) {
            getFaresDetails();
        }
    }, [open]);

    const AssignTaskDialog = () => {
        setloading(true);
        try {
            const resp = orderServices.assignDeliveryTask(selectedOrder?.id);
            if (resp) {
                setloading(false);
                onAssignTask();
            }
        } catch (error) {
            setloading(false);
        }
    };
    const getFaresDetails = async () => {
        setloading(true);
        try {
            const resp = await orderServices.getFaresDetails(selectedOrder.id);
            // Mock example for fare details:
            console.log(resp, 'faresss');

            if (resp) {
                setloading(false);
                setFareDetails(resp.data.result || {});
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    padding: 2,
                    textAlign: 'center'
                }
            }}
        >
            {loading && <LinearProgress />}

            <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'flex-end' }}>
                <IconButton onClick={onClose} sx={{ position: 'absolute', top: 0, right: 0 }}>
                    <CloseIcon />
                </IconButton>
            </Box>
            <DialogContent>
                <Box
                    sx={{
                        width: 50,
                        height: 50,
                        borderRadius: '50%',
                        margin: '0 auto',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 2
                    }}
                >
                    <img src={'https://tryverdi.com/frontend/images/Logo_Black.png'} alt="wordy" style={{ width: '100px' }} />
                </Box>

                {/* <Typography variant="h5" fontWeight="bold" marginBottom={1}>
                    {fareDetails?.fare} KWD
                </Typography> */}

                <Typography variant="h6" fontWeight="bold" marginBottom={1}>
                    Confirmation!
                </Typography>
                <Typography variant="body2" color="textSecondary" marginBottom={2}>
                    Are you sure you want to assign the delivery task to Wordy?
                </Typography>

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 2
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AttachMoneyIcon sx={{ marginRight: 1, fontSize: 20 }} />
                        <Typography variant="h5" fontWeight="bold">
                            {fareDetails?.fare} KWD
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AccessTimeIcon sx={{ marginRight: 1, fontSize: 20 }} />
                        <Typography variant="h5" fontWeight="bold">
                            {fareDetails?.deliveryETA} Min
                        </Typography>
                    </Box>
                </Box>

                {/* Progress Bar */}

                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{
                        backgroundColor: '#000',
                        color: '#fff',
                        padding: 1.5,
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        borderRadius: 2,
                        '&:hover': {
                            backgroundColor: '#333'
                        }
                    }}
                    onClick={AssignTaskDialog}
                >
                    Assign Task
                </Button>
            </DialogContent>
        </Dialog>
    );
};

export default AssignTaskDialog;
