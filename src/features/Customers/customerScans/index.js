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

const ScansHistory = ({ user }) => {
  const { cid } = useParams();
  const [selectedBrandId, setSelectedBrandId] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedRow, setSelectedRow] = useState();
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [pointsRows, setPointsRows] = useState([]);
  const [stampsRows, setStampsRows] = useState([]);
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
    if (!cid || !brandId) return;
    setLoading(true);
    try {
      const response = await customerService.getScansHistory(cid, brandId, 10, 0);
      setPointsRows(response?.data?.result?.item1 || []);
    } catch (err) {
      setPointsRows([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchScanStampsHistory = async (brandId) => {
    if (!cid || !brandId) return;
    setLoading(true);
    try {
      const response = await customerService.getScansStampsHistory(cid, brandId, 10, 0);
      setStampsRows(response?.data?.result?.item1 || []);
    } catch (err) {
      console.error('Failed to fetch scan stamps history:', err);
      setStampsRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (brandsList.length && user?.companyId) {
      const filtered = brandsList.filter((br) => br.companyId === user.companyId);
      setFilteredBrands(filtered);
      if (filtered.length) {
        setSelectedBrandId(filtered[0].id);
        setSelectedBrand(filtered[0]);
      }
    }
  }, [brandsList, user]);

  useEffect(() => {
    const brand = filteredBrands.find((br) => br.id === selectedBrandId);
    setSelectedBrand(brand);

    setPointsRows([]);
    setStampsRows([]);
    if (!brand) return;

    if (brand.isPointPrimaryBrand) fetchScanHistory(selectedBrandId);
    if (brand.isStampPrimaryBrand) fetchScanStampsHistory(selectedBrandId);
  }, [selectedBrandId, filteredBrands, cid]);

  return (
    <>
      <Grid container spacing={4}>
        <Grid item xs={12} sx={{ marginTop: '10px', marginBottom: '10px' }}>
          <Grid container alignItems="center" justifyContent="flex-end">
     
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

      {/* Points Table */}
      {selectedBrand?.isPointPrimaryBrand && (
        <div style={{  margin: '0 auto', marginBottom: 32 }}>
          <Typography variant="h4" fontWeight={600} sx={{ mb: 1 }}>
            Points History
          </Typography>
          <TableContainer
            component={Paper}
            elevation={2}
            sx={{ maxHeight: 360, overflow: 'auto' }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Date & Time</strong></TableCell>
                  <TableCell><strong>Points</strong></TableCell>
                  <TableCell><strong>Amount</strong></TableCell>
                  <TableCell><strong>Action</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pointsRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      No points history found.
                    </TableCell>
                  </TableRow>
                ) : (
                  pointsRows.map((row, index) => (
                    <TableRow key={index}>
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
                            onClick={() => handleRemoveClick(row)}
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

      {/* Stamps Table */}
      {selectedBrand?.isStampPrimaryBrand && (
        <div style={{  margin: '0 auto', marginBottom: 32 }}>
          <Typography variant="h4" fontWeight={600} sx={{ mb: 1 }}>
            Stamps History
          </Typography>
          <TableContainer
            component={Paper}
            elevation={2}
            sx={{ maxHeight: 360, overflow: 'auto' }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Date & Time</strong></TableCell>
                  <TableCell><strong>Description</strong></TableCell>
                  <TableCell><strong>Stamp Quantity</strong></TableCell>
                  <TableCell><strong>Action</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stampsRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      No stamps history found.
                    </TableCell>
                  </TableRow>
                ) : (
                  stampsRows.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {row.creationTime
                          ? moment(row.creationTime).format('DD/MM/YYYY HH:mm')
                          : '--'}
                      </TableCell>
                      <TableCell>
                        {(() => {
                          const value = row?.value ?? '';
                          const invoice = row?.id ? `for #invoice${row.id}` : '';
                          if (row?.freeItems === true && value < 0) {
                            return `Drinks Redeemed ${Math.abs(value)} ${invoice}`;
                          }
                          if (row?.punches) {
                            return `Stamp Increase by ${value} ${invoice}`;
                          }
                          return `Drinks Increase by ${value} ${invoice}`;
                        })()}
                      </TableCell>
                      <TableCell>
                        {row?.value}
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
                            onClick={() => handleRemoveClick(row)}
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

export default ScansHistory;
