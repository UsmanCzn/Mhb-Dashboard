import { ApiV1 } from 'helper/api'; 
 

export default {
    getAllAdvertisements() { 
        return ApiV1.get(
          'services/app/BrandAdvertisements/GetAllBrandAdvertisements'
        );
      },

    createNewAdvertisements(data) { 
        return ApiV1.post(
          'services/app/BrandAdvertisements/CreateBrandAdvertisement',
          data
        );
      },

      updateNewAdvertisements(data) {
        return ApiV1.put(
            'services/app/BrandAdvertisements/UpdateBrandAdvertisement',
            data
          );
      }

      
}