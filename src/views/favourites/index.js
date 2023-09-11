import React from 'react';
import { useState, useEffect } from 'react';
import { Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Box from '@mui/material/Box';
import { Container, Grid } from '@mui/material';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Radio from '@mui/material/Radio';
import SearchComponent from 'react-material-ui-searchbar';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import FormControlLabel from '@mui/material/FormControlLabel';
import { userRows } from '../../components/Datagrid/dummyData';
import ImageListItem from '@mui/material/ImageListItem';
import room1 from '../../assets/images/roomimg/room1.png';
import { IconUserCircle } from '@tabler/icons';
import PendingOutlinedIcon from '@mui/icons-material/PendingOutlined';
import Popover from '@mui/material/Popover';
import { Link } from 'react-router-dom';
import TextareaAutosize from '@mui/base/TextareaAutosize';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import RoomA1 from 'assets/images/roomimg/RoomA1.png';
import RoomA_Items1 from 'assets/images/roomimg/RoomA_Items1.webp';
import RoomA_Items2 from 'assets/images/roomimg/RoomA_Items2.webp';
import RoomA_Items3 from 'assets/images/roomimg/RoomA_Items3.webp';
import RoomA_Items4 from 'assets/images/roomimg/RoomA_Items4.webp';
import Paper from '@mui/material/Paper';
import UserIconGroup from 'assets/images/icons/UserIconGroup.png';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { IconHeart, IconArchive } from '@tabler/icons';
import '../library/index.css';
import { useCookies } from 'react-cookie';
import { useGetRoomsMutation, useToggleFavoriteMutation } from 'store/slices/apiSlice';
import { AUTHORISATION_USER_ID_STORAGE_KEY } from 'utils/constants';

//custom material ui paper
const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    width: 280,
    height: 300,
    marginTop: 0,
    boxShadow: '0 8px 8px 3px rgb(0 0 0 / 25%)',
    '&:hover': {
        border: 0,
        boxShadow: '5px 5px 8px 0px #afb5ff'
    },
    cursor: 'pointer'
    // boxShadow: "3.0331px 2px 3.0331px rgba(0, 0, 0, 0.25)",
}));

const Favourites = () => {
    const [cookies] = useCookies();
    const [value, setValue] = useState('1');
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const theme = useTheme(); //using theme
    const StyledTab = styled(Tab)({
        '&.Mui-selected': {
            color: theme.palette.background.primaryColor
        }
    });

    const [favouritedata, setFavouritedata] = useState([]);
    const [feachdata, setFetchData] = useState(false);
    const [projects, setProjects] = useState([]);

    const [getProjects, projectResponse] = useGetRoomsMutation();
    const [toggleProjectFavorite, favoriteResponse] = useToggleFavoriteMutation();

    useEffect(() => {
        getProjects({ userId: cookies[AUTHORISATION_USER_ID_STORAGE_KEY] });
    }, [favoriteResponse]);

    useEffect(() => {
        if (projectResponse?.data) {
            const projectRooms = _.filter(projectResponse?.data, (room) => {
                return room.assignmentId === null;
            });
            setProjects(projectRooms);
        }
    }, [projectResponse]);

    const favouriteiconClick = async (id, check) => {
        setFetchData((t) => !t);
    };

    const FavouriteRoom = () => {
        const currentDate = new Date();
        const toIsodate = currentDate.toISOString();
        const toIsodate1 = toIsodate.slice(0, -5);

        const gotoRoom = (path) => {
            window.open(path);
        };

        return (
            <React.Fragment>
                <Grid container spacing={5} sx={{ ml: 6 }}>
                    {projects.map((project, index) => {
                        const favoriteUser = _.filter(project?.sharingUsers, (user) => {
                            return user.userId === cookies.userId;
                        })[0];
                        if (favoriteUser.isFavorite)
                            return (
                                //spacing size problem
                                <Grid container spacing={0} xs={4} item key={index}>
                                    <Item>
                                        <ImageListItem sx={{ mt: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <img
                                                src={project?.headImg || RoomA1}
                                                alt="room1"
                                                loading="lazy"
                                                style={{ width: '197.23px', height: '212.25px' }}
                                                onClick={() => gotoRoom(`${project.storagePath}${project.roomId}&userId=${cookies[AUTHORISATION_USER_ID_STORAGE_KEY]}`)}
                                            />
                                        </ImageListItem>

                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '0px 13px' }}>
                                            <Typography component="h2" variant="h2" sx={{ fontFamily: 'Livvic' }}></Typography>
                                            <IconHeart
                                                style={favoriteUser.isFavorite == true ? { fill: '#CE2C2C' } : {}}
                                                onClick={() =>
                                                    toggleProjectFavorite({ roomId: project.id, favorite: !favoriteUser.isFavorite })
                                                }
                                            />
                                        </Box>

                                        <Typography component="h2" variant="h2" sx={{ mt: 5 }}>
                                            {project.title}
                                        </Typography>
                                    </Item>
                                </Grid>
                            );
                    })}
                </Grid>
            </React.Fragment>
        );
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={1} sx={{ mx: 'auto' }}>
                <Box sx={{ mt: '10px' }}>
                    <Typography component="h2" variant="h3" sx={{ fontFamily: 'Livvic' }}>
                        Favourites
                    </Typography>
                </Box>

                <Grid container item spacing={0} sx={{ mt: 4 }}>
                    <FavouriteRoom />
                </Grid>
            </Grid>
        </Box>
    );
};

export default Favourites;
