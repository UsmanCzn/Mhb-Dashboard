import { useEffect, useMemo, useState } from 'react';
import {
    Avatar,
    Button,
    Card,
    Chip,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
    Box
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import ReactApexChart from 'react-apexcharts';
import dayjs from 'dayjs';
import { useBranches } from 'providers/branchesProvider';
import { useFetchBrandsList } from 'features/BrandsTable/hooks/useFetchBrandsList';
import { useDashboard } from 'features/dashbord/hooks/useDashboard';
import adminStatsService from 'services/adminStatsService';
import MonthlyLineChart from '../dashboard/MonthlyBarChart';

const FILTER_TYPES = [
    { label: 'Today', value: '1' },
    { label: 'Week', value: '2' },
    { label: 'Month', value: '3' },
    { label: 'Year', value: '4' }
];

const COMPARISON_TYPES = [
    { label: 'Day Over Day', value: '1' },
    { label: 'Week Over Week', value: '2' },
    { label: 'Month Over Month', value: '3' },
    { label: 'Year Over Year', value: '4' },
];

const toArray = (value) => (Array.isArray(value) ? value : []);
const formatDate = (value) => dayjs(value).format('YYYY-MM-DD');
const formatDateTime = (value) => (value ? dayjs(value).format('YYYY-MM-DD') : '-');
const formatCurrency = (value) => Number(value || 0).toFixed(2);
const formatNumber = (value) => Number(value || 0).toLocaleString();
const formatPercent = (value) => `${Number(value || 0).toFixed(2)}%`;
const extractPayload = (response) => response?.data?.result ?? response?.result ?? response?.data ?? response;

const LogoCell = ({ src, label }) => <Avatar src={src || ''} alt={label || 'logo'} sx={{ width: 28, height: 28 }} />;

const ScopeChips = ({ scopes = [] }) =>
    scopes.length ? (
        <Grid container spacing={1} sx={{ mb: 1 }}>
            {scopes.map((scope) => (
                <Grid item key={scope}>
                    <Chip size="small" label={scope} variant="outlined" />
                </Grid>
            ))}
        </Grid>
    ) : null;

const ChartCard = ({ title, options, series, type = 'bar', height = 300, scopes = [] }) => (
    <Card sx={{ p: 2, height: '100%' }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
            {title}
        </Typography>
        <ScopeChips scopes={scopes} />
        <ReactApexChart options={options} series={series} type={type} height={height} />
    </Card>
);

const DataTableCard = ({ title, columns, rows, headerActions = null, scopes = [] }) => (
    <Card sx={{ p: 2, height: '100%' }}>
        <Grid container alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
            <Grid item>
                <Typography variant="h6">{title}</Typography>
            </Grid>
            {headerActions ? <Grid item>{headerActions}</Grid> : null}
        </Grid>
        <ScopeChips scopes={scopes} />
        {rows.length === 0 ? (
            <Typography color="text.secondary">No data found.</Typography>
        ) : (
            <TableContainer sx={{ maxHeight: 320 }}>
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell key={column.key}>{column.label}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, rowIndex) => (
                            <TableRow key={row.id || row.brandId || row.branchId || row.productId || rowIndex}>
                                {columns.map((column) => (
                                    <TableCell key={column.key}>
                                        {column.render
                                            ? column.render(row[column.key], row)
                                            : column.format
                                              ? column.format(row[column.key], row)
                                              : row[column.key] ?? '-'}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        )}
    </Card>
);

const StatsSection = ({ title, description, scopes = [], actions = null, children }) => (
    <Card sx={{ p: 2 }}>
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Grid container spacing={2} alignItems="flex-start" justifyContent="space-between">
                    <Grid item xs={12} md={actions ? 7 : 12}>
                        <Typography variant="h6" sx={{ mb: 0.5 }}>
                            {title}
                        </Typography>
                        {description ? (
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                {description}
                            </Typography>
                        ) : null}
                        <ScopeChips scopes={scopes} />
                    </Grid>
                    {actions ? (
                        <Grid item xs={12} md={5}>
                            {actions}
                        </Grid>
                    ) : null}
                </Grid>
            </Grid>
            {children}
        </Grid>
    </Card>
);

const AdminStats = () => {
    const [reload] = useState(false);
    const { brandsList } = useFetchBrandsList(reload);
    const { branchesList } = useBranches();

    const [selectedBrandIds, setSelectedBrandIds] = useState([]);
    const [primaryBrandId, setPrimaryBrandId] = useState('');
    const [selectedBranch, setSelectedBranch] = useState(null);
    const [startDate, setStartDate] = useState(dayjs().subtract(30, 'day'));
    const [endDate, setEndDate] = useState(dayjs());
    const [filterType, setFilterType] = useState('1');
    const [comparisonType, setComparisonType] = useState('3');
    const [topCount, setTopCount] = useState(5);
    const [bottomCount, setBottomCount] = useState(5);
    const [multiBrandLoading, setMultiBrandLoading] = useState(false);
    const [primaryBrandLoading, setPrimaryBrandLoading] = useState(false);
    const [multiBrandError, setMultiBrandError] = useState('');
    const [primaryBrandError, setPrimaryBrandError] = useState('');
    const [multiBrandFetched, setMultiBrandFetched] = useState(false);
    const [primaryBrandFetched, setPrimaryBrandFetched] = useState(false);

    const [results, setResults] = useState({
        totalRevenueByBrand: [],
        revenueGrowth: [],
        brandRevenueComparison: { brands: [], totalRevenue: 0, periodStart: null, periodEnd: null },
        conversionRate: [],
        returningCustomersPercentage: [],
        topPerformingBranches: [],
        underperformingBranches: [],
        bestPerformingProducts: [],
        worstPerformingProducts: []
    });

    const selectedBrand = useMemo(() => {
        if (!primaryBrandId) return null;
        return brandsList.find((brand) => brand.id === primaryBrandId) || null;
    }, [brandsList, primaryBrandId]);
    const primaryBrandLabel = selectedBrand?.name || 'No Primary Brand';

    const filteredBranches = useMemo(() => {
        if (!selectedBrand?.id) return [];
        return branchesList.filter((branch) => branch.brandId === selectedBrand.id);
    }, [branchesList, selectedBrand]);

    const dashboardStartDate = useMemo(() => (startDate?.toDate ? startDate.toDate() : startDate), [startDate]);
    const dashboardEndDate = useMemo(() => (endDate?.toDate ? endDate.toDate() : endDate), [endDate]);

    const { dashbaordBoardData: primaryBrandDashboardData } = useDashboard(
        false,
        primaryBrandFetched ? selectedBrand?.id : undefined,
        dashboardStartDate,
        dashboardEndDate,
        selectedBranch?.id || 0
    );

    const primaryIncomeOverviewData = useMemo(
        () => primaryBrandDashboardData?.ordersChartData || [],
        [primaryBrandDashboardData]
    );

    const revenueChartData = useMemo(() => {
        const categories = results.totalRevenueByBrand.map((item) => item.brandName || 'Unknown');
        const values = results.totalRevenueByBrand.map((item) => Number(item.totalRevenue || 0));
        return {
            series: [{ name: 'Revenue', data: values }],
            options: {
                chart: { toolbar: { show: false } },
                dataLabels: { enabled: false },
                plotOptions: { bar: { borderRadius: 4, distributed: true } },
                xaxis: { categories },
                yaxis: { labels: { formatter: (val) => formatCurrency(val) } },
                legend: { show: false },
                noData: { text: 'No data' }
            }
        };
    }, [results.totalRevenueByBrand]);

    const growthChartData = useMemo(() => {
        const values = results.revenueGrowth.map((item) => ({
            x: item.brandName || 'Unknown',
            y: Number(item.growthPercentage || 0),
            currentRevenue: item.currentRevenue,
            previousRevenue: item.previousRevenue,
            growthAmount: item.growthAmount,
            comparisonType: item.comparisonType,
            currentPeriodStart: item.currentPeriodStart,
            currentPeriodEnd: item.currentPeriodEnd,
            previousPeriodStart: item.previousPeriodStart,
            previousPeriodEnd: item.previousPeriodEnd
        }));

        return {
            series: [{ name: 'Growth %', data: values }],
            options: {
                chart: { toolbar: { show: false } },
                dataLabels: { enabled: true, formatter: (val) => `${Number(val).toFixed(1)}%` },
                xaxis: { type: 'category' },
                yaxis: { labels: { formatter: (val) => `${Number(val).toFixed(1)}%` } },
                plotOptions: { bar: { borderRadius: 4, distributed: true } },
                legend: { show: false },
                tooltip: {
                    custom: ({ seriesIndex, dataPointIndex, w }) => {
                        const data = w.config.series?.[seriesIndex]?.data?.[dataPointIndex] || {};
                        const title = data.x || 'Unknown';
                        return `
                            <div style="padding:8px 10px;">
                                <div style="font-weight:600; margin-bottom:6px;">${title}</div>
                                <div>Growth: ${formatPercent(data.y)}</div>
                                <div>Current Revenue: ${formatCurrency(data.currentRevenue)}</div>
                                <div>Previous Revenue: ${formatCurrency(data.previousRevenue)}</div>
                                <div>Growth Amount: ${formatCurrency(data.growthAmount)}</div>
                                <div>Type: ${data.comparisonType || '-'}</div>
                                <div>Current Period: ${formatDateTime(data.currentPeriodStart)} to ${formatDateTime(data.currentPeriodEnd)}</div>
                                <div>Previous Period: ${formatDateTime(data.previousPeriodStart)} to ${formatDateTime(data.previousPeriodEnd)}</div>
                            </div>
                        `;
                    }
                },
                noData: { text: 'No data' }
            }
        };
    }, [results.revenueGrowth]);

    const contributionChartData = useMemo(() => {
        const labels = results.brandRevenueComparison.brands.map((item) => item.brandName || 'Unknown');
        const values = results.brandRevenueComparison.brands.map((item) => Number(item.contributionPercentage || 0));
        return {
            series: values,
            options: {
                labels,
                legend: { position: 'bottom' },
                dataLabels: { formatter: (val) => `${Number(val).toFixed(1)}%` },
                noData: { text: 'No data' }
            }
        };
    }, [results.brandRevenueComparison.brands]);

    const conversionChartData = useMemo(() => {
        const categories = results.conversionRate.map((item) => item.branchName || item.brandName || 'Unknown');
        const conversionValues = results.conversionRate.map((item) => Number(item.conversionRate || 0));
        const customerValues = results.conversionRate.map((item) => Number(item.customerConversionRate || 0));
        return {
            series: [
                { name: 'Conversion %', data: conversionValues },
                { name: 'Customer Conversion %', data: customerValues }
            ],
            options: {
                chart: { toolbar: { show: false } },
                dataLabels: { enabled: false },
                xaxis: { categories },
                yaxis: { labels: { formatter: (val) => `${Number(val).toFixed(1)}%` } },
                stroke: { width: 2 },
                noData: { text: 'No data' }
            }
        };
    }, [results.conversionRate]);

    useEffect(() => {
        if (selectedBrandIds.length === 0 && brandsList.length > 0) {
            setSelectedBrandIds([brandsList[0].id]);
        }
    }, [brandsList, selectedBrandIds]);

    useEffect(() => {
        if (selectedBrandIds.length === 0) {
            setPrimaryBrandId('');
            return;
        }
        if (!selectedBrandIds.includes(primaryBrandId)) {
            setPrimaryBrandId(selectedBrandIds[0]);
        }
    }, [selectedBrandIds, primaryBrandId]);

    useEffect(() => {
        if (filteredBranches.length > 0) {
            setSelectedBranch(filteredBranches[0]);
        } else {
            setSelectedBranch(null);
        }
    }, [filteredBranches]);

    const fetchMultiBrandStats = async (overrides = {}) => {
        if (selectedBrandIds.length === 0) {
            setMultiBrandError('Please select at least one brand.');
            return;
        }

        setMultiBrandLoading(true);
        setMultiBrandError('');
        try {
            const start = formatDate(startDate);
            const end = formatDate(endDate);
            const activeFilterType = overrides.filterType ?? filterType;
            const activeComparisonType = overrides.comparisonType ?? comparisonType;

            const [
                totalRevenueRes,
                revenueGrowthRes,
                brandComparisonRes,
                returningRes
            ] = await Promise.all([
                adminStatsService.getTotalRevenueByBrand(activeFilterType, start, end, selectedBrandIds),
                adminStatsService.getRevenueGrowth(activeComparisonType, end, selectedBrandIds),
                adminStatsService.getBrandRevenueComparison(start, end, selectedBrandIds),
                adminStatsService.getReturningCustomersPercentage(start, end, selectedBrandIds)
            ]);

            const brandComparisonPayload = extractPayload(brandComparisonRes) || {};
            setResults(prev => ({
                ...prev,
                totalRevenueByBrand: toArray(extractPayload(totalRevenueRes)),
                revenueGrowth: toArray(extractPayload(revenueGrowthRes)),
                brandRevenueComparison: {
                    brands: toArray(brandComparisonPayload.brands),
                    totalRevenue: brandComparisonPayload.totalRevenue || 0,
                    periodStart: brandComparisonPayload.periodStart || null,
                    periodEnd: brandComparisonPayload.periodEnd || null
                },
                returningCustomersPercentage: toArray(extractPayload(returningRes))
            }));
            setMultiBrandFetched(true);
        } catch (apiError) {
            setMultiBrandFetched(false);
            setMultiBrandError(apiError?.response?.data?.error?.message || apiError?.message || 'Failed to fetch multi-brand stats.');
        } finally {
            setMultiBrandLoading(false);
        }
    };

    const fetchPrimaryBrandStats = async () => {
        if (!selectedBrand?.id) {
            setPrimaryBrandError('Please select a valid primary brand.');
            return;
        }

        setPrimaryBrandLoading(true);
        setPrimaryBrandError('');
        try {
            const start = formatDate(startDate);
            const end = formatDate(endDate);

            const [
                conversionRateRes,
                topBranchesRes,
                underBranchesRes,
                bestProductsRes,
                worstProductsRes
            ] = await Promise.all([
                adminStatsService.getConversionRate({
                    brandId: selectedBrand.id,
                    branchId: selectedBranch?.id || 0,
                    startDate: start,
                    endDate: end
                }),
                adminStatsService.getTopPerformingBranches(selectedBrand.id, start, end, topCount),
                adminStatsService.getUnderperformingBranches(selectedBrand.id, start, end, bottomCount),
                adminStatsService.getBestPerformingProducts(selectedBrand.id, start, end, topCount),
                adminStatsService.getWorstPerformingProducts(selectedBrand.id, start, end, bottomCount)
            ]);

            setResults(prev => ({
                ...prev,
                conversionRate: toArray(extractPayload(conversionRateRes)),
                topPerformingBranches: toArray(extractPayload(topBranchesRes)),
                underperformingBranches: toArray(extractPayload(underBranchesRes)),
                bestPerformingProducts: toArray(extractPayload(bestProductsRes)),
                worstPerformingProducts: toArray(extractPayload(worstProductsRes))
            }));
            setPrimaryBrandFetched(true);
        } catch (apiError) {
            setPrimaryBrandFetched(false);
            setPrimaryBrandError(apiError?.response?.data?.error?.message || apiError?.message || 'Failed to fetch primary brand stats.');
        } finally {
            setPrimaryBrandLoading(false);
        }
    };

    return (
        <Grid container rowSpacing={2} columnSpacing={2}>
            <Grid item xs={12}>
                <Typography fontSize={22} fontWeight={700}>
                    Admin Stats
                </Typography>
            </Grid>

            {/* Date Range Filter */}
            <Grid item xs={12}>
                <Card sx={{ p: 2, border: '1px solid #e0e0e0' }}>
                    <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                        Date Range Filter
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="Start Date"
                                    value={startDate}
                                    onChange={setStartDate}
                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="End Date"
                                    value={endDate}
                                    onChange={setEndDate}
                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                />
                            </LocalizationProvider>
                        </Grid>
                    </Grid>
                </Card>
            </Grid>

            {/* Multi-Brand Analysis Section */}
            <Grid item xs={12} md={6}>
                <Card sx={{ p: 2,  height: '100%' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5 }}>
                                Multi-Brand Analysis
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Compare revenue, growth, and customer metrics across multiple brands
                            </Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <InputLabel id="admin-stats-brand-label">Select Brands (Multiple)</InputLabel>
                                        <Select
                                            labelId="admin-stats-brand-label"
                                            multiple
                                            value={selectedBrandIds}
                                            label="Select Brands (Multiple)"
                                            onChange={(event) => {
                                                const value = event.target.value;
                                                setSelectedBrandIds(
                                                    typeof value === 'string' ? value.split(',').map(Number) : value.map((id) => Number(id))
                                                );
                                            }}
                                            renderValue={(selected) =>
                                                brandsList
                                                    .filter((brand) => selected.includes(brand.id))
                                                    .map((brand) => brand.name)
                                                    .join(', ')
                                            }
                                        >
                                            {brandsList.map((brand) => (
                                                <MenuItem key={brand.id} value={brand.id}>
                                                    {brand.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12}>
                                    <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1 }}>
                                        <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                                            Includes:
                                        </Typography>
                                        <ScopeChips scopes={['Total Revenue by Brand', 'Revenue Growth %', 'Brand Revenue Comparison', 'Returning Customers %']} />
                                    </Box>
                                </Grid>

                                {multiBrandError ? (
                                    <Grid item xs={12}>
                                        <Typography color="error" sx={{ bgcolor: '#ffebee', p: 1.5, borderRadius: 1 }}>{multiBrandError}</Typography>
                                    </Grid>
                                ) : null}

                                <Grid item xs={12}>
                                    <Button 
                                        fullWidth 
                                        variant="contained" 
                                        size="medium"
                                        onClick={fetchMultiBrandStats} 
                                        disabled={multiBrandLoading}
                                    >
                                        {multiBrandLoading ? 'Fetching Data...' : 'Fetch Multi-Brand Statistics'}
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Card>
            </Grid>

            {/* Primary Brand Analysis Section */}
            <Grid item xs={12} md={6}>
                <Card sx={{ p: 2, height: '100%' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5 }}>
                                Primary Brand 
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Detailed analysis of branches, products, and conversion rates for a single brand
                            </Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={4}>
                                    <FormControl fullWidth>
                                        <InputLabel id="admin-stats-primary-brand-label">Primary Brand</InputLabel>
                                        <Select
                                            labelId="admin-stats-primary-brand-label"
                                            value={primaryBrandId}
                                            label="Primary Brand"
                                            onChange={(event) => setPrimaryBrandId(Number(event.target.value))}
                                        >
                                            {brandsList
                                                .filter((brand) => selectedBrandIds.includes(brand.id))
                                                .map((brand) => (
                                                    <MenuItem key={brand.id} value={brand.id}>
                                                        {brand.name}
                                                    </MenuItem>
                                                ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} md={4}>
                                    <FormControl fullWidth>
                                        <InputLabel id="admin-stats-branch-label">Branch (Optional)</InputLabel>
                                        <Select
                                            labelId="admin-stats-branch-label"
                                            value={selectedBranch || ''}
                                            label="Branch (Optional)"
                                            onChange={(event) => setSelectedBranch(event.target.value)}
                                        >
                                            {filteredBranches.map((branch) => (
                                                <MenuItem key={branch.id} value={branch}>
                                                    {branch.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={6} md={2}>
                                    <TextField
                                        fullWidth
                                        label="Top Count"
                                        type="number"
                                        value={topCount}
                                        onChange={(event) => setTopCount(Number(event.target.value) || 1)}
                                    />
                                </Grid>

                                <Grid item xs={6} md={2}>
                                    <TextField
                                        fullWidth
                                        label="Bottom Count"
                                        type="number"
                                        value={bottomCount}
                                        onChange={(event) => setBottomCount(Number(event.target.value) || 1)}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1 }}>
                                        <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                                            Includes:
                                        </Typography>
                                        <ScopeChips scopes={['Conversion Rate', 'Top Performing Branches', 'Underperforming Branches', 'Best/Worst Products']} />
                                    </Box>
                                </Grid>

                                {primaryBrandError ? (
                                    <Grid item xs={12}>
                                        <Typography color="error" sx={{ bgcolor: '#ffebee', p: 1.5, borderRadius: 1 }}>{primaryBrandError}</Typography>
                                    </Grid>
                                ) : null}

                                <Grid item xs={12}>
                                    <Button 
                                        fullWidth 
                                        variant="contained" 
                                        size="medium"
                                        onClick={fetchPrimaryBrandStats} 
                                        disabled={primaryBrandLoading}
                                    >
                                        {primaryBrandLoading ? 'Fetching Data...' : 'Fetch Primary Brand Statistics'}
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Card>
            </Grid>

            {/* Multi-Brand Results Section */}
            {multiBrandFetched && (
                <>
                    <Grid item xs={12}>
                        <Typography variant="h4" fontWeight={700} sx={{ mt: 3, mb: 2 }}>
                            Multi-Brand Analysis Results
                        </Typography>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Card sx={{ p: 2, height: '100%' }}>
                            <Grid container alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                                <Grid item>
                                    <Typography variant="h6">Revenue By Brand</Typography>
                                </Grid>
                                <Grid item>
                                    <FormControl size="small" sx={{ minWidth: 160 }}>
                                        <InputLabel id="revenue-by-brand-filter-type-label">Filter Type</InputLabel>
                                        <Select
                                            labelId="revenue-by-brand-filter-type-label"
                                            value={filterType}
                                            label="Filter Type"
                                            onChange={(event) => {
                                                const nextFilterType = event.target.value;
                                                setFilterType(nextFilterType);
                                                fetchMultiBrandStats({ filterType: nextFilterType });
                                            }}
                                        >
                                            {FILTER_TYPES.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <ScopeChips
                                scopes={[
                                    `Date Range: ${formatDate(startDate)} to ${formatDate(endDate)}`,
                                    `Brands: ${brandsList.filter(b => selectedBrandIds.includes(b.id)).map(b => b.name).join(', ')}`,
                                    `Filter Type: ${FILTER_TYPES.find(opt => opt.value === filterType)?.label || ''}`
                                ]}
                            />
                            <ReactApexChart options={revenueChartData.options} series={revenueChartData.series} type="bar" height={300} />
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Card sx={{ p: 2, height: '100%' }}>
                            <Grid container alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                                <Grid item>
                                    <Typography variant="h6">Revenue Growth %</Typography>
                                </Grid>
                                <Grid item>
                                    <FormControl size="small" sx={{ minWidth: 180 }}>
                                        <InputLabel id="revenue-growth-comparison-type-select-label">Comparison Type</InputLabel>
                                        <Select
                                            labelId="revenue-growth-comparison-type-select-label"
                                            value={comparisonType}
                                            label="Comparison Type"
                                            onChange={(event) => {
                                                const nextComparisonType = event.target.value;
                                                setComparisonType(nextComparisonType);
                                                fetchMultiBrandStats({ comparisonType: nextComparisonType });
                                            }}
                                        >
                                            {COMPARISON_TYPES.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                            {/* Show applied filter values in scopes */}
                            <ScopeChips
                                scopes={[
                                    `Date Range: ${formatDate(startDate)} to ${formatDate(endDate)}`,
                                    `Brands: ${brandsList.filter(b => selectedBrandIds.includes(b.id)).map(b => b.name).join(', ')}`,
                                    `Comparison Type: ${COMPARISON_TYPES.find(opt => opt.value === comparisonType)?.label || ''}`
                                ]}
                            />
                            <ReactApexChart options={growthChartData.options} series={growthChartData.series} type="bar" height={300} />
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <ChartCard
                            title="Brand Contribution %"
                            scopes={[
                                `Date Range: ${formatDate(startDate)} to ${formatDate(endDate)}`,
                                `Brands: ${brandsList.filter(b => selectedBrandIds.includes(b.id)).map(b => b.name).join(', ')}`
                            ]}
                            series={contributionChartData.series}
                            options={contributionChartData.options}
                            type="donut"
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <DataTableCard
                            title="Total Revenue By Brand (Multi-brand)"
                            scopes={[
                                `Date Range: ${formatDate(startDate)} to ${formatDate(endDate)}`,
                                `Brands: ${brandsList.filter(b => selectedBrandIds.includes(b.id)).map(b => b.name).join(', ')}`,
                                `Filter Type: ${FILTER_TYPES.find(opt => opt.value === filterType)?.label || ''}`
                            ]}
                            headerActions={
                                <FormControl size="small" sx={{ minWidth: 160 }}>
                                    <InputLabel id="total-revenue-filter-type-label">Filter Type</InputLabel>
                                    <Select
                                        labelId="total-revenue-filter-type-label"
                                        value={filterType}
                                        label="Filter Type"
                                        onChange={(event) => {
                                            const nextFilterType = event.target.value;
                                            setFilterType(nextFilterType);
                                            fetchMultiBrandStats({ filterType: nextFilterType });
                                        }}
                                    >
                                        {FILTER_TYPES.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            }
                            rows={results.totalRevenueByBrand}
                            columns={[
                                { key: 'brandLogo', label: 'Logo', render: (value, row) => <LogoCell src={value} label={row.brandName} /> },
                                { key: 'brandName', label: 'Brand' },
                                { key: 'totalRevenue', label: 'Revenue', format: formatCurrency },
                                { key: 'totalOrders', label: 'Orders', format: formatNumber },
                                { key: 'averageOrderValue', label: 'Avg Order', format: formatCurrency },
                                { key: 'period', label: 'Period' },
                                { key: 'periodStart', label: 'Start', format: formatDateTime },
                                { key: 'periodEnd', label: 'End', format: formatDateTime }
                            ]}
                        />
                    </Grid>

                    <Grid item xs={12} md={12}>
                        <DataTableCard
                            title="Revenue Growth (Multi-brand)"
                            scopes={[
                                `Date Range: ${formatDate(startDate)} to ${formatDate(endDate)}`,
                                `Brands: ${brandsList.filter(b => selectedBrandIds.includes(b.id)).map(b => b.name).join(', ')}`,
                                `Comparison Type: ${COMPARISON_TYPES.find(opt => opt.value === comparisonType)?.label || ''}`
                            ]}
                            headerActions={
                                <FormControl size="small" sx={{ minWidth: 180 }}>
                                    <InputLabel id="revenue-growth-comparison-type-label">Comparison Type</InputLabel>
                                    <Select
                                        labelId="revenue-growth-comparison-type-label"
                                        value={comparisonType}
                                        label="Comparison Type"
                                        onChange={(event) => {
                                            const nextComparisonType = event.target.value;
                                            setComparisonType(nextComparisonType);
                                            fetchMultiBrandStats({ comparisonType: nextComparisonType });
                                        }}
                                    >
                                        {COMPARISON_TYPES.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            }
                            rows={results.revenueGrowth}
                            columns={[
                                { key: 'brandName', label: 'Brand' },
                                { key: 'comparisonType', label: 'Type' },
                                { key: 'currentRevenue', label: 'Current Revenue', format: formatCurrency },
                                { key: 'previousRevenue', label: 'Previous Revenue', format: formatCurrency },
                                { key: 'growthAmount', label: 'Growth Amount', format: formatCurrency },
                                { key: 'growthPercentage', label: 'Growth %', format: formatPercent },
                                { key: 'currentPeriodStart', label: 'Current Period Start', format: formatDateTime },
                                { key: 'currentPeriodEnd', label: 'Current Period End', format: formatDateTime },
                                { key: 'previousPeriodStart', label: 'Previous Period Start', format: formatDateTime },
                                { key: 'previousPeriodEnd', label: 'Previous Period End', format: formatDateTime }
                            ]}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Card sx={{ p: 2 }}>
                            <Typography variant="h6" sx={{ mb: 1 }}>
                                Brand Revenue Comparison (Multi-brand)
                            </Typography>
                            <Typography sx={{ mb: 2 }}>
                                Total Revenue: {formatCurrency(results.brandRevenueComparison.totalRevenue)} | Period:{' '}
                                {formatDateTime(results.brandRevenueComparison.periodStart)} to{' '}
                                {formatDateTime(results.brandRevenueComparison.periodEnd)}
                            </Typography>
                            <DataTableCard
                                title="Compared Brands"
                                scopes={[
                                    `Date Range: ${formatDate(startDate)} to ${formatDate(endDate)}`,
                                    `Brands: ${brandsList.filter(b => selectedBrandIds.includes(b.id)).map(b => b.name).join(', ')}`
                                ]}
                                rows={results.brandRevenueComparison.brands}
                                columns={[
                                    { key: 'brandLogo', label: 'Logo', render: (value, row) => <LogoCell src={value} label={row.brandName} /> },
                                    { key: 'rank', label: 'Rank' },
                                    { key: 'brandName', label: 'Brand' },
                                    { key: 'revenue', label: 'Revenue', format: formatCurrency },
                                    { key: 'contributionPercentage', label: 'Contribution %', format: formatPercent },
                                    { key: 'totalOrders', label: 'Orders', format: formatNumber }
                                ]}
                            />
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={12}>
                        <DataTableCard
                            title="Returning Customers Percentage (Multi-brand)"
                            scopes={[
                                `Date Range: ${formatDate(startDate)} to ${formatDate(endDate)}`,
                                `Brands: ${brandsList.filter(b => selectedBrandIds.includes(b.id)).map(b => b.name).join(', ')}`
                            ]}
                            rows={results.returningCustomersPercentage}
                            columns={[
                                { key: 'brandName', label: 'Brand' },
                                { key: 'totalCustomers', label: 'Total Customers', format: formatNumber },
                                { key: 'newCustomers', label: 'New Customers', format: formatNumber },
                                { key: 'returningCustomers', label: 'Returning', format: formatNumber },
                                { key: 'returningPercentage', label: 'Returning %', format: formatPercent },
                                { key: 'newCustomerPercentage', label: 'New %', format: formatPercent }
                            ]}
                        />
                    </Grid>
                </>
            )}

            {/* Primary Brand Results Section */}
            {primaryBrandFetched && (
                <>
                    <Grid item xs={12}>
                        <Typography variant="h4" fontWeight={700} sx={{ mt: 3, mb: 2 }}>
                            Primary Brand Analysis Results
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Card sx={{ p: 2, height: '100%' }}>
                            <Typography variant="h6" sx={{ mb: 1 }}>
                                {`Income Overview (${primaryBrandLabel})`}
                            </Typography>
                            <ScopeChips
                                scopes={[
                                    `Date Range: ${formatDate(startDate)} to ${formatDate(endDate)}`,
                                    `Primary Brand: ${primaryBrandLabel}`,
                                    `Branch: ${selectedBranch?.name || ''}`
                                ]}
                            />
                            {primaryIncomeOverviewData.length ? (
                                <MonthlyLineChart data={primaryIncomeOverviewData} selectedBrand={selectedBrand} />
                            ) : (
                                <Typography color="text.secondary">No data found.</Typography>
                            )}
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <ChartCard
                            title={`Conversion Overview (${primaryBrandLabel})`}
                            scopes={[
                                `Date Range: ${formatDate(startDate)} to ${formatDate(endDate)}`,
                                `Primary Brand: ${primaryBrandLabel}`,
                                `Branch: ${selectedBranch?.name || ''}`
                            ]}
                            series={conversionChartData.series}
                            options={conversionChartData.options}
                            type="line"
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <DataTableCard
                            title={`Conversion Rate (${primaryBrandLabel})`}
                            scopes={[
                                `Date Range: ${formatDate(startDate)} to ${formatDate(endDate)}`,
                                `Primary Brand: ${primaryBrandLabel}`,
                                `Branch: ${selectedBranch?.name || ''}`
                            ]}
                            rows={results.conversionRate}
                            columns={[
                                { key: 'brandName', label: 'Brand' },
                                { key: 'branchName', label: 'Branch' },
                                { key: 'totalVisitors', label: 'Visitors', format: formatNumber },
                                { key: 'totalOrders', label: 'Orders', format: formatNumber },
                                { key: 'paidOrders', label: 'Paid Orders', format: formatNumber },
                                { key: 'conversionRate', label: 'Conversion %', format: formatPercent },
                                { key: 'customerConversionRate', label: 'Customer Conversion %', format: formatPercent }
                            ]}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <DataTableCard
                            title={`Top Performing Branches (${primaryBrandLabel})`}
                            scopes={[
                                `Date Range: ${formatDate(startDate)} to ${formatDate(endDate)}`,
                                `Primary Brand: ${primaryBrandLabel}`,
                                `Top Count: ${topCount}`
                            ]}
                            rows={results.topPerformingBranches}
                            columns={[
                                { key: 'branchLogo', label: 'Logo', render: (value, row) => <LogoCell src={value} label={row.branchName} /> },
                                { key: 'rank', label: 'Rank' },
                                { key: 'branchName', label: 'Branch' },
                                { key: 'brandName', label: 'Brand' },
                                { key: 'revenue', label: 'Revenue', format: formatCurrency },
                                { key: 'totalOrders', label: 'Orders', format: formatNumber },
                                { key: 'averageOrderValue', label: 'Avg Order', format: formatCurrency },
                                { key: 'conversionRate', label: 'Conversion %', format: formatPercent },
                                { key: 'performanceLevel', label: 'Level' }
                            ]}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <DataTableCard
                            title={`Underperforming Branches (${primaryBrandLabel})`}
                            scopes={[
                                `Date Range: ${formatDate(startDate)} to ${formatDate(endDate)}`,
                                `Primary Brand: ${primaryBrandLabel}`,
                                `Bottom Count: ${bottomCount}`
                            ]}
                            rows={results.underperformingBranches}
                            columns={[
                                { key: 'branchLogo', label: 'Logo', render: (value, row) => <LogoCell src={value} label={row.branchName} /> },
                                { key: 'rank', label: 'Rank' },
                                { key: 'branchName', label: 'Branch' },
                                { key: 'brandName', label: 'Brand' },
                                { key: 'revenue', label: 'Revenue', format: formatCurrency },
                                { key: 'totalOrders', label: 'Orders', format: formatNumber },
                                { key: 'averageOrderValue', label: 'Avg Order', format: formatCurrency },
                                { key: 'conversionRate', label: 'Conversion %', format: formatPercent },
                                { key: 'performanceLevel', label: 'Level' }
                            ]}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <DataTableCard
                            title={`Best Performing Products (${primaryBrandLabel})`}
                            scopes={[
                                `Date Range: ${formatDate(startDate)} to ${formatDate(endDate)}`,
                                `Primary Brand: ${primaryBrandLabel}`,
                                `Top Count: ${topCount}`
                            ]}
                            rows={results.bestPerformingProducts}
                            columns={[
                                { key: 'productImage', label: 'Image', render: (value, row) => <LogoCell src={value} label={row.productName} /> },
                                { key: 'rank', label: 'Rank' },
                                { key: 'productName', label: 'Product' },
                                { key: 'brandName', label: 'Brand' },
                                { key: 'revenue', label: 'Revenue', format: formatCurrency },
                                { key: 'orderCount', label: 'Orders', format: formatNumber },
                                { key: 'quantitySold', label: 'Qty Sold', format: formatNumber },
                                { key: 'averagePrice', label: 'Avg Price', format: formatCurrency },
                                { key: 'performanceLevel', label: 'Level' }
                            ]}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <DataTableCard
                            title={`Worst Performing Products (${primaryBrandLabel})`}
                            scopes={[
                                `Date Range: ${formatDate(startDate)} to ${formatDate(endDate)}`,
                                `Primary Brand: ${primaryBrandLabel}`,
                                `Bottom Count: ${bottomCount}`
                            ]}
                            rows={results.worstPerformingProducts}
                            columns={[
                                { key: 'productImage', label: 'Image', render: (value, row) => <LogoCell src={value} label={row.productName} /> },
                                { key: 'rank', label: 'Rank' },
                                { key: 'productName', label: 'Product' },
                                { key: 'brandName', label: 'Brand' },
                                { key: 'revenue', label: 'Revenue', format: formatCurrency },
                                { key: 'orderCount', label: 'Orders', format: formatNumber },
                                { key: 'quantitySold', label: 'Qty Sold', format: formatNumber },
                                { key: 'averagePrice', label: 'Avg Price', format: formatCurrency },
                                { key: 'performanceLevel', label: 'Level' }
                            ]}
                        />
                    </Grid>
                </>
            )}
        </Grid>
    );
};

export default AdminStats;
