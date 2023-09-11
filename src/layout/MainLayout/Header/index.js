import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Box, MenuItem, Typography } from '@mui/material';
import { CheckCircleOutline } from '@mui/icons-material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
// project imports
import LogoSection from '../LogoSection';
import SearchSection from './SearchSection';
import ProfileSection from './ProfileSection';
import NotificationSection from './NotificationSection';
import MenuPopover from '../../../components/MenuPopover';
// import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
// assets
import { IconMenu2, IconBell } from '@tabler/icons';
import Stack from '@mui/material/Stack';
import usericon from 'assets/images/icons/UserIcon.webp';
import { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { AUTHORISATION_TOKEN_STORAGE_KEY, AUTHORISATION_USER_HEAD_IMAGE_KEY, AUTHORISATION_USER_NAME_STORAGE_KEY } from 'utils/constants';
import { useCookies } from 'react-cookie';
import { useLogoutMutation } from 'store/slices/apiSlice';

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const Header = ({ handleLeftDrawerToggle }) => {
    const [cookies, removeCookie, get] = useCookies();
    const theme = useTheme();
    const [queryParameters] = useSearchParams();
    const [code, setCode] = useState(queryParameters.get('code'));
    const navigate = useNavigate();
    const [userinfo, setUserinfo] = useState([]);
    const [user, setUser] = useState({});
    const [logout, response] = useLogoutMutation();

    const [isLoaded, setIsLoaded] = useState(false);
    useEffect(async () => {
        async function init() {
            setUserinfo(cookies[AUTHORISATION_USER_NAME_STORAGE_KEY]);
        }
        init();
    }, [cookies]);

    const [open, setOpen] = useState(null);

    const handleOpen = (event) => {
        setOpen(event.currentTarget);
    };

    const handleClose = () => {
        setOpen(null);
    };

    const handleLogout = async () => {
        let url = '';

        if (process.env.NODE_ENV === 'development') {
            url = 'https://uatgrwth.app360.cn/grwth-as/logout?redirect=http://localhost:8081';
        } else {
            url = 'https://uatgrwth.app360.cn/grwth-as/logout?redirect=https://grwthx.grwth.hk';
        }
        logout({});
        removeCookie();

        setTimeout(() => (window.location.href = url), 1000);

    };

    useEffect(() => {
        if (response?.data) {
            navigate('/', { replace: true });
        }
        console.log('==', response);
    }, [response]);
    
    const vrMode = (event) => {
        event.preventDefault();
        if (process.env.NODE_ENV === 'development') {
            window.location.href =`http://localhost:8081/vr`;
        }else{
             window.location.href =`https://grwthx.grwth.hk/vr`;
        }
     };

    return (
        <>
            {
                <Box
                    sx={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        backgroundColor: '#7983FF',
                        alignItems: 'center',
                        textAlign: 'center',
                        [theme.breakpoints.down('md')]: {
                            width: 'auto'
                        }
                    }}
                >
                    <Box component="span">
                        <LogoSection />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-evenly', pr: 4, justifyContent: 'center', alignItems: 'center' }}>
                        <Box sx={{ mr: 6 }}>
                            <Typography
                                variant="h6"
                                component="h6"
                                sx={{
                                    pl: 2,
                                    fontWeight: '500',
                                    font: 'Lalezar',
                                    fontStyle: 'normal',
                                    color: '#FFFFFF',
                                    fontSize: '15px',
                                    fontFamily: 'Livvic',
                                    cursor: 'pointer'
                                }}
                            >
                                {userinfo != '' && userinfo}
                            </Typography>
                        </Box>
                        <Box sx={{ mr: 3 }}>
                            <PlayArrowIcon style={{ color: '#FFFFFF' }} onClick={vrMode} />
                        </Box>
                        <Stack direction="row" spacing={2}>
                            {/* <IconBell style={{ color: '#FFFFFF', width: '35px', height: '35px' }} /> */}
                            <img
                                src={cookies[AUTHORISATION_USER_HEAD_IMAGE_KEY] || usericon}
                                alt="UserIcon"
                                width={32}
                                height={32}
                                style={{ borderRadius: '50%' }}
                                onClick={handleOpen}
                            />
                        </Stack>
                        <MenuPopover
                            open={Boolean(open)}
                            anchorEl={open}
                            onClose={handleClose}
                            sx={{
                                p: 0,
                                mt: 1.5,
                                ml: 0.75,
                                '& .MuiMenuItem-root': {
                                    typography: 'body2',
                                    borderRadius: 0.75
                                }
                            }}
                        >
                            <MenuItem onClick={handleLogout} sx={{ m: 1 }}>
                                Logout
                            </MenuItem>
                        </MenuPopover>
                    </Box>
                </Box>
            }
        </>
    );
};

Header.propTypes = {
    handleLeftDrawerToggle: PropTypes.func
};

export default Header;
