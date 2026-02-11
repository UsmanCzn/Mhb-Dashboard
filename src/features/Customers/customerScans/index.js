import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Link,
  Typography,
  Grid,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  TablePagination,
} from '@mui/material';

import customerService from 'services/customerService';
import { useFetchBrandsList } from 'features/BrandsTable/hooks/useFetchBrandsList';
import { useSnackbar } from 'notistack';
import AddCommentsModal from 'components/add-comment-modal';
import LinearProgress from '@mui/material/LinearProgress';
import moment from 'moment';

const TAKE = 10;

const ScansHistory = ({ user }) => {
  const { cid } = useParams();

  const [selectedBrandId, setSelectedBrandId] = useState('');
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [filteredBrands, setFilteredBrands] = useState([]);

  const [pointsRows, setPointsRows] = useState([]);
  const [stampsRows, setStampsRows] = useState([]);

  const [pointsPage, setPointsPage] = useState(0);
  const [stampsPage, setStampsPage] = useState(0);

  const [pointsTotal, setPointsTotal] = useState(0);
  const [stampsTotal, setStampsTotal] = useState(0);

  const [selectedRow, setSelectedRow] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isCommentsModalOpen, setCommentsModalOpen] = useState(false);

  const { brandsList } = useFetchBrandsList(true);
  const { enqueueSnackbar } = useSnackbar();

  /* ------------------ DISPUTE ------------------ */

  const handleRemoveClick = (row) => {
    setSelectedRow(row);
    setCommentsModalOpen(true);
  };

  const handleCommentSubmit = async (comment) => {
    try {
      setLoading(true);
      await customerService.CreateScanDispute(selectedRow?.id, comment);
      enqueueSnackbar('Dispute request has been created.', { variant: 'success' });

      if (selectedBrand?.isPointPrimaryBrand) {
        fetchScanHistory(selectedBrandId, pointsPage);
      }
      if (selectedBrand?.isStampPrimaryBrand) {
        fetchScanStampsHistory(selectedBrandId, stampsPage);
      }
    } catch {
      enqueueSnackbar('Failed to create dispute.', { variant: 'error' });
    } finally {
      setLoading(false);
      setCommentsModalOpen(false);
    }
  };

  /* ------------------ API CALLS ------------------ */

  const fetchScanHistory = async (brandId, page = 0) => {
    if (!cid || !brandId) return;

    try {
      setLoading(true);
      const skip = page * TAKE;
      const res = await customerService.getScansHistory(cid, brandId, TAKE, skip);

      setPointsRows(res?.data?.result?.item1 || []);
      setPointsTotal(res?.data?.result?.item2 || 0);
    } catch {
      setPointsRows([]);
      setPointsTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const fetchScanStampsHistory = async (brandId, page = 0) => {
    if (!cid || !brandId) return;

    try {
      setLoading(true);
      const skip = page * TAKE;
      const res = await customerService.getScansStampsHistory(cid, brandId, TAKE, skip);

      setStampsRows(res?.data?.result?.item1 || []);
      setStampsTotal(res?.data?.result?.item2 || 0);
    } catch {
      setStampsRows([]);
      setStampsTotal(0);
    } finally {
      setLoading(false);
    }
  };

  /* ------------------ EFFECTS ------------------ */

  useEffect(() => {
    if (brandsList.length && user?.companyId) {
      const filtered = brandsList.filter(
        (br) => br.companyId === user.companyId
      );
      setFilteredBrands(filtered);

      if (filtered.length) {
        setSelectedBrandId(filtered[0].id);
        setSelectedBrand(filtered[0]);
      }
    }
  }, [brandsList, user]);

  useEffect(() => {
    const brand = filteredBrands.find((br) => br.id === selectedBrandId) || null;
    setSelectedBrand(brand);

    setPointsPage(0);
    setStampsPage(0);
    setPointsRows([]);
    setStampsRows([]);

    if (!brand) return;

    if (brand.isPointPrimaryBrand) {
      fetchScanHistory(selectedBrandId, 0);
    }
    if (brand.isStampPrimaryBrand) {
      fetchScanStampsHistory(selectedBrandId, 0);
    }
  }, [selectedBrandId, filteredBrands, cid]);

  /* ------------------ RENDER ------------------ */

  return (
    <>
      <Grid container spacing={4}>
        <Grid item xs={12} sx={{ mt: 1, mb: 1 }}>
          <Grid container justifyContent="flex-end">
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Brand</InputLabel>
              <Select
                value={selectedBrandId}
                label="Brand"
                onChange={(e) => setSelectedBrandId(e.target.value)}
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

      {loading && <LinearProgress sx={{ mb: 0.5 }} />}

      {/* ------------------ POINTS TABLE ------------------ */}
      {selectedBrand?.isPointPrimaryBrand && (
        <>
          <Typography variant="h4" fontWeight={600} sx={{ mb: 1 }}>
            Points History
          </Typography>

          <TableContainer component={Paper} sx={{ maxHeight: 360 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Date & Time</TableCell>
                  <TableCell>Points</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pointsRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No points history found.
                    </TableCell>
                  </TableRow>
                ) : (
                  pointsRows.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        {moment(row.creationTime).format('DD/MM/YYYY HH:mm')}
                      </TableCell>
                      <TableCell>{row.pointsEarned}</TableCell>
                      <TableCell>
                        {row.amount} {selectedBrand.currency}
                      </TableCell>
                      <TableCell>
                        {row.isAct ? (
                          <span style={{ color: '#bdbdbd' }}>Remove</span>
                        ) : (
                          <Link
                            component="button"
                            color="error"
                            onClick={() => handleRemoveClick(row)}
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

          <TablePagination
            component="div"
            count={pointsTotal}
            page={pointsPage}
            onPageChange={(_, p) => {
              setPointsPage(p);
              fetchScanHistory(selectedBrandId, p);
            }}
            rowsPerPage={TAKE}
            rowsPerPageOptions={[10]}
          />
        </>
      )}

      {/* ------------------ STAMPS TABLE ------------------ */}
      {selectedBrand?.isStampPrimaryBrand && (
        <>
          <Typography variant="h4" fontWeight={600} sx={{ mt: 3, mb: 1 }}>
            Stamps History
          </Typography>

          <TableContainer component={Paper} sx={{ maxHeight: 360 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Date & Time</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Qty</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stampsRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No stamps history found.
                    </TableCell>
                  </TableRow>
                ) : (
                  stampsRows.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        {moment(row.creationTime).format('DD/MM/YYYY HH:mm')}
                      </TableCell>
                      <TableCell>
                        {row.freeItems && row.value < 0
                          ? `Drinks Redeemed ${Math.abs(row.value)}`
                          : `Increase ${row.value}`}
                      </TableCell>
                      <TableCell>{row.value}</TableCell>
                      <TableCell>
                        {row.isAct ? (
                          <span style={{ color: '#bdbdbd' }}>Remove</span>
                        ) : (
                          <Link
                            component="button"
                            color="error"
                            onClick={() => handleRemoveClick(row)}
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

          <TablePagination
            component="div"
            count={stampsTotal}
            page={stampsPage}
            onPageChange={(_, p) => {
              setStampsPage(p);
              fetchScanStampsHistory(selectedBrandId, p);
            }}
            rowsPerPage={TAKE}
            rowsPerPageOptions={[10]}
          />
        </>
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
