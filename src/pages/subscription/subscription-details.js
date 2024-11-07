import React, { useEffect, useState } from 'react';
import { Grid, Box, Typography, Button, Card, CardContent, CardHeader } from '@mui/material';
import InvoiceTable from './subscriptionInvoiceTable';
import { useParams } from 'react-router-dom';
import membershipService from 'services/membership.service';
import { useAuth, useUser } from 'providers/authProvider';
import moment from 'moment-jalaali';
const Subscription = () => {
    const { id } = useParams();
    const user = useAuth();
    const [membership, setmembership] = useState();
    const [membershipInvoces, setMembershipInvoices] = useState([]);
    useEffect(() => {
        getComapnyMembership();
        getComapnyMembershipInovices();
    }, []);

    const getComapnyMembership = async () => {
        try {
            const resp = await membershipService.getCompanyMembershipById(id || user?.user?.companyId);
            setmembership(resp.data.result);
        } catch (err) {
            console.log(err);
        }
    };
    const getComapnyMembershipInovices = async () => {
        try {
            const resp = await membershipService.getCompanyMembershipInvoicesById(id);
            if (resp) {
                setMembershipInvoices(resp.data.result);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const getBillingDate = (billdate) => {
        const creationTime = billdate;
        const date = new Date(creationTime);

        const month = date.toLocaleString('default', { month: 'long' }); // "November"
        const year = date.getFullYear(); // 2024
        return `${month}  ${year}`;
    };
    return (
        <>
            <Typography fontSize={22} sx={{ marginBottom: '10px' }} fontWeight={700}>
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
                        {/* <Typography variant="body1">
                            <strong>User ID:</strong> 009976123
                        </Typography> */}
                        <Typography variant="body1">
                            {' '}
                            <strong>Company Name:</strong> {membership?.companyName}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Phone Number:</strong> {membership?.phoneNumber}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Email Address:</strong> {membership?.emailAddress}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Membership:</strong> {membership?.memberShipName}
                        </Typography>
                        {membership?.memberShipStatus === 0 ? (
                            <Typography variant="body1" sx={{ color: 'green' }}>
                                <strong>Status:</strong> Active
                            </Typography>
                        ) : (
                            <Typography variant="body1" sx={{ color: 'red' }}>
                                <strong>Status:</strong> InActive
                            </Typography>
                        )}
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
                            <strong>Billing Month:</strong> {getBillingDate(membershipInvoces[0]?.creationTime) ?? 'NA'}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Due Date:</strong> {moment(membershipInvoces[0]?.dueDate).format('DD/MM/YYYY')}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Payable Amount:</strong> KWD{membershipInvoces[0]?.totalAmount}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Last Paid Amount:</strong> KWD {membershipInvoces[0]?.totalAmount}
                        </Typography>
                        {/* <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                            Pay Now
                        </Button> */}
                    </CardContent>
                </Card>
            </Box>
            <InvoiceTable
                membershipInvoces={membershipInvoces}
                getCompanyMembership={getComapnyMembership}
                getCompanyMembershipInvoices={getComapnyMembershipInovices}
            />
        </>
    );
};

export default Subscription;
