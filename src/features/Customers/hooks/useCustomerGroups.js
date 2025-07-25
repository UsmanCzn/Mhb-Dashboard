import { useCallback, useEffect, useState } from 'react';
import { ServiceFactory } from 'services/index';
import rewardService from 'services/rewardService';
import tiersService from 'services/tiersService';

export function useCustomerGroup(reload, selectedBrand) {
    const [loading, setloading] = useState(false);

    const [totalRowCount, setTotalRowCount] = useState(0);

    const [tiersList, setTiersList] = useState([]);

    const fetchTiersList = useCallback(
        (selectedBrand) => {
            // if (selectedBrand?.id) {
            // } else return;
            setloading(true);

            tiersService
                .getCustomerGroupsV2(100, 0,selectedBrand.id, 0)
                .then(
                    (res) => {
                        console.log(res);
                        var customers = [];
                        for (var i = 0; i < res?.data?.result?.data?.data.length; i++) {
                            const item = res?.data?.result?.data?.data[i];
                            if (item.type === "BrandGroup" || item.type === "DefaultBrandGroup" ) {
                                customers.push(item);
                            }
                        }
                        setTiersList(customers);
                        setTotalRowCount(res?.data?.result?.data?.totalCount);
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
        fetchTiersList(selectedBrand);
    }, [fetchTiersList, reload]);

    return {
        tiersList: tiersList || [],
        fetchTiersList,
        totalRowCount,
        loading
    };
}
