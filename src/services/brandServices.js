
import { ApiV1 } from 'helper/api'; 
 

export default {
  
  
   
  getAllBrands() { 
    return ApiV1.get(
      'services/app/Brand/GetBrandsForCurrentUser'
    );
  },
  createBrand(data) { 
    return ApiV1.post(
      'services/app/Brand/CreateBrand',
      data
    );
  },
  UpdateBrand(data) { 
    return ApiV1.put(
      'services/app/Brand/UpdateBrand',
      data
    );
  },
  getLanguages() { 
    return ApiV1.get(
      'services/app/Currency/GetLanguagesDictionary'
    );
  },
  getCurrencies() { 
    return ApiV1.get(
      'services/app/Currency/GetCurrenciesDictionary'
    );
  },
   
   
   
}


 