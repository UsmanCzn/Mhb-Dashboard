import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Grid,
  Card,
  Typography,
  Select,
  MenuItem,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  FormControl,
  InputLabel,
} from '@mui/material';
import { useFetchBrandsList } from 'features/BrandsTable/hooks/useFetchBrandsList';
import brandCommissionService from 'services/brandCommissionService';
import InvoicePaymentDialog from './commission-payment';
import { useAuth } from 'providers/authProvider';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const ReportsAndStatements = () => {
  /* =======================
     CONSTANTS
  ======================= */
  const MONTHS = [
    { label: 'January', value: 1 },
    { label: 'February', value: 2 },
    { label: 'March', value: 3 },
    { label: 'April', value: 4 },
    { label: 'May', value: 5 },
    { label: 'June', value: 6 },
    { label: 'July', value: 7 },
    { label: 'August', value: 8 },
    { label: 'September', value: 9 },
    { label: 'October', value: 10 },
    { label: 'November', value: 11 },
    { label: 'December', value: 12 },
  ];

  const START_YEAR = 2024;
  const CURRENT_YEAR = new Date().getFullYear();
  const YEARS = Array.from(
    { length: CURRENT_YEAR - START_YEAR + 1 },
    (_, i) => START_YEAR + i
  );

  /* =======================
     STATE
  ======================= */
  const { brandsList } = useFetchBrandsList(false);
  const { userRole } = useAuth();

  const currentDate = new Date();
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);

  const [summaryData, setSummaryData] = useState(null);
  const [invoices, setInvoices] = useState([]);

  const [openPayment, setOpenPayment] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);

  /* =======================
     INITIAL BRAND
  ======================= */
  useEffect(() => {
    if (brandsList?.length) {
      setSelectedBrand(brandsList[0]);
    }
  }, [brandsList]);

  /* =======================
     FETCH DATA
  ======================= */
  useEffect(() => {
    if (!selectedBrand) return;

    const fetchAll = async () => {
      const [summaryRes, invoiceRes] = await Promise.all([
        brandCommissionService.GetCurrentMonthCommission(
          selectedBrand.id,
          selectedMonth,
          selectedYear
        ),
        brandCommissionService.GetBrandCommissionInvoice(
          selectedBrand.id,
          selectedMonth,
          selectedYear
        ),
      ]);

      setSummaryData(summaryRes?.data?.result ?? null);
      setInvoices(invoiceRes?.data?.result ?? []);
    };

    fetchAll();
  }, [selectedBrand, selectedMonth, selectedYear]);

  /* =======================
     SOURCE OF TRUTH
  ======================= */
  const useSummaryFallback = !Array.isArray(invoices) || invoices.length === 0;

  const currentData = useMemo(
    () => (useSummaryFallback ? summaryData : invoices[0]),
    [useSummaryFallback, summaryData, invoices]
  );

  /* =======================
     DERIVED VALUES
  ======================= */
  const totalOrders =
    (currentData?.applePayOrders ?? 0) +
    (currentData?.ccOrders ?? 0) +
    (currentData?.knetOrders ?? 0);

  const totalSales =
    (currentData?.applePaySale ?? 0) +
    (currentData?.ccSale ?? 0) +
    (currentData?.knetSale ?? 0);

  const totalCommissionFlat = currentData?.totalCommissionFlat ?? 0;
  const totalCommissionPercentage = currentData?.totalCommissionPercentage ?? 0;

  const commissionDue = (
    totalCommissionFlat + totalCommissionPercentage
  ).toFixed(selectedBrand?.currencyDecimals ?? 3);

  /* =======================
     HELPERS
  ======================= */
  const formatAmount = (amount, decimals = 3, currency = '') =>
    `${(amount ?? 0).toFixed(decimals)} ${currency}`;

  const getMonthLabel = (month) =>
    MONTHS.find(m => m.value === month)?.label ?? `Month ${month}`;

  /* =======================
     PDF (UNCHANGED LOGIC)
  ======================= */
const downloadPdfReport = () => {
  if (!currentData || !selectedBrand) return;

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  /* =======================
     HEADER
  ======================= */
  doc.setFontSize(16);
  doc.text('Commission Report', pageWidth / 2, 15, { align: 'center' });

  doc.setFontSize(11);
  doc.text(`Brand: ${selectedBrand.name}`, 14, 25);
  doc.text(`Period: ${getMonthLabel(selectedMonth)} ${selectedYear}`, 14, 32);

  /* =======================
     SUMMARY SECTION
  ======================= */
  autoTable(doc, {
    startY: 40,
    theme: 'grid',
    styles: { fontSize: 9 },
    head: [['Metric', 'Value']],
    body: [
      ['Total Orders', totalOrders],
      [
        'Total Sales',
        formatAmount(
          totalSales,
          selectedBrand.currencyDecimals,
          selectedBrand.currency
        ),
      ],
      [
        'Commission Due',
        formatAmount(
          totalCommissionFlat + totalCommissionPercentage,
          selectedBrand.currencyDecimals,
          selectedBrand.currency
        ),
      ],
      ['Status', currentData.isPaid ? 'Paid' : 'Unpaid'],
    ],
  });

  /* =======================
     PAYMENT METHOD BREAKDOWN
  ======================= */
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 10,
    theme: 'grid',
    styles: { fontSize: 9 },
    head: [
      [
        'Payment Method',
        'Orders',
        'Sales',
        'Flat Commission',
        'Commission %',
      ],
    ],
    body: [
      ...paymentMethods.map((method) => [
        method.toUpperCase(),
        currentData?.[`${method}Orders`] ?? 0,
        formatAmount(
          currentData?.[`${method}Sale`],
          selectedBrand.currencyDecimals,
          selectedBrand.currency
        ),
        formatAmount(
          currentData?.[`${method}CommissionFlat`],
          selectedBrand.currencyDecimals,
          selectedBrand.currency
        ),
        `${currentData?.[`${method}CommissionPercentage`] ?? 0}%`,
      ]),
      [
        'TOTAL',
        totals.orders,
        formatAmount(
          totals.sales,
          selectedBrand.currencyDecimals,
          selectedBrand.currency
        ),
        formatAmount(
          totals.flatCommission,
          selectedBrand.currencyDecimals,
          selectedBrand.currency
        ),
        `${totals.percentage}%`,
      ],
    ],
  });

  /* =======================
     COMMISSION STATEMENTS
  ======================= */
  if (Array.isArray(invoices) && invoices.length > 0) {
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      theme: 'grid',
      styles: { fontSize: 9 },
      head: [['Month', 'Total Commission', 'Status']],
      body: invoices.map((invoice) => [
        `${getMonthLabel(invoice.month)} ${invoice.year}`,
        formatAmount(
          invoice.totalCommissionFlat + invoice.totalCommissionPercentage,
          selectedBrand.currencyDecimals,
          selectedBrand.currency
        ),
        invoice.isPaid ? 'Paid' : 'Unpaid',
      ]),
    });
  }

  /* =======================
     FOOTER
  ======================= */
  doc.setFontSize(8);
  doc.text(
    `Generated on ${new Date().toLocaleString()}`,
    pageWidth / 2,
    doc.internal.pageSize.getHeight() - 10,
    { align: 'center' }
  );

  doc.save(
    `Commission_Report_${selectedBrand.name}_${selectedMonth}_${selectedYear}.pdf`
  );
};



  const paymentMethods = ['applePay', 'cc', 'knet'];

const totals = paymentMethods.reduce(
  (acc, method) => {
    acc.orders += currentData?.[`${method}Orders`] ?? 0;
    acc.sales += currentData?.[`${method}Sale`] ?? 0;
    acc.flatCommission += currentData?.[`${method}CommissionFlat`] ?? 0;
    acc.percentage += currentData?.[`${method}CommissionPercentage`] ?? 0;
    return acc;
  },
  {
    orders: 0,
    sales: 0,
    flatCommission: 0,
    percentage: 0,
  }
);


  /* =======================
     RENDER
  ======================= */
  return (
    <>
      <Box p={3}>
        <Typography variant="h5" fontWeight={600} mb={2}>
          Reports & Statements
        </Typography>

        {/* Filters */}
        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Brand</InputLabel>
              <Select
                value={selectedBrand || ''}
                label="Brand"
                onChange={(e) => setSelectedBrand(e.target.value)}
              >
                {brandsList.map((brand) => (
                  <MenuItem key={brand.id} value={brand}>
                    {brand.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Month</InputLabel>
              <Select
                label="Month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
              >
                {MONTHS.map((m) => (
                  <MenuItem key={m.value} value={m.value}>
                    {m.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Year</InputLabel>
              <Select
                label="Year"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                {YEARS.map((y) => (
                  <MenuItem key={y} value={y}>
                    {y}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* SUMMARY CARDS */}
        <Grid container spacing={2} mb={4}>
          <Grid item xs={12} md={4}>
            <Grid container spacing={2}>
              {[
                { label: 'Total Orders', value: `${totalOrders} Orders` },
                { label: 'Total Sales', value: formatAmount(totalSales, selectedBrand?.currencyDecimals, selectedBrand?.currency) },
                { label: 'Commission Due', value: formatAmount(Number(commissionDue), selectedBrand?.currencyDecimals, selectedBrand?.currency) },
                { label: 'Status', value: currentData?.isPaid ? 'Paid' : 'Unpaid' },
              ].map((item, i) => (
                <Grid item xs={12} sm={6} key={i}>
                  <Card sx={{ p: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      {item.label}
                    </Typography>
                    <Typography fontWeight={600}>{item.value}</Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Card sx={{ p: 2, mt: 2 }}>
              {userRole === 'ADMIN' && !currentData?.isPaid && (
                <Button variant="contained" fullWidth size="small" sx={{ mb: 1 }}>
                  Send Invoice
                </Button>
              )}
              <Button variant="outlined" fullWidth size="small" onClick={downloadPdfReport}>
                Download PDF
              </Button>
            </Card>
          </Grid>

          {/* RIGHT SIDE PAYMENT TABLE — PRESERVED */}
          <Grid item xs={12} md={8}>
            <Card>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Payment Method</TableCell>
                    <TableCell align="right">Orders</TableCell>
                    <TableCell align="right">Sales</TableCell>
                    <TableCell align="right">Flat Commission</TableCell>
                    <TableCell align="right">Commission %</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paymentMethods.map((method) => (
                    <TableRow key={method}>
                      <TableCell>{method.toUpperCase()}</TableCell>
                      <TableCell align="right">
                        {currentData?.[`${method}Orders`] ?? 0}
                      </TableCell>
                      <TableCell align="right">
                        {formatAmount(
                          currentData?.[`${method}Sale`],
                          selectedBrand?.currencyDecimals,
                          selectedBrand?.currency
                        )}
                      </TableCell>
                      <TableCell align="right">
                        {formatAmount(
                          currentData?.[`${method}CommissionFlat`],
                          selectedBrand?.currencyDecimals,
                          selectedBrand?.currency
                        )}
                      </TableCell>
                      <TableCell align="right">
                        {currentData?.[`${method}CommissionPercentage`] ?? 0}
                      </TableCell>
                    </TableRow>
                  ))}

                  {/* TOTAL ROW */}
                  <TableRow sx={{ fontWeight: 600 }}>
                    <TableCell>Total</TableCell>

                    <TableCell align="right">
                      {totals.orders}
                    </TableCell>

                    <TableCell align="right">
                      {formatAmount(
                        totals.sales,
                        selectedBrand?.currencyDecimals,
                        selectedBrand?.currency
                      )}
                    </TableCell>

                    <TableCell align="right">
                      {formatAmount(
                        totals.flatCommission,
                        selectedBrand?.currencyDecimals,
                        selectedBrand?.currency
                      )}
                    </TableCell>

                    <TableCell align="right">
                      {formatAmount(
                        totals.percentage,
                        selectedBrand?.currencyDecimals,
                        selectedBrand?.currency
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>

              </Table>
            </Card>
          </Grid>
        </Grid>

        {/* COMMISSION STATEMENTS — PRESERVED */}
        <Typography variant="h6" fontWeight={600} mb={2}>
          Commission Statements
        </Typography>

        <Card>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Month</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(invoices) && invoices.length > 0 ? (
                invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>{getMonthLabel(invoice.month)}, {invoice.year}</TableCell>
                    <TableCell>
                      {formatAmount(
                        invoice.totalCommissionFlat + invoice.totalCommissionPercentage,
                        selectedBrand?.currencyDecimals,
                        selectedBrand?.currency
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={invoice.isPaid ? 'Paid' : 'Unpaid'}
                        color={invoice.isPaid ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      {!invoice.isPaid && userRole !== 'ADMIN' && (
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => {
                            setInvoiceData(invoice);
                            setOpenPayment(true);
                          }}
                        >
                          Pay Now
                        </Button>
                      )}
                      {!invoice.isPaid && userRole == 'ADMIN' && (
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => {
       
                          }}
                        >
                          Resend Invoice
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No commission statements found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </Box>

      <InvoicePaymentDialog
        open={openPayment}
        onClose={() => setOpenPayment(false)}
        invoice={invoiceData}
      />
    </>
  );
};

export default ReportsAndStatements;
