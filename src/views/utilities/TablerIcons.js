import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import room1 from '../../assets/images/roomimg/room1.png';
import ImageListItem from '@mui/material/ImageListItem';
import { Typography } from '@mui/material';
import { Card } from '@mui/material';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import Autocomplete from '@mui/material/Autocomplete';
import Dialog from '@mui/material/Dialog';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';

// assets
import LinkIcon from '@mui/icons-material/Link';

// styles
const IFrameWrapper = styled('iframe')(({ theme }) => ({
    height: 'calc(100vh - 210px)',
    border: '1px solid',
    borderColor: theme.palette.primary.light
}));

// =============================||  Room Obj||============================= //

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    width: 170,
    height: 170
}));

const Griddatas = [
    {
        id: 1,
        avatar: room1,
        title: 'Chair',
        users: ['alan', 'keith', 'joby', 'Noah']
    },
    {
        id: 2,
        Class: 'A2',
        Subject: 'Chinese',
        avatar: room1,
        title: 'Door',
        users: ['alan', 'keith', 'joby', 'Noah']
    },
    {
        id: 3,
        Class: 'A3',
        Subject: 'Music',
        avatar: room1,
        title: 'Car',
        users: ['alan', 'keith', 'joby', 'Noah']
    },
    {
        id: 4,
        Class: 'B1',
        Subject: 'Fine Art',
        avatar: room1,
        title: 'Table',
        users: ['alan', 'keith', 'joby', 'Noah']
    },
    {
        id: 5,
        Class: 'B2',
        Subject: 'Fine Art',
        avatar: room1,
        title: 'Heart',
        users: ['alan', 'keith', 'joby', 'Noah']
    },
    {
        id: 6,
        Class: 'B3',
        Subject: 'Nature',
        avatar: room1,
        title: 'Chair',
        users: ['alan', 'keith', 'joby', 'Noah']
    },
    {
        id: 7,
        Class: 'C1',
        Subject: 'Nature',
        avatar: room1,
        title: 'Chair',
        users: ['alan', 'keith', 'joby', 'Noah']
    },
    {
        id: 8,
        Class: 'C2',
        Subject: 'Music',
        avatar: room1,
        title: 'Chair',
        users: ['alan', 'keith', 'joby', 'Noah']
    },
    {
        id: 9,
        Class: 'C3',
        Subject: 'English',
        avatar: room1,
        title: 'Chair',
        users: ['alan', 'keith', 'joby', 'Noah']
    },
    {
        id: 10,
        Class: 'C4',
        Subject: 'Chinese',
        avatar: room1,
        title: 'Chair',
        users: ['alan', 'keith', 'joby', 'Noah']
    },
    {
        id: 11,
        Class: 'C4',
        Subject: 'Chinese',
        avatar: room1,
        title: 'Chair',
        users: ['alan', 'keith', 'joby', 'Noah']
    },
    {
        id: 12,
        Class: 'C4',
        Subject: 'Chinese',
        avatar: room1,
        title: 'Chair',
        users: ['alan', 'keith', 'joby', 'Noah']
    }
];

const openLinkInNewTab = (url) => {
    const newTab = window.open(url, '_blank');
    if (newTab) newTab.opener = null;
};

function FormRow() {
    const Userlist = [{ title: 'Everyone' }, { title: 'Joby' }, { title: 'Alan' }, { title: 'Kaya' }, { title: 'Noah' }];
    const [openstudentlist, Setopenstudentlist] = useState(false);
    const handleclickstudentlistopen = () => {
        Setopenstudentlist(true);
    };
    const handleclickstudentlistclose = () => {
        Setopenstudentlist(false);
    };

    const currentDate = new Date();
    const toIsodate = currentDate.toISOString();
    const toIsodate1 = toIsodate.slice(0, -5);

    return (
        <React.Fragment>
            <Grid item xs={3}>
                <Dialog
                    open={openstudentlist}
                    onClose={handleclickstudentlistclose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    className="studentlistdialog"
                >
                    <div style={{ marginTop: '30px', alignSelf: 'center' }}>
                        <Typography component="h2" variant="h3">
                            Assign to
                        </Typography>

                        <Stack spacing={2} sx={{ width: 300, mt: '10px' }}>
                            <Autocomplete
                                multiple
                                id="free-solo-demo"
                                options={Userlist.map((option) => option.title)}
                                renderInput={(params) => <TextField {...params} label="Userlist" />}
                            />
                        </Stack>

                        <Box sx={{ mt: '30px' }}>
                            <TextField
                                id="datetime-local"
                                label="Current Time"
                                type="datetime-local"
                                defaultValue={toIsodate1}
                                sx={{ width: 300 }}
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />
                        </Box>

                        <Box sx={{ display: 'flex', mt: '30px' }}>
                            <TextField
                                id="datetime-local"
                                label="Available from"
                                type="datetime-local"
                                defaultValue=""
                                sx={{ width: 150 }}
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />
                            <TextField
                                id="datetime-local"
                                label="Until"
                                type="datetime-local"
                                defaultValue=""
                                sx={{ width: 150 }}
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />
                        </Box>
                        <Button variant="contained" style={{ position: 'absolute', bottom: '30px', right: '30px' }}>
                            {' '}
                            + Add{' '}
                        </Button>
                    </div>
                </Dialog>

                <Item>
                    <ImageListItem sx={{ width: 170, height: 130 }}>
                        <img
                            src={room1}
                            alt="room1"
                            loading="lazy"
                            // onClick={ () => openLinkInNewTab('https://play.grwth.hk/?assignments=room1')}
                        />
                    </ImageListItem>
                    <Box sx={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
                        <Box>
                            <Typography component="h2" variant="h2">
                                Char
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <GroupOutlinedIcon fontSize="large" />
                            <Typography component="h2" variant="h5">
                                +7
                            </Typography>
                        </Box>
                    </Box>
                </Item>
            </Grid>
            <Grid item xs={3}>
                <Item>
                    <ImageListItem sx={{ width: 170, height: 130 }}>
                        <img
                            src={room1}
                            alt="room1"
                            loading="lazy"
                            // onClick={ () => openLinkInNewTab('https://play.grwth.hk/?assignments=room2')}
                        />
                    </ImageListItem>
                    <Box sx={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
                        <Box>
                            <Typography component="h2" variant="h2">
                                Door
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }} onClick={handleclickstudentlistopen}>
                            <GroupOutlinedIcon fontSize="large" />
                            <Typography component="h2" variant="h5">
                                +3
                            </Typography>
                        </Box>
                    </Box>
                </Item>
            </Grid>
            <Grid item xs={3}>
                <Item>
                    <ImageListItem sx={{ width: 170, height: 130 }}>
                        <img
                            src={room1}
                            alt="room1"
                            loading="lazy"
                            // onClick={ () => openLinkInNewTab('https://play.grwth.hk/?assignments=room2')}
                        />
                    </ImageListItem>
                    <Box sx={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
                        <Box>
                            <Typography component="h2" variant="h2">
                                Table
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <GroupOutlinedIcon fontSize="large" />
                            <Typography component="h2" variant="h5">
                                +2
                            </Typography>
                        </Box>
                    </Box>
                </Item>
            </Grid>
            <Grid item xs={3}>
                <Item>
                    <ImageListItem sx={{ width: 170, height: 130 }}>
                        <img
                            src={room1}
                            alt="room1"
                            loading="lazy"
                            // onClick={ () => openLinkInNewTab('https://play.grwth.hk/?assignments=room1')}
                        />
                    </ImageListItem>
                    <Box sx={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
                        <Box>
                            <Typography component="h2" variant="h2">
                                Car
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <GroupOutlinedIcon fontSize="large" />
                            <Typography component="h2" variant="h5">
                                +7
                            </Typography>
                        </Box>
                    </Box>
                </Item>
            </Grid>
        </React.Fragment>
    );
}

const Roomobj = () => (
    <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={10} sx={{ mx: 'auto' }}>
            <Grid container item spacing={1}>
                <FormRow />
            </Grid>
            <Grid container item spacing={1}>
                <FormRow />
            </Grid>
            <Grid container item spacing={1}>
                <FormRow />
            </Grid>
        </Grid>
    </Box>
);

export default Roomobj;
