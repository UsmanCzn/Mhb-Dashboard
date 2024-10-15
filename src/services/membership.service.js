import { ApiV1 } from 'helper/api';

export default {
    getAllMembershipTypesMaster(data) {
        return ApiV1.get('services/app/MemberShip/GetAllMemberShipTypesMaster', {
            params: data
        });
    },
    CreateMembership(payload) {
        return ApiV1.post(`services/app/MemberShip/CreateMemberShip`, payload);
    },
    getCompanyMembershipById(id) {
        return ApiV1.get(`services/app/MemberShip/GetByCompanyId?companyId=${id}`);
    },
    getAllActiveInactiveMembershipForAdmin() {
        return ApiV1.get(`services/app/MemberShip/GetAllInActiveMemberShipsForAdmin`);
    }
};
