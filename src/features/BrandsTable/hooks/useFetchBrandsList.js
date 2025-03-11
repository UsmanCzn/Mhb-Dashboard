import { useCallback, useEffect, useState } from 'react';
import { ServiceFactory } from 'services/index';

export function useFetchBrandsList() {
    const [loading, setloading] = useState(false);

    const [totalRowCount, setTotalRowCount] = useState(0);

    const [brandsList, setBrandsList] = useState([]);
    
    const brandServices = ServiceFactory.get('brands');
    const fetchBrandsList = useCallback((pageNo) => {
        setloading(true);
        brandServices
            .getAllBrands()
            .then(
                (res) => {
                    setBrandsList(res.data?.result);

                    // setTotalRowCount(res.data?.pages);
                },
                (err) => {}
            )
            .finally(() => {
                setloading(false);
            });
    }, []);

    useEffect(() => {
        fetchBrandsList(0);
    }, [fetchBrandsList]);

    return {
        brandsList: brandsList || [],
        fetchBrandsList,
        totalRowCount,
        loading
    };
}
