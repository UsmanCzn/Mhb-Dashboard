import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const useInactivityLogout = (timeout = 30 * 60 * 1000, warningTime = 10 * 1000) => {
  const navigate = useNavigate();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const logoutTimer = useRef(null);
  const warningTimer = useRef(null);
  const snackbarKey = useRef(null);

  const logout = () => {
    document.cookie = "userAuthtoken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    closeSnackbar(snackbarKey.current);
    navigate('/login');
  };

  const showWarning = () => {
    snackbarKey.current = enqueueSnackbar('You will be logged out soon due to inactivity.', {
      variant: 'warning',
      persist: true,
    });
    logoutTimer.current = setTimeout(logout, warningTime); // Wait after showing warning
  };

  const resetTimer = () => {
    if (logoutTimer.current) clearTimeout(logoutTimer.current);
    if (warningTimer.current) clearTimeout(warningTimer.current);
    closeSnackbar(snackbarKey.current);

    warningTimer.current = setTimeout(showWarning, timeout - warningTime);
  };

  useEffect(() => {
    const events = ['mousemove', 'keydown', 'click', 'scroll'];
    events.forEach(event => window.addEventListener(event, resetTimer));

    resetTimer();

    return () => {
      events.forEach(event => window.removeEventListener(event, resetTimer));
      clearTimeout(warningTimer.current);
      clearTimeout(logoutTimer.current);
      closeSnackbar(snackbarKey.current);
    };
  }, []);
};

export default useInactivityLogout;
