import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

// material-ui
import { Box, List, Typography } from '@mui/material';

// project import
import NavItem from './NavItem';
import { useAuth } from 'providers/authProvider';

// ==============================|| NAVIGATION - LIST GROUP ||============================== //

const NavGroup = ({ item }) => {
    const menu = useSelector((state) => state.menu);
    const { drawerOpen } = menu;
    const { userRole } = useAuth();

    const navCollapse = item.children?.map((menuItem,index ) => {
        // console.log(menuItem?.forUserRoles,"userRolli");
        // console.log(userRole,"userRollyyyyy");

        if (!menuItem?.forUserRoles?.find((obj) => obj === userRole)) {
            return;
        }

        switch (menuItem.type) {
            case 'collapse':
                return <CollapseMenu  key={index}item={menuItem} />;
            case 'item':
                return <NavItem key={menuItem.id} item={menuItem} level={1} />;
            default:
                return (
                    <Typography key={menuItem.id} variant="h6" color="error" align="center">
                        Fix - Group Collapse or Items
                    </Typography>
                );
        }
    });

    return (
        <>
            <List
                subheader={
                    item.title &&
                    drawerOpen && (
                        <Box sx={{ pl: 3, mb: 1.5 }}>
                            <Typography variant="subtitle2" color="textSecondary">
                                {item.title}
                            </Typography>
                            {/* only available in paid version */}
                        </Box>
                    )
                }
                sx={{ mb: drawerOpen ? 1.5 : 0, py: 0, zIndex: 0 }}
            >
                {navCollapse}
            </List>
        </>
    );
};

NavGroup.propTypes = {
    item: PropTypes.object
};

const CollapseMenu = ({ item }) => {
    const { userRole } = useAuth();
    const menu = useSelector((state) => state.menu);
    const { drawerOpen } = menu;
    const navCollapse = item.children?.map((menuItem) => {
        // console.log(menuItem?.forUserRoles?.find(obj=>obj===userRole),"userRolli");
        // console.log(userRole,"userRollyyyyy");

        if (!menuItem?.forUserRoles?.find((obj) => obj === userRole)) {
            return;
        }

        switch (menuItem.type) {
            case 'item':
                return <NavItem key={menuItem.id} item={menuItem} level={2} />;
            default:
                return (
                    <Typography key={menuItem.id} variant="h6" color="error" align="center">
                        Fix - Group Collapse or Items
                    </Typography>
                );
        }
    });
    return (
        <List
            subheader={item.title && drawerOpen && <NavItem key={item.id} item={item} level={1} />}
            sx={{ mb: drawerOpen ? 1.5 : 0, py: 0, zIndex: 0 }}
        >
            {item?.isOpen &&
                navCollapse
            }

        </List>
    );
};

export default NavGroup;
