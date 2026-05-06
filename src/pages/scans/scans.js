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
  Button,
  Box,
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

import customerService from 'services/customerService';
import { useFetchBrandsList } from 'features/BrandsTable/hooks/useFetchBrandsList';
import { useSnackbar } from 'notistack';
import AddCommentsModal from 'components/add-comment-modal';
import LinearProgress from '@mui/material/LinearProgress';
import moment from 'moment';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
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

  const canExportPoints = selectedBrand?.isPointPrimaryBrand && selectedBranch;
  const canExportStamps = selectedBrand?.isStampPrimaryBrand;

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

  const getFullPointRows = async () => {
    if (!selectedBranch?.id) return [];

    const initialRes = await customerService.getScansHistoryByBrand(
      selectedBranch.id,
      1,
      0
    );
    const total = initialRes?.data?.result?.item2 || 0;

    if (!total) return [];

    const fullRes = await customerService.getScansHistoryByBrand(
      selectedBranch.id,
      total,
      0
    );
    return fullRes?.data?.result?.item1 || [];
  };

  const getFullStampRows = async () => {
    if (!selectedBrandId) return [];

    const initialRes = await customerService.getScansStampsHistoryByBrand(
      selectedBrandId,
      1,
      0
    );
    const total = initialRes?.data?.result?.item2 || 0;

    if (!total) return [];

    const fullRes = await customerService.getScansStampsHistoryByBrand(
      selectedBrandId,
      total,
      0
    );
    return fullRes?.data?.result?.item1 || [];
  };

  const buildMonthlySummary = (rows, type) => {
    const monthlyMap = rows.reduce((acc, row) => {
      const key = moment(row.creationTime).format('YYYY-MM');

      if (!acc[key]) {
        acc[key] = {
          month: moment(row.creationTime).format('MMMM YYYY'),
          scansCount: 0,
          points: 0,
          amount: 0,
          qty: 0,
        };
      }

      acc[key].scansCount += 1;

      if (type === 'points') {
        acc[key].points += Number(row.pointsEarned || 0);
        acc[key].amount += Number(row.amount || 0);
      } else {
        acc[key].qty += Number(row.value || 0);
      }

      return acc;
    }, {});

    return Object.values(monthlyMap).sort(
      (a, b) =>
        moment(a.month, 'MMMM YYYY').valueOf() -
        moment(b.month, 'MMMM YYYY').valueOf()
    );
  };

  const groupRowsByMonth = (rows) =>
    rows.reduce((acc, row) => {
      const key = moment(row.creationTime).format('YYYY-MM');
      if (!acc[key]) acc[key] = [];
      acc[key].push(row);
      return acc;
    }, {});

  const setWorksheetLayout = (worksheet, columnWidths = []) => {
    worksheet['!cols'] = columnWidths.map((wch) => ({ wch }));
    if (worksheet['!ref']) {
      worksheet['!autofilter'] = { ref: worksheet['!ref'] };
    }
  };

  const toFileSafeText = (value) =>
    (value || '')
      .toString()
      .trim()
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9_-]/g, '');

  const handleDownloadExcel = async () => {
    try {
      setLoading(true);

      const [allPointRows, allStampRows] = await Promise.all([
        canExportPoints ? getFullPointRows() : Promise.resolve([]),
        canExportStamps ? getFullStampRows() : Promise.resolve([]),
      ]);

      if (allPointRows.length === 0 && allStampRows.length === 0) {
        enqueueSnackbar('No records found to export.', { variant: 'warning' });
        return;
      }

      const wb = XLSX.utils.book_new();
      const rows = [];

      rows.push(['Scans Report']);
      rows.push(['Brand', selectedBrand?.name || '-']);
      rows.push(['Branch', selectedBranch?.name || 'All/Not Applicable']);
      rows.push(['Generated At', moment().format('DD/MM/YYYY HH:mm')]);
      rows.push([]);

      if (allPointRows.length > 0) {
        const groupedPointRows = groupRowsByMonth(allPointRows);
        rows.push(['Point Scans (Grouped By Month)']);

        Object.keys(groupedPointRows)
          .sort()
          .forEach((monthKey) => {
            const monthRows = groupedPointRows[monthKey];
            const monthLabel = moment(monthKey, 'YYYY-MM').format('MMMM YYYY');
            const monthlyTotals = buildMonthlySummary(monthRows, 'points')[0];

            rows.push([]);
            rows.push([`Month: ${monthLabel}`]);
            rows.push([
              'Monthly Total Scans',
              monthlyTotals?.scansCount || 0,
              'Monthly Total Points',
              monthlyTotals?.points || 0,
              'Monthly Total Amount',
              monthlyTotals?.amount || 0,
            ]);
            rows.push(['Customer', 'Date', 'Points', 'Amount', 'Currency']);

            monthRows.forEach((row) => {
              rows.push([
                row.customerName || '-',
                moment(row.creationTime).format('DD/MM/YYYY HH:mm'),
                row.pointsEarned,
                row.amount,
                selectedBrand?.currency || '-',
              ]);
            });
          });
      }

      if (allStampRows.length > 0) {
        const groupedStampRows = groupRowsByMonth(allStampRows);
        rows.push([]);
        rows.push(['Stamp Scans (Grouped By Month)']);

        Object.keys(groupedStampRows)
          .sort()
          .forEach((monthKey) => {
            const monthRows = groupedStampRows[monthKey];
            const monthLabel = moment(monthKey, 'YYYY-MM').format('MMMM YYYY');
            const monthlyTotals = buildMonthlySummary(monthRows, 'stamps')[0];

            rows.push([]);
            rows.push([`Month: ${monthLabel}`]);
            rows.push([
              'Monthly Total Scans',
              monthlyTotals?.scansCount || 0,
              'Monthly Net Qty',
              monthlyTotals?.qty || 0,
            ]);
            rows.push(['Customer', 'Date', 'Description', 'Qty']);

            monthRows.forEach((row) => {
              rows.push([
                row.customerName || '-',
                moment(row.creationTime).format('DD/MM/YYYY HH:mm'),
                row.freeItems && row.value < 0
                  ? `Redeemed ${row.value}`
                  : `Increase ${row.value}`,
                row.value,
              ]);
            });
          });
      }

      const reportSheet = XLSX.utils.aoa_to_sheet(rows);
      setWorksheetLayout(reportSheet, [30, 22, 20, 15, 14, 14]);
      XLSX.utils.book_append_sheet(wb, reportSheet, 'Scans Report');

      const brandName = toFileSafeText(selectedBrand?.name || 'brand');
      const branchName = toFileSafeText(
        selectedBranch?.name || (canExportStamps ? 'all_branches' : 'branch')
      );

      XLSX.writeFile(
        wb,
        `scans_report_${brandName}_${branchName}_${moment().format(
          'YYYYMMDD_HHmm'
        )}.xlsx`
      );

      enqueueSnackbar('Excel report downloaded.', { variant: 'success' });
    } catch {
      enqueueSnackbar('Failed to download Excel report.', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      setLoading(true);

      const [allPointRows, allStampRows] = await Promise.all([
        canExportPoints ? getFullPointRows() : Promise.resolve([]),
        canExportStamps ? getFullStampRows() : Promise.resolve([]),
      ]);

      if (allPointRows.length === 0 && allStampRows.length === 0) {
        enqueueSnackbar('No records found to export.', { variant: 'warning' });
        return;
      }

      const doc = new jsPDF('p', 'mm', 'a4');
      let yPos = 12;

      doc.setFontSize(14);
      doc.text('Scans Report', 14, yPos);
      yPos += 6;

      doc.setFontSize(10);
      doc.text(`Brand: ${selectedBrand?.name || '-'}`, 14, yPos);
      yPos += 5;
      if (selectedBranch?.name) {
        doc.text(`Branch: ${selectedBranch.name}`, 14, yPos);
        yPos += 5;
      }
      doc.text(`Generated at: ${moment().format('DD/MM/YYYY HH:mm')}`, 14, yPos);
      yPos += 8;

      if (allPointRows.length > 0) {
        const pointMonthly = buildMonthlySummary(allPointRows, 'points');

        doc.setFontSize(12);
        doc.text('Point Scans Monthly Summary', 14, yPos);
        yPos += 2;

        autoTable(doc, {
          startY: yPos,
          head: [['Month', 'Total Scans', 'Total Points', 'Total Amount']],
          body: pointMonthly.map((row) => [
            row.month,
            row.scansCount,
            row.points,
            row.amount.toFixed(2),
          ]),
        });

        yPos = (doc.lastAutoTable?.finalY || yPos) + 6;

        doc.setFontSize(12);
        doc.text('Point Scans Details', 14, yPos);
        yPos += 2;

        autoTable(doc, {
          startY: yPos,
          head: [['Customer', 'Date', 'Points', 'Amount']],
          body: allPointRows.map((row) => [
            row.customerName || '-',
            moment(row.creationTime).format('DD/MM/YYYY HH:mm'),
            row.pointsEarned,
            row.amount,
          ]),
        });

        yPos = (doc.lastAutoTable?.finalY || yPos) + 8;
      }

      if (allStampRows.length > 0) {
        if (yPos > 240) {
          doc.addPage();
          yPos = 12;
        }

        const stampMonthly = buildMonthlySummary(allStampRows, 'stamps');

        doc.setFontSize(12);
        doc.text('Stamp Scans Monthly Summary', 14, yPos);
        yPos += 2;

        autoTable(doc, {
          startY: yPos,
          head: [['Month', 'Total Scans', 'Net Qty']],
          body: stampMonthly.map((row) => [row.month, row.scansCount, row.qty]),
        });

        yPos = (doc.lastAutoTable?.finalY || yPos) + 6;

        doc.setFontSize(12);
        doc.text('Stamp Scans Details', 14, yPos);
        yPos += 2;

        autoTable(doc, {
          startY: yPos,
          head: [['Customer', 'Date', 'Description', 'Qty']],
          body: allStampRows.map((row) => [
            row.customerName || '-',
            moment(row.creationTime).format('DD/MM/YYYY HH:mm'),
            row.freeItems && row.value < 0
              ? `Redeemed ${row.value}`
              : `Increase ${row.value}`,
            row.value,
          ]),
        });
      }

      const brandName = toFileSafeText(selectedBrand?.name || 'brand');
      const branchName = toFileSafeText(
        selectedBranch?.name || (canExportStamps ? 'all_branches' : 'branch')
      );

      doc.save(
        `scans_report_${brandName}_${branchName}_${moment().format(
          'YYYYMMDD_HHmm'
        )}.pdf`
      );

      enqueueSnackbar('PDF report downloaded.', { variant: 'success' });
    } catch {
      enqueueSnackbar('Failed to download PDF report.', { variant: 'error' });
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

        <Grid item xs={12}>
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button
              variant="outlined"
              startIcon={<FileDownloadIcon />}
              onClick={handleDownloadExcel}
              disabled={!canExportPoints && !canExportStamps}
            >
              Download Excel
            </Button>

            <Button
              variant="outlined"
              color="error"
              startIcon={<PictureAsPdfIcon />}
              onClick={handleDownloadPDF}
              disabled={!canExportPoints && !canExportStamps}
            >
              Download PDF
            </Button>
          </Box>
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
