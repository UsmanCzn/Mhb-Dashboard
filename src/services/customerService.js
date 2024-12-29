import { ApiV1 } from 'helper/api';
import CreateNotification from 'pages/customer-notification/create-notification';

export default {
    getAllCustomers(data) {
        return ApiV1.get('services/app/Customer/GetCustomersAccessibleForCurrentUser', {
            params: data
        });
    },

    GetCustomersGroups() {
        return ApiV1.get('services/app/CustomersGroups/GetCustomersGroups');
    },
    GetCustomersGroupsTree() {
        return ApiV1.get('services/app/CustomersGroups/GetCustomersGroupsTreeView');
    },
    GetAllCustomerNotification() {
        return ApiV1.get('services/app/Notifications/GetAllNotificationsRequests');
    },
    CreateNotification(payload) {
        return ApiV1.post(`services/app/Notifications/NotificationsRequests`, payload);
    },
    AcceptNotification(payload) {
        return ApiV1.post(`services/app/Notifications/SendWebAdminNotifications`, payload);
    },
    RejectNotification(payload) {
        return ApiV1.post(`services/app/Notifications/RejectNotificationsRequests`, payload);
    },
    getCountries() {
        return ApiV1.get('services/app/Country/GetCountriesDictionary');
    },

    createNewCustomer(data) {
        return ApiV1.post('services/app/Customer/RegistrateWhiteLabelCustomer', data);
    },
    getCustomerDetail(userId) {
        return ApiV1.get('services/app/Customer/GetCustomerDetailsByIdV2', {
            params: {
                userId: userId
            }
        });
    },
    updateCustomerDetail(data) {
        return ApiV1.put('services/app/Customer/UpdateCustomerDetails', data);
    },

    getWalletDetails(data) {
        return ApiV1.get('services/app/Customer/GetCustomerWalletPunchesAndFreeItemsDetails', {
            params: data
        });
    },

    UpdateCustomerWalletBalance(data) {
        return ApiV1.put('services/app/Customer/UpdateCustomerWalletBalance', data);
    },

    getCreditDetails() {
        return ApiV1.get('services/app/Customer/GetCustomerCreditBalanceByCompanyManager');
    },
    getCreditDetailsByCustomerId(cid, bid) {
        return ApiV1.get(`services/app/Customer/GetCustomerWalletPunchesAndFreeItemsDetails?customerId=${cid}&brandId=${bid}`);
    },

    UpdateCreditBalance(data) {
        return ApiV1.put('services/app/Customer/UpdateCustomerCreditBalanceByCompanyManager', data);
    },
    GenerateRequestForFreeItems(data) {
        return ApiV1.put('services/app/Customer/InsertUserPunchesInfoDetail', data);
    },
    UpdateCreditDepositWalletByid(data) {
        return ApiV1.put('services/app/Customer/UpdateCustomerCreditWalletBalance', data);
    },

    getCustomerOrdersByBrand(data) {
        return ApiV1.post('services/app/Store/GetCurrentCustomerOrdersHistoryById', data);
    },

    addPointsForCustomer(data) {
        return ApiV1.post(
            `services/app/Store/AddPointsForUserByAdmin?pointAdded=${data.pointAdded}&brandId=${data.brandId}&customerId=${data.customerId}`
        );
    },

    getUserPointsCountByUserIdandBrandId$(data) {
        return ApiV1.get(`services/app/Customer/GetUserPointsCountByUserIdandBrandId?userId=${data.userId}&brandId=${data.brandId}`);
    },

    updateUsedPoints(data) {
        return ApiV1.post('services/app/Customer/InsertUserPunchesInfoDetail', data);
    },

    acceptUsedPointsRequest(data) {
        return ApiV1.put('services/app/Customer/UpdateCustomerFreeItemsAndPunches', data);
    },

    rejectUsedPointsRequest(data) {
        return ApiV1.put('services/app/Customer/UpdateRejectCustomerFreeItemsAndPunches', data);
    },
    getUsedPointsRequest() {
        return ApiV1.get('services/app/Customer/GetUserPunchesInfoDetail');
    },
    getCustomerDetailV3(userId, brandId) {
        return ApiV1.get('services/app/Customer/GetCustomerDetailsByIdV3', {
            params: {
                userId: userId,
                brandId: brandId
            }
        });
    },

    getComapniesByUserRole() {
        return ApiV1.get(`services/app/AdminUserManagement/GetCompaniesForCurrentUserUM`);
    }
};
