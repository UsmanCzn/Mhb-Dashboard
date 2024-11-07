import React from 'react';
import { Dialog, DialogContent, DialogTitle, DialogActions, Card, CardContent, Typography, Button } from '@mui/material';
import moment from 'moment-jalaali';
import membershipService from 'services/membership.service';
import { useSnackbar } from 'notistack';

const BillingDetailsPopup = ({ open, onClose, invoice, getCompanyMembership, getCompanyMembershipInvoices }) => {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const markAsPaid = async () => {
        try {
            // Assuming `membershipService.markAsPaid` is a function that takes the invoice ID and a boolean for marking as paid
            const resp = await membershipService.markAspaid(invoice?.id, true);

            if (resp?.status === 200) {
                enqueueSnackbar('Invoice paid successfully', {
                    variant: 'success'
                });
                getCompanyMembership(), getCompanyMembershipInvoices();
                onClose();
            } else {
                console.error('Failed to mark the invoice as paid');
            }
        } catch (error) {
            enqueueSnackbar('something went wrong', {
                variant: 'error'
            });
            console.error('An error occurred while marking as paid:', error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>Billing Details</DialogTitle>
            <DialogContent>
                <Card variant="outlined">
                    <CardContent>
                        <Typography variant="body1" gutterBottom>
                            <strong>Billing Month:</strong> {moment(invoice?.creationTime).format('MMMM YYYY')}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            <strong>Due Date:</strong> {moment(invoice?.dueDate).format('DD/MM/YYYY')}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            <strong>Payable Amount:</strong> {invoice?.totalAmount}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            <strong>Status</strong> {invoice?.isPaid ? ' Paid' : 'Unpaid'}
                        </Typography>
                    </CardContent>
                </Card>
            </DialogContent>

            {/* Add DialogActions for the button at the bottom */}
            <DialogActions>
                {!invoice?.isPaid && (
                    <Button variant="contained" color="primary" onClick={() => markAsPaid()}>
                        Mark as Paid
                    </Button>
                )}
                <Button variant="outlined" color="primary" onClick={() => onClose()}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default BillingDetailsPopup;
