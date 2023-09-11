import { Link } from 'react-router-dom';

// material-ui
import { ButtonBase } from '@mui/material';

// project imports
import config from 'config';
import Logo from 'ui-component/Logo';
import { Box, Typography } from '@mui/material';

// ==============================|| MAIN LOGO ||============================== //

const LogoSection = () => (
    <ButtonBase disableRipple component={Link} to={config.defaultPath}>
        <Box>
            <Typography
                variant="h2"
                component="h3"
                sx={{
                    pl: 2,
                    fontWeight: '500',
                    font: 'Lalezar',
                    fontStyle: 'normal',
                    color: '#FFFFFF',
                    fontSize: '35px',
                    fontFamily: 'Livvic-Bold'
                }}
            >
                Grwth.x
            </Typography>
        </Box>
    </ButtonBase>
);

export default LogoSection;
