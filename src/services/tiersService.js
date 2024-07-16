import { ApiV1 } from 'helper/api';

export default {
    getTiers(bid) {
        return ApiV1.get('services/app/CustomersGroups/GetCustomersGroupsV2', {
            params: {
                brandId: bid,
                GroupType: 5
            }
        });
    },

    createNewTier(data) {
        return ApiV1.post('services/app/CustomersGroups/CreatePrivatePointsProgramGroup', data);
    },

    createNewCustomerGroup(data) {
        return ApiV1.post('services/app/CustomersGroups/CreateNewCustomersGroup', data);
    },

    getCustomerGroups(take, skip) {
        return ApiV1.get('services/app/CustomersGroups/GetCustomersGroups?Skip=' + skip + '&Take=' + take + '&Sort.Desc=true', {});
    },
    getCustomerGroupsV2(take, skip,brandId,grouptype) {
        return ApiV1.get(`services/app/CustomersGroups/GetCustomersGroupsV2?BrandId=${brandId}&GroupType=${grouptype}&Skip=${skip}&Take=${take}`, {});
    },

    updateCustomerGroup(data) {
        return ApiV1.put('services/app/CustomersGroups/UpdateCustomersGroup', data);
    },
    updateTier(data) {
        return ApiV1.put('services/app/CustomersGroups/UpdatePrivatePointsProgramGroup', data);
    },
    getLevels(id) {
        const url = 'services/app/LevelsRedeemable/GetAllByBrandId?brandId=' + id;
        return ApiV1.get(url, {});
    },
    createLevel(data) {
        return ApiV1.post('services/app/LevelsRedeemable/Create', data);
    },
    updateLevel(data) {
        return ApiV1.put('services/app/LevelsRedeemable/Update', data);
    },
    deleteLevel(data) {
        return ApiV1.delete('services/app/LevelsRedeemable/Delete', data);
    }
};
