import { useSelector } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider } from '@mui/material';
import { CookiesProvider } from 'react-cookie';
// routing
import Routes from './routes';
// defaultTheme
import themes from './themes';

// project imports
import NavigationScroll from './layout/NavigationScroll';

// import "slick-carousel/slick/slick"

// ==============================|| APP ||============================== //

const App = () => {
    const customization = useSelector((state) => state.customization);
    return (
        <CookiesProvider>
            <StyledEngineProvider injectFirst>
                <ThemeProvider theme={themes(customization)}>
                    <CssBaseline />
                    <NavigationScroll>
                        <Routes />
                    </NavigationScroll>
                </ThemeProvider>
            </StyledEngineProvider>
        </CookiesProvider>
    );
};

export default App;
