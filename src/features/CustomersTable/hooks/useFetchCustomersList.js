import { useCallback, useEffect, useState } from 'react';
import { ServiceFactory } from 'services/index';

export function useFetchCustomerList({ reload }) {
    const [loading, setloading] = useState(false);

    const [totalRowCount, setTotalRowCount] = useState(0);

    const [customersList, setCustomersList] = useState([]);

    const customerServices = ServiceFactory.get('customer');

    const fetchCustomersList = useCallback((pageNo) => {
        setloading(true);
        customerServices
            .getAllCustomers({
                Skip: pageNo * 10,
                Take: pageNo + 1 + 10
            })
            .then(
                (res) => {
                    setCustomersList(res.data.result?.data?.data);
                    // console.log(res.data.result);
                    setTotalRowCount(res.data?.result?.data?.totalCount);

                    // setTotalRowCount(res.data?.pages);
                },
                (err) => {}
            )
            .finally(() => {
                setloading(false);
            });
    }, []);

    useEffect(() => {
        fetchCustomersList(0);
    }, [fetchCustomersList, reload]);

    return {
        customersList: customersList || [],
        fetchCustomersList,
        totalRowCount,
        loading
    };
}
