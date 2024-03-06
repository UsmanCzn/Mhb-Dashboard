import { ApiV1 } from 'helper/api'; 
 

export default {
  
  
  getProductTypes(brandId) {  
    return ApiV1.get(
      'services/app/ProductTypesAndSubtypes/GetProductTypeWithSubtypesDictionary',
      {
        params:{
            brandId:brandId
        }
      },
    );
  },

  createProductType(data) {  
    return ApiV1.post(
      'services/app/ProductTypesAndSubtypes/CreateProductType',
      data
      ,
    );
  },
  updateProductType(data) {  
    return ApiV1.put(
      'services/app/ProductTypesAndSubtypes/UpdateProductType',
      data
      ,
    );
  },
  deleteProductType(id) {  
    return ApiV1.delete(
      'services/app/ProductTypesAndSubtypes/DeleteProductType',
    {  
      params:{
        productTypeId:id
      }
    }
    ,
    );
  },
  createProductSubType(data) {  
    return ApiV1.post(
      'services/app/ProductTypesAndSubtypes/CreateProductSubType',
      data
      ,
    );
  },
  
  deleteProductSubType(id) {  
    return ApiV1.delete(
      'services/app/ProductTypesAndSubtypes/DeleteProductSubType',
    {  
      params:{
        productSubTypeId:id
      }
    }
    ,
    );
  },
 
  UpdateProductSubType(data) {  
    return ApiV1.put(
      'services/app/ProductTypesAndSubtypes/UpdateProductSubType',
    data
    ,
    );
  },

   
  
  getProductList(id) {  
    return ApiV1.get(
      'services/app/Products/GetProductListByBrandId',
    {
      params:{
        brandId:id
      }
    }
    ,
    );
  },

  createNewProduct(data) {  
    return ApiV1.post(
      'services/app/Products/CreateProductsV2',
      data
      ,
    );
  },
  updateProduct(data) {  
    return ApiV1.put(
      'services/app/Products/UpdateProductV2', 
      data 

      ,
    );
  },
  deleteProduct(id) {  
    return ApiV1.delete(
      'services/app/Products/DeleteProduct',
    {  
      params:{
        productId:id
      }
    }
    ,
    );
  },
  getProductAdditionGroupList(id) {  
    return ApiV1.get(
      'services/app/ProductAddition/GetProductAdditionsGroupListMaster',
      {
        params:{
          brandId:id
        }
      }
    ,
    );
  },

  createProductAdditionGroup(data) {  
    return ApiV1.post(
      'services/app/ProductAddition/CreateProductAdditionsGroup',
      data
      ,
    );
  },

  updateProductAdditionGroup(data,bid) {  
    return ApiV1.put(
      'services/app/ProductAddition/UpdateProductAdditionsGroup',
      data,
      {
        params:{
          brandId:bid
        }
      }
    );
  },
  deleteProductAddonGroup(id) {  
    return ApiV1.delete(
      'services/app/ProductAddition/DeleteProductAdditionsGroup',
    {  
      params:{
        productAdditionsGroupId:id
      }
    }
    ,
    );
  },
 
  getProductAdditionList(groupId,brandId) {  
    return ApiV1.get(
      'services/app/ProductAddition/GetProductAdditionsByGroupId',
      {  
        params:{
          groupId:groupId,
          // brandId:brandId,
        }
      }
    ,
    );
  },
  createProductAddition(data) {  
    return ApiV1.post(
      'services/app/ProductAddition/CreateProductAddition',
      data
      ,
    );
  },
  updateProductAddition(data,bid) {  
    return ApiV1.put(
      'services/app/ProductAddition/UpdateProductAddition', 
      data ,
      {
        params:{
          brandId:bid
        }
      }

      ,
    );
  },
  
  deleteProductAddon(id,bid) {  
    return ApiV1.delete(
      'services/app/ProductAddition/DeleteProductAddition',
    {  
      params:{
        productAdditionId:id,
        brandId:bid
      }
    }
    ,
    );
  },
 
getProductNameandIdByBrandid(id){
  return ApiV1.get(
    'services/app/Products/GetProductsNameandIdByBrandId',
  {
    params:{
      brandId:id
    }
  }
  );
}


}
