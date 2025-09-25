import { ApiV1 } from 'helper/api';

export default {
    getAllTopupWalletByBrand(brandId) {
        return ApiV1.get(`services/app/BrandPayment/GetAllBrandTopUpsByBrandId?brandId=${brandId}`);
    },

    CreateWalletTopUp(data) {
        return ApiV1.post(`services/app/BrandPayment/CreateTopUp`, data);
    },
    UpdateWalletTopUp(data) {
        return ApiV1.put(`services/app/BrandPayment/UpdateTopUp`, data);
    },
    DeleteWalletTopUp(data) {
        return ApiV1.delete(`services/app/BrandPayment/DeleteTopById?Id=${data}`);
    },
};
