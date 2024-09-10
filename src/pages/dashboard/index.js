import { useEffect, useState } from 'react';

// material-ui
import { Box, Button, Card, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';

// project import

import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import { useFetchBrandsList } from 'features/BrandsTable/hooks/useFetchBrandsList';
import { useDashboard } from 'features/dashbord/hooks/useDashboard';
import MonthlyLineChart from './MonthlyBarChart';
import OrdersTable from './OrdersTable';
import { useSnackbar } from 'notistack';
// assets
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
// avatar style
const avatarSX = {
    width: 36,
    height: 36,
    fontSize: '1rem'
};

// action style
const actionSX = {
    mt: 0.75,
    ml: 1,
    top: 'auto',
    right: 'auto',
    alignSelf: 'flex-start',
    transform: 'none'
};

// sales report status
const status = [
    {
        value: 'today',
        label: 'Today'
    },
    {
        value: 'month',
        label: 'This Month'
    },
    {
        value: 'year',
        label: 'This Year'
    }
];

// ==============================|| DASHBOARD - DEFAULT ||============================== //

const DashboardDefault = () => {
    const [reload, setReload] = useState(false);
    const { brandsList } = useFetchBrandsList(reload);
    const [value, setValue] = useState('today');
    const [slot, setSlot] = useState('week');
    const [selectedButton, setSelectedButton] = useState(0);
    const [startDate, setStartDate] = useState(() => {
        const currentDate = new Date();
        currentDate.setMonth(currentDate.getMonth() - 1);
        return currentDate;
      });
    const [endDate, setEndDate] = useState(new Date());
    
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const handleButtonClick = (buttonNumber) => {
        setSelectedButton(buttonNumber);
        fetchRewardList(buttonNumber);
        // recallData(buttonNumber, fetchRewardList);
    };
    const [selectedBrand, setselectedBrand] = useState({});
    const [topPayers, setTopPayers] = useState();
    const [topSales, setTopSales] = useState();
    const [ordersChartData, setOrdersChartData] = useState();
    const [isOpen, setIsOpen] = useState(false);
    const [chartDataUpdateCounter, setChartDataUpdateCounter] = useState(0);
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

    const { dashbaordBoardData, recallData, fetchRewardList } = useDashboard(reload, selectedBrand?.id, startDate, endDate);
    useEffect(() => {
        setTopPayers(dashbaordBoardData?.topUsersFromSales);
        setTopSales(dashbaordBoardData?.topUsersFromOrders);
        setOrdersChartData(dashbaordBoardData?.ordersChartData);
        setChartDataUpdateCounter((prev) => prev + 1);
    }, [dashbaordBoardData]);

    const topCard = () => {
        let roundedNumber = dashbaordBoardData?.totalSale.toFixed(3);
        return (
            <>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <AnalyticEcommerce title="Total Order" count={dashbaordBoardData?.totalOrders??0} percentage={27.4} extra="1,943" />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <AnalyticEcommerce
                        title="Total Sales"
                        count={roundedNumber === undefined ? '' : roundedNumber + ' KWD'}
                        percentage={27.4}
                        isLoss
                        color="warning"
                        extra="$20,395"
                    />
                </Grid>
                {/* <Grid item xs={12} sm={6} md={4} lg={3}>
                    <AnalyticEcommerce
                        title="Average Order Ready Time"
                        count={formatTimeToHumanReadable(dashbaordBoardData?.averageReadyTime)}
                        percentage={27.4}
                        extra="1,943"
                    />
                </Grid> */}
            </>
        );
    };

    useEffect(() => {
        if (brandsList[0]?.id) {
            if(brandsList && brandsList.length>2){
            setselectedBrand(brandsList[0]);
            }
            else{
                setselectedBrand(brandsList[0]);
            }
            setOrdersChartData(null);
            setReload((prev) => !prev);
        } else {
        }
    }, [brandsList]);

    return (
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            {/* row 1 */}

            <Grid item xs={12}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item xs={6}>
                        <Typography fontSize={22} fontWeight={700}>
                            Dashboard
                        </Typography>
                    </Grid>
                    <Grid item xs="auto">
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">{'Brand'}</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={selectedBrand}
                                label={'Brand'}
                                onChange={(event) => {
                                    setselectedBrand(event.target.value);
                                    setReload((prev) => !prev);
                                }}
                            >
                                {brandsList.map((row, index) => {
                                    return <MenuItem key={index} value={row}>{row?.name}</MenuItem>;
                                })}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Grid>

            <Grid item xs={12}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={2.2}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Start"
                                value={startDate}
                                renderInput={(params) => <TextField {...params} />}
                                onChange={(newValue) => {
                                    handleDateChange(newValue);
                                }}
                                minDate={new Date(2023, 0, 1)}
                                maxDate={new Date()}
                            />
                        </LocalizationProvider>
                    </Grid>

                    <Grid item xs={2.2}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="End"
                                value={endDate}
                                renderInput={(params) => <TextField {...params} />}
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

            {topCard()}
            <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />
            {/* row 2 */}
            <Grid item xs={12} md={12} lg={12}></Grid>

            <Grid item xs={12} md={12} lg={12}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h5">Income Overview</Typography>
                    </Grid>
                </Grid>
                <MainCard sx={{ mt: 2 }} content={false}>
                    {ordersChartData && <MonthlyLineChart data={ordersChartData} key={chartDataUpdateCounter} />}
                </MainCard>
            </Grid>
            {/* row 3 */}
            <Grid item xs={12} md={6} lg={6}>
                <Card>
                    <Box p={2}>
                        <Grid container alignItems="center" justifyContent="space-between">
                            <Grid item>
                                <Typography variant="h5">Top Payers</Typography>
                            </Grid>
                            <Grid item />
                        </Grid>
                        <MainCard sx={{ mt: 2 }} content={false}>
                            <OrdersTable users={topPayers} payers={true} />
                        </MainCard>
                    </Box>
                </Card>
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
                <Card>
                    <Box p={2}>
                        <Grid container alignItems="center" justifyContent="space-between">
                            <Grid item>
                                <Typography variant="h5">Most with redeemable</Typography>
                            </Grid>
                            <Grid item />
                        </Grid>
                        <MainCard sx={{ mt: 2 }} content={false}>
                            <OrdersTable users={topSales} payers={false} />
                        </MainCard>
                    </Box>
                </Card>
            </Grid>
        </Grid>
    );

    function formatTimeToHumanReadable(timeString) {
        if (timeString === undefined || timeString === null) {
            return;
        }
        const timeParts = timeString?.split(':');
        const hours = parseInt(timeParts[0]?.replace('h', ''), 10);
        const minutes = parseInt(timeParts[1].replace('m', ''), 10);
        const seconds = parseInt(timeParts[2].replace('s', ''), 10);
        const milliseconds = parseInt(timeParts[3].replace('ms', ''), 10);

        let formattedTime = '';

        if (hours > 0) {
            formattedTime += hours + ' hours ';
        }

        if (minutes > 0) {
            formattedTime += minutes + ' minutes ';
        }

        if (seconds > 0) {
            formattedTime += seconds + ' seconds ';
        }

        if (milliseconds > 0) {
            formattedTime += milliseconds + ' milliseconds';
        }

        return formattedTime.trim();
    }
};

export default DashboardDefault;
