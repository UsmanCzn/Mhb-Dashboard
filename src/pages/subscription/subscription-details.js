import React from 'react';
import { Grid, Box, Typography, Button, Card, CardContent, CardHeader } from '@mui/material';
import InvoiceTable from './subscriptionInvoiceTable';
const Subscription = () => {
    return (
        <>
            <Typography fontSize={22} fontWeight={700}>
                Subscription
            </Typography>
            <Box display="flex" gap={4}>
                {/* Membership Details Card */}
                <Card sx={{ minWidth: 305, boxShadow: 2 }}>
                    <CardHeader
                        sx={{
                            backgroundColor: '#f5f5f5'
                        }}
                        title="Membership Details"
                        subheader=""
                    />
                    <CardContent>
                        <Typography variant="body1">
                            <strong>User ID:</strong> 009976123
                        </Typography>
                        <Typography variant="body1">
                            {' '}
                            <strong>Company Name:</strong> Lail Caffee
                        </Typography>
                        <Typography variant="body1">
                            <strong>Phone Number:</strong> +965 6578654
                        </Typography>
                        <Typography variant="body1">
                            <strong>Email Address:</strong> lalicafe676@gmail.com
                        </Typography>
                        <Typography variant="body1">
                            <strong>Membership:</strong> KWD 40/Month
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'green' }}>
                            <strong>Status:</strong> Active
                        </Typography>
                    </CardContent>
                </Card>

                {/* Billing Details Card */}
                <Card sx={{ minWidth: 305, boxShadow: 2 }}>
                    <CardHeader
                        sx={{
                            backgroundColor: '#f5f5f5'
                        }}
                        title="Billing Details"
                        subheader=""
                    />
                    <CardContent>
                        <Typography variant="body1">
                            <strong>Billing Month:</strong> March 2024
                        </Typography>
                        <Typography variant="body1">
                            <strong>Due Date:</strong> 03/27/2024
                        </Typography>
                        <Typography variant="body1">
                            <strong>Payable Amount:</strong> KWD 40
                        </Typography>
                        <Typography variant="body1">
                            <strong>Last Paid Amount:</strong> KWD 40
                        </Typography>
                        <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                            Pay Now
                        </Button>
                    </CardContent>
                </Card>
            </Box>
            <InvoiceTable />
        </>
    );
};

export default Subscription;
