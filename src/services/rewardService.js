import { ApiV1 } from 'helper/api';

export default {
    getRewardsByBrand(bid) {
        return ApiV1.get('services/app/RewardProgram/GetBranchActualRewardProgramsByBrand', {
            params: {
                brandId: bid
            }
        });
    },
    getdashBoardData(brandId, startDate, endDate) {
        const baseUrl = 'https://nextwhitelabelling-prod.azurewebsites.net/api/services/app/Dashboard/GetLiveDashboardReport';

        let url = `${baseUrl}?brandId=${brandId}&branchId=0`;

        if (startDate !== null) {
            url += `&startDate=${startDate}`;
        }

        if (endDate !== null) {
            url += `&endDate=${endDate}`;
        }

        console.log(url);
        return ApiV1.get(url, {});
    },
    editPurchasesCollectionProgram(data) {
        return ApiV1.post('services/app/RewardProgram/EditPurchasesCollectionProgram', data);
    },
    editPointCollectionProgram(data) {
        return ApiV1.post('services/app/RewardProgram/EditPointsCollectionProgram', data);
    },
    editConstantCollectionProgram(data) {
        return ApiV1.post('services/app/RewardProgram/EditConstantDiscountProgram', data);
    },
    editCouponsDiscountProgram(data) {
        return ApiV1.post('services/app/RewardProgram/EditCouponsDiscountProgram', data);
    },

    createPointsCollectionProgram(data) {
        return ApiV1.post('services/app/RewardProgram/CreatePointsCollectionProgram', data);
    },
    createPurchasesCollectionProgram(data) {
        return ApiV1.post('services/app/RewardProgram/CreatePurchasesCollectionProgram', data);
    },

    createConstantsCollectionProgram(data) {
        return ApiV1.post('services/app/RewardProgram/CreateConstantDiscountProgram', data);
    },
    createCouponDiscountCollection(data) {
        return ApiV1.post('services/app/RewardProgram/CreateCouponDiscountProgram', data);
    },

    DeleteDiscountProgram(id) {
        return ApiV1.delete('services/app/RewardProgram/DeleteDiscountProgram', {
            params: {
                discountProgramId: id
            }
        });
    },

    DuplicateReward(data) {
        return ApiV1.post('services/app/RewardProgram/DuplicateRewardProgramForOtherBranches', data);
    },


    getRewardStats (data){
        const {
            brandId,
            branchId,
            startDate,
            endDate,
        }= data
        return ApiV1.get(`services/app/Dashboard/GetLiveDashboardReport?brandId=${brandId}&branchId=${branchId}&startDate=${startDate}&endDate=${endDate}`)  
    },

    getAllBundles (brandId){ 
        return ApiV1.get(`services/app/Bundle/GetAllBundlesByBrandId`,{
            params:{
                brandId
            }
        })  
    },
    addNewBundle (body){ 
        return ApiV1.post(`services/app/Bundle/CreateBundle`,body)  
    },
    updateBundle (body){ 
        return ApiV1.put(`services/app/Bundle/UpdateBundle`,body)  
    },

};
