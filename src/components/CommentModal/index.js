import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import CloseIcon from '@mui/icons-material/Close';
import DialogContent from '@mui/material/DialogContent';

import _ from 'lodash';
import dayjs from 'dayjs';
import { useTheme } from '@mui/styles';
import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import {
    AUTHORISATION_USER_ID_STORAGE_KEY,
    AUTHORISATION_USER_NAME_STORAGE_KEY,
    AUTHORISATION_USER_NAME_ZH_STORAGE_KEY
} from 'utils/constants';
import { socket } from '../../views/utilities/Socket';

export default function CommentModal({ roomId, open, handleClose, senderId }) {
    // studentlists component
    const theme = useTheme();
    const [cookies] = useCookies();
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);

    

    useEffect(() => {
        socket.emit('subscribe', roomId);

        console.log("=============",socket)

        socket.on('newComment', (comment) => {
            console.log('create', comment);
            setComments((comments) => [...comments, comment]);
        });

        socket.emit('getComments', roomId);


        socket.on('comments', (comments) => {
            setComments(comments);
        });

        return () => {
            socket.off('subscribe');
            socket.off('newComment');
            socket.off('getComments');
        };
    }, [roomId]);

    const sendComment = () => {
        if (comment !== '') {
            const commentData = {
                roomId: roomId,
                message: comment,
                senderId: senderId,
                read: false
            };
            setComment('');
            try {
            socket.emit('newComment', commentData);
            console.log('-sent--', commentData)
            } catch(error) {
                console.log('---', error)
            }
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" className="studentlistdialog">
            <Box sx={{ display: 'flex', backgroundColor: '#2CC5CE', padding: '10px' }}>
                <Typography variant="h3" component="h3" sx={{ color: 'white', width: '100%', margin: '0px' }}>
                    {'Comment'} <br />
                </Typography>

                <CloseIcon onClick={handleClose} sx={{ color: 'white' }} />
            </Box>

            <DialogContent>
                <Box sx={{ height: '370px', overflow: 'auto' }}>
                    {comments?.map((comment, index) => {
                        return (
                            <div key={index}>
                                <Box sx={{ textAlign: 'left', fontSize: '12px' }}>
                                    {dayjs(comment.createdAt).format('DD-MM-YYYY HH:mm:ss')}
                                </Box>

                                <Box
                                    sx={{
                                        display: 'flex',
                                        fontSize: '20px',
                                        alignItems: 'center',
                                        marginBottom: '20px'
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            borderRadius: '50%',
                                            width: '40px',
                                            height: '40px',
                                            backgroundColor: 'yellow',
                                            paddingY: '13px',
                                            fontWeight: 'bold',
                                            fontSize: '8px',
                                            textAlign: 'center'
                                        }}
                                    >
                                        {console.log(
                                            comment.senderUserId,
                                            cookies[AUTHORISATION_USER_ID_STORAGE_KEY],
                                            comment.senderNameZh
                                        )}
                                        {comment.senderUserId === cookies[AUTHORISATION_USER_ID_STORAGE_KEY]
                                            ? cookies[AUTHORISATION_USER_NAME_ZH_STORAGE_KEY]
                                            : comment.senderNameZh}
                                    </Typography>

                                    <Box sx={{ marginLeft: '20px' }}>{comment.message}</Box>
                                </Box>
                            </div>
                        );
                    })}
                </Box>

                <TextField
                    id="datetime-local"
                    label="Comment"
                    type="text"
                    value={comment}
                    defaultValue=""
                    sx={{ width: 180, position: 'absolute', bottom: '30px' }}
                    InputLabelProps={{
                        shrink: true
                    }}
                    onChange={(e) => setComment(e.target.value)}
                />
                <Button
                    onClick={sendComment}
                    variant="contained"
                    style={{ position: 'absolute', bottom: '30px', right: '30px', backgroundColor: '#7983FF', borderRadius: '8px' }}
                >
                    Send
                </Button>
            </DialogContent>
        </Dialog>
    );
}
