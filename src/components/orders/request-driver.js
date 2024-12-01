import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Card,
    CardContent,
    CardActions,
    Radio,
    RadioGroup,
    FormControlLabel,
    Box
} from '@mui/material';
import { DirectionsCar, AccessTime, AttachMoney } from '@mui/icons-material';

const RequestDriverDialog = ({ open, onClose }) => {
    const driverOptions = [
        {
            name: 'Wordy',
            distance: '1.2 KM Away',
            time: '25-35 min',
            price: '0.000 KD',
            icon: <DirectionsCar />
        },
        {
            name: 'ShipIt',
            distance: '3.0 KM Away',
            time: '40-50 min',
            price: '1.800 KD',
            icon: <DirectionsCar />
        },
        {
            name: 'Quick Delivery',
            distance: '0.3 KM Away',
            time: '20-30 min',
            price: '0.750 KD',
            icon: <DirectionsCar />
        }
    ];

    const [selectedDriver, setSelectedDriver] = useState('');

    const handleSelect = (event) => {
        setSelectedDriver(event.target.value);
    };

    const handleConfirm = () => {
        onClose(selectedDriver);
        setSelectedDriver('');
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            {/* Dialog Header */}
            <DialogTitle>
                <Typography variant="h5" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                    Request A Driver
                </Typography>
            </DialogTitle>

            {/* Dialog Content */}
            <DialogContent>
                <RadioGroup value={selectedDriver} onChange={handleSelect}>
                    <Box display="flex" flexDirection="column" gap={2}>
                        {driverOptions.map((option, index) => (
                            <Card
                                key={index}
                                variant="outlined"
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: 2,
                                    boxShadow: selectedDriver === option.name ? '0 4px 20px rgba(0, 0, 0, 0.2)' : 'none',
                                    borderColor: selectedDriver === option.name ? 'primary.main' : 'grey.300'
                                }}
                            >
                                {/* Left Section */}
                                <Box display="flex" alignItems="center" gap={2}>
                                    {option.icon}
                                    <Box>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                            {option.name}
                                        </Typography>
                                        <Typography variant="body2">
                                            {option.distance} | {option.time}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                            {option.price}
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* Right Section */}
                                <FormControlLabel value={option.name} control={<Radio />} label="" sx={{ marginRight: 0 }} />
                            </Card>
                        ))}
                    </Box>
                </RadioGroup>
            </DialogContent>

            {/* Dialog Actions */}
            <DialogActions sx={{ justifyContent: 'space-between' }}>
                <Button onClick={onClose} color="secondary">
                    Cancel
                </Button>
                <Button onClick={handleConfirm} variant="contained" color="primary">
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default RequestDriverDialog;
