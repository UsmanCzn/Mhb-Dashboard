import React, { useEffect, useState, useMemo } from 'react';
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
import { useBranches } from 'providers/branchesProvider';

const TAKE = 10;

const Scans = () => {
  const { cid } = useParams();

  /* ------------------ STATE ------------------ */

  const [selectedBrandId, setSelectedBrandId] = useState('');
  const [selectedBrand, setSelectedBrand] = useState(null);

  const [selectedBranch, setSelectedBranch] = useState(null);

  const [pointRows, setPointRows] = useState([]);
  const [stampRows, setStampRows] = useState([]);

  const [pointsPage, setPointsPage] = useState(0);
  const [stampsPage, setStampsPage] = useState(0);

  const [pointsTotal, setPointsTotal] = useState(0);
  const [stampsTotal, setStampsTotal] = useState(0);

  const [selectedRow, setSelectedRow] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isCommentsModalOpen, setCommentsModalOpen] = useState(false);

  const { brandsList } = useFetchBrandsList(true);
  const { branchesList } = useBranches();
  const { enqueueSnackbar } = useSnackbar();

  /* ------------------ DERIVED DATA ------------------ */

  const filteredBranchesList = useMemo(
    () => branchesList.filter((b) => b.brandId === selectedBrandId),
    [branchesList, selectedBrandId]
  );

  /* ------------------ API CALLS ------------------ */

  const fetchScanHistory = async (branchId, page = 0) => {
    if (!branchId) return;

    try {
      setLoading(true);
      const skip = page * TAKE;

      const res = await customerService.getScansHistoryByBrand(
        branchId,
        TAKE,
        skip
      );

      setPointRows(res?.data?.result?.item1 || []);
      setPointsTotal(res?.data?.result?.item2 || 0);
    } catch {
      setPointRows([]);
      setPointsTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const fetchScanStampsHistory = async (brandId, page = 0) => {
    if (!brandId) return;

    try {
      setLoading(true);
      const skip = page * TAKE;

      const res = await customerService.getScansStampsHistoryByBrand(
        brandId,
        TAKE,
        skip
      );

      setStampRows(res?.data?.result?.item1 || []);
      setStampsTotal(res?.data?.result?.item2 || 0);
    } catch {
      setStampRows([]);
      setStampsTotal(0);
    } finally {
      setLoading(false);
    }
  };

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

      if (selectedBrand?.isPointPrimaryBrand && selectedBranch) {
        fetchScanHistory(selectedBranch.id, pointsPage);
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

  /* ------------------ EFFECTS ------------------ */

  // Select first brand on load
  useEffect(() => {
    if (brandsList.length > 0) {
      setSelectedBrandId(brandsList[0].id);
      setSelectedBrand(brandsList[0]);
    }
  }, [brandsList]);

  // Update selected brand when ID changes
  useEffect(() => {
    const brand = brandsList.find((b) => b.id === selectedBrandId) || null;
    setSelectedBrand(brand);

    setPointRows([]);
    setStampRows([]);
    setPointsPage(0);
    setStampsPage(0);

    if (brand?.isStampPrimaryBrand) {
      fetchScanStampsHistory(selectedBrandId, 0);
    }
  }, [selectedBrandId, brandsList]);

  // Auto-select first branch when brand changes
  useEffect(() => {
    if (filteredBranchesList.length > 0) {
      setSelectedBranch(filteredBranchesList[0]);
    } else {
      setSelectedBranch(null);
    }
  }, [filteredBranchesList]);

  // Fetch POINT scans when branch changes
  useEffect(() => {
    if (!selectedBranch || !selectedBrand?.isPointPrimaryBrand) return;

    setPointsPage(0);
    fetchScanHistory(selectedBranch.id, 0);
  }, [selectedBranch, selectedBrand]);

  /* ------------------ RENDER ------------------ */

  return (
    <>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} container gap={2}>
          {/* BRAND */}
          <FormControl sx={{ minWidth: 220 }}>
            <InputLabel>Brand</InputLabel>
            <Select
              value={selectedBrandId}
              label="Brand"
              onChange={(e) => setSelectedBrandId(e.target.value)}
            >
              {brandsList.map((brand) => (
                <MenuItem key={brand.id} value={brand.id}>
                  {brand.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* BRANCH */}
          <FormControl
            sx={{ minWidth: 220 }}
            disabled={filteredBranchesList.length === 0}
          >
            <InputLabel>Branch</InputLabel>
            <Select
              value={selectedBranch || ''}
              label="Branch"
              onChange={(e) => setSelectedBranch(e.target.value)}
            >
              {filteredBranchesList.map((branch) => (
                <MenuItem key={branch.id} value={branch}>
                  {branch.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {loading && <LinearProgress sx={{ mb: 1 }} />}

      {/* ------------------ POINTS TABLE ------------------ */}
      {selectedBrand?.isPointPrimaryBrand && (
        <>
          <Typography variant="h4" fontWeight={600} sx={{ mb: 1 }}>
            Point Scans History
          </Typography>

          <TableContainer component={Paper} sx={{ maxHeight: 360 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Customer</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Points</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pointRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No records found
                    </TableCell>
                  </TableRow>
                ) : (
                  pointRows.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell>{row.customerName || '-'}</TableCell>
                      <TableCell>
                        {moment(row.creationTime).format('DD/MM/YYYY HH:mm')}
                      </TableCell>
                      <TableCell>{row.pointsEarned}</TableCell>
                      <TableCell>
                        {row.amount} {selectedBrand.currency}
                      </TableCell>
                      <TableCell>
                        {row.isAct ? (
                          <span style={{ color: '#aaa' }}>Remove</span>
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
              fetchScanHistory(selectedBranch?.id, p);
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
            Stamp Scans History
          </Typography>

          <TableContainer component={Paper} sx={{ maxHeight: 360 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Customer</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Qty</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stampRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No records found
                    </TableCell>
                  </TableRow>
                ) : (
                  stampRows.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell>{row.customerName}</TableCell>
                      <TableCell>
                        {moment(row.creationTime).format('DD/MM/YYYY HH:mm')}
                      </TableCell>
                      <TableCell>
                        {row.freeItems && row.value < 0
                          ? `Redeemed ${row.value}`
                          : `Increase ${row.value}`}
                      </TableCell>
                      <TableCell>{row.value}</TableCell>
                      <TableCell>
                        {row.isAct ? (
                          <span style={{ color: '#aaa' }}>Remove</span>
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

export default Scans;
