import { useCallback, useEffect, useState } from 'react';
import { ServiceFactory } from 'services/index';
import rewardService from 'services/rewardService';

export function useDashboard(reload, brandId, startDate, endDate,branchId) {
    const [loading, setloading] = useState(false);
    const [reportType, setReportType] = useState(0);

    const [totalRowCount, setTotalRowCount] = useState(0);

    const [dashbaordBoardData, setDashbordData] = useState(null);

const fetchRewardList = useCallback(() => {
    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);

    const pad = (n) => String(n).padStart(2, "0");

    const formattedStartDate = `${parsedStartDate.getFullYear()}-${pad(parsedStartDate.getMonth() + 1)}-${pad(parsedStartDate.getDate())}`;
    const formattedEndDate = `${parsedEndDate.getFullYear()}-${pad(parsedEndDate.getMonth() + 1)}-${pad(parsedEndDate.getDate())}`;

    const apiStartDate = formattedStartDate;
    const apiEndDate = formattedEndDate;

    setloading(true);

    Promise.allSettled([
        rewardService.getdashBoardData(brandId, apiStartDate, apiEndDate,branchId),
        rewardService.getTotalRegisteredCustomers(brandId, apiStartDate, apiEndDate,branchId),
        rewardService.getTotalFreeDrinks(brandId, apiStartDate, apiEndDate,branchId),
        rewardService.getTotalPointsEarned(brandId, apiStartDate, apiEndDate,branchId),
        rewardService.getTotalPointsRedeemed(brandId, apiStartDate, apiEndDate,branchId),
        rewardService.getAvgDispatchTime(brandId, apiStartDate, apiEndDate,branchId),
        rewardService.getTopTenProducts(brandId, apiStartDate, apiEndDate,branchId),
        rewardService.getCustomersCountOrdered(brandId, apiStartDate, apiEndDate,branchId),
        rewardService.getCustomersLastOrders(brandId, apiStartDate, apiEndDate),
        rewardService.peakHoursData(brandId, apiStartDate, apiEndDate,branchId),
    ])
        .then((results) => {
            // index map just for readability
            const DASHBOARD = 0;
            const TOTAL_REGISTERED = 1;
            const FREE_DRINKS = 2;
            const POINTS_EARNED = 3;
            const POINTS_REDEEMED = 4;
            const AVG_DISPATCH = 5;
            const TOP_TEN_PRODUCTS = 6;
            const CUSTOMER_COUNT = 7;
            const LAST_ORDERS = 8;
            const PEAK_HOUR = 9;

            // helper to safely read numeric/simple values with fallback
            const getData = (idx, fallback) => {
                const r = results[idx];
                if (r.status === "fulfilled") {
                    return r.value && r.value.data && r.value.data.result
                        ? r.value.data.result
                        : fallback;
                }
                console.error("Call " + idx + " failed:", r.reason);
                return fallback;
            };
            const getPeakHoursData = (idx, fallback) => {
            const r = results[idx];
            if (r.status !== "fulfilled") {
                console.error("Call " + idx + " failed:", r.reason);
                return fallback;
            }

            const hourly = r?.value?.data?.result?.hourly ?? [];
            if (!Array.isArray(hourly) || hourly.length === 0) {
                return { hourly: [], peak: null };
            }

            // Normalize possible shapes: {hour,count} or {Hour,Count} or {h,c}
            const norm = (it) => {
                const hour =
                typeof it.hour !== "undefined" ? it.hour :
                typeof it.Hour !== "undefined" ? it.Hour :
                typeof it.h !== "undefined" ? it.h : null;

                const count =
                typeof it.count !== "undefined" ? it.count :
                typeof it.Count !== "undefined" ? it.Count :
                typeof it.c !== "undefined" ? it.c : null;

                return {
                hour: typeof hour === "number" ? hour : Number(hour),
                count: typeof count === "number" ? count : Number(count),
                };
            };

            const normalized = hourly.map(norm).filter(x => Number.isFinite(x.hour) && Number.isFinite(x.count));

            if (normalized.length === 0) {
                return { hourly, peak: null };
            }

            // Find the item with max count (if tie, keeps the earliest hour)
            const peak = normalized.reduce((best, cur) =>
                cur.count > best.count || (cur.count === best.count && cur.hour < best.hour) ? cur : best
            , normalized[0]);

            return { hourly, peak }; // peak is { hour: number, count: number }
            };

            const dashboardRes =
                results[DASHBOARD].status === "fulfilled"
                    ? results[DASHBOARD].value
                    : null;

            const dashboardData = {
                ...(dashboardRes &&
                dashboardRes.data &&
                dashboardRes.data.result &&
                dashboardRes.data.result.item2
                    ? dashboardRes.data.result.item2
                    : {}),

                totalRegisteredCustomers: getData(TOTAL_REGISTERED, 0),
                totalFreeDrinks: getData(FREE_DRINKS, 0),
                totalPointsEarned: getData(POINTS_EARNED, 0),
                pointsRedeemed: getData(POINTS_REDEEMED, 0),
                avgDispatchTime: getData(AVG_DISPATCH, null),
                peakHoursData: getPeakHoursData(PEAK_HOUR, { hourly: [], peak: null }),

                topTenProducts:
                    results[TOP_TEN_PRODUCTS].status === "fulfilled"
                        ? (
                            (results[TOP_TEN_PRODUCTS].value &&
                             results[TOP_TEN_PRODUCTS].value.data &&
                             results[TOP_TEN_PRODUCTS].value.data.result &&
                             results[TOP_TEN_PRODUCTS].value.data.result.item2) ||
                            []
                          )
                        : [],

                customerCount: getData(CUSTOMER_COUNT, 0),

                lastorders:
                    results[LAST_ORDERS].status === "fulfilled"
                        ? (
                            (results[LAST_ORDERS].value &&
                             results[LAST_ORDERS].value.data &&
                             results[LAST_ORDERS].value.data.result &&
                             results[LAST_ORDERS].value.data.result.data &&
                             results[LAST_ORDERS].value.data.result.data.data) ||
                            []
                          )
                        : [],
            };

            setDashbordData(dashboardData);
        })
        .finally(() => {
            setloading(false);
        });
}, [startDate, endDate, brandId,branchId]);

    


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
