import React, { useEffect, useState } from 'react';
import { useTheme } from '@material-ui/core/styles';
import ReactApexChart from 'react-apexcharts';

const MonthlyLineChart = (data) => {
    const theme = useTheme();
    const { primary, secondary } = theme.palette.text;
    const info = theme.palette.info.light;

    const [series, setSeries] = useState();
    const [options, setOptions] = useState({
        chart: {
            id: 'monthly-line-chart',
            toolbar: {
                show: false
            }
        },
        xaxis: {
            categories: data?.data.map((en) => new Date(en.date).toLocaleString('default', { month: 'short', year: 'numeric' })),
            labels: {
                style: {
                    colors: [primary, primary, primary, primary, primary, primary, primary]
                }
            }
        },
        tooltip: {
            theme: 'light',
            x: {
                show: true,
                format: 'MMM dd, yyyy'
            }
        },
        colors: [info, '#f1c40f'],
        yaxis: [
            {
                axisTicks: {
                    show: true
                },
                axisBorder: {
                    show: true
                },
                labels: {
                    style: {
                        colors: [info]
                    },
                    formatter: function (value) {
                        return 'KD' + value.toFixed(2);
                    }
                },
                title: {
                    text: 'Total Sales',
                    style: {
                        color: info
                    }
                }
            },
            {
                opposite: true,
                axisTicks: {
                    show: true
                },
                axisBorder: {
                    show: true
                },
                labels: {
                    style: {
                        colors: ['#f1c40f']
                    },
                    formatter: function (value) {
                        return  value.toFixed(2);
                    }
                },
                title: {
                    text: 'Total Orders',
                    style: {
                        color: '#f1c40f'
                    }
                }
            }
        ]
    });

    useEffect(() => {
        // Check if there is data for only one month
        // if (data?.data.length === 1) {
        //     const singleMonthData = data?.data[0];

        //     if (singleMonthData?.date) {
        //         const categories = Array.isArray(singleMonthData.date)
        //             ? singleMonthData.date.map((date) => new Date(date).toLocaleString('default', { day: 'numeric' }))
        //             : [new Date(singleMonthData.date).toLocaleString('default', { day: 'numeric' })];

        //         setOptions((prevState) => ({
        //             ...prevState,
        //             xaxis: {
        //                 ...prevState.xaxis,
        //                 categories: categories
        //             }
        //         }));

        //         setSeries([
        //             {
        //                 name: 'Total Sales',
        //                 data: singleMonthData.totalSale,
        //                 color: info
        //             },
        //             {
        //                 name: 'Total Orders',
        //                 data: singleMonthData.totalOrders,
        //                 color: '#f1c40f'
        //             }
        //         ]);
        //     }
        // }

        // Group data by month and calculate total sales and total orders
        const categories = data.data.map(entry => new Date(entry.date).toLocaleDateString('default', { day: 'numeric', month: 'short' }));
        const totalSales = data.data.map(entry => entry.totalSale);
        const totalOrders = data.data.map(entry => entry.totalOrders);

        setOptions((prevState) => ({
            ...prevState,
            xaxis: {
                ...prevState.xaxis,
                categories: categories
            }
        }));

        setSeries([
            {
                name: 'Total Sales',
                data: totalSales,
                color: info
            },
            {
                name: 'Total Orders',
                data: totalOrders,
                color: '#f1c40f'
            }
        ]);
    }, [data]);

    return (
        <div id="chart">{series?.length > 0 ? <ReactApexChart options={options} series={series} type="line" height={365} /> : <></>}</div>
    );
};

export default MonthlyLineChart;
