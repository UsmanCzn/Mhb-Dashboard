
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
   
  getBrandEvents (brandId) {
    return ApiV1.get(`services/app/BrandEvent/GetAllByBrandId?brandId=${brandId}`)
  },

  createBrandEvent(body){
    return ApiV1.post(`services/app/BrandEvent/Create`,body)
  },
  updateBrandEvent(body){
    return ApiV1.put(`services/app/BrandEvent/Update`,body)
  },
  deleteBrandEvent(body){
    return ApiV1.delete(`services/app/BrandEvent/Delete?Id=${body}`,)
  },

  GetNotificationBalanceToAddByCompany(cId){
    return ApiV1.get(`services/app/NotificationCredits/GetNotificationBalanceToAddByCompany?companyId=${cId}`)
  }
   ,
   AddNotificationBalance(orderPrice, companyId, productName,notificationCount,PaymentSystemId) {
    return ApiV1.post(`services/app/NotificationCredits/AddBalanceForNotification?orderPrice=${orderPrice}&companyId=${companyId}&ProductName=${productName}&PaymentSystemId=${PaymentSystemId}&NotificationCount=${notificationCount}`);
},

CheckNotificationBalanceStatus(cId) {
  return ApiV1.get(`services/app/NotificationCredits/GetNotificationBalanceToAddByCompany?companyId=${cId}`);
},
}


 