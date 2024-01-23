import constants from 'helper/constants';
import { useCallback, useEffect, useState } from 'react';
import { ServiceFactory } from 'services/index';
import storeServices from 'services/storeServices';

export function useFetchProductsList(reload, selectedBrand) {
    const [loading, setloading] = useState(false);

    const [totalRowCount, setTotalRowCount] = useState(0);

    const [productsList, setProductsList] = useState([]);

    const fetchProductsList = useCallback(
        (pageNo) => {
            setloading(true);
            storeServices
                .getProductList(selectedBrand?.id)
                .then(
                    (res) => {
                        setProductsList(res.data.result);

                        // setTotalRowCount(res.data?.pages);
                    },
                    (err) => {}
                )
                .finally(() => {
                    setloading(false);
                });
        },
        [selectedBrand]
    );

    useEffect(() => {
        if (selectedBrand?.id) fetchProductsList(0);
    }, [fetchProductsList, reload]);

    return {
        productsList: productsList || [],
        fetchProductsList,
        totalRowCount,
        loading,
        setProductsList
    };
}
