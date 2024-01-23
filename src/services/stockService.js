import { ApiV1 } from 'helper/api';

export default {
    getProductsListWithQty(data) {
        return ApiV1.get(`services/app/Products/GetProductsGroupedByTypeAndSubtypeHideUnHide`, {
            params: data
        });
    },

    ProductMenuSwitchV2(data) {
        return ApiV1.post(`services/app/Products/ProductMenuSwitchV2`, data);
    }
};
