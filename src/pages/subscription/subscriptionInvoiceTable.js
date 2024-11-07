import React, { useState } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Link } from '@mui/material';
import { Margin } from '../../../node_modules/@mui/icons-material/index';
import BillingDetailsPopup from './billing-modal';
import moment from 'moment-jalaali';
const InvoiceTable = ({ membershipInvoces, getCompanyMembership, getCompanyMembershipInvoices }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [SelectedInvoice, setSelectedInvoice] = useState();

    const toggleModal = (invoice) => {
        setSelectedInvoice(invoice);
        setIsModalOpen((prev) => !prev);
    };

    return (
        <>
            <Box display="flex" sx={{ marginTop: '15px' }}>
                <TableContainer component={Paper} sx={{ maxWidth: '90%' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Invoice Date</TableCell>
                                <TableCell>Invoice Number</TableCell>
                                <TableCell>Invoice Amount</TableCell>
                                <TableCell>Due Date</TableCell>
                                <TableCell>Invoice PDF</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {membershipInvoces?.map((invoice, index) => (
                                <TableRow key={index}>
                                    <TableCell>{moment(invoice.creationTime).format('DD/MM/YYYY')}</TableCell>
                                    <TableCell>{invoice.invoiceNumber}</TableCell>
                                    <TableCell>{invoice.billableAmount} KWD</TableCell>
                                    <TableCell>{moment(invoice.dueDate).format('DD/MM/YYYY')}</TableCell>
                                    <TableCell>
                                        <Link href="#" onClick={() => toggleModal(invoice)} color="primary">
                                            View Invoice
                                            {/* {invoice.invoicePDF} */}
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            <BillingDetailsPopup
                open={isModalOpen}
                onClose={toggleModal}
                invoice={SelectedInvoice}
                getCompanyMembership={getCompanyMembership}
                getCompanyMembershipInvoices={getCompanyMembershipInvoices}
            />
        </>
    );
};

export default InvoiceTable;
