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
import { ADMIN, BRANCH_USER, BRAND_MANAGER } from 'helper/UserRoles';
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
            forUserRoles: [ADMIN, BRANCH_USER, BRAND_MANAGER]
        },

        {
            id: 'apps',
            title: 'Apps',
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
            forUserRoles: [ADMIN]
        },
        {
            id: 'locations',
            title: 'Locations',
            type: 'item',
            url: '/locations',
            icon: StoreIcon,
            breadcrumbs: false,
            forUserRoles: [ADMIN, BRAND_MANAGER]
        },
        {
            id: 'user-management',
            title: 'User Management',
            type: 'item',
            url: '/user-management',
            icon: AccessibilityIcon,
            breadcrumbs: false,
            forUserRoles: [ADMIN, BRAND_MANAGER]
        },
        {
            id: 'rewards',
            title: 'Rewards',
            type: 'collapse',
            url: '/rewards',
            icon: GradeIcon,
            breadcrumbs: false,
            forUserRoles: [ADMIN],
            isOpen: false,
            children: [
                {
                    id: 'collect',
                    title: 'Collect',
                    type: 'item',
                    url: '/rewardcollection/',
                    breadcrumbs: false,
                    forUserRoles: [ADMIN, BRANCH_USER, BRAND_MANAGER]
                },
                {
                    id: 'redeem',
                    title: 'Redeem',
                    type: 'item',
                    url: '/rewardredemption/',
                    breadcrumbs: false,
                    forUserRoles: [ADMIN, BRANCH_USER, BRAND_MANAGER]
                }
            ]
        },
        {
            id: 'rewardHistory',
            title: 'Rewards History',
            type: 'item',
            url: '/rewardHistory',
            icon: TimelineIcon,
            breadcrumbs: false,
            forUserRoles: [ADMIN]
        },
        {
            id: 'rewardStats',
            title: 'Rewards Stats',
            type: 'item',
            url: '/rewards-stats',
            icon: icons.DashboardOutlined,
            breadcrumbs: false,
            forUserRoles: [ADMIN, BRANCH_USER, BRAND_MANAGER]
        },
        {
            id: 'levels',
            title: 'Levels',
            type: 'item',
            url: '/levels',
            icon: TimelineIcon,
            breadcrumbs: false,
            forUserRoles: [ADMIN]
        },
        {
            id: 'customers',
            title: 'Customers',
            type: 'collapse',
            url: '/customers',
            icon: PeopleIcon,
            breadcrumbs: false,
            forUserRoles: [ADMIN, BRANCH_USER],
            isOpen: false,
            children: [
                {
                    id: 'list',
                    title: 'List',
                    type: 'item',
                    url: '/customers/list',
                    breadcrumbs: false,
                    forUserRoles: [ADMIN, BRANCH_USER, BRAND_MANAGER]
                },
                {
                    id: 'tiers',
                    title: 'Tiers',
                    type: 'item',
                    url: '/customers/tiers',
                    breadcrumbs: false,
                    forUserRoles: [ADMIN, BRANCH_USER, BRAND_MANAGER]
                },
                {
                    id: 'groups',
                    title: 'Groups',
                    type: 'item',
                    url: '/customers/groups',
                    breadcrumbs: false,
                    forUserRoles: [ADMIN, BRANCH_USER, BRAND_MANAGER]
                }
            ]
        },
        {
            id: 'menu',
            title: 'Menu',
            type: 'collapse',
            url: '/products',
            icon: InventoryIcon,
            breadcrumbs: false,
            forUserRoles: [ADMIN, BRANCH_USER, BRAND_MANAGER],
            isOpen: false,
            children: [
                {
                    id: 'category',
                    title: 'Categories',
                    type: 'item',
                    url: '/categories/',
                    breadcrumbs: false,
                    forUserRoles: [ADMIN, BRANCH_USER, BRAND_MANAGER]
                },
                {
                    id: 'products',
                    title: 'Products',
                    type: 'item',
                    url: '/products/',
                    breadcrumbs: false,
                    forUserRoles: [ADMIN, BRANCH_USER, BRAND_MANAGER]
                },
                {
                    id: 'addon',
                    title: 'Addons',
                    type: 'item',
                    url: '/addons/',
                    breadcrumbs: false,
                    forUserRoles: [ADMIN, BRANCH_USER, BRAND_MANAGER]
                },
                {
                    id: 'stocks',
                    title: 'Stocks',
                    type: 'item',
                    url: '/stocks/',
                    breadcrumbs: false,
                    forUserRoles: [ADMIN, BRANCH_USER, BRAND_MANAGER]
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
            forUserRoles: [ADMIN, BRANCH_USER, BRAND_MANAGER]
        },
        {
            id: 'offer',
            title: 'Offers',
            type: 'item',
            url: '/offers',
            icon: CardGiftcardIcon,
            breadcrumbs: false,
            forUserRoles: [ADMIN, BRAND_MANAGER]
        },
        {
            id: 'payment',
            title: 'Payment Settings',
            type: 'collapse',
            url: '/payments-settings/methods',
            icon: InventoryIcon,
            breadcrumbs: false,
            forUserRoles: [ADMIN, BRAND_MANAGER],
            isOpen: false,
            children: [
                {
                    id: 'providers',
                    title: 'Payment Providers',
                    type: 'item',
                    url: '/payments-settings/providers',
                    breadcrumbs: false,
                    forUserRoles: [ADMIN, BRAND_MANAGER]
                },
                {
                    id: 'methods',
                    title: 'Payment Method',
                    type: 'item',
                    url: '/payments-settings/methods',
                    breadcrumbs: false,
                    forUserRoles: [ADMIN,BRAND_MANAGER]
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
            forUserRoles: [ADMIN, BRAND_MANAGER],
        },
        
        {
            id: 'CreditBalance',
            title: 'All Request',
            type: 'item',
            url: '/credit',
            icon: CreditCardIcon,
            breadcrumbs: false,
            forUserRoles: [ADMIN, BRANCH_USER, BRAND_MANAGER]
        }
    ]
};

export default dashboard;
