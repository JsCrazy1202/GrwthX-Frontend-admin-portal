import { Box, CssBaseline } from '@mui/material';
// project imports
import Loadable from 'ui-component/Loadable';

import { styled, useTheme } from '@mui/material/styles';
import { useParams, useNavigate } from 'react-router';
import { useGetTotalInfoMutation, useGetGrwthxInfoMutation, useGetUserInfoQuery } from 'store/slices/apiSlice';
import { useEffect,lazy,useState,useRef, useMemo } from 'react';
import { useCookies } from 'react-cookie';
import { AUTHORISATION_USER_ID_STORAGE_KEY, AUTHORISATION_TOKEN_STORAGE_KEY } from 'utils/constants';

const NotFound = Loadable(lazy(() => import('../Page404')));

const Header = Loadable(lazy(() => import('./header')));

const PreviewIframe = styled('iframe')(() => ({
    border: 'none',
    height: 'calc(100vh - 75px)',
    width: '100%'
}));

const RoomMakerProject = () => {
    localStorage.removeItem('redirectUrl');
    const [cookies] = useCookies();
    const [roomUrl, setRoomUrl] = useState('');
    const params = useParams();
    const { roomId, userId, startobj } = params;
    const [data, setData] = useState({});
    const [timeoutId, setTimeoutId] = useState(null);
    const iframeRef = useRef(null);
    const [getTotalInfo, infoResponse] = useGetTotalInfoMutation();
    const { data: userInfo } = useGetUserInfoQuery();


    const [roomState, setRoomState] = useState(false);
    const [getGrwthxInfo, infoGrwthResponse] = useGetGrwthxInfoMutation();

    useEffect(() => {
        getTotalInfo({ roomId, userId });   
        getGrwthxInfo({ roomId, userId });
        if (userId) {
            // let url = `https://play.grwth.hk/?roomId=${roomId}&userId=${userId}&devmode=jobyDevMode`;
            let url = `https://play.grwth.hk/?roomId=${roomId}&userId=${userId}`;
            if (!!startobj && (startobj !== 'undefined')) {
                // url = `https://play.grwth.hk/?roomId=${roomId}&userId=${userId}&startobj=${startobj}&devmode=jobyDevMode`;
                url = `https://play.grwth.hk/?roomId=${roomId}&userId=${userId}&startobj=${startobj}`;
            }
            // const url = `https://play.grwth.hk/?roomId=${roomId}&userId=${userId}`;
            setRoomUrl(url);
        } else {
            // let url = `https://play.grwth.hk/?roomId=${roomId}&userId=${userId}&devmode=jobyDevMode`;
            let url = `https://play.grwth.hk/?roomId=${roomId}&userId=${userId}`;
            if (!!startobj && (startobj !== 'undefined')) {
                // url = `https://play.grwth.hk/?roomId=${roomId}&userId=${userId}&startobj=${startobj}&devmode=jobyDevMode`;
                url = `https://play.grwth.hk/?roomId=${roomId}&userId=${userId}&startobj=${startobj}`;
            }
            // const url = `https://play.grwth.hk/?roomId=${roomId}&userId=${userId}`;
            setRoomUrl(url);
        }
    }, [roomId, userId]);

    useEffect(() => {
        if (infoResponse.data) {
            setData(infoResponse.data);
        }
    }, [infoResponse]);

    const isRightUser = useMemo(() => {
        if(infoGrwthResponse?.data?.user){
            if(infoGrwthResponse?.data?.user.userId == userId ){
                setRoomState(true);
                return true;
            }else{
                setRoomState(false);
                return false;
            }
        }else{
            setRoomState(false);
            return false;
        }
    },[infoGrwthResponse])
    
    // useEffect(() => {
    //     if(roomState && isRightUser){
    //         clearTimeout(timeoutId);
    //         setTimeoutId(null);
    //     }else{
    //         const timeId = setTimeout(() => {
    //             if (process.env.NODE_ENV === 'development') {
    //                 window.location.href = 'http://localhost:8081/dashboard/default';
    //             } else {
    //                 window.location.href = 'https://grwthx.grwth.hk/dashboard/default';
    //             }
    //         }, 1000);
    //         setTimeoutId(timeId);
    //     }
    // },[roomState, isRightUser])

    const postMessage = (message) => {
        iframeRef.current.contentWindow.postMessage(message, roomUrl);
    };

    const isSaved = (event) =>{
        if (event.data === 'saveRoom' ) {
        }
    }
    window.addEventListener('message', (event) => 
        isSaved(event),
        false
    );

    return (
        <Box sx={{ width: '100vw', overflow: 'none', height: '100vh', background: 'black' }}>
            <CssBaseline />
            <Header
                data={data}
                userId={userId}
                roomId={roomId}
                postMessage={postMessage}
            />
            { roomState && <PreviewIframe ref={iframeRef} src={roomUrl} />}
        </Box>
    );
};

export default RoomMakerProject;
