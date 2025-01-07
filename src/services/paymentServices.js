import { ApiV1 } from 'helper/api';

export default {
    getAllBrandPaymentByBrandId(data) {
        return ApiV1.get(`services/app/BrandPayment/GetAllByBrandIdAll?brandId=${data}`);
    },

    CreateNewPaymentMethods(data) {
        return ApiV1.post(`services/app/BrandPayment/Create`, data);
    },

    UpdatePaymentMethods(data) {
        return ApiV1.put(`services/app/BrandPayment/Update`, data);
    },

    GetPaymentById(id) {
        return ApiV1.get(`services/app/BrandPayment/GetById?Id=${id}`);
    },

    DeletePayment(id){
        return ApiV1.delete(`services/app/BrandPayment/Delete?Id=${id}`)
    }
};
