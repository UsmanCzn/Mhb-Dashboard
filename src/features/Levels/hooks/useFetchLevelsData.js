import { useCallback, useEffect, useState } from 'react';
import { ServiceFactory } from 'services/index';
import rewardService from 'services/rewardService';
import tiersService from 'services/tiersService';
import storeServices from 'services/storeServices';

export function useFetchLevelData(selectedBrand, reload) {
    const [loading, setloading] = useState(false);
    const [productTypes, setProductTypes] = useState();

    const [totalRowCount, setTotalRowCount] = useState(0);
    const [tiersList, setTiersList] = useState([]);

    const [response, setResponse] = useState();
    const [regenerateResponse, setRegeneratedResponse] = useState();

    const [subtype, setSubtypes] = useState();
    useEffect(() => {
        if (response !== undefined) {
            const arrayTwoWithNames = response.map((item) => {
                const customerGroupId = item.customerGroupId;
                const foundItem = tiersList.find((entry) => entry.id === customerGroupId);

                return {
                    ...item,
                    name: foundItem ? foundItem.name : '' // If a match is found, assign the name, otherwise an empty string
                };
            });

            const allSubTypes = productTypes.reduce((acc, curr) => [...acc, ...curr.subTypes], []);
            setSubtypes(allSubTypes);
            const arrayTwoWithItemNames = arrayTwoWithNames.map((item) => {
                const matchingSubTypes = allSubTypes.filter((subType) => item.subItemsAllowedToRedeem.includes(subType.id));
                const itemNames = matchingSubTypes.map((subType) => subType.name);

                return {
                    ...item,
                    itemNames
                };
            });

            setRegeneratedResponse(arrayTwoWithItemNames);
        }
    }, [response,selectedBrand]);

    const fetchTiersList = useCallback(() => {
        if (!selectedBrand?.id) return;
        setloading(true);
        tiersService
            .getTiers(selectedBrand?.id)
            .then(
                (res) => {
                    var tiers = [];
                    for (var i = 0; i < res?.data?.result?.data?.data.length; i++) {
                        const item = res?.data?.result?.data?.data[i];
                        if (item.type === 'DynamicPointsGroup') {
                            tiers.push(item);
                        }
                    }
                    setTiersList(tiers);
                    setTotalRowCount(res?.data?.result?.data?.totalCount);
                    fetchCategories();
                },
                (err) => {
                    console.log(err, 'err');
                }
            )
            .finally(() => {});
    }, [selectedBrand]);

    const fetchLevels = () => {
        tiersService
            .getLevels(selectedBrand.id)
            .then(
                (res) => {
                    setResponse(res.data.result);
                    setTotalRowCount(res.data.result.length);
                },
                (err) => {
                    console.log(err, 'err');
                }
            )
            .finally(() => {});
    };

    const fetchCategories = () => {
        storeServices
            .getProductTypes(selectedBrand?.id)
            .then((res) => {
                setProductTypes(res?.data?.result);
                fetchLevels();
            })
            .catch((err) => {
                console.log(err?.response?.data);
            })
            .finally(() => {
                setloading(false);
            });
    };

    useEffect(() => {
        fetchTiersList();
    }, [fetchTiersList, reload]);

    return {
        response: response || [],
        fetchTiersList,
        totalRowCount,
        productTypes,
        tiersList,
        regenerateResponse,
        subtype,
        loading
    };
}
