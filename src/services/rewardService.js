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

    createPointsCollectionProgram(data) {
        return ApiV1.post('services/app/RewardProgram/CreatePointsCollectionProgram', data);
    },
    createPurchasesCollectionProgram(data) {
        return ApiV1.post('services/app/RewardProgram/CreatePurchasesCollectionProgram', data);
    },

    createConstantsCollectionProgram(data) {
        return ApiV1.post('services/app/RewardProgram/CreateConstantDiscountProgram', data);
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
    }
};
