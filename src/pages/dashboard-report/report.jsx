import React, { useEffect, useRef, useState } from 'react';

// material-ui
import {
  Box,
  Button,
  Card,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';

// project imports
import { useBranches } from 'providers/branchesProvider';
import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import { useFetchBrandsList } from 'features/BrandsTable/hooks/useFetchBrandsList';
import { useDashboard } from 'features/dashbord/hooks/useDashboard';
import MonthlyLineChart from '../dashboard/MonthlyBarChart';
import OrdersTable from '../dashboard/OrdersTable';
import { useAuth } from 'providers/authProvider';

// >>> PEAK HOURS: chart import
import HourlyActivityChart from '../dashboard/peakhoursChart'; // adjust path if different

// date picker
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';

// export libs
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// ==============================|| DASHBOARD REPORT ||============================== //

const DECIMALS = 3;

const DashboardReport = () => {
  const [reload, setReload] = useState(false);
  const { brandsList } = useFetchBrandsList(reload);
  const { branchesList } = useBranches();
  const { userRole } = useAuth();

  const [startDate, setStartDate] = useState(() => {
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() - 1);
    return currentDate;
  });
  const [endDate, setEndDate] = useState(new Date());
  const [selectedBrand, setselectedBrand] = useState({});
  const [selectedBranch, setselectedBranch] = useState('');
  const [filteredBranches, setFilteredBranches] = useState([]);

  const [topPayers, setTopPayers] = useState();
  const [ordersChartData, setOrdersChartData] = useState();
  const [chartDataUpdateCounter, setChartDataUpdateCounter] = useState(0);

  // >>> PEAK HOURS: local state + ref
  const [peakhours, setPeakhours] = useState([]);
  const [peakSummary, setPeakSummary] = useState({
    peakHour: 0,
    peakCount: 0,
    averagePerHour: 0,
    normalized: []
  });
  const peakChartRef = useRef(null); // used to grab chart PNG for PDF

  const { dashbaordBoardData, loading } = useDashboard(
    reload,
    selectedBrand?.id,
    startDate,
    endDate,
    selectedBranch?.id
  );

  // ----- HELPERS -----
  const getCurrencyDecimals = () => DECIMALS; // force 3 decimals everywhere

  const formatAmount = (value) => {
    const num = Number(value ?? 0);
    if (Number.isNaN(num)) return (0).toFixed(DECIMALS);
    return num.toFixed(DECIMALS);
  };

  const formatIncomeDate = (value) => {
    if (!value) return '';
    const d = dayjs(value);
    if (!d.isValid()) return String(value);
    return d.format('YYYY-MM-DD');
  };

  // >>> PEAK HOURS: helpers
  const normalizeHourly = (raw = []) => {
    const byHour = new Map(raw.map((d) => [Number(d.hour), Number(d.count) || 0]));
    return Array.from({ length: 24 }, (_, h) => ({ hour: h, count: byHour.get(h) ?? 0 }));
  };

  const summarizePeakHours = (raw = []) => {
    const normalized = normalizeHourly(raw);
    const total = normalized.reduce((s, r) => s + r.count, 0);
    const peak = normalized.reduce(
      (best, r) => (r.count > best.count ? r : best),
      { hour: 0, count: 0 }
    );
    const avg = total / 24;
    return {
      normalized,
      peakHour: peak.hour,
      peakCount: peak.count,
      averagePerHour: avg
    };
  };

  const hourLabel = (h) => `${String(h).padStart(2, '0')}:00`;

  // Reusable styles so numeric columns line up across tables
  const tableSx = {
    '& th, & td': {
      py: 1,
      fontVariantNumeric: 'tabular-nums',
    },
    '& th': { fontWeight: 600 },
    '& td:first-of-type, & th:first-of-type': { textAlign: 'left', width: '60%' },
    '& td:last-of-type, & th:last-of-type': { textAlign: 'right', width: '40%' }
  };

  // ----- TABLE HEADERS -----
  const headCells = [
    { id: 'name', align: 'left', disablePadding: true, label: 'Name' },
    { id: 'fat', align: 'right', disablePadding: false, label: 'Total Order' },
    { id: 'carbs', align: 'right', disablePadding: false, label: 'Amount' }
  ];

  const headCellsTop10 = [
    { id: 'name', align: 'left', disablePadding: true, label: 'Name' },
    { id: 'salesPercent', align: 'right', disablePadding: false, label: 'Ordered' },
    { id: 'sales', align: 'right', disablePadding: false, label: 'Sales' }
  ];

  // ----- DATE HELPERS -----
  const getMaxEndDate = (start) => {
    return start ? dayjs(start).add(31, 'day') : new Date();
  };

  const handleDateChange = (newValue) => {
    setStartDate(newValue);
    const maxEndDate = getMaxEndDate(newValue);
    if (!endDate || dayjs(endDate).isAfter(maxEndDate)) {
      setEndDate(maxEndDate);
    }
  };

  const handleEndDateChange = (newValue) => {
    setEndDate(newValue);
  };

  const getData = () => {
    setReload((prev) => !prev);
  };

  // ----- FILTER BRANCHES -----
  const changeFilteredBranches = (brand) => {
    if (!brand?.id) {
      setFilteredBranches([]);
      setselectedBranch('');
      return;
    }

    let branchesForSelectedBrand = branchesList.filter(
      (branch) => branch.brandId === brand.id
    );

    if (
      userRole === 'ADMIN' ||
      userRole === 'COMPANY_ADMIN' ||
      userRole === 'BRAND_MANAGER'
    ) {
      const allBranchesOption = {
        id: 0,
        name: 'All Branches',
        brandId: brand.id
      };

      branchesForSelectedBrand = [allBranchesOption, ...branchesForSelectedBrand];
    }

    setFilteredBranches(branchesForSelectedBrand);

    if (branchesForSelectedBrand.length > 0) {
      setselectedBranch(branchesForSelectedBrand[0]);
    }
  };

  // ----- SET DATA WHEN DASHBOARD DATA CHANGES -----
  useEffect(() => {
    setTopPayers(dashbaordBoardData?.topUsersFromSales);
    setOrdersChartData(dashbaordBoardData?.ordersChartData);
    setChartDataUpdateCounter((prev) => prev + 1);

    // >>> PEAK HOURS: pull hourly array from API and summarize
    const hourly = dashbaordBoardData?.peakHoursData?.hourly ?? [];
    const safeHourly = Array.isArray(hourly) ? hourly : [];
    setPeakhours(safeHourly);
    setPeakSummary(summarizePeakHours(safeHourly));
  }, [dashbaordBoardData]);

  // ----- INITIAL BRAND SELECTION -----
  useEffect(() => {
    if (brandsList[0]?.id) {
      if (brandsList && brandsList.length > 2) {
        if (userRole === 'ADMIN') {
          brandsList.unshift({ id: 0, name: 'All Brands' });
        }
        setselectedBrand(brandsList[0]);
      } else {
        setselectedBrand(brandsList[0]);
        changeFilteredBranches(brandsList[0]);
      }
      setOrdersChartData(null);
      setReload((prev) => !prev);
    }
  }, [brandsList]);

  // ================== EXPORT HELPERS ==================

  const topTenProducts = dashbaordBoardData?.topTenProducts ?? [];
  const incomeOverview = dashbaordBoardData?.ordersChartData ?? [];

  // --- EXCEL ---
  const handleExportExcel = () => {
    const wb = XLSX.utils.book_new();

    // 1) Top Payers (TOP 10 ONLY)
    const topPayersData = (topPayers || [])
      .slice(0, 10)
      .map((row, idx) => ({
        '#': idx + 1,
        Name: row?.userFullName ?? row?.name ?? '',
        'Total Orders': row.totalOrders ?? 0,
        Amount: formatAmount(row.totalSale)
      }));
    const wsTopPayers = XLSX.utils.json_to_sheet(topPayersData);
    XLSX.utils.book_append_sheet(wb, wsTopPayers, 'Top Payers');

    // 2) Top 10 Products
    const topProductsData = topTenProducts.map((row, idx) => ({
      '#': idx + 1,
      Product: row.productName ?? row.name ?? '',
      Ordered: row.countOrdered ?? row.orderCount ?? 0,
      Sales: formatAmount(row.sales ?? row.totalSales)
    }));
    const wsProducts = XLSX.utils.json_to_sheet(topProductsData);
    XLSX.utils.book_append_sheet(wb, wsProducts, 'Top Products');

    // 3) Income Overview
    const incomeData = incomeOverview.map((row) => {
      const totalSales =
        row.totalSale ?? row.totalSales ?? row.total ?? 0;
      const totalOrders =
        row.totalOrders ?? row.totalOrder ?? row.orderCount ?? 0;

      return {
        Date: formatIncomeDate(row.date),
        'Total Sales': formatAmount(totalSales),
        'Total Orders': totalOrders
      };
    });
    const wsIncome = XLSX.utils.json_to_sheet(incomeData);
    XLSX.utils.book_append_sheet(wb, wsIncome, 'Income Overview');

    // 4) Peak Hours sheet (24-hour table)
    const peakRows = peakSummary.normalized.map((r) => ({
      Hour: `${String(r.hour).padStart(2, '0')}:00`,
      Orders: r.count
    }));
    const wsPeak = XLSX.utils.json_to_sheet([
      { Metric: 'Peak Hour', Value: `${String(peakSummary.peakHour).padStart(2, '0')}:00` },
      { Metric: 'Peak Orders', Value: peakSummary.peakCount },
      { Metric: 'Average Orders / Hour', Value: Number(peakSummary.averagePerHour).toFixed(DECIMALS) },
      {},
      { Hour: 'Hour', Orders: 'Orders' },
      ...peakRows
    ]);
    XLSX.utils.book_append_sheet(wb, wsPeak, 'Peak Hours');

    const fileName = `dashboard_report_${new Date()
      .toISOString()
      .slice(0, 10)}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  // --- PDF ---
  const handleExportPDF = async () => {
    const doc = new jsPDF('p', 'mm', 'a4');

    const currentDate = new Date().toLocaleString();
    let yPos = 10;

    // Header
    doc.setFontSize(16);
    doc.text('Dashboard Report', 14, yPos);
    doc.setFontSize(10);
    yPos += 6;
    doc.text(`Brand: ${selectedBrand?.name || 'N/A'}`, 14, yPos);
    yPos += 5;
    if (selectedBranch?.name) {
      doc.text(`Branch: ${selectedBranch.name}`, 14, yPos);
      yPos += 5;
    }
    doc.text(`Generated at: ${currentDate}`, 14, yPos);
    yPos += 8;

    // Summary
    doc.setFontSize(12);
    doc.text('Summary', 14, yPos);
    yPos += 4;
    doc.setFontSize(10);

    const summary = [
      ['Total Orders', String(dashbaordBoardData?.totalOrders ?? 0)],
      ['Total Sales', formatAmount(dashbaordBoardData?.totalSale)],
      ['Avg Dispatch Time', String(dashbaordBoardData?.avgDispatchTime ?? 0)],
      ['People Signed Up', String(dashbaordBoardData?.totalRegisteredCustomers ?? 0)],
      ['Points Collected', String(dashbaordBoardData?.totalPointsEarned ?? 0)],
      ['Free Drinks', String(dashbaordBoardData?.totalFreeDrinks ?? 0)],
      ['Points Redeemed', String(dashbaordBoardData?.pointsRedeemed ?? 0)],
      ['Customers Ordered', String(dashbaordBoardData?.customerCount ?? 0)]
    ];

    autoTable(doc, {
      head: [['Metric', 'Value']],
      body: summary,
      startY: yPos,
      styles: { fontSize: 9 },
      headStyles: { halign: 'left' },
      columnStyles: {
        0: { halign: 'left' },
        1: { halign: 'right' } // align values
      }
    });

    yPos = (doc.lastAutoTable?.finalY || yPos) + 6;

    // PEAK HOURS: summary + chart image + 24-hour table
    doc.setFontSize(12);
    doc.text('Peak Hours', 14, yPos);
    yPos += 4;

    autoTable(doc, {
      head: [['Metric', 'Value']],
      body: [
        ['Peak Hour', `${String(peakSummary.peakHour).padStart(2, '0')}:00`],
        ['Peak Orders', String(peakSummary.peakCount)],
        ['Average Orders / Hour', Number(peakSummary.averagePerHour).toFixed(DECIMALS)]
      ],
      startY: yPos,
      styles: { fontSize: 9 },
      headStyles: { halign: 'left' },
      columnStyles: { 0: { halign: 'left' }, 1: { halign: 'right' } }
    });

    yPos = (doc.lastAutoTable?.finalY || yPos) + 4;

    try {
      const imgURI = await peakChartRef.current?.getDataURI?.();
      if (imgURI) {
        const imgWidth = 180; // page width minus margins
        const imgHeight = 70;
        doc.addImage(imgURI, 'PNG', 14, yPos, imgWidth, imgHeight);
        yPos += imgHeight + 6;
      }
    } catch (e) {
      // ignore if not available
    }

    // 24-hour table
    const peakTableRows = peakSummary.normalized.map((r, idx) => ([
      idx + 1,
      hourLabel(r.hour),
      String(r.count)
    ]));
    autoTable(doc, {
      head: [['#', 'Hour', 'Orders']],
      body: peakTableRows,
      startY: yPos,
      styles: { fontSize: 9 },
      headStyles: { halign: 'right' },
      columnStyles: {
        0: { halign: 'right', cellWidth: 8 },
        1: { halign: 'left' },
        2: { halign: 'right' }
      }
    });

    yPos = (doc.lastAutoTable?.finalY || yPos) + 6;

    // Top Payers (TOP 10 ONLY)
    if (topPayers?.length) {
      doc.setFontSize(12);
      doc.text('Top Payers', 14, yPos);
      yPos += 4;

      const topPayersBody = (topPayers || [])
        .slice(0, 10)
        .map((row, idx) => [
          idx + 1,
          row.userFullName ?? row.name ?? '',
          String(row.totalOrders ?? row.totalOrder ?? 0),
          formatAmount(row.totalSale ?? 0)
        ]);

      autoTable(doc, {
        head: [['#', 'Name', 'Total Orders', 'Amount']],
        body: topPayersBody,
        startY: yPos,
        styles: { fontSize: 9 },
        headStyles: { halign: 'right' },
        columnStyles: {
          0: { halign: 'right', cellWidth: 8 },
          1: { halign: 'left' },
          2: { halign: 'right' },
          3: { halign: 'right' }
        }
      });

      yPos = (doc.lastAutoTable?.finalY || yPos) + 6;
    }

    // Top 10 Products
    const topTenProducts = dashbaordBoardData?.topTenProducts ?? [];
    if (topTenProducts.length) {
      doc.setFontSize(12);
      doc.text('Top 10 Ordered Products', 14, yPos);
      yPos += 4;

      const productsBody = topTenProducts
        .slice()
        .sort((a, b) => (b.countOrdered ?? 0) - (a.countOrdered ?? 0))
        .map((row, idx) => [
          idx + 1,
          row.productName ?? row.name ?? '',
          String(row.countOrdered ?? row.orderCount ?? 0),
          formatAmount(row.sales ?? row.totalSales)
        ]);

      autoTable(doc, {
        head: [['#', 'Product', 'Ordered', 'Sales']],
        body: productsBody,
        startY: yPos,
        styles: { fontSize: 9 },
        headStyles: { halign: 'right' },
        columnStyles: {
          0: { halign: 'right', cellWidth: 8 },
          1: { halign: 'left' },
          2: { halign: 'right' },
          3: { halign: 'right' }
        }
      });

      yPos = (doc.lastAutoTable?.finalY || yPos) + 6;
    }

    // Income Overview table
    if (incomeOverview.length) {
      doc.addPage();
      yPos = 10;
      doc.setFontSize(12);
      doc.text('Income Overview', 14, yPos);
      yPos += 4;
      doc.setFontSize(10);

      const incomeBody = incomeOverview.map((row, idx) => {
        const totalSales =
          row.totalSale ?? row.totalSales ?? row.total ?? 0;
        const totalOrders =
          row.totalOrders ?? row.totalOrder ?? row.orderCount ?? 0;

        return [
          idx + 1,
          formatIncomeDate(row.date),
          formatAmount(totalSales),
          String(totalOrders)
        ];
      });

      autoTable(doc, {
        head: [['#', 'Date', 'Total Sales', 'Total Orders']],
        body: incomeBody,
        startY: yPos,
        styles: { fontSize: 9 },
        headStyles: { halign: 'right' },
        columnStyles: {
          0: { halign: 'right', cellWidth: 8 },
          1: { halign: 'left' },
          2: { halign: 'right' },
          3: { halign: 'right' }
        }
      });
    }

    doc.save(`dashboard_report_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  // ================== TOP CARDS ==================
  const topCard = () => {
    const totalSaleNumber = Number(dashbaordBoardData?.totalSale ?? 0);
    const roundedNumber = totalSaleNumber.toFixed(DECIMALS);

    return (
      <>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <AnalyticEcommerce
            title="Total Order"
            isLoading={loading}
            count={dashbaordBoardData?.totalOrders ?? 0}
            percentage={27.4}
            extra="1,943"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <AnalyticEcommerce
            title="Total Sales"
            count={
              selectedBrand?.currency
                ? `${roundedNumber}${selectedBrand.currency}`
                : `${roundedNumber}`
            }
            isLoading={loading}
            percentage={27.4}
            isLoss
            color="warning"
            extra="$20,395"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <AnalyticEcommerce
            title="Avg order ready time"
            count={dashbaordBoardData?.avgDispatchTime ?? 0}
            isLoading={loading}
            percentage={27.4}
            extra="1,943"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <AnalyticEcommerce
            title="People Signed Up"
            count={
              dashbaordBoardData?.totalRegisteredCustomers === undefined
                ? 0
                : dashbaordBoardData?.totalRegisteredCustomers
            }
            isLoading={loading}
            percentage={27.4}
            isLoss
            color="warning"
            extra="$20,395"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <AnalyticEcommerce
            title="Points Collected"
            count={dashbaordBoardData?.totalPointsEarned ?? 0}
            isLoading={loading}
            percentage={27.4}
            extra="1,943"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <AnalyticEcommerce
            title="Free Drinks"
            count={dashbaordBoardData?.totalFreeDrinks ?? 0}
            isLoading={loading}
            percentage={27.4}
            isLoss
            color="warning"
            extra="$20,395"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <AnalyticEcommerce
            title="Points Redeemed"
            count={dashbaordBoardData?.pointsRedeemed ?? 0}
            isLoading={loading}
            percentage={27.4}
            extra="1,943"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <AnalyticEcommerce
            title="Customers Ordered"
            count={dashbaordBoardData?.customerCount ?? 0}
            isLoading={loading}
            percentage={27.4}
            isLoss
            color="warning"
            extra="$20,395"
          />
        </Grid>
      </>
    );
  };

  // ================== RENDER ==================

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* Header + Export Buttons */}
      <Grid item xs={12}>
        <Grid
          container
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
        >
          <Grid item xs={12} md="auto">
            <Typography fontSize={22} fontWeight={700}>
              Dashboard Reports
            </Typography>
          </Grid>

          <Grid item xs={12} md="auto">
            <Box display="flex" gap={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                disabled={loading}
                onClick={handleExportExcel}
              >
                Export Excel
              </Button>
              <Button
                variant="contained"
                disabled={loading}
                onClick={handleExportPDF}
              >
                Export PDF
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Grid>

      {/* Brand / Branch Filters */}
      <Grid item xs={12}>
        <Grid
          container
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
        >
          <Grid item xs={12} md={6}>
            <Grid
              container
              spacing={2}
              alignItems="center"
              justifyContent="flex-start"
            >
              {/* Brand Select */}
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel id="brand-select-label">Brand</InputLabel>
                  <Select
                    labelId="brand-select-label"
                    id="brand-select"
                    value={selectedBrand}
                    label="Brand"
                    onChange={(event) => {
                      setselectedBrand(event.target.value);
                      changeFilteredBranches(event.target.value);
                      setReload((prev) => !prev);
                    }}
                  >
                    {brandsList.map((row, index) => (
                      <MenuItem key={index} value={row}>
                        {row?.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Branch Select */}
              {selectedBrand?.id !== 0 && (
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel id="branch-select-label">Branch</InputLabel>
                    <Select
                      labelId="branch-select-label"
                      id="branch-select"
                      value={selectedBranch}
                      label="Branch"
                      onChange={(event) => {
                        setselectedBranch(event.target.value);
                        setReload((prev) => !prev);
                      }}
                    >
                      {filteredBranches.map((row, index) => (
                        <MenuItem key={index} value={row}>
                          {row?.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Date Filters */}
      <Grid item xs={12}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Start"
                value={startDate}
                renderInput={(params) => <TextField {...params} fullWidth />}
                onChange={(newValue) => {
                  handleDateChange(newValue);
                }}
                minDate={new Date(2023, 0, 1)}
                maxDate={new Date()}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} sm={3}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="End"
                value={endDate}
                renderInput={(params) => <TextField {...params} fullWidth />}
                onChange={(newValue) => {
                  handleEndDateChange(newValue);
                }}
                minDate={new Date(2023, 0, 1)}
                maxDate={getMaxEndDate(startDate)}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item>
            <Button variant="contained" onClick={getData}>
              Submit
            </Button>
          </Grid>
        </Grid>
      </Grid>

      {/* Stats cards */}
      {topCard()}

      {/* Top Payers (TOP 10) */}
      <Grid item xs={12} md={6} lg={6}>
        <Card>
          <Box p={2}>
            <Grid container alignItems="center" justifyContent="space-between">
              <Grid item>
                <Typography variant="h5">Top Payers (Top 10)</Typography>
              </Grid>
            </Grid>
            {/* numeric alignment improvement */}
            <MainCard sx={{ mt: 2, '& td': { fontVariantNumeric: 'tabular-nums' } }} content={false}>
              <OrdersTable
                users={topPayers?.slice(0, 10)}
                payers={true}
                headers={headCells}
                selectedBrand={selectedBrand}
              />
            </MainCard>
          </Box>
        </Card>
      </Grid>

      {/* Top 10 Products */}
      <Grid item xs={12} md={6} lg={6}>
        <Card>
          <Box p={2}>
            <Grid container alignItems="center" justifyContent="space-between">
              <Grid item>
                <Typography variant="h5">Top 10 ordered Product</Typography>
              </Grid>
            </Grid>
            {/* numeric alignment improvement */}
            <MainCard sx={{ mt: 2, '& td': { fontVariantNumeric: 'tabular-nums' } }} content={false}>
              <OrdersTable
                users={[]}
                payers={false}
                headers={headCellsTop10}
                selectedBrand={selectedBrand}
                top10Products={topTenProducts
                  ?.slice()
                  .sort((a, b) => b.countOrdered - a.countOrdered)}
              />
            </MainCard>
          </Box>
        </Card>
      </Grid>

      {/* Income Overview chart */}
      <Grid item xs={12} md={12} lg={12}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Income Overview</Typography>
          </Grid>
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          {ordersChartData && (
            <MonthlyLineChart
              data={ordersChartData}
              selectedBrand={selectedBrand}
              key={chartDataUpdateCounter}
            />
          )}
        </MainCard>
      </Grid>

      {/* >>> PEAK HOURS: UI section */}
      <Grid item xs={12} md={12} lg={12}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Peak Hours</Typography>
            <Typography variant="body2" color="text.secondary">
              Busiest hour:&nbsp;{hourLabel(peakSummary.peakHour)}
              &nbsp;•&nbsp; Orders:&nbsp;{peakSummary.peakCount}
              &nbsp;•&nbsp; Avg/hr:&nbsp;{Number(peakSummary.averagePerHour).toFixed(DECIMALS)}
            </Typography>
          </Grid>
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <Box p={2}>
            {peakhours?.length ? (
              <>
                {/* Chart restored */}
                <HourlyActivityChart ref={peakChartRef} data={peakhours} />

              </>
            ) : (
              <Typography p={2} variant="body2" color="text.secondary">
                No hourly data.
              </Typography>
            )}
          </Box>
        </MainCard>
      </Grid>
    </Grid>
  );
};

export default DashboardReport;
