import React from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Link } from '@mui/material';
import { Margin } from '../../../node_modules/@mui/icons-material/index';

const InvoiceTable = ({ membershipInvoces }) => {
    // Sample data
    const invoices = [
        {
            invoiceDate: '03/27/2024',
            invoiceNumber: '009976123',
            invoiceAmount: 'KWD 40',
            dueDate: '03/27/2024',
            invoicePDF: 'View Invoice'
        },
        {
            invoiceDate: '03/27/2024',
            invoiceNumber: '009976123',
            invoiceAmount: 'KWD 40',
            dueDate: '03/27/2024',
            invoicePDF: 'View Invoice'
        },
        {
            invoiceDate: '03/27/2024',
            invoiceNumber: '009976123',
            invoiceAmount: 'KWD 40',
            dueDate: '03/27/2024',
            invoicePDF: 'View Invoice'
        }
    ];

    return (
        <Box display="flex" sx={{ marginTop: '15px' }}>
            <TableContainer component={Paper} sx={{ maxWidth: '90%' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Invoice Date</TableCell>
                            <TableCell>Invoice Number</TableCell>
                            <TableCell>Invoice Amount</TableCell>
                            <TableCell>Due Date</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Invoice PDF</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {membershipInvoces?.map((invoice, index) => (
                            <TableRow key={index}>
                                <TableCell>{invoice.invoiceDate}</TableCell>
                                <TableCell>{invoice.invoiceNumber}</TableCell>
                                <TableCell>{invoice.invoiceAmount}</TableCell>
                                <TableCell>{invoice.invoiceAmount}</TableCell> 
                                <TableCell>{invoice.dueDate}</TableCell>
                                <TableCell>
                                    <Link href="#" color="primary">
                                        {invoice.invoicePDF}
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default InvoiceTable;
