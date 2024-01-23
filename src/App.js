// project import
import Routes from 'routes';
import ThemeCustomization from 'themes';
import ScrollTop from 'components/ScrollTop';
import AuthProvider from 'providers/authProvider';
import { SnackbarProvider } from 'notistack';
import { BranchesProvider } from 'providers/branchesProvider';
// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //

const App = () => (
    <SnackbarProvider maxSnack={3}>
        <AuthProvider>
            <BranchesProvider> 
            <ThemeCustomization>
                <ScrollTop>
                    <Routes />
                </ScrollTop>
            </ThemeCustomization>
            </BranchesProvider>
        </AuthProvider>
    </SnackbarProvider>
);

export default App;
