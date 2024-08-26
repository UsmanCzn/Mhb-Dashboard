import { useCallback, useEffect, useState } from 'react';
import { ServiceFactory } from 'services/index';
import rewardService from 'services/rewardService';
import tiersService from 'services/tiersService';
import storeServices from 'services/storeServices';

export function useFetchBundlesData(selectedBrand, reload) {
    const [loading, setloading] = useState(false); 

    const [totalRowCount, setTotalRowCount] = useState(0);
    const [bundlesList, setBundleList] = useState([]);

  
    const fetchBundlesList = useCallback(
        () => {
            if (!selectedBrand?.id) return
            setloading(true);
            rewardService
                .getAllBundles(selectedBrand?.id)
                .then(
                    (res) => {
                        
                        setBundleList(res?.data?.result)
                        // setTotalRowCount(res?.data?.result?.data?.totalCount); 
                    },
                    (err) => {
                        console.log(err, 'err');
                    }
                )
                .finally(() => {
            setloading(false);
                });
        },
        [selectedBrand]
    );

 

  

    useEffect(() => {
        fetchBundlesList();
    }, [fetchBundlesList, reload]);

    return { 
        fetchBundlesList,
        totalRowCount, 
        bundlesList,  
        loading
    };
}
