// material-ui
import { Link, Typography, Stack } from '@mui/material';

// ==============================|| FOOTER - AUTHENTICATION 2 & 3 ||============================== //

const AuthFooter = () => (
    <Stack direction="row" justifyContent="space-between">
        <Typography variant="subtitle2" component={Link} href="https://grwthx-portal.leoluca.io" target="_blank" underline="hover">
        GrwthX Admin Portal
        </Typography>
        <Typography variant="subtitle2" component={Link} href="https://grwthx-portal.leoluca.io" target="_blank" underline="hover">
        GrwthX Admin Portal
        </Typography>
    </Stack>
);

export default AuthFooter;
