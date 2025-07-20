// project import
import Routes from 'routes';
import ThemeCustomization from 'themes';
import ScrollTop from 'components/ScrollTop';
import AuthProvider from 'providers/authProvider';
import { SnackbarProvider } from 'notistack';
import { BranchesProvider } from 'providers/branchesProvider';
import InActivityWrapper from 'layout/InActivityWrapper/index';
// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //

const App = () => {
    
    return (
    <SnackbarProvider maxSnack={3}>
        <AuthProvider>
            <BranchesProvider> 
            <ThemeCustomization>
                <ScrollTop>
                    <InActivityWrapper/>
                    <Routes />
                </ScrollTop>
            </ThemeCustomization>
            </BranchesProvider>
        </AuthProvider>
    </SnackbarProvider>
);
}

export default App;
