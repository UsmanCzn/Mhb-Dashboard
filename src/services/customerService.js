import { ApiV1 } from 'helper/api';

export default {
    getAllCustomers(data) {
        return ApiV1.get('services/app/Customer/GetCustomersAccessibleForCurrentUser', {
            params: data
        });
    },
    GetCustomersGroups() {
        return ApiV1.get('services/app/CustomersGroups/GetCustomersGroups');
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
        console.log(bid, 'sads');
        return ApiV1.get(`services/app/Customer/GetCustomerWalletPunchesAndFreeItemsDetails?customerId=${cid}&brandId=${bid}`);
    },

    UpdateCreditBalance(data) {
        return ApiV1.put('services/app/Customer/UpdateCustomerCreditBalanceByCompanyManager', data);
    },
    UpdateCreditDepositWalletByid(data) {
        return ApiV1.put('services/app/Customer/UpdateCustomerCreditWalletBalance', data);
    }
};
