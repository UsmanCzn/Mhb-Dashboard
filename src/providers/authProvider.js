// import { useSendLoginSlackMessage } from "app/modules/Auth/methods/sendLoginSlackMessage";
import { ADMIN, BRANCH_USER, BRAND_MANAGER } from 'helper/UserRoles';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import userServices from 'services/userServices';

const AuthContext = createContext();

const AUTH_TOKEN_KEY = 'userAuthtoken';
const USER_ID = 'userId';

export function useAuth() {
    const { AuthToken, setToken, unsetToken, userId, setUserRole, userRole, user, setUser } = useContext(AuthContext);

    const fetchRoleId = async () => {
        try {
            const data = await userServices.getUserManagement(userId);
            setUser(data?.data?.result);

            switch (data?.data?.result?.roleId) {
                case 2:
                    setUserRole(ADMIN);
                    break;
                case 5:
                    setUserRole(BRAND_MANAGER);
                    break;
                case 7:
                    setUserRole(BRANCH_USER);
                    break;

                default:
                    setUserRole(ADMIN);
                    break;
            }
        } catch (error) {
            unsetToken();
            console.log(error, '%getUserManagement');
        }
    };

    useEffect(() => {
        if(userId)
        fetchRoleId();
    }, [userId]);
    return {
        isAuthenticated: Boolean(AuthToken),
        token: AuthToken,
        setToken,
        unsetToken,
        userId: userId,
        userRole: userRole,
        user: user
    };
}

export default function AuthProvider({ children }) {
    const [cookies, setCookie] = useCookies();

    const AuthToken = cookies[AUTH_TOKEN_KEY];
    const userId = cookies[USER_ID];

    const [user, setUser] = useState(null);
    const [userRole, setUserRole] = useState('');
    //   const sendLoginMessage = useSendLoginSlackMessage();

    const setToken = useCallback(
        async (token, id) => {
            // console.log(token);
            try {
                setCookie(AUTH_TOKEN_KEY, token, {
                    path: '/'
                });
                setCookie(USER_ID, id, {
                    path: '/'
                });

                // sendLoginMessage(token);
            } catch (error) {}
        },
        [setCookie]
    );

    const unsetToken = useCallback(async () => {
        try {
            setCookie(AUTH_TOKEN_KEY, '', {
                maxAge: -1,
                path: '/'
            });
            setCookie(USER_ID, '', {
                maxAge: -1,
                path: '/'
            });
        } catch (error) {}
    }, [setCookie]);

    const value = {
        AuthToken,
        setToken,
        unsetToken,
        userId,
        userRole,
        setUserRole,
        user,
        setUser
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
