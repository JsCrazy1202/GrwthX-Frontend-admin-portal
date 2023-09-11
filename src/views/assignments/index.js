import { useEffect } from 'react';

// material-ui
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import SearchComponent from 'react-material-ui-searchbar';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

// components imports
import { useState } from 'react';

// import Select from '../../components/select/select';
import DataGrid from '../../components/Datagrid/datagrid';
import Select from '@mui/material/Select';
import AddAssignmentModal from 'components/AddAssignmentModal';
import * as dataSource from './drag-data.json';
import { useGetClassListQuery, useGetSubjectsQuery, useGetUserInfoQuery, useGetAssignmentsByMutationMutation } from 'store/slices/apiSlice';
import { AUTHORISATION_USER_ID_STORAGE_KEY } from 'utils/constants';
import { useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';
import _ from 'lodash';

// ==============================|| Assignments PAGE ||============================== //

export default function Assignmentlistpage() {
    // Assignment Component
    const assignmentsData = useSelector((state) => state.customization.assignments);
    const [cookies] = useCookies();

    const [open, setOpen] = useState(false);
    const [subject, setSubject] = useState('None');
    const [classType, setClassType] = useState('None');
    const [searchValue, setSearchVaule] = useState('');
    const [openstudentlist, Setopenstudentlist] = useState(false);
    const [assignments, setAssignments] = useState([]);

    const { data: classes, isLoading: isLoadingClasses, error: classesError } = useGetClassListQuery();
    const { data: userInfo, isLoading: isLoadingUsreInfo, error: userInfoError } = useGetUserInfoQuery();
    const { data: subjects, isLoading: isLoadingSubjects, error: subjectsError, refetch } = useGetSubjectsQuery();
    const [getAssignment, response] = useGetAssignmentsByMutationMutation();

    const Classlist = [{ title: '1A' }, { title: '1B' }, { title: '1C' }, { title: '2A' }, { title: '2B' }, { title: '2C' }]; // mock data
    const dargData = dataSource;
    const fields = { dataSource: dargData.dragData2, id: 'id', text: 'name', child: 'child', selected: 'isSelected' };

    useEffect(() => {
        refetch();
        getAssignment({ userId: cookies[AUTHORISATION_USER_ID_STORAGE_KEY] });
    }, [assignmentsData]);

    useEffect(() => {
        if (response?.data) {
            const data = _.filter(response?.data, (assignment) => {
                return searchValue !== '' ? _.includes(assignment.title, searchValue) : assignment;
            });
            console.log(searchValue);
            setAssignments(data);
        }
    }, [response, searchValue]);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const handleclickstudentlistclose = () => {
        Setopenstudentlist(false);
    };

    const callbackedit = (id) => {};

    const handleChangeSubject = (e) => {
        setSubject(e.target.value);
    };

    const handleChangeClass = (e) => {
        console.log(e);
        setClassType(e.target.value);
    };

    const searchChange = (event) => {
        setSearchVaule(event);
    };

    const handleCloseDialog = () => {
        setOpen(false);
    };

    console.log(subjects);

    return (
        <div className="Assignmentlist">
            <AddAssignmentModal open={open} handleCloseDialog={handleCloseDialog} handleClose={handleClose} fields={fields} />

            <div className="header">
                <div
                    className="widgetSmallTitle"
                    style={{ fontFamily: 'Livvic', fontSize: '30px', fontWeight: '700', lineHeight: '37.65px' }}
                >
                    Assignment List
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                        <div>
                            <SearchComponent onChangeHandle={searchChange} style={{ fontFamily: 'Livicc' }} />
                        </div>
                        <div style={{ marginLeft: '40px', width: '130px' }}>
                            <FormControl fullWidth sx={{ width: '150px' }}>
                                <InputLabel id="demo-simple-select-label" style={{ fontFamily: 'Livicc' }}>
                                    Subject
                                </InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={subject}
                                    label="Subject"
                                    onChange={handleChangeSubject}
                                >
                                    <MenuItem
                                        value={'None'}
                                        sx={{
                                            '&:hover': { color: 'white', backgroundColor: '#2CC5CE' },
                                            color: '#2CC5CE',
                                            backgroundColor: 'white',
                                            fontFamily: 'Livicc'
                                        }}
                                    >
                                        None
                                    </MenuItem>
                                    {subjects?.map((u, i) => (
                                        <MenuItem
                                            value={u}
                                            key={i}
                                            sx={{
                                                '&:hover': { color: 'white', backgroundColor: '#2CC5CE' },
                                                color: '#2CC5CE',
                                                backgroundColor: 'white',
                                                fontFamily: 'Livicc'
                                            }}
                                        >
                                            {u}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        {userInfo?.type === 1 && (
                            <div style={{ marginLeft: '55px', width: '100px' }}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label" style={{ fontFamily: 'Livicc' }}>
                                        Class
                                    </InputLabel>
                                    <Select
                                        labelId="demo-controlled-open-select-label"
                                        id="demo-controlled-open-select"
                                        value={classType}
                                        label="Class"
                                        onChange={handleChangeClass}
                                    >
                                        <MenuItem
                                            value={'None'}
                                            sx={{
                                                '&:hover': { color: 'white', backgroundColor: '#2CC5CE' },
                                                color: '#2CC5CE',
                                                fontFamily: 'Livicc'
                                            }}
                                        >
                                            None
                                        </MenuItem>
                                        {classes?.map((u, i) => (
                                            <MenuItem
                                                value={u}
                                                key={i}
                                                sx={{
                                                    '&:hover': { color: 'white', backgroundColor: '#2CC5CE' },
                                                    color: '#2CC5CE',
                                                    fontFamily: 'Livicc'
                                                }}
                                            >
                                                {u}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>
                        )}
                    </div>
                    <div>
                        {userInfo?.type === 1 && (
                            <Button
                                variant="contained"
                                onClick={handleClickOpen}
                                sx={{
                                    backgroundColor: '#7983FF',
                                    borderRadius: '25px',
                                    fontFamily: 'Livvic',
                                    fontSize: '25px',
                                    fontWeight: '700'
                                }}
                            >
                                + Assignment
                            </Button>
                        )}
                    </div>
                </div>

                <Dialog
                    open={openstudentlist}
                    onClose={handleclickstudentlistclose}
                    aria-labelledby="alert-dialog-title"
                    le
                    aria-describedby="alert-dialog-description"
                    className="studentlistdialog"
                >
                    <div style={{ marginTop: '30px', alignSelf: 'center' }}>
                        <Stack spacing={2} sx={{ width: 300 }}>
                            <Autocomplete
                                multiple
                                id="free-solo-demo"
                                options={Classlist.map((option) => option.title)}
                                renderInput={(params) => <TextField {...params} label="Classlist" />}
                            />
                        </Stack>
                        <Button style={{ position: 'absolute', bottom: '30px', right: '30px' }}>Save</Button>
                    </div>
                </Dialog>

                <DataGrid
                    callbackedit={callbackedit}
                    subject={subject}
                    classtype={classType}
                    searchvalue={searchValue}
                    assignmentslists={assignments}
                    checkusertype={userInfo?.type}
                />
            </div>
        </div>
    );
}
