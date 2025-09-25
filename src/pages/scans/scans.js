import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Link,
  Typography, Grid, Select, FormControl, InputLabel, MenuItem
} from '@mui/material';

import customerService from 'services/customerService';
import { useFetchBrandsList } from 'features/BrandsTable/hooks/useFetchBrandsList';
import { useSnackbar } from 'notistack';

import AddCommentsModal from 'components/add-comment-modal';
import LinearProgress from '@mui/material/LinearProgress';
import moment from "moment";

const Scans = (props) => {
  const { cid } = useParams();
  const [selectedBrandId, setSelectedBrandId] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedRow, setSelectedRow] = useState();
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [stampRows, setStampRows] = useState([]);
  const [pointRows, setPointRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCommentsModalOpen, setCommentsModalOpen] = useState(false);

  const { brandsList } = useFetchBrandsList(true);
  const { enqueueSnackbar } = useSnackbar();

  const handleRemoveClick = (row) => {
    setSelectedRow(row);
    setCommentsModalOpen(true);
  };

  const handleCommentSubmit = (comment) => {
    CreateDispute(comment);
    setCommentsModalOpen(false);
  };

  const CreateDispute = async (comment) => {
    setLoading(true);
    try {
      await customerService.CreateScanDispute(selectedRow?.id, comment);
      enqueueSnackbar('Dispute request has been created.', { variant: 'success' });
    } catch (err) {
      console.error('Failed to create dispute:', err);
      enqueueSnackbar('Failed to create dispute.', { variant: 'error', autoHideDuration: 1000 });
    } finally {
      setLoading(false);
    }
  };

  const fetchScanHistory = async (brandId) => {
    if (!brandId) return;
    try {
      setLoading(true);
      const response = await customerService.getScansHistoryByBrand(brandId, 10, 0);
      setPointRows(response?.data?.result?.item1 || []);
    } catch (err) {
      console.error('Failed to fetch scan history:', err);
      setPointRows([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchScanStampsHistory = async (brandId) => {
    if (!brandId) return;
    try {
      setLoading(true);
      const response = await customerService.getScansStampsHistoryByBrand(brandId, 10, 0);
      setStampRows(response?.data?.result?.item1 || []);
    } catch (err) {
      console.error('Failed to fetch scan stamps history:', err);
      setStampRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (brandsList.length) {
      setFilteredBrands(brandsList);
      setSelectedBrandId(brandsList[0].id);
      setSelectedBrand(brandsList[0]);
    }
  }, [brandsList]);

  useEffect(() => {
    const brand = brandsList.find((e) => e.id === selectedBrandId);
    setSelectedBrand(brand);

    // Reset data before fetch
    setStampRows([]);
    setPointRows([]);

    if (!brand) return;

    if (brand.isStampPrimaryBrand) {
      fetchScanStampsHistory(selectedBrandId);
    }
    if (brand.isPointPrimaryBrand) {
      fetchScanHistory(selectedBrandId);
    }
  }, [selectedBrandId, brandsList]);

  return (
    <>
      <Grid container spacing={4}>
        <Grid item xs={12} sx={{ marginTop: '10px', marginBottom: '10px' }}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography fontSize={26} fontWeight={600}></Typography>
            </Grid>
            <Grid item>
              <FormControl fullWidth sx={{ minWidth: 200 }}>
                <InputLabel id="brand-select-label">Brand</InputLabel>
                <Select
                  labelId="brand-select-label"
                  id="brand-select"
                  value={selectedBrandId}
                  label="Brand"
                  onChange={(event) => setSelectedBrandId(event.target.value)}
                >
                  {filteredBrands.map((brand) => (
                    <MenuItem key={brand.id} value={brand.id}>
                      {brand.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {loading && <LinearProgress sx={{ mb: 0.5 }} />}

      {/* Points History Table */}
      {selectedBrand?.isPointPrimaryBrand && (
        <div style={{  margin: '0 auto' }}>
          <Typography variant="h4" fontWeight={600} sx={{ mb: 1 }}>
              Point Scans History
          </Typography>
          <TableContainer
            component={Paper}
            elevation={2}
            sx={{ maxHeight: 360, overflow: 'auto', mb: 4 }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Customer Name</strong></TableCell>
                  <TableCell><strong>Date & Time</strong></TableCell>
                  <TableCell><strong>Points</strong></TableCell>
                  <TableCell><strong>Amount</strong></TableCell>
                  <TableCell><strong>Action</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pointRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      No points history found.
                    </TableCell>
                  </TableRow>
                ) : (
                  pointRows.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row?.customerName || '-'}</TableCell>
                      <TableCell>
                        {row.creationTime
                          ? moment(row.creationTime).format('DD/MM/YYYY HH:mm')
                          : '--'}
                      </TableCell>
                      <TableCell>{row?.pointsEarned || 0}</TableCell>
                      <TableCell>
                        {row?.amount || 0} {selectedBrand?.currency}
                      </TableCell>
                      <TableCell>
                        {row.isAct ? (
                          <span
                            style={{
                              color: '#bdbdbd',
                              textDecoration: 'none',
                              cursor: 'not-allowed',
                              fontWeight: 500,
                            }}
                          >
                            Remove
                          </span>
                        ) : (
                          <Link
                            component="button"
                            color="error"
                            underline="none"
                            onClick={() => {
                              setSelectedRow(row);
                              handleRemoveClick(row);
                            }}
                            sx={{ fontWeight: 500 }}
                          >
                            Remove
                          </Link>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}

      {/* Stamps History Table */}
      {selectedBrand?.isStampPrimaryBrand && (
        <div style={{  margin: '0 auto' }}>
          <Typography variant="h4" fontWeight={600} sx={{ mb: 1 }}>
            Stamp Scans History
          </Typography>
          <TableContainer
            component={Paper}
            elevation={2}
            sx={{ maxHeight: 360, overflow: 'auto', mb: 4 }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Customer Name</strong></TableCell>
                  <TableCell><strong>Date & Time</strong></TableCell>
                  <TableCell><strong>Description</strong></TableCell>
                  <TableCell><strong>Stamp Quantity</strong></TableCell>
                  <TableCell><strong>Action</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stampRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      No stamps history found.
                    </TableCell>
                  </TableRow>
                ) : (
                  stampRows.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row?.customerName || '-'}</TableCell>
                      <TableCell>
                        {row.creationTime
                          ? moment(row.creationTime).format('DD/MM/YYYY HH:mm')
                          : '--'}
                      </TableCell>
                      <TableCell>
                        {(() => {
                          // Extract info
                          const value = row?.value ?? '';
                          const invoice = row?.id ? `for #invoice${row.id}` : '';

                          // Logic
                          if (row?.freeItems === true && value < 0) {
                            return `Drinks Redeemed ${value} ${invoice}`;
                          }
                          if (row?.punches) {
                            return `Stamp Increase by ${value} ${invoice}`;
                          }
                          return `Drinks Increase by ${value} ${invoice}`;
                        })()}
                      </TableCell>

                      <TableCell>{row?.value}</TableCell>
                      <TableCell>
                        {row.isAct ? (
                          <span
                            style={{
                              color: '#bdbdbd',
                              textDecoration: 'none',
                              cursor: 'not-allowed',
                              fontWeight: 500,
                            }}
                          >
                            Remove
                          </span>
                        ) : (
                          <Link
                            component="button"
                            color="error"
                            underline="none"
                            onClick={() => {
                              setSelectedRow(row);
                              handleRemoveClick(row);
                            }}
                            sx={{ fontWeight: 500 }}
                          >
                            Remove
                          </Link>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}

      <AddCommentsModal
        open={isCommentsModalOpen}
        onClose={() => setCommentsModalOpen(false)}
        onSubmit={handleCommentSubmit}
      />
    </>
  );
};

export default Scans;
