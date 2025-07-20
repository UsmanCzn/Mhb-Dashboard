import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Avatar, IconButton, Menu, MenuItem, TablePagination, LinearProgress,Button, Box
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DownloadIcon from '@mui/icons-material/Download'; // Optional icon
import { useParams, useNavigate } from 'react-router-dom';
import { ApiV1 } from 'helper/api'; 
import { ServiceFactory } from 'services/index';
const rowsPerPageOptions = [5, 10];

const GroupCustomerTable = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuRow, setMenuRow] = useState(null);
  const [page, setPage] = useState(0); // zero-based
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[1]);
  const [totalCount, setTotalCount] = useState(0);
  const customerServices = ServiceFactory.get('customer');

  // Fetch customers
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await ApiV1.get(
          `services/app/Customer/GetCustomerDetailsByCustomersGroupId`,
          {
            params: {
              CustomersGroupId: id,
              Skip: page * rowsPerPage,
              Take: rowsPerPage
            }
          }
        );

        const data = res?.data?.result?.data;
        setCustomers(data?.data || []);
        setTotalCount(data?.totalCount || 0);
      } catch (err) {
        console.error('Failed to fetch customers:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id, page, rowsPerPage]);

  const handleClickMenu = (event, row) => {
    setAnchorEl(event.currentTarget);
    setMenuRow(row);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setMenuRow(null);
  };

  const handleCustomer = () => {
    navigate(`/customers/${menuRow?.id}`);
    handleCloseMenu();
  };

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0); // Reset to first page
  };

  const DownloadCustomers = async () => {
    setLoading(true);
    try {
      const response = await customerServices.downloadCustomerList(id);
  
      const blob = new Blob([response.data], {
        type:
          response.headers['content-type'] ||
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
  
      // Optional: Get filename from Content-Disposition header
      const contentDisposition = response.headers['content-disposition'];
      let fileName = 'CustomerList.xlsx';
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?(.+)"?/);
        if (match?.[1]) {
          fileName = decodeURIComponent(match[1]);
        }
      }
  
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
  
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download customer list.');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <>
  <Box display="flex" justifyContent="flex-end" p={2}>
    <Button
      variant="contained"
      color="primary"
      startIcon={<DownloadIcon />}
      onClick={DownloadCustomers}
    >
      Download Customers
    </Button>
  </Box>
    <Paper>
      {loading && <LinearProgress />}

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Email</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers?.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <Avatar src={row.userAvatar || undefined} />
                </TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.displayPhoneNumber || '-'}</TableCell>
                <TableCell>{row.displayEmailAddress || '-'}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={(e) => handleClickMenu(e, row)}>
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
          <MenuItem onClick={handleCustomer}>Customer Details</MenuItem>
        </Menu>
      </TableContainer>
      <TablePagination
        component="div"
        count={totalCount}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={rowsPerPageOptions}
      />
    </Paper>
    </>
  );
};

export default GroupCustomerTable;
