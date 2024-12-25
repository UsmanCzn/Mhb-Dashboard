import React, { useState } from 'react';
import { Box, Typography, IconButton, Paper, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import userServices from 'services/userServices';
const MembershipPopup = ({ notification, userId, getNotification }) => {
    const [showPopup, setShowPopup] = useState(!notification.isRead ?? false);

    const handleClose = () => {
        ReadNotifications();
        setShowPopup(false);
    };

    const ReadNotifications = async () => {
        try {
            const resp = await userServices.updateReadNotification(notification?.id, userId);
            // All notifications are updated
        } catch (error) {
            console.error('Error updating notifications:', error);
        }
        getNotification();
    };

    return (
        <>
            {showPopup && (
                <Paper
                    elevation={5}
                    sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        maxWidth: 300,
                        p: 2,
                        borderRadius: 2,
                        boxShadow: 4,
                        zIndex: 9999
                    }}
                >
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6" fontWeight="bold">
                            {notification?.notificationTitle}
                        </Typography>
                        <IconButton size="small" onClick={handleClose}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <Typography variant="body2" sx={{ mt: 1, mb: 2 }}>
                        {notification?.notificationMessage}
                    </Typography>
                    {/* <Button variant="contained" color="primary" fullWidth>
                        Renew Now
                    </Button> */}
                </Paper>
            )}
        </>
    );
};

export default MembershipPopup;
