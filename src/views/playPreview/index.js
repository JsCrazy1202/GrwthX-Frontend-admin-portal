import React, {useState} from 'react';
import { lazy } from 'react';
import { useSearchParams, useParams, useNavigate, useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { useCookies } from 'react-cookie';
import { AUTHORISATION_TOKEN_STORAGE_KEY } from 'utils/constants';
import { useEffect } from 'react';
import { useGetTotalInfoMutation, useGetGrwthxInfoMutation } from 'store/slices/apiSlice';
import Loadable from 'ui-component/Loadable';
import {ROOM_PREVIEW_MESSAGE,
    ROOM_SAVE_MESSAGE
} from 'utils/constants';

const NotFound = Loadable(lazy(() => import('../Page404')));

const PreviewIframe = styled('iframe')(() => ({
    border: 'none',
    height: '100vh',
    width: '100%',
    margin: '0'
}));

const PlayPreview = () => {
    const [roomState, setRoomState] = useState(false);
    const [roomUrl, setRoomUrl] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const [cookies] = useCookies();
    const [assignmentId, setAssignmentId] = useState();
    const [roomId, setRoomId] = useState();
    const [userId, setUserId] = useState();
    const [mode, setMode] = useState();

    const [getGrwthxInfo, infoGrwthResponse] = useGetGrwthxInfoMutation();
    
    
    useEffect(() => {
        setAssignmentId(location.state?.assignmentId);
        setRoomId(location.state?.roomId);
        setUserId(location.state?.userId);
        setMode(location.state?.mode);
        setTimeout(() => {
            if (!cookies[AUTHORISATION_TOKEN_STORAGE_KEY])
            navigate('/404')
        }, 1000)
    }, [cookies])
    
    useEffect(() => {
        getGrwthxInfo({ roomId, userId, assignmentId });
        console.log(mode, "mode");
        const tempUrl = `https://play.grwth.hk/${mode === ROOM_PREVIEW_MESSAGE ? 'preview' : 'play'}/?roomId=${roomId}&userId=${userId}&assignmentId=${assignmentId}`;
        setRoomUrl(tempUrl, 'tempUrl');
    }, [roomId, userId, assignmentId]);

    useEffect(() => {
        if(infoGrwthResponse?.data?.user){
            setRoomState(true);
        }
    },[infoGrwthResponse])
    
    
    return (
        <>
            <PreviewIframe src={roomUrl} same-origin-allow />
        </>
    )
        
}

export default PlayPreview;