import { ApiV1 } from 'helper/api'; 
 

export default {
  
 
 
  
  getOrdersList(data) { 
    return ApiV1.get(
      'services/app/Store/GetUserOrdersAsBranchUser',
      {
        params:data
      }
    );
  },
  getOrderTypes() { 
    return ApiV1.get(
      'services/app/Store/GetOrderStatusTypes', 
    );
  },
    
  getAcceptedOrdersNumbers(data) { 
    return ApiV1.get(
      'services/app/Store/GetAcceptedStatusOrdersHistory',
      {
        params:{branchId:data}
      }
    );
  },
  getPendingOrdersNumbers(data) { 
    return ApiV1.get(
      'services/app/Store/GetPendingdStatusOrdersHistory',
      {
        params:{branchId:data}
      }
    );
  },
  getClosedOrdersNumbers(data) { 
    return ApiV1.get(
      'services/app/Store/GetCloseddStatusOrdersHistory',
      {
        params:{branchId:data}
      }
    );
  },

  getReadyOrdersNumbers(data) { 
    return ApiV1.get(
      'services/app/Store/GetReadyStatusOrdersHistory',
      {
        params:{branchId:data}
      }
    );
  },

   
  getRejectedOrdersNumbers(data) { 
    return ApiV1.get(
      'services/app/Store/GetRejectedStatusOrdersHistory',
      {
        params:{branchId:data}
      }
    );
  },
   
  updateOrderStatus(data) {  
    return ApiV1.put(
      'services/app/Store/UpdateOrderStatus', 
      data 
      ,
    );
  },

}
