import { useCallback, useEffect, useState } from 'react';
import { ServiceFactory } from 'services/index';
import rewardService from 'services/rewardService';

export function useDashboard(reload, brandId, startDate, endDate) {
    const [loading, setloading] = useState(false);
    const [reportType, setReportType] = useState(0);

    const [totalRowCount, setTotalRowCount] = useState(0);

    const [dashbaordBoardData, setDashbordData] = useState(null);

    const fetchRewardList = useCallback(() => {
        const parsedStartDate = new Date(startDate);
        const parsedEndDate = new Date(endDate);
        const formattedStartDate = `${parsedStartDate.getFullYear()}-${parsedStartDate.getMonth() + 1}-${parsedStartDate.getDate()}`;
        const formattedEndDate = `${parsedEndDate.getFullYear()}-${parsedEndDate.getMonth() + 1}-${parsedEndDate.getDate()}`;
        const isSame = formattedStartDate === formattedEndDate;

        const apiStartDate = isSame ? null : formattedStartDate;
        const apiEndDate = isSame ? null : formattedEndDate;

        setloading(true);

        Promise.all([
            rewardService.getdashBoardData(brandId, apiStartDate, apiEndDate),
            rewardService.getTotalRegisteredCustomers(brandId, apiStartDate, apiEndDate),
            rewardService.getTotalFreeDrinks(brandId, apiStartDate, apiEndDate),
            rewardService.getTotalPointsEarned(brandId, apiStartDate, apiEndDate),
            rewardService.getTotalPointsRedeemed(brandId, apiStartDate, apiEndDate),
            rewardService.getAvgDispatchTime(brandId, apiStartDate, apiEndDate),
            rewardService.getTopTenProducts(brandId, apiStartDate, apiEndDate),
            rewardService.getCustomersCountOrdered(brandId, apiStartDate, apiEndDate),
            rewardService.getCustomersLastOrders(brandId, apiStartDate, apiEndDate)
        ])
            .then(
                ([
                    dashboardRes,
                    registeredCustomersRes,
                    freeDrinksRes,
                    pointsEarnedRes,
                    pointsRedeemed,
                    avgDispatchTime,
                    topTenProducts,
                    customerCount,
                    lastorders
                ]) => {
                    console.log(lastorders?.data?.result.data.data, 'Top Ten');

                    const dashboardData = {
                        ...dashboardRes.data.result, // Include existing dashboard data
                        totalRegisteredCustomers: registeredCustomersRes?.data.result,
                        totalFreeDrinks: freeDrinksRes?.data?.result,
                        totalPointsEarned: pointsEarnedRes?.data.result,
                        pointsRedeemed: pointsRedeemed?.data?.result,
                        avgDispatchTime: avgDispatchTime.data.result,
                        topTenProducts: topTenProducts.data.result,
                        customerCount: customerCount.data.result,
                        lastorders: lastorders?.data?.result.data.data
                    };

                    setDashbordData(dashboardData);
                }
            )
            .catch((error) => {
                console.error('Error fetching dashboard data:', error);
            })
            .finally(() => {
                setloading(false);
            });
    }, [startDate, endDate, brandId]);
    


    useEffect(() => {
        if (brandId === undefined) {
            return;
        }
        fetchRewardList();
    }, [fetchRewardList, reload]);

    const recallData = (number) => {
        setReportType(number);
    };

    return {
        dashbaordBoardData: dashbaordBoardData,
        recallData: recallData,
        fetchRewardList: fetchRewardList,
        loading
    };
}
