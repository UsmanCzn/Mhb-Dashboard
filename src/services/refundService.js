import { ApiV1 } from 'helper/api';

export default {
    getRefundRequests() {
        return ApiV1.get(`services/app/Refund/GetRefundOrderRequest`);
    },

    InitiateRefundRequestFromOrder(data) {
        return ApiV1.post(`services/app/Refund/InitiateRefundRequestFromOrder`, data);
    },
    InitiateRefundRequestManual(data) {
        return ApiV1.post(`services/app/Refund/InitiateRefundRequestManual`, data);
    },
    ApproveRefundRequest(data) {
        return ApiV1.post(`services/app/Refund/ApproveRefundRequest`, data);
    },


};
