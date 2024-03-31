import { useCallback, useEffect, useState } from 'react';
import { ServiceFactory } from 'services/index';

export function useFetchCustomerList(props) {
    const { reload,search,setCustomerStats,selectedCompany } = props
    console.log(selectedCompany,"ss");
    const [loading, setloading] = useState(false);
    const [totalRowCount, setTotalRowCount] = useState(0);
    const [customersList, setCustomersList] = useState([]);

    const customerServices = ServiceFactory.get('customer');
    const fetchCustomersList = useCallback((pageNo,searchexp,compId) => {
        setloading(true);
        customerServices
            .getAllCustomers({
                Skip: pageNo * 10,
                Take: 10,
                SearchExpression:searchexp,
                ApplicationId:compId
            })
            .then(
                (res) => {
                    setCustomersList(res.data.result?.data?.data);
                    let stats= res.data.result.data 
                    setCustomerStats({totalDaily:stats.totalDaily,totalMonthly:stats.totalMonthly,totalYearly:stats.totalYearly,totalCount:stats.totalCount})
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
        fetchCustomersList(0,search,selectedCompany);
    }, [fetchCustomersList, reload,search,selectedCompany]);

    return {
        customersList: customersList || [],
        fetchCustomersList,
        totalRowCount,
        loading
    };
}
