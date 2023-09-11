import { Box, CssBaseline } from '@mui/material';
import Header from './header';
import { styled, useTheme } from '@mui/material/styles';
import { useParams } from 'react-router';
import { useGetTotalInfoMutation,useGetGrwthxInfoMutation,useGetUserInfoQuery } from 'store/slices/apiSlice';
import { useEffect,lazy,useState,useRef, useMemo } from 'react';
import { useCookies } from 'react-cookie';
import { AUTHORISATION_USER_ID_STORAGE_KEY, AUTHORISATION_TOKEN_STORAGE_KEY } from 'utils/constants';
import Loadable from 'ui-component/Loadable';
const NotFound = Loadable(lazy(() => import('../Page404')));

const PreviewIframe = styled('iframe')(() => ({
    border: 'none',
    height: 'calc(100vh - 75px)',
    width: '100%'
}));

const RoomMaker = () => {
    localStorage.removeItem('redirectUrl');
    const [roomUrl, setRoomUrl] = useState('');
    const [cookies] = useCookies();
    const iframeRef = useRef(null);
    const params = useParams();
    const { assignmentId, roomId, userId } = params;
    const [data, setData] = useState({});
    const [timeoutId, setTimeoutId] = useState(null);
    const [getTotalInfo, infoResponse] = useGetTotalInfoMutation();
    const { data: userInfo } = useGetUserInfoQuery();

    const [roomState, setRoomState] = useState(true);
    const [getGrwthxInfo, infoGrwthResponse] = useGetGrwthxInfoMutation();

    useEffect(() => {
        getTotalInfo({ assignmentId, roomId, userId });
        getGrwthxInfo({ roomId, userId, assignmentId });
        if (userId) {
            // const url = `https://play.grwth.hk/?roomId=${roomId}&assignmentId=${assignmentId}&userId=${userId}&devmode=jobyDevMode`;
            const url = `https://play.grwth.hk/?roomId=${roomId}&assignmentId=${assignmentId}&userId=${userId}`;
            setRoomUrl(url);
        } else {
            // const url = `https://play.grwth.hk/?roomId=${roomId}&assignmentId=${assignmentId}&devmode=jobyDevMode`;
            const url = `https://play.grwth.hk/?roomId=${roomId}&assignmentId=${assignmentId}`;
            setRoomUrl(url);
        }
    }, [assignmentId, roomId, userId]);

    useEffect(() => {
        if (infoResponse.data) {
            setData(infoResponse.data);
        }
    }, [infoResponse]);

    useEffect(() => {
        if(infoGrwthResponse?.data?.user){
            if(((infoGrwthResponse?.data?.user.userId == userId) && (cookies.userId == userId || (userInfo?.type == '1')))){
                setRoomState(true);
            }else{
                setRoomState(false);
            }
        }else{
            if(infoResponse?.data?.groups?.length > 0){  // in group case
                infoResponse?.data?.rooms?.map((room)=>{
                    if ((room.roomId === roomId) && (room.assignmentId === assignmentId)) {
                        setRoomState(true);
                    }
                })
            }else{
                setRoomState(false);
            }
        }
    },[infoGrwthResponse, infoResponse])

    useEffect(() => {
        if(roomState){
            clearTimeout(timeoutId);
            setTimeoutId(null);
        }else{
            const timeId = setTimeout(() => {
                if (process.env.NODE_ENV === 'development') {
                    window.location.href = 'http://localhost:8081/dashboard/default';
                } else {
                    window.location.href = 'https://grwthx.grwth.hk/dashboard/default';
                }
            }, 1600);
            setTimeoutId(timeId);
        }
    },[roomState])
    
    const postMessage = (message) => {
        iframeRef.current.contentWindow.postMessage(message, roomUrl);
    };

    return (
        <Box sx={{ width: '100vw', overflow: 'none', height: '100vh', background: 'black' }}>
            <CssBaseline />

            <Header
                data={data}
                userId={userId}
                roomId={roomId}
                assignmentId={assignmentId}
                postMessage={postMessage}
            />
           { roomState && <PreviewIframe ref={iframeRef} src={roomUrl} />}
        </Box>
    );
};

export default RoomMaker;
