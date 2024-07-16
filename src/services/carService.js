import { ApiV1 } from 'helper/api';

export default {
    getCarType(brandId) {
        return ApiV1.get(`services/app/Cars/GetCarTypesV2?brandId=${brandId}`);
    },
    getCarBrands(brandId) {
        return ApiV1.get(`services/app/Cars/GetCarBrandsV2?brandId=${brandId}`);
    },
    getCarColors(brandId) {
        return ApiV1.get(`services/app/Cars/GetCarColorsV2?brandId=${brandId}`);
    },

    CreateCarType(data) {
        return ApiV1.post(`services/app/Cars/AddCarType`, data);
    },
    CreateCarBrand(data) {
        return ApiV1.post(`services/app/Cars/AddCarBrand`, data);
    },
    CreateCarColor(data) {
        return ApiV1.post(`services/app/Cars/AddCarColor`, data);
    },

    UpdateCarType(data) {
        return ApiV1.put(`services/app/Cars/UpdateCarType`, data);
    },
    UpdateCarBrand(data) {
        return ApiV1.put(`services/app/Cars/UpdateCarBrand`, data);
    },
    UpdateCarColor(data) {
        return ApiV1.put(`services/app/Cars/UpdateCarColor`, data);
    },

};
