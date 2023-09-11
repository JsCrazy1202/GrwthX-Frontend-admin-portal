import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation, useSearchParams, useNavigate } from 'react-router-dom';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { AppBar, Box, CssBaseline, Toolbar, useMediaQuery } from '@mui/material';

// project imports
import Breadcrumbs from 'ui-component/extended/Breadcrumbs';
import Header from './Header';
import Sidebar from './Sidebar';
import Customization from '../Customization';
import navigation from 'menu-items';
import { drawerWidth } from 'store/constant';
import { SET_MENU } from 'store/actions';

// assets
import { IconChevronRight } from '@tabler/icons';
import { useCookies } from 'react-cookie';
import { useGetAccessTokenQuery, useGetUserDataMutation } from 'store/slices/apiSlice';
import { AUTHORISATION_USER_ID_STORAGE_KEY, AUTHORISATION_TOKEN_STORAGE_KEY, AUTHORISATION_USER_HEAD_IMAGE_KEY, AUTHORISATION_USER_NAME_STORAGE_KEY } from 'utils/constants';
import { set } from 'lodash';

// styles
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
    ...theme.typography.mainContent,
    ...(!open && {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        }),
        [theme.breakpoints.up('md')]: {
            marginLeft: -(drawerWidth - 20),
            width: `calc(100% - ${drawerWidth}px)`
        },
        [theme.breakpoints.down('md')]: {
            marginLeft: '20px',
            width: `calc(100% - ${drawerWidth}px)`,
            padding: '16px'
        },
        [theme.breakpoints.down('sm')]: {
            marginLeft: '10px',
            width: `calc(100% - ${drawerWidth}px)`,
            padding: '16px',
            marginRight: '10px'
        }
    }),
    ...(open && {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen
        }),
        marginLeft: 0,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        width: `calc(100% - ${drawerWidth}px)`,
        [theme.breakpoints.down('md')]: {
            marginLeft: '20px'
        },
        [theme.breakpoints.down('sm')]: {
            marginLeft: '10px'
        }
    })
}));

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = () => {
    console.log('main layout');
    const routesWithoutAppBar = ['roomId', 'createRoom'];
    let location = useLocation();
    const isRouteWithoutAppBar = routesWithoutAppBar.includes(location.pathname.split('/')[1]);

    const [isAuth, setAuth] = useState(false);
    const navigate = useNavigate();
    // if (window.location.pathname == '/sso-demo-client/callback') {
    //     setTimeout(() => {
    //         navigate('/dashboard/default');
    //         window.location.href = window.location.href;
    //     }, 1500);
    // }
    const [cookies] = useCookies();
    const [queryParameters] = useSearchParams();
    const [code] = useState(queryParameters.get('code')); //get code value from thirty party api
    const { data: tokenData} = useGetAccessTokenQuery({ code });

    const theme = useTheme();
    const matchDownMd = useMediaQuery(theme.breakpoints.down('lg'));

    // Handle left drawer
    const leftDrawerOpened = useSelector((state) => state.customization.opened);
    const dispatch = useDispatch();
    const handleLeftDrawerToggle = () => {
        dispatch({ type: SET_MENU, opened: !leftDrawerOpened });
    };

    useEffect(() => {
        dispatch({ type: SET_MENU, opened: !matchDownMd });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [matchDownMd]);

    useEffect(() => {
        if (!!!cookies[AUTHORISATION_TOKEN_STORAGE_KEY]) {
            setAuth(false);
            console.log(isRouteWithoutAppBar, 'isRouteWithoutAppBar');
            if (isRouteWithoutAppBar) {
                console.log('window.location.href', window.location.href)
                localStorage.setItem('redirectUrl', window.location.href);    
            }
            navigate('/');
            
        }else{
            if (!!localStorage.getItem('redirectUrl')) {
                window.location.href = localStorage.getItem('redirectUrl');
            }else{
                console.log('no redirect url')
            }
            setAuth(true);
        }
    }, [tokenData]);

    return (
        <Box sx={{ display: 'flex' }}>
           <CssBaseline />
            {/* header */}
            {!isRouteWithoutAppBar && (
                <AppBar
                    enableColorOnDark
                    position="fixed"
                    color="inherit"
                    elevation={0}
                    sx={{
                        bgcolor: theme.palette.background.default,
                        transition: leftDrawerOpened ? theme.transitions.create('width') : 'none'
                    }}
                >
                    <Box>
                        <Header handleLeftDrawerToggle={handleLeftDrawerToggle} />
                    </Box>
                </AppBar>
            )}

            {/* drawer */}
            
            { !isRouteWithoutAppBar && <Sidebar drawerOpen={leftDrawerOpened} drawerToggle={handleLeftDrawerToggle} />}

            {/* main content */}
            {!isRouteWithoutAppBar ? (
                <Main theme={theme} open={leftDrawerOpened}>
                    {/* breadcrumb */}
                    {/* <Breadcrumbs separator={IconChevronRight} navigation={navigation} icon title rightAlign /> */}
                     <Outlet />
                </Main> 
             ) : (
                <Outlet />
            )}
            {/* <Customization /> */}

        </Box>
    );
};

export default MainLayout;
