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
        params:{
          branchId
        }
      }
    );
  },


  getBranchById(branchId) { 
    return ApiV1.get(
      'services/app/Branch/GetById',
      {
        params:{
          branchId
        }
      }
    );
  },
   
  getBranchRewardProgramByID(branchId) { 
    return ApiV1.get(
      'services/app/RewardProgram/GetBranchActualRewardProgramsByBranchId',
      {
        params:{
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
      params:{
        discountProgramId:id
      }
    }
    );
  },
   
  GetBranchUsersByBranchId(branchId) { 
    return ApiV1.get(
      'services/app/Branch/GetBranchUsersByBranchId',
      {
        params:{
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
      params:params}
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
   
}
