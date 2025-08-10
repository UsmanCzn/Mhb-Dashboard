import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import { Box, Typography } from '@mui/material';

const ConfirmationModal = ({ open, onClose, onConfirm, statement }) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    minWidth: 350
                }
            }}
        >
            <Box display="flex" flexDirection="column" alignItems="center" pt={3}>
                <WarningAmberRoundedIcon color="warning" sx={{ fontSize: 44 }} />
                <DialogTitle sx={{ textAlign: 'center', fontWeight: 700, fontSize: 22, p: 0, mt: 1 }}>Confirmation</DialogTitle>
            </Box>
            <DialogContent>
                <DialogContentText sx={{ textAlign: 'center', mt: 1, fontSize: 16 }}>{statement}</DialogContentText>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
                <Button onClick={onClose} variant="outlined" color="inherit" sx={{ borderRadius: 2, textTransform: 'none', px: 3 }}>
                    No
                </Button>
                <Button onClick={onConfirm} variant="contained" color="primary" sx={{ borderRadius: 2, textTransform: 'none', px: 3 }}>
                    Yes
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmationModal;
