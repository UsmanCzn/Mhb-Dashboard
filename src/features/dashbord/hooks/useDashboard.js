import { useCallback, useEffect, useState } from 'react';
import { ServiceFactory } from 'services/index';
import rewardService from 'services/rewardService';

export function useDashboard(reload, brandId, startDate, endDate) {
    const [loading, setloading] = useState(false);
    const [reportType, setReportType] = useState(0);

    const [totalRowCount, setTotalRowCount] = useState(0);

    const [dashbaordBoardData, setDashbordData] = useState(null);

    const fetchRewardList = useCallback(
        (reload) => {
            const parsedStartDate = new Date(startDate);
            const parsedEndDate = new Date(endDate);
            const formatedStartDate = `${parsedStartDate.getFullYear()}-${parsedStartDate.getMonth() + 1}-${parsedStartDate.getDate()}`;
            const formatedEndDate = `${parsedEndDate.getFullYear()}-${parsedEndDate.getMonth() + 1}-${parsedEndDate.getDate()}`;
            const isSame = formatedStartDate == formatedEndDate;
            console.log(isSame, 'Im Here========');
            setloading(true);
            rewardService
                .getdashBoardData(brandId, isSame ? null : formatedStartDate, isSame ? null : formatedEndDate)
                .then(
                    (res) => {
                        console.log(JSON.res);
                        setDashbordData(res.data.result);
                    },
                    (err) => {
                        console.log(err, 'err');
                    }
                )
                .finally(() => {
                    setloading(false);
                });
        },
        [reload]
    );

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
