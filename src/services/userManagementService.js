import { ApiV1 } from 'helper/api';

export default {
    getAllUsers(companyId) {
        // 
        return ApiV1.get(`services/app/AdminUserManagement/GetDashboardUsersList?companyId=${companyId}`);
    },

    getUserRoles() {
        return ApiV1.get(`services/app/AdminUserManagement/GetCurrentAllowedRoles`);
    },

    CreateUser(data) {
        return ApiV1.post(`services/app/AdminUserManagement/CreateUser`, data);
    },

    UpdateUser(data) {
        return ApiV1.put(`services/app/AdminUserManagement/UpdateUser`, data);
    },

    GetUserId(id) {
        return ApiV1.get(`services/app/AdminUserManagement/GetUserManagementUserById?UserId=${id}`);
    },
    GetAllCompaniesUM(){
        return ApiV1.get(`services/app/AdminUserManagement/GetAllCompaniesUM`);
    },
    GetBrandsForCurrentUserUM(){
        return ApiV1.get(`services/app/AdminUserManagement/GetBrandsForCurrentUserUM`);
    },
    GetBranchesForCurrentUserUM(){
        return ApiV1.get(`services/app/AdminUserManagement/GetBranchesForCurrentUserUM`);
    },


    DeleteUser(id) {
        return ApiV1.delete(`services/app/AdminUserManagement/DeleteDashboardUser?UserId=${id}`);
    }
};
