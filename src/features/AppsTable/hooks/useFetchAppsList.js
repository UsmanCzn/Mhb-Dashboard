import { useCallback, useEffect, useState } from 'react';
import { ServiceFactory } from 'services/index';
import userServices from 'services/userServices';

export function useFetchAppsList({ reload }) {
    const [loading, setloading] = useState(false);

    const [totalRowCount, setTotalRowCount] = useState(0);

    const [appsList, setAppsList] = useState([]);

    const customerServices = ServiceFactory.get('customer');

    const fetchAppsList = useCallback((pageNo) => {
        setloading(true);
        userServices
            .GetAllCompanies()
            .then(
                (res) => {
                    setAppsList(res.data.result);
                    // console.log(res.data.result);
                    // setTotalRowCount(res.data?.result?.data?.totalCount)

                    // setTotalRowCount(res.data?.pages);
                },
                (err) => {}
            )
            .finally(() => {
                setloading(false);
            });
    }, []);

    useEffect(() => {
        fetchAppsList(0);
    }, [fetchAppsList, reload]);

    return {
        appsList: appsList || [],
        fetchAppsList,
        totalRowCount,
        loading
    };
}
