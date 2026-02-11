import { ApiV1 } from 'helper/api';

export default {
    getBrandCommission(brandId) {
        return ApiV1.get(`services/app/BrandCommission/GetByBrandId?brandId=${brandId}`);
    },
    CreateBrandCommission(payload) {
        return ApiV1.post(`services/app/BrandCommission/Create`, payload);
    },
    UpdateBrandCommission(payload) {
        return ApiV1.put(`services/app/BrandCommission/Update`, payload);
    },
    GetCurrentMonthCommission(brandId,month,year) {
        return ApiV1.get(`services/app/BrandCommission/GetCurrentMonthCommissionData?brandId=${brandId}&month=${month}&year=${year}`);
    },
    GetBrandCommissionInvoice(brandId,month,year) {
        return ApiV1.get(`services/app/BrandCommission/GetBrandCommissionInvoiceList?brandId=${brandId}&month=${month}&year=${year}`);
    },
    CheckoutForBrandCommissionInvoice(invoiceId,paymentSystemId) {
        return ApiV1.post(`services/app/BrandCommission/CheckoutForBrandCommissionInvoice?brandCommissionInvoiceId=${invoiceId}&PaymentSystemId=${paymentSystemId}`);
    }
    ,
    SendEmailBrandCommissionInvoice(invoiceId,paymentSystemId) {
        return ApiV1.post(`services/app/BrandCommission/SendInvoiceEmailToCompanyAndBrandAdmin?id=${invoiceId}`);
    }
};
