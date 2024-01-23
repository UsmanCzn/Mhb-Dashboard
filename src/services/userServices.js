import { ApiV1 } from 'helper/api'; 
 

export default {
  
  
  login(data) {  
    return ApiV1.post(
      '/TokenAuth/Authenticate',
      data,
    );
  },
  GetAllCompanies() { 
    return ApiV1.get(
      'services/app/Company/GetAllCompanies'
    );
  },
 

   
  createCompany(data) { 
    return ApiV1.post(
      'services/app/Company/Create',
      data
    );
  },
  UpdateCompany(data) { 
    return ApiV1.put(
      'services/app/Company/UpdateCompany',
      data
    );
  },
   

  getUserManagement(id) { 
    return ApiV1.get(
      'services/app/AdminUserManagement/GetUserManagementUserById',
      {
        params:{
          UserId:id
        }
      }
    );
  },
   
 
 
}
