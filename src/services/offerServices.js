import { ApiV1 } from 'helper/api';

export default {
    getAllOffers() {
        return ApiV1.get(`services/app/Offer/GetAllList`);
    },
    getAllOffersByBrandId(brandId) {
        return ApiV1.get(`services/app/Offer/GetAllOffersByBrandId?brandId=${brandId}`);
    },

    CreateOffer(data) {
        return ApiV1.post(`services/app/Offer/Create`, data);
    },

    UpdateOffer(data) {
        return ApiV1.put(`services/app/Offer/Update`, data);
    },

    GetOfferId(id) {
        return ApiV1.get(`services/app/Offer/GetById?Id=${id}`);
    },

    DeleteOffer(id) {
        return ApiV1.delete(`services/app/Offer/Delete?Id=${id}`);
    }
};
