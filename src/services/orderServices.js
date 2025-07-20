import { ApiV1 } from 'helper/api'; 
import { Api } from '../../node_modules/@mui/icons-material/index';
 

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


  getAllOrderStatusCount(branchId=0, statusId){
    return ApiV1.get(`services/app/Store/GetAllStatusCounts?branchId=${branchId}&StatusId=${statusId}`)
  },
   
  updateOrderStatus(data) {  
    return ApiV1.put(
      'services/app/Store/UpdateOrderStatus', 
      data 
      ,
    );
  },

  getCustomerOrders (data){
    return ApiV1.get(
      'services/app/Store/GetRejectedStatusOrdersHistory',
      {
        params:{branchId:data}
      }
    ); 
  },
  
  getFaresDetails(orderId){
    return ApiV1.get(`services/app/Store/GetFareDetailsForVerdiStageDelivery?orderId=${orderId}`)
  },
  assignDeliveryTask(orderId){
      return ApiV1.post(`services/app/Store/CreateTaskForDelivery?orderId=${orderId}`);
  }
,
  getOrderDetails(id){
    return ApiV1.get(`services/app/Store/GetOrderDetails?orderId=${id}`)
  }
}
