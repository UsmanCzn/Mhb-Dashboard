import { ApiV1 } from 'helper/api';

export default {
  getAllBranches() {
    return ApiV1.get(
      'services/app/Branch/GetBranchesForCurrentUser'
    );
  },

  getBranchScedule(branchId) {
    return ApiV1.get(
      'services/app/Branch/GetBranchOnlineOrderingSchedule',
      {
        params: {
          branchId
        }
      }
    );
  },

  getBranchById(branchId) {
    return ApiV1.get(
      'services/app/Branch/GetById',
      {
        params: {
          branchId
        }
      }
    );
  },

  getBranchRewardProgramByID(branchId) {
    return ApiV1.get(
      'services/app/RewardProgram/GetBranchActualRewardProgramsByBranchId',
      {
        params: {
          branchId
        }
      }
    );
  },

  CreateConstantDiscountProgram(data) {
    return ApiV1.post(
      'services/app/RewardProgram/CreateConstantDiscountProgram',
      data
    );
  },

  editPointsCollectionProgram(data) {
    return ApiV1.post(
      'services/app/RewardProgram/EditPointsCollectionProgram',
      data
    );
  },

  EditConstantDiscountProgram(data) {
    return ApiV1.post(
      'services/app/RewardProgram/EditConstantDiscountProgram',
      data
    );
  },

  DeleteDiscountProgram(id) {
    return ApiV1.delete(
      'services/app/RewardProgram/DeleteDiscountProgram',
      {
        params: {
          discountProgramId: id
        }
      }
    );
  },

  GetBranchUsersByBranchId(branchId) {
    return ApiV1.get(
      'services/app/Branch/GetBranchUsersByBranchId',
      {
        params: {
          branchId
        }
      }
    );
  },

  EditBranchSchedule(params) {
    return ApiV1.post(
      'services/app/Branch/EditBranchOnlineOrderingSchedule',
      params
    );
  },

  createBranchSchedule(params) {
    return ApiV1.post(
      'services/app/Branch/CreateBranchOnlineOrderingcShedule',
      params
    );
  },

  deleteBranchSchedule(params) {
    return ApiV1.delete(
      'services/app/Branch/DeleteBranchOnlineOrderingSchedule',
      {
        params: params
      }
    );
  },

  createBranch(params) {
    return ApiV1.post(
      'services/app/Branch/Create',
      params
    );
  },

  editBranch(params) {
    return ApiV1.put(
      'services/app/Branch/Update',
      params
    );
  },

  copyProductsMenuToBranch(params) {
    return ApiV1.post(
      `services/app/Products/DuplicateProductAvailabilityAsOtherBranch?prevBranchId=${params.prevId}&currentBranchId=${params.currentId}`
    );
  },

  copyProductsAddOnsMenuToBranch(params) {
    return ApiV1.post(
      `services/app/ProductAddition/DuplicateProductAdditionAvailabilityAsOtherBranch?prevBranchId=${params.prevId}&currentBranchId=${params.currentId}`
    );
  },

  getDeliveryAreasTreeByBrandId(brandId) {
    return ApiV1.get('services/app/Country/GetDeliveryAreasTreeByBrandId', {
      params: {
        brandId
      }
    });
  },

  getRegions(brandId, branchId) {
    return ApiV1.get('services/app/Country/GetDeliveryAreasTreeByBrandId', {
      params: {
        brandId,
        branchId
      }
    });
  },

  createDeliveryRegion(payload) {
    return ApiV1.post('services/app/CustomerDeliveryAddress/CreateDeliveryRegion', null, {
      params: {
        name: payload.name,
        nativeName: payload.nativeName,
        branchId: payload.branchId,
        brandId: payload.brandId
      }
    });
  },

  createDeliveryArea(payload) {
    return ApiV1.post('services/app/CustomerDeliveryAddress/CreateDeliveryArea', null, {
      params: {
        name: payload.name,
        nativeName: payload.nativeName,
        deliveryRegionId: payload.deliveryRegionId,
        branchId: payload.branchId,
        brandId: payload.brandId,
        sortOrder: payload.sortOrder
      }
    });
  },

  updateDeliveryRegion(payload) {
    return ApiV1.put('services/app/CustomerDeliveryAddress/UpdateDeliveryRegion', null, {
      params: payload
    });
  },

  updateDeliveryAreaHide({ brandId, regionId, areaId, isHidden }) {
    return ApiV1.get('services/app/Country/GetUpdateDeliveryAreaHide', {
      params: {
        brandId,
        RegionId: regionId,
        AreaId: areaId,
        IsHidden: isHidden
      }
    });
  }
};
