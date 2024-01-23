import { ApiV1, baseURL } from 'helper/api'; 
import axios  from '../../node_modules/axios/index';
import { Cookies } from "react-cookie";
 

export default {
  
  
  uploadBranchLogo(data) { 
    const cookies = new Cookies();
    const token = cookies.get("userAuthtoken");
    var bodyFormData = new FormData();
    bodyFormData.append('file', data); 
    return axios.post(
     baseURL+ '/Files/UploadproductImage',
      bodyFormData,
      {
        headers: { 
        "Content-Type": "multipart/form-data" ,
        Authorization: `Bearer ${token}`
      } 
      })
  },

  uploadProductImage(data) {   
    const cookies = new Cookies();
    const token = cookies.get("userAuthtoken");
    var bodyFormData = new FormData();
    bodyFormData.append('file', data); 
    return axios.post(
     baseURL+ '/Files/UploadproductImage',
      bodyFormData,
      {
        headers: { 
        "Content-Type": "multipart/form-data" ,
        Authorization: `Bearer ${token}`
      } 
      }
    );
  },
  UploadBrandLogoImage(data) {   
    const cookies = new Cookies();
    const token = cookies.get("userAuthtoken");
    var bodyFormData = new FormData();
    bodyFormData.append('file', data); 
    return axios.post(
     baseURL+ '/Files/UploadBrandLogoImage',
      bodyFormData,
      {
        headers: { 
        "Content-Type": "multipart/form-data" ,
        Authorization: `Bearer ${token}`
      } 
      }
    );
 
     
  },
  UploadCompanyLogoImage(data) {   
    const cookies = new Cookies();
    const token = cookies.get("userAuthtoken");
    var bodyFormData = new FormData();
    bodyFormData.append('file', data); 
    return axios.post(
     baseURL+ '/Files/UploadCompanyLogoImage',
      bodyFormData,
      {
        headers: { 
        "Content-Type": "multipart/form-data" ,
        Authorization: `Bearer ${token}`
      } 
      }
    );
 
     
  },
   

  // uploadBranchLogo
  
 
 
}
