import React, { useState, useEffect, useMemo } from 'react';
import {
    Grid,
    Typography,
    Button,
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Avatar,
    Card,
    List,
    ListItem,
    Divider,
    ListItemText,
    ListItemSecondaryAction,
    ListItemButton,
    Modal,
    IconButton
} from '@mui/material';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import userServices from 'services/userServices';
import CloseIcon from '@mui/icons-material/Close'; // Import the Close Icon

const NotificationModal = ({ open, setOpen, content }) => {
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #fff',
        borderRadius: '10px',
        boxShadow: 24,
        p: 4
    };

    return (
        <Modal open={open} onClose={() => setOpen(false)} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
            <Box sx={style}>
                {/* Close Button at the Top-Right */}
                <IconButton
                    onClick={() => setOpen(false)}
                    sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        color: 'gray' // Optional styling for the button color
                    }}
                >
                    <CloseIcon />
                </IconButton>

                <Typography id="modal-modal-title" fontWeight={700} variant="h6" component="h2">
                    {content?.notificationTitle || ''}
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    {content?.notificationMessage || ''}
                </Typography>
            </Box>
        </Modal>
    );
};
const AllNotification = () => {
    const [notifications, setNotifications] = useState([]);
    const [notification, setNotification] = useState();
    const [open, setOpen] = React.useState(false);
    const [cookies, setCookie] = useCookies();
    const [notificationCount, setnotificationCount] = useState(0);
    const userId = cookies['userId'];
    const getNotifications = async () => {
        const response = await userServices.getSystemNotifications(userId);
        if (response) {
            const noOfNotification = response.data.result.filter((e) => !e.isRead).length ?? 0;
            setnotificationCount(noOfNotification);

            setNotifications(response.data.result);
        }
    };
    useEffect(() => {
        getNotifications();
    }, []);
    const getRelativeTime = (date) => {
        const now = new Date();
        const elapsed = now.getTime() - date.getTime();

        const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

        const units = [
            { unit: 'year', ms: 1000 * 60 * 60 * 24 * 365 },
            { unit: 'month', ms: 1000 * 60 * 60 * 24 * 30 },
            { unit: 'day', ms: 1000 * 60 * 60 * 24 },
            { unit: 'hour', ms: 1000 * 60 * 60 },
            { unit: 'minute', ms: 1000 * 60 },
            { unit: 'second', ms: 1000 }
        ];

        for (const { unit, ms } of units) {
            const value = Math.floor(elapsed / ms);
            if (value !== 0) {
                return rtf.format(-value, unit);
            }
        }
        return 'just now';
    };
    const onNotificationClick = (notification) => {
        setOpen((prev) => !prev);
        setNotification(notification);
    };
    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Grid container alignItems="center">
                        <Grid item xs={'auto'}>
                            <Typography fontSize={22} fontWeight={700}>
                                All Notifications
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Card raised={true} sx={{ padding: '20px' }}>
                        <Box sx={{ width: '100%', height: 400, overflowY: 'auto', bgcolor: 'background.paper' }}>
                            <List>
                                {notifications?.map((e, index) => {
                                    return (
                                        <React.Fragment key={index}>
                                            <ListItemButton onClick={() => onNotificationClick(e)}>
                                                <ListItem alignItems="flex-start">
                                                    <ListItemText
                                                        primary={e.notificationTitle}
                                                        primaryTypographyProps={{ fontWeight: '700' }}
                                                        secondary={
                                                            <React.Fragment>
                                                                {/* <Typography
                                                        component="span"
                                                        variant="body2"
                                                        sx={{ color: 'text.primary', display: 'inline' }}
                                                    >
                                                        Ali Connors
                                                    </Typography> */}
                                                                {e.notificationMessage}
                                                            </React.Fragment>
                                                        }
                                                    />
                                                </ListItem>
                                                <ListItemSecondaryAction>
                                                    <Typography variant="caption" noWrap>
                                                        {getRelativeTime(new Date(e.creationTime))}
                                                    </Typography>
                                                </ListItemSecondaryAction>
                                            </ListItemButton>
                                            <Divider />
                                        </React.Fragment>
                                    );
                                })}
                            </List>
                        </Box>
                    </Card>
                </Grid>
            </Grid>
            <NotificationModal open={open} setOpen={setOpen} content={notification} />
        </>
    );
};

export default AllNotification;
