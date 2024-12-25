import React, { useRef, useState, useEffect, useMemo } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Avatar,
    Badge,
    Box,
    ClickAwayListener,
    Divider,
    IconButton,
    List,
    ListItemButton,
    ListItemAvatar,
    ListItemText,
    ListItemSecondaryAction,
    Paper,
    Popper,
    Typography,
    useMediaQuery
} from '@mui/material';
import userServices from 'services/userServices';
// project import
import MainCard from 'components/MainCard';
import Transitions from 'components/@extended/Transitions';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import MembershipPopup from '../notification-popup';
// assets
import { BellOutlined, CloseOutlined, GiftOutlined, MessageOutlined, SettingOutlined } from '@ant-design/icons';

// sx styles
const avatarSX = {
    width: 36,
    height: 36,
    fontSize: '1rem'
};

const actionSX = {
    mt: '6px',
    ml: 1,
    top: 'auto',
    right: 'auto',
    alignSelf: 'flex-start',

    transform: 'none'
};

// ==============================|| HEADER CONTENT - NOTIFICATION ||============================== //

const Notification = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const matchesXs = useMediaQuery(theme.breakpoints.down('md'));
    const [cookies, setCookie] = useCookies();
    const userId = cookies['userId'];
    const [notificationCount, setnotificationCount] = useState(0);
    const getNotifications = async () => {
        const response = await userServices.getSystemNotifications(userId);
        if (response) {
            const noOfNotification = response.data.result.filter((e) => !e.isRead).length ?? 0;
            setnotificationCount(noOfNotification);
            response.data.result.slice(0, 4);
            setNotifications(response.data.result);
            // setNotifications([
            //     {
            //         id: 1,
            //         notificationTypeId: 1,
            //         receiverId: 101,
            //         receiverName: 'John Doe',
            //         notificationMessage: 'Your order has been shipped.',
            //         notificationMessageNative: 'Su pedido ha sido enviado.',
            //         creationTime: '2024-10-08T04:35:05.711Z',
            //         isSent: true,
            //         sentTime: '2024-10-08T04:35:05.711Z',
            //         isAdminNotification: false,
            //         isRead: false
            //     },
            //     {
            //         id: 2,
            //         notificationTypeId: 2,
            //         receiverId: 102,
            //         receiverName: 'Jane Smith',
            //         notificationMessage: 'Your account has been activated.',
            //         notificationMessageNative: 'Su cuenta ha sido activada.',
            //         creationTime: '2024-10-07T11:20:30.111Z',
            //         isSent: true,
            //         sentTime: '2024-10-07T11:25:45.711Z',
            //         isAdminNotification: true,
            //         isRead: true
            //     },
            //     {
            //         id: 3,
            //         notificationTypeId: 3,
            //         receiverId: 103,
            //         receiverName: 'Michael Brown',
            //         notificationMessage: 'Your password has been reset.',
            //         notificationMessageNative: 'Tu contraseña ha sido restablecida.',
            //         creationTime: '2024-10-06T14:45:20.611Z',
            //         isSent: true,
            //         sentTime: '2024-10-06T14:50:10.711Z',
            //         isAdminNotification: false,
            //         isRead: true
            //     },
            //     {
            //         id: 4,
            //         notificationTypeId: 1,
            //         receiverId: 104,
            //         receiverName: 'Emily Davis',
            //         notificationMessage: 'A new promotion is available.',
            //         notificationMessageNative: 'Una nueva promoción está disponible.',
            //         creationTime: '2024-10-05T09:10:00.511Z',
            //         isSent: true,
            //         sentTime: '2024-10-05T09:15:30.711Z',
            //         isAdminNotification: false,
            //         isRead: false
            //     },
            //     {
            //         id: 5,
            //         notificationTypeId: 2,
            //         receiverId: 105,
            //         receiverName: 'Chris Johnson',
            //         notificationMessage: 'Your subscription has been renewed.',
            //         notificationMessageNative: 'Su suscripción ha sido renovada.',
            //         creationTime: '2024-10-04T16:00:50.411Z',
            //         isSent: true,
            //         sentTime: '2024-10-04T16:05:00.711Z',
            //         isAdminNotification: true,
            //         isRead: true
            //     }
            // ]);
        }
    };
    useEffect(() => {
        getNotifications();
    }, []);
    useEffect(() => {}, [notificationCount]);
    const anchorRef = useRef(null);
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
        ReadNotifications();
    };
    const ReadNotifications = async () => {
        try {
            const unreadNotifications = notifications.filter((e) => !e.isRead);
            await Promise.all(unreadNotifications.map((notification) => userServices.updateReadNotification(notification.id, userId)));
            // All notifications are updated
        } catch (error) {
            console.error('Error updating notifications:', error);
        }
        getNotifications();
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };
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

    const iconBackColorOpen = 'grey.300';
    const iconBackColor = 'grey.100';

    return (
        <Box sx={{ flexShrink: 0, ml: 0.75 }}>
            <IconButton
                disableRipple
                color="secondary"
                sx={{ color: 'text.primary' }}
                aria-label="open profile"
                ref={anchorRef}
                aria-controls={open ? 'profile-grow' : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
            >
                <Badge badgeContent={notificationCount} color="primary">
                    <BellOutlined />
                </Badge>
            </IconButton>
            {notifications.length > 0 &&
                notifications
                    .filter((e) => e.isStickyNotification)
                    .slice(0, 4)
                    .map((item, index) => (
                        <MembershipPopup key={index} notification={item} userId={userId} getNotification={getNotifications} />
                    ))}
            <Popper
                placement={matchesXs ? 'bottom' : 'bottom-end'}
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                popperOptions={{
                    modifiers: [
                        {
                            name: 'offset',
                            options: {
                                offset: [matchesXs ? -5 : 0, 9]
                            }
                        }
                    ]
                }}
            >
                {({ TransitionProps }) => (
                    <Transitions type="fade" in={open} {...TransitionProps}>
                        <Paper
                            sx={{
                                boxShadow: theme.customShadows.z1,
                                width: '100%',
                                minWidth: 285,
                                maxWidth: 420,
                                [theme.breakpoints.down('md')]: {
                                    maxWidth: 285
                                }
                            }}
                        >
                            <ClickAwayListener onClickAway={handleClose}>
                                <MainCard
                                    title="Notification"
                                    elevation={0}
                                    border={false}
                                    content={false}
                                    secondary={
                                        <IconButton size="small" onClick={handleToggle}>
                                            <CloseOutlined />
                                        </IconButton>
                                    }
                                >
                                    <List
                                        component="nav"
                                        sx={{
                                            p: 0,
                                            '& .MuiListItemButton-root': {
                                                py: 0.5,
                                                '& .MuiAvatar-root': avatarSX,
                                                '& .MuiListItemSecondaryAction-root': { ...actionSX, position: 'relative' }
                                            }
                                        }}
                                    >
                                        {notifications.length > 0 ? (
                                            notifications
                                                .filter((e) => !e.isStickyNotification)
                                                .slice(0, 4)
                                                .map((item) => (
                                                    <React.Fragment key={item.id}>
                                                        {/* Ensure to use a unique key for each item */}
                                                        <ListItemButton onClick={() => navigate('/all-notifications')}>
                                                            <ListItemText
                                                                primary={
                                                                    <Typography variant="h6">
                                                                        <Typography component="span" variant="subtitle1">
                                                                            {item.notificationTitle}
                                                                        </Typography>
                                                                    </Typography>
                                                                }
                                                                secondary={item.notificationMessage}
                                                            />
                                                            <ListItemSecondaryAction>
                                                                <Typography variant="caption" noWrap>
                                                                    {getRelativeTime(new Date(item.creationTime))}
                                                                </Typography>
                                                            </ListItemSecondaryAction>
                                                        </ListItemButton>
                                                        <Divider />
                                                    </React.Fragment>
                                                ))
                                        ) : (
                                            <Typography variant="body1" sx={{ textAlign: 'center', mt: 2 }}>
                                                No Notifications
                                            </Typography>
                                        )}

                                        <ListItemButton
                                            onClick={() => navigate('/all-notifications')}
                                            sx={{ textAlign: 'center', py: `${12}px !important` }}
                                        >
                                            <ListItemText
                                                primary={
                                                    <Typography variant="h6" color="primary">
                                                        View All
                                                    </Typography>
                                                }
                                            />
                                        </ListItemButton>
                                    </List>
                                </MainCard>
                            </ClickAwayListener>
                        </Paper>
                    </Transitions>
                )}
            </Popper>
        </Box>
    );
};

export default Notification;
