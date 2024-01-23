import userService from './userServices';
import brandServices from './brandServices';
import branchServices from './branchServices';
import customerService from './customerService';
import fileService from './fileService';
import storeServices from './storeServices';
import rewardService from './rewardService';
import paymentServices from 'services/paymentServices';

const services = {
    users: userService,
    brands: brandServices,
    branch: branchServices,
    customer: customerService,
    file: fileService,
    store: storeServices,
    reward: rewardService,
    payment: paymentServices
};

export const ServiceFactory = {
    get: (name) => services[name]
};
