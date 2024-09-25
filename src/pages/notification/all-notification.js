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
    Modal
} from '@mui/material';

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
                <Typography id="modal-modal-title" fontWeight={700} variant="h6" component="h2">
                    {content?.heading || ''}
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
                </Typography>
            </Box>
        </Modal>
    );
};
const AllNotification = () => {
    const [notifications, setNotifications] = useState([
        {
            heading: 'Notication Heading ',
            notifcationContent: 'Notification Content'
        },
        {
            heading: 'Notication Heading2 ',
            notifcationContent: 'Notification Content'
        },
        {
            heading: 'Notication Heading3 ',
            notifcationContent: 'Notification Content'
        },
        {
            heading: 'Notication Heading4 ',
            notifcationContent: 'Notification Content'
        },
        {
            heading: 'Notication Heading ',
            notifcationContent: 'Notification Content'
        },
        {
            heading: 'Notication Heading5 ',
            notifcationContent: 'Notification Content'
        },
        {
            heading: 'Notication Heading6 ',
            notifcationContent: 'Notification Content'
        },
        {
            heading: 'Notication Heading7 ',
            notifcationContent: 'Notification Content'
        },
        {
            heading: 'Notication Heading8 ',
            notifcationContent: 'Notification Content'
        },
        {
            heading: 'Notication Heading9 ',
            notifcationContent: 'Notification Content'
        }
    ]);
    const [notification, setNotification] = useState();
    const [open, setOpen] = React.useState(false);

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
                                {notifications.map((e, index) => {
                                    return (
                                        <>
                                        <ListItemButton key={index} onClick={() => onNotificationClick(e)}>
                                            <ListItem alignItems="flex-start">
                                                <ListItemText
                                                    primary="Brunch this weekend?"
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
                                                            {"  I'll be in your neighborhood doing errands this…"}
                                                        </React.Fragment>
                                                    }
                                                />
                                            </ListItem>
                                            <ListItemSecondaryAction>
                                                <Typography variant="caption" noWrap>
                                                    6m ago
                                                </Typography>
                                            </ListItemSecondaryAction>
                                            
                                        </ListItemButton>
                                        <Divider />
                                        </>
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
