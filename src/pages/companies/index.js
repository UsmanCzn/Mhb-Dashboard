import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import moment from 'moment';

// material-ui
import { Box, Button, Modal, Table, TableBody, TableCell, Avatar,
    TableContainer, TableHead, TableRow, Typography,Grid } from '@mui/material';
 import MainCard from 'components/MainCard';
 
 
import { ServiceFactory } from 'services/index';
import NewCompany from 'components/companies/newCompany';

  
// ==============================|| ORDER TABLE - HEADER CELL ||============================== //

const headCells = [
    {
        id: 'logo',
        align: 'left',
        disablePadding: false,
        label: 'Logo'
    },
    {
        id: 'compoanyName',
        align: 'left',
        disablePadding: true,
        label: 'Company Name'
    },
     
    {
        id: 'category',
        align: 'left',
        disablePadding: false,
        label: 'Category'
    },
    {
        id: 'noOfBrands',
        align: 'left',
        disablePadding: false,
        label: 'Amount of Brands'
    },
    {
        id: 'noOfBranches',
        align: 'left',
        disablePadding: false, 
        label: 'Amount of Branches'
    },
    {
        id: 'amount',
        align: 'left',
        disablePadding: false,
        label: 'Amount Of Gift Cards'
    },
    {
        id: 'endSubscriptionDate',
        align: 'right',
        disablePadding: false,
        label: 'End Subscription date'
    }
];

// ==============================|| ORDER TABLE - HEADER ||============================== //

function OrderTableHead({ order, orderBy }) {


    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
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

 

// ==============================|| ORDER TABLE ||============================== //

export default function Companies() {
    const [order] = useState('asc');
    const [orderBy] = useState('trackingNo');
    const [selected] = useState([]);
    const userServices=ServiceFactory.get("users")
    const [companies,setCompanies] =useState([])
    const [modalOpen,setModalOpen] =useState(false)

    const isSelected = (trackingNo) => selected.indexOf(trackingNo) !== -1;


    const getCompanies=async()=>{
        await userServices.GetAllCompanies()
        .then((res)=>{ 
            console.log(res.data?.result);
            setCompanies(res.data?.result)
        })
        .catch((err)=>{
            console.log(err);
        })
    }

    useEffect(
        ()=>{
            getCompanies()
        }
        ,[]
    )

    return (

        <Grid item xs={12} md={7} lg={8}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h5">Apps</Typography>
                    </Grid>
                    <Grid item />
                    <Button size="small" variant="contained" sx={{ textTransform: 'capitalize' }}
                     onClick={()=>setModalOpen(true)}
                    >
                            Create New App
                        </Button>
                </Grid>
                <MainCard sx={{ mt: 2 }} content={false}>
                     <Box>
            <TableContainer
                sx={{
                    width: '100%',
                    overflowX: 'auto',
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
                    <OrderTableHead order={order} orderBy={orderBy} />
                    <TableBody>
                        {companies.map((row, index) => {
                            const isItemSelected = isSelected(row.trackingNo);
                            const labelId = `enhanced-table-checkbox-${index}`;

                            return (
                                <TableRow
                                    hover
                                    role="checkbox"
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    aria-checked={isItemSelected}
                                    tabIndex={-1}
                                    key={row.transactionNo}
                                    selected={isItemSelected}
                                >
                                    <TableCell component="th" id={labelId} scope="row" align="left">
                                    <Avatar alt={row?.name} src={ row?.logoUrl} />
                                    </TableCell>
                                    <TableCell align="left">{row?.name}</TableCell>
                                    <TableCell align="left">{row?.category}</TableCell>
                                    <TableCell align="right">{row?.amountOfBrands}</TableCell>
                                    <TableCell align="right">
                                    {row?.amountOfBranches}
                                    </TableCell>
                                    <TableCell align="right">{row?.giftCardsLimit}</TableCell> 

                                    <TableCell align="right">{moment(row?.endSubscriptionDate.toString()).format('DD-MMM-YYYY')}</TableCell>
                                
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
       
                </MainCard>
                <NewCompany modalOpen={modalOpen} setModalOpen={setModalOpen} />
                </Grid>
       
    );
}
