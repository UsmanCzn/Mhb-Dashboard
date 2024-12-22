import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import React from 'react';
import { useLocation, useNavigate, useHistory } from 'react-router-dom';
import OrderDetail from 'components/orders/OrderDetails';
import moment from 'moment';

// material-ui
import {
    Box,
    Link,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Button,
    Dialog
} from '@mui/material';

// third-party
import NumberFormat from 'react-number-format';

// project import
import Dot from 'components/@extended/Dot';

import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import RedButton from 'components/redButton';
import NewLevel from 'features/Levels/NewLevel';
import { useSnackbar } from 'notistack';

import Slide from '@mui/material/Slide';

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

// ==============================|| ORDER TABLE - HEADER CELL ||============================== //

const headCells = [
    {
        id: 'name',
        align: 'left',
        disablePadding: true,
        label: 'Name'
    },
    {
        id: 'fat',
        align: 'right',
        disablePadding: false,
        label: 'Total Order'
    },
    {
        id: 'carbs',
        align: 'right',
        disablePadding: false,
        label: 'Amount'
    }
];

// ==============================|| ORDER TABLE - HEADER ||============================== //

function OrderTableHead({ order, orderBy, payers, colHeaders }) {
    return (
        <TableHead>
            <TableRow>
                {colHeaders.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.align}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        {headCell.label}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

OrderTableHead.propTypes = {
    order: PropTypes.string,
    orderBy: PropTypes.string
};

// ==============================|| ORDER TABLE - STATUS ||============================== //

const OrderStatus = ({ status }) => {
    let color;
    let title;

    switch (status) {
        case 0:
            color = 'warning';
            title = 'Pending';
            break;
        case 1:
            color = 'success';
            title = 'Approved';
            break;
        case 2:
            color = 'error';
            title = 'Rejected';
            break;
        default:
            color = 'primary';
            title = 'None';
    }

    return (
        <Stack direction="row" spacing={1} alignItems="center">
            <Dot color={color} />
            <Typography>{title}</Typography>
        </Stack>
    );
};

OrderStatus.propTypes = {
    status: PropTypes.number
};

// ==============================|| ORDER TABLE ||============================== //

export default function OrderTable({ users, payers, headers, top10Products, lastOrders }) {
    const [order] = useState('asc');
    const [orderBy] = useState('trackingNo');
    const [selected] = useState([]);
    const [deleteAlert, setDeleteAlert] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [modalOpen, setModalOpen] = useState(false);
    const [data, setData] = useState({});
    const [reload, setReload] = useState(false);
    const [statustypes, setStatusTypes] = useState([
        { id: 1, title: 'Open' },
        { id: 3, title: 'Accepted' },
        { id: 4, title: 'Ready' },
        { id: 2, title: 'Closed' },
        { id: 5, title: 'Rejected' }
    ]);

    const gotoViewAll = () => {
        const data = JSON.stringify(users);
        navigate(`/pages/dashboard/viewAll?data =${encodeURIComponent(data)}}`);
    };

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const showDetails = (data) => {
        setData(data);
        setModalOpen(true);
    };

    const navigateToUserProfile = (user) => {
        navigate(`/customers/${user.userId}`);
    };

    const isSelected = (trackingNo) => selected.indexOf(trackingNo) !== -1;

    return (
        <>
            <Box>
                <TableContainer
                    sx={{
                        width: '100%',
                        maxHeight: '400px', // Set a fixed height for the scrollable area
                        overflowY: 'auto', // Enable vertical scrolling
                        overflowX: 'auto', // Enable horizontal scrolling
                        position: 'relative',
                        display: 'block',
                        maxWidth: '100%',
                        '& td, & th': { whiteSpace: 'nowrap' }
                    }}
                >
                    <Table
                        aria-labelledby="tableTitle"
                        sx={{
                            '& .MuiTableCell-root:first-child': {
                                pl: 2
                            },
                            '& .MuiTableCell-root:last-child': {
                                pr: 3
                            }
                        }}
                    >
                        <OrderTableHead order={order} orderBy={orderBy} payers={payers} colHeaders={headers} />
                        <TableBody>
                            {users && users.length > 0 ? (
                                stableSort(users.slice(0, 10), getComparator(users, orderBy))?.map((row, index) => {
                                    const isItemSelected = isSelected(row.trackingNo);

                                    return (
                                        <TableRow
                                            hover
                                            key={index}
                                            role="checkbox"
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: 'pointer' }}
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            selected={isItemSelected}
                                            onClick={(e) => {
                                                e.preventDefault(); // Prevent default navigation behavior
                                                navigateToUserProfile(row);
                                            }}
                                        >
                                            <TableCell align="left">{row.userFullName}</TableCell>
                                            <TableCell align="right">{row.totalOrders}</TableCell>
                                            <TableCell align="right">{row.totalSale.toFixed(3) + ' KWD'}</TableCell>
                                        </TableRow>
                                    );
                                })
                            ) : top10Products && top10Products.length > 0 ? (
                                top10Products.map((row, index) => (
                                    <TableRow
                                        hover
                                        key={index}
                                        role="checkbox"
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        tabIndex={-1}
                                    >
                                        <TableCell align="left">{row.productName}</TableCell>
                                        <TableCell align="right">
                                            {row.countOrdered} {row.countOrdered > 1 ? 'Times' : 'Time'}
                                        </TableCell>
                                        <TableCell align="right">{row.totalSales.toFixed(2) + ' KWD'}</TableCell>
                                    </TableRow>
                                ))
                            ) : lastOrders && lastOrders.length > 0 ? (
                                lastOrders.map((order, index) => (
                                    <TableRow
                                        hover
                                        key={index}
                                        role="checkbox"
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        tabIndex={-1}
                                    >
                                        {/* Customize the TableCell values according to the structure of lastOrders */}
                                        <TableCell align="left">
                                            {order.products[0]?.productImage ? (
                                                <img
                                                    src={order.products[0].productImage}
                                                    alt={order.products[0]?.name || 'Product Image'}
                                                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                                />
                                            ) : (
                                                <span>No Image</span>
                                            )}
                                        </TableCell>
                                        <TableCell align="left">{order.products[0]?.name}</TableCell>
                                        <TableCell align="right">
                                            {moment(order.creationDate).format('DD-MMM-YYYY')}{' '}
                                            {moment(order.creationDate).format('hh:mm A')}
                                        </TableCell>
                                        <TableCell align="right">
                                            <a
                                                href="#"
                                                style={{
                                                    cursor: 'pointer',
                                                    textDecoration: 'underline',
                                                    color: 'blue'
                                                }}
                                                onClick={(e) => {
                                                    e.preventDefault(); // Prevent default navigation behavior
                                                    showDetails(order);
                                                }}
                                            >
                                                View Details
                                            </a>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={3} align="center">
                                        No data available
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <OrderDetail
                    modalOpen={modalOpen}
                    setModalOpen={setModalOpen}
                    setReload={setReload}
                    data={data}
                    statustypes={statustypes}
                />
            </Box>
        </>
    );
}
