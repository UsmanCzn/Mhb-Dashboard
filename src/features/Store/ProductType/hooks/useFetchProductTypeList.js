import constants from 'helper/constants';
import { useCallback, useEffect, useState } from 'react';
import { ServiceFactory } from 'services/index';
import storeServices from 'services/storeServices';

export function useFetchProductTypeList(reload, selectedBrand) {
    const [loading, setloading] = useState(false);

    const [totalRowCount, setTotalRowCount] = useState(0);

    const [productTypes, setProductTypes] = useState([]);

    const fetchProductTypesList = useCallback(() => {
        // console.log(selectedBrand,"sb 1");
        setloading(true);
        storeServices
            .getProductTypes(selectedBrand?.id)
            .then((res) => {
                setProductTypes(res?.data?.result);
            })
            .catch((err) => {
                console.log(err?.response?.data);
            })
            .finally(() => {
                setloading(false);
            });
    }, [selectedBrand]);

    // add selected brand in dependency

    useEffect(() => {
        if (selectedBrand?.id) fetchProductTypesList();
    }, [fetchProductTypesList, reload, selectedBrand]);

    return {
        productTypes: productTypes || [],
        fetchProductTypesList,
        totalRowCount,
        loading,
        setProductTypes
    };
}
