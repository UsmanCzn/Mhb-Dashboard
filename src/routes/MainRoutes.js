import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AcquireLogin } from 'components/AcquireLogin';
import { AuthLayout } from 'components/AuthLayout';
import Login from 'pages/authentication/Login';
import Register from 'pages/authentication/Register';
import Customers from 'pages/customers/index';
import BranchTimings from 'pages/branch/branchTimings/index';
import BranchRewardProgram from 'pages/branch/branchRewardProgram/index';
import BranchUsers from 'pages/branch/branchUsers/index';
import CustomerDetail from 'pages/customers/customerDetails/index';
import Store from 'pages/store/index';
import Orders from 'pages/orders';
import Products from 'pages/products';
import Categories from 'pages/categories';
import Addons from 'pages/addons';
import Rewards from 'pages/rewards/index';
import RewardsHistory from 'pages/rewardsHistory/index';
import Apps from 'pages/apps/index';
import LocationDetail from 'pages/branch/branches/locationDetail';
import RewardCollection from 'pages/rewards/rewardcollection';
import RewardRedemption from 'pages/rewards/rewardredemption';
import TiersList from 'pages/customers/tiers';
import CustomersList from 'pages/customers/list';
import CustomerGroups from 'pages/customers/groups';
import Credit from 'pages/Credit/index';
import LevelIndex from 'pages/levels';
import Bundles from 'pages/bundles';
import Stocks from 'pages/stocks';
import Paymentprovider from 'pages/payment-settings/payment-provider';
import PaymentMethods from 'pages/payment-settings/payment-methods';
import AddPaymentMethod from 'pages/payment-settings/add-payment-method';
import UserList from 'pages/user-management/user-lists';
import CreateUser from 'pages/user-management/create-user';
import UpdateUser from '../pages/user-management/update-user';
import RewardStats from 'pages/rewardStats/RewardStats';
import Offers from 'pages/offers/offers';
import Advertisement from 'pages/advertisement/advertisement';
import Campaings from 'pages/campaings/index';
import VechileType from 'pages/driveThru/vechile-type';
import VechileBrand from 'pages/driveThru/vechile-brand'
import VechileColor from 'pages/driveThru/vechile-color';
import CustomerNotification from 'pages/customer-notification/customer-notifcation';
import CreateNotification from '../pages/customer-notification/create-notification';
import SystemNotification from '../pages/notification/systemNotification';
import AllNotification from 'pages/notification/all-notification';
import Subscription from 'pages/subscription/subscription-details';
import MembershipForm from 'pages/subscription/create-subscriptions';
import Membership from 'pages/subscription/memberships';
import pages from 'menu-items/pages';
import DeliverySettings from 'pages/delivery-settings/delivery-settings';
// render - dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard')));
const Companies = Loadable(lazy(() => import('pages/companies')));
const Brands = Loadable(lazy(() => import('pages/brands')));
const Branches = Loadable(lazy(() => import('pages/branch/branches')));

// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/SamplePage')));

// render - utilities
const Typography = Loadable(lazy(() => import('pages/components-overview/Typography')));
const Color = Loadable(lazy(() => import('pages/components-overview/Color')));
const Shadow = Loadable(lazy(() => import('pages/components-overview/Shadow')));
const AntIcons = Loadable(lazy(() => import('pages/components-overview/AntIcons')));

// ==============================|| MAIN ROUTING ||============================== //

export default function MainRoutes() {
    return (
        <Routes>
            <Route element={<AcquireLogin />}>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<DashboardDefault />} />
                    <Route path="/dashboard" element={<DashboardDefault />} />

                    <Route path="/apps" element={<Apps />} />

                    <Route path="/brands" element={<Brands />} />
                    <Route path="/campaigns" element={<Campaings />} />

                    <Route path="/locations" element={<Branches />} />
                    <Route path="/locations/:bhid" element={<LocationDetail />} />
                    <Route path="/locations/:bhid/branchTimings" element={<BranchTimings />} />
                    <Route path="/locations/:bhid/branchRewardProgram" element={<BranchRewardProgram />} />
                    <Route path="/locations/:bhid/branchUsers" element={<BranchUsers />} />

                    <Route path="/rewards" element={<Rewards />} />
                    <Route path="/rewardcollection" element={<RewardCollection />} />
                    <Route path="/rewardredemption" element={<RewardRedemption />} />
                    <Route path="/rewardHistory" element={<RewardsHistory />} />

                    <Route path="/user-management" element={<UserList />} />
                    <Route path="/update-user/:id" element={<UpdateUser />} />
                    <Route path="/create-user/:cid" element={<CreateUser />} />
                    <Route path="/create-user/:cid/:id" element={<CreateUser />} />

                    <Route path="/customers" element={<Customers />} />
                    <Route path="/customers/list" element={<CustomersList />} />
                    <Route path="/customers/tiers" element={<TiersList />} />
                    <Route path="/customers/groups" element={<CustomerGroups />} />
                    <Route path="/customers/:cid" element={<CustomerDetail />} />
                    <Route path="/rewards-stats" element={<RewardStats />} />

                    <Route path="/advertisement" element={<Advertisement />} />

                    <Route path="/drive/vechiles" element={<VechileType />} />
                    <Route path="/drive/brand" element={<VechileBrand />} />
                    <Route path="/drive/color" element={<VechileColor />} />

                    <Route path="/store" element={<Store />} />
                    <Route path="/offers" element={<Offers />} />

                    <Route path="/products" element={<Products />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/addons" element={<Addons />} />
                    <Route path="/stocks" element={<Stocks />} />

                    <Route path="/payments-settings/providers" element={<Paymentprovider />} />
                    <Route path="/payments-settings/providers/:id" element={<Paymentprovider />} />
                    <Route path="/payments-settings/methods" element={<PaymentMethods />} />
                    {/* <Route path="/payments-settings/addnew" element={<AddPaymentMethod />} /> */}

                    <Route path="/orders" element={<Orders />} />
                    <Route path="/credit" element={<Credit />} />
                    <Route path="/levels" element={<LevelIndex />} />
                    <Route path="/bundles" element={<Bundles />} />
                    <Route path="/customernotification" element={<CreateNotification />} />
                    <Route path="/all-notifications" element={<AllNotification />} />
                    <Route path="/notification" element={<SystemNotification />} />
                    <Route path="/membership-detail" element={<Subscription />} />
                    <Route path="/membership-detail/:id" element={<Subscription />} />
                    <Route path="/membership" element={<Membership />} />
                    <Route path="/deliverySettings" element={<DeliverySettings />} />
                </Route>
            </Route>

            <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Route>
        </Routes>
    );
}

// const MainRoutes1 = {
//     path: '/',
//     element: <MainLayout />,
//     children: [
//         {
//             path: '/',
//             element: <DashboardDefault />
//         },
//         {
//             path: '/companies',
//             element: <Companies />
//         },
//         {
//             path: 'color',
//             element: <Color />
//         },
//         {
//             path: 'dashboard',
//             children: [
//                 {
//                     path: 'default',
//                     element: <DashboardDefault />
//                 }
//             ]
//         },
//         {
//             path: 'sample-page',
//             element: <SamplePage />
//         },
//         {
//             path: 'shadow',
//             element: <Shadow />
//         },
//         {
//             path: 'typography',
//             element: <Typography />
//         },
//         {
//             path: 'icons/ant',
//             element: <AntIcons />
//         }
//     ]
// };
