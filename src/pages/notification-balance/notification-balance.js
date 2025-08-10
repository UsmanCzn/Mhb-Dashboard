import React, { useEffect, useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  Box,
  LinearProgress ,
} from '@mui/material';
import customerService from 'services/customerService';
import notificationService from 'services/notificationService';
import moment from 'moment-jalaali';
const NotificationBalnce = () => {
  const [payments, setPayments] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    getCompanies();
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [selectedCompany, page, rowsPerPage]);

  const fetchPayments = () => {
    if (!selectedCompany) return;
    setLoading(true);
    notificationService
      .getNotificationBalanceHistory({
        companyId: selectedCompany,
        take: rowsPerPage,
        skip: page * rowsPerPage,
      })
      .then((res) => {
        setPayments(res.data.result.item2 || []);
        setTotalCount(res.data.result.item1 || 0);
      }).finally(()=>{
        setLoading(false);
      })
  };
  

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleInputChange = (e) => {
    const { value } = e.target;
    setSelectedCompany(value);
  };

  const getCompanies = async () => {
    try {
      const res = await customerService.getComapniesByUserRole();
      if (res) {
        const tempComp = res.data.result;
        if (tempComp.length) {
          let index = tempComp.findIndex((e) => e.name === 'Holmes Bakehouse');
          setSelectedCompany(index >= 0 ? tempComp[index].id : tempComp[0].id);
        }
        setCompanies(res.data.result);
      }
    } catch (err) {}
  };

  return (
    <div className="p-6">
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 className="text-xl font-bold mb-4">Payment History</h2>
        <FormControl sx={{ minWidth: 200, mb: 2 }} size="small">
          <InputLabel>Companies</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            fullWidth
            title="Company"
            value={selectedCompany}
            label="Company"
            name="companyId"
            onChange={handleInputChange}
          >
            {companies.map((row, index) => (
              <MenuItem key={index} value={row.id}>
                {row?.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      {loading && <LinearProgress />}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Company Name</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Payment ID</TableCell>
              <TableCell>Creation Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {payments.map((payment, index) => (
            <TableRow key={index}>
              <TableCell>{payment.companyName}</TableCell>
              <TableCell>{payment.amount}</TableCell>
              <TableCell>{payment.paymentId}</TableCell>
              <TableCell>{moment(payment.creationTime).format('YYYY-MM-DD HH:mm')}</TableCell>
            </TableRow>
          ))}
        </TableBody>

        </Table>
        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </TableContainer>
    </div>
  );
};

export default NotificationBalnce;
