// assets
import { DashboardOutlined } from '@ant-design/icons';
import BusinessIcon from '@mui/icons-material/Business';
import StoreIcon from '@mui/icons-material/Store';
import PeopleIcon from '@mui/icons-material/People';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import StorefrontIcon from '@mui/icons-material/Storefront';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import GradeIcon from '@mui/icons-material/Grade';
import TimelineIcon from '@mui/icons-material/Timeline';
import InventoryIcon from '@mui/icons-material/Inventory';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import ShopTwoIcon from '@mui/icons-material/ShopTwo';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { ADMIN, BRANCH_USER, BRAND_MANAGER, COMPANY_ADMIN } from 'helper/UserRoles';
import EventIcon from '@mui/icons-material/Event';
import AddAlertIcon from '@mui/icons-material/AddAlert';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
// icons
const icons = {
    DashboardOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
    id: 'group-dashboard',
    title: 'Navigation',
    type: 'group',
    children: [
        {
            id: 'dashboard',
            title: 'Dashboard',
            type: 'item',
            url: '/dashboard/',
            icon: icons.DashboardOutlined,
            breadcrumbs: false,
            forUserRoles: [ADMIN, COMPANY_ADMIN, BRANCH_USER, BRAND_MANAGER]
        },

        {
            id: 'apps',
            title: 'Companies',
            type: 'item',
            url: '/apps',
            icon: BusinessIcon,
            breadcrumbs: false,
            forUserRoles: [ADMIN]
        },
        {
            id: 'brands',
            title: 'Brands',
            type: 'item',
            url: '/brands',
            icon: LocalOfferIcon,
            breadcrumbs: false,
            forUserRoles: [ADMIN, COMPANY_ADMIN]
        },

        {
            id: 'locations',
            title: 'Stores',
            type: 'item',
            url: '/locations',
            icon: StoreIcon,
            breadcrumbs: false,
            forUserRoles: [ADMIN, COMPANY_ADMIN, BRAND_MANAGER]
        },
        {
            id: 'user-management',
            title: 'User Management',
            type: 'item',
            url: '/user-management',
            icon: AccessibilityIcon,
            breadcrumbs: false,
            forUserRoles: [ADMIN, COMPANY_ADMIN, BRAND_MANAGER]
        },
        {
            id: 'campaings',
            title: 'Campaigns',
            type: 'item',
            url: '/campaigns',
            icon: EventIcon,
            breadcrumbs: false,
            forUserRoles: [ADMIN, COMPANY_ADMIN]
        },
        {
            id: 'rewards',
            title: 'Rewards',
            type: 'collapse',
            icon: GradeIcon,
            breadcrumbs: false,
            forUserRoles: [ADMIN, COMPANY_ADMIN, BRAND_MANAGER],
            isOpen: false,
            children: [
                {
                    id: 'rewards',
                    title: 'Rewards',
                    type: 'item',
                    url: '/rewards',
                    icon: TimelineIcon,
                    breadcrumbs: false,
                    forUserRoles: [ADMIN, COMPANY_ADMIN, BRAND_MANAGER]
                },
                {
                    id: 'rewardHistory',
                    title: 'Rewards History',
                    type: 'item',
                    url: '/rewardHistory',
                    icon: TimelineIcon,
                    breadcrumbs: false,
                    forUserRoles: [ADMIN, COMPANY_ADMIN, BRAND_MANAGER]
                },
                {
                    id: 'bundles',
                    title: 'Bundles',
                    type: 'item',
                    url: '/bundles',
                    icon: TimelineIcon,
                    breadcrumbs: false,
                    forUserRoles: [ADMIN]
                }
                // {
                //     id: 'collect',
                //     title: 'Collect',
                //     type: 'item',
                //     url: '/rewardcollection/',
                //     breadcrumbs: false,
                //     forUserRoles: [ADMIN,COMPANY_ADMIN, BRANCH_USER, BRAND_MANAGER]
                // },
                // {
                //     id: 'redeem',
                //     title: 'Redeem',
                //     type: 'item',
                //     url: '/rewardredemption/',
                //     breadcrumbs: false,
                //     forUserRoles: [ADMIN,COMPANY_ADMIN, BRANCH_USER, BRAND_MANAGER]
                // }
            ]
        },
        // {
        //     id: 'rewardStats',
        //     title: 'Rewards Stats',
        //     type: 'item',
        //     url: '/rewards-stats',
        //     icon: icons.DashboardOutlined,
        //     breadcrumbs: false,
        //     forUserRoles: [ADMIN,COMPANY_ADMIN, BRANCH_USER, BRAND_MANAGER]
        // },

        {
            id: 'customers',
            title: 'Customers',
            type: 'collapse',
            url: '/customers',
            icon: PeopleIcon,
            breadcrumbs: false,
            forUserRoles: [ADMIN, COMPANY_ADMIN, BRAND_MANAGER, BRANCH_USER],
            isOpen: false,
            children: [
                // {
                //     id: 'list',
                //     title: 'List',
                //     type: 'item',
                //     url: '/customers/list',
                //     breadcrumbs: false,
                //     forUserRoles: [ADMIN, BRANCH_USER, BRAND_MANAGER]
                // },
                {
                    id: 'tiers',
                    title: 'Tiers',
                    type: 'item',
                    url: '/customers/tiers',
                    breadcrumbs: false,
                    forUserRoles: [ADMIN, COMPANY_ADMIN, BRANCH_USER, BRAND_MANAGER]
                },
                {
                    id: 'groups',
                    title: 'Groups',
                    type: 'item',
                    url: '/customers/groups',
                    breadcrumbs: false,
                    forUserRoles: [ADMIN, COMPANY_ADMIN, BRANCH_USER, BRAND_MANAGER]
                }
            ]
        },
        {
            id: 'menu',
            title: 'Menu',
            type: 'collapse',
            // url: '/products',
            icon: InventoryIcon,
            breadcrumbs: false,
            forUserRoles: [ADMIN, COMPANY_ADMIN, BRANCH_USER, BRAND_MANAGER],
            isOpen: false,
            children: [
                {
                    id: 'category',
                    title: 'Categories',
                    type: 'item',
                    url: '/categories/',
                    breadcrumbs: false,
                    forUserRoles: [ADMIN, COMPANY_ADMIN, BRAND_MANAGER]
                },
                {
                    id: 'products',
                    title: 'Products',
                    type: 'item',
                    url: '/products/',
                    breadcrumbs: false,
                    forUserRoles: [ADMIN, COMPANY_ADMIN, BRAND_MANAGER]
                },
                {
                    id: 'addon',
                    title: 'Addons',
                    type: 'item',
                    url: '/addons/',
                    breadcrumbs: false,
                    forUserRoles: [ADMIN, COMPANY_ADMIN, BRAND_MANAGER,]
                },
                {
                    id: 'addonstock',
                    title: 'Addons Management',
                    type: 'item',
                    url: '/addonsstock',
                    breadcrumbs: false,
                    forUserRoles: [ADMIN, COMPANY_ADMIN, BRAND_MANAGER,, BRANCH_USER,]
                },
                {
                    id: 'stocks',
                    title: 'Product Management ',
                    type: 'item',
                    url: '/stocks/',
                    breadcrumbs: false,
                    forUserRoles: [ADMIN, COMPANY_ADMIN, BRANCH_USER, BRAND_MANAGER]
                }
            ]
        },
        {
            id: 'orders',
            title: 'Orders',
            type: 'item',
            url: '/orders',
            icon: RestaurantIcon,
            breadcrumbs: false,
            forUserRoles: [ADMIN, COMPANY_ADMIN, BRANCH_USER, BRAND_MANAGER]
        },
        {
            id: 'offer',
            title: 'Offers',
            type: 'collapse',
            icon: CardGiftcardIcon,
            breadcrumbs: false,
            forUserRoles: [ADMIN, COMPANY_ADMIN, BRAND_MANAGER],
            children: [
                {
                    id: 'offers',
                    title: 'Offers',
                    type: 'item',
                    url: '/offers',
                    breadcrumbs: false,
                    forUserRoles: [ADMIN, COMPANY_ADMIN, BRAND_MANAGER]
                },
                {
                    id: 'levels',
                    title: 'Levels',
                    type: 'item',
                    url: '/levels',

                    breadcrumbs: false,
                    forUserRoles: [ADMIN, COMPANY_ADMIN]
                }
            ]
        },
        {
            id: 'drive',
            title: 'Drive-Thru',
            type: 'collapse',
            icon: InventoryIcon,
            breadcrumbs: false,
            forUserRoles: [ADMIN, COMPANY_ADMIN, BRAND_MANAGER, BRANCH_USER],
            isOpen: false,
            children: [
                {
                    id: 'vechiles',
                    title: 'Vehicle Type',
                    type: 'item',
                    url: '/drive/vechiles',
                    breadcrumbs: false,
                    forUserRoles: [ADMIN, COMPANY_ADMIN, BRAND_MANAGER, BRANCH_USER]
                },
                {
                    id: 'brand',
                    title: 'Vehicle Brand',
                    type: 'item',
                    url: '/drive/brand',
                    breadcrumbs: false,
                    forUserRoles: [ADMIN, COMPANY_ADMIN, BRAND_MANAGER, BRANCH_USER]
                },
                {
                    id: 'color',
                    title: 'Vehicle Color',
                    type: 'item',
                    url: '/drive/color',
                    breadcrumbs: false,
                    forUserRoles: [ADMIN, COMPANY_ADMIN, BRAND_MANAGER, BRANCH_USER]
                }
            ]
        },
        {
            id: 'payment',
            title: 'Payment Settings',
            type: 'collapse',
            url: '/payments-settings/methods',
            icon: InventoryIcon,
            breadcrumbs: false,
            forUserRoles: [ADMIN, COMPANY_ADMIN, BRAND_MANAGER],
            isOpen: false,
            children: [
                // {
                //     id: 'providers',
                //     title: 'Payment Providers',
                //     type: 'item',
                //     url: '/payments-settings/providers',
                //     breadcrumbs: false,
                //     forUserRoles: [ADMIN, COMPANY_ADMIN, BRAND_MANAGER]
                // },
                {
                    id: 'methods',
                    title: 'Payment Method',
                    type: 'item',
                    url: '/payments-settings/methods',
                    breadcrumbs: false,
                    forUserRoles: [ADMIN, COMPANY_ADMIN, BRAND_MANAGER]
                }
            ]
        },
        {
            id: 'advertisement',
            title: 'Advertisement',
            type: 'item',
            url: '/advertisement',
            icon: ShopTwoIcon,
            breadcrumbs: false,
            forUserRoles: [ADMIN]
        },
        {
            id: 'delivery-settings',
            title: 'Delivery Settings',
            type: 'item',
            url: '/deliverySettings',
            icon: DeliveryDiningIcon,
            breadcrumbs: false,
            forUserRoles: [ADMIN, COMPANY_ADMIN]
        },
        {
            id: 'notifcations',
            title: 'System Notifications',
            type: 'item',
            url: '/notification',
            type: 'item',
            icon: AddAlertIcon,
            breadcrumbs: false,
            forUserRoles: [ADMIN]
        },
        {
            id: 'CreditBalance',
            title: 'All Request',
            type: 'item',
            url: '/credit',
            icon: CreditCardIcon,
            breadcrumbs: false,
            forUserRoles: [ADMIN, COMPANY_ADMIN,]
        },
        {
            id: 'CustomerNotification',
            title: 'Notifications',
            type: 'collapse',
            // url: '/customernotification',
            icon: NotificationsIcon,
            breadcrumbs: false,
            isOpen: false,
            forUserRoles: [ADMIN, COMPANY_ADMIN, BRAND_MANAGER],
            children: [
                {
                    id: 'customerNotification',
                    title: 'Notification Management',
                    type: 'item',
                    url: '/customernotification',
                    breadcrumbs: false,
                    forUserRoles: [ADMIN, COMPANY_ADMIN, BRAND_MANAGER]
                },
                {
                    id: 'notificationBalanceHistory',
                    title: 'Notification Balance',
                    type: 'item',
                    url: '/notificationBalance',
                    breadcrumbs: false,
                    forUserRoles: [ADMIN, COMPANY_ADMIN, BRAND_MANAGER]
                },
            ]
        },
        {
            id: 'subscription',
            title: 'Subscriptions',
            type: 'collapse',
            icon: SubscriptionsIcon,
            breadcrumbs: false,
            forUserRoles: [ADMIN, COMPANY_ADMIN, BRAND_MANAGER],
            isOpen: false,
            children: [
                {
                    id: 'membership',
                    title: 'Membership',
                    type: 'item',
                    url: '/membership',
                    breadcrumbs: false,
                    forUserRoles: [ADMIN]
                },
                {
                    id: 'membership-details',
                    title: 'Membership Details',
                    type: 'item',
                    url: '/membership-detail',
                    breadcrumbs: false,
                    forUserRoles: [COMPANY_ADMIN, BRAND_MANAGER]
                }
            ]
        }
    ]
};

export default dashboard;
