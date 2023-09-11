import io from 'socket.io-client';

export const socket = process.env.NODE_ENV === 'development' ? io('http://localhost:3000') : io('https://grwthx.grwth.hk/api', { path: '/socket.io' });
