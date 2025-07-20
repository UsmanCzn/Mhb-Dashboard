import { ApiV1 } from 'helper/api';
export default {

    getNotificationBalanceHistory(data) {
        return ApiV1.get('services/app/NotificationCredits/GetNotificationCreditHistory', {
          params: data
        });
      },
      
}