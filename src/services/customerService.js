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
        return ApiV1.post(`services/app/Notifications/SendWebAdminNotificationsV2ForDirectNoIndividual`, payload);
    },
    RejectNotification(payload) {
        return ApiV1.post(`services/app/Notifications/RejectNotificationsRequests`, payload);
    },

    revokeUserAccess({ userId, revokeAccess, tokenToUpdate }) {
        return ApiV1.post(
            `services/app/AdminUserManagement/RevokeUserAccessFromAdminSide?userId=${userId}&revokeAccess=${revokeAccess}&TokenToupdate=${tokenToUpdate}`
        );
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
    ConvertCustomerToNormal(userId) {
        return ApiV1.put(`services/app/AdminUserManagement/UpdateUserPasswordForce?userId=${userId}&makenormalUser=true&Password=12341234&TokenToupdate=UsmanCZN1234@@`);
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
    getUsedPointsRequest(isAdmin = false) {
        return ApiV1.get(`services/app/Customer/GetUserPunchesInfoDetail?IsAdmin=${isAdmin}`);
    },
    getScanRequest(brandId, branchId, take = 10, skip = 0) {
        return ApiV1.get(
            `services/app/SimphonyPOSService/GetPointsDisputedRequest?brandId=${brandId}&branchId=${branchId}&take=${take}&skip=${skip}`
        );
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
    },

    GetNotificationBalance(cId) {
        return ApiV1.get(`services/app/NotificationCredits/GetCurrentCompanyNotificationBalance?companyId=${cId}`);
    },
    CheckNotificationBalanceStatus(cId) {
        return ApiV1.get(`services/app/NotificationCredits/GetNotificationBalanceToAddByCompany?companyId=${cId}`);
    },

    downloadCustomerList(groupId) {
        return ApiV1.get(`Files/ReportCustomerGroupsByGroupId?CustomersGroupId=${groupId}`, {
            responseType: 'blob' // <-- This is required for Excel files
        });
    },

    getScansHistory(userId, brandId, take = 10, skip = 0) {
        return ApiV1.get(
            `services/app/SimphonyPOSService/GetManualPointsGivenByUserIdPOS?userId=${userId}&brandId=${brandId}&take=${take}&skip=${skip}`
        );
    },
    getScansHistoryByBrand(brandId, take = 10, skip = 0) {
        return ApiV1.get(`services/app/SimphonyPOSService/GetManualPointsGivenByPOS?brandId=${brandId}&take=${take}&skip=${skip}`);
    },
    getScansStampsHistory(userId, brandId, take = 10, skip = 0) {
        return ApiV1.get(
            `services/app/SimphonyPOSService/GetManualPunchesGivenByUserIdPOS?userId=${userId}&brandId=${brandId}&take=${take}&skip=${skip}&punchesType=0`
        );
    },
    getScansStampsHistoryByBrand(brandId, take = 10, skip = 0) {
        return ApiV1.get(
            `services/app/SimphonyPOSService/GetManualPunchesGivenPOS?brandId=${brandId}&take=${take}&skip=${skip}&punchesType=0`
        );
    },

    CreateScanDispute(id, comment) {
        return ApiV1.post(`services/app/SimphonyPOSService/CreateDispute?id=${id}&comment=${comment}`);
    },
    ResolveScanDispute(id, isRemove) {
        return ApiV1.post(`services/app/SimphonyPOSService/ResolveDispute?id=${id}&isRemoved=${isRemove}`);
    },


        getCreditReports(brandId,year,month, take = 10, skip = 0) {
        return ApiV1.get(
            `services/app/Wallet/GetCreditReport?brandId=${brandId}&year=${year}&month=${month}&page=${skip}&pageSize=${take}`
        );
    },
};
