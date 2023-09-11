import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AUTHORISATION_TOKEN_STORAGE_KEY } from '../../utils/constants';

export const dataApi = createApi({
    reducerPath: 'dataApi',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:3000/api' : 'https://grwthx.grwth.hk/api/api',

        credentials: 'include'
    }),

    tagTypes: ['Post'],
    endpoints: (builder) => ({
        getAccessToken: builder.query({
            query: ({ code }) => ({
                url: `/auth/getAccessToken?code=${code}`
            })
        }),
        getUserData: builder.mutation({
            query: () => ({
                url: `auth/userinfo/byToken`,
                method: 'GET'
            })
        }),
        getAssignments: builder.query({
            query: ({ userId }) => ({
                url: `/assignments/getdata?userId=${userId}`
            })
        }),
        getAssignmentsByMutation: builder.mutation({
            query: ({ userId }) => ({
                url: `/assignments/getdata?userId=${userId}`,
                method: 'GET'
            })
        }),
        getClassList: builder.query({
            query: () => ({
                url: '/findClass'
            })
        }),
        getClassListOriginal: builder.query({
            query: () => ({
                url: '/getClassOriginal'
            })
        }),
        getUserInfo: builder.query({
            query: () => ({
                url: '/auth/userinfo'
            })
        }),
        getSubjectsOriginal: builder.query({
            query: () => ({
                url: '/getSubjectsOriginal'
            })
        }),
        getSubjects: builder.query({
            query: () => ({
                url: '/findSubjects'
            })
        }),

        insertAssignment: builder.mutation({
            query: (payload) => ({
                url: '/assignments/insert',
                method: 'POST',
                body: payload
            })
        }),
        getClassUsers: builder.mutation({
            query: ({ classId }) => ({
                url: '/getClassUsers',
                method: 'POST',
                body: { classId }
            })
        }),
        deleteAssignment: builder.mutation({
            query: ({ assignmentId }) => ({
                url: '/assignments/deleteById',
                method: 'DELETE',
                body: { assignmentId }
            })
        }),
        getAssignmentById: builder.mutation({
            query: ({ assignmentId }) => ({
                url: `assignments/getAssignmentById?assignmentId=${assignmentId}`,
                method: 'GET'
            })
        }),
        updateAssignment: builder.mutation({
            query: (payload) => ({
                url: `assignments/update`,
                method: 'PUT',
                body: payload
            })
        }),
        deleteStudentById: builder.mutation({
            query: ({ roomId }) => ({
                url: 'users/deleteUserByRoomId',
                method: 'DELETE',
                body: { roomId }
            })
        }),
        getComments: builder.mutation({
            query: ({ roomId }) => ({
                url: `comments/getByRoomId?roomId=${roomId}`,
                method: 'GET'
            })
        }),
        createComment: builder.mutation({
            query: (payload) => ({
                url: `comments/create`,
                method: 'POST',
                body: payload
            })
        }),
        getRooms: builder.mutation({
            query: ({ userId }) => ({
                url: `rooms/get?userId=${userId}`,
                method: 'GET'
            })
        }),
        getRoomById: builder.mutation({
            query: ({ roomId }) => ({
                url: `rooms/getById?roomId=${roomId}`,
                method: 'GET'
            })
        }),
        createRoom: builder.mutation({
            query: (payload) => ({
                url: `/rooms/create`,
                method: 'POST',
                body: payload
            })
        }),
        toggleFavorite: builder.mutation({
            query: (payload) => ({
                url: `/rooms/toggleFavorite`,
                method: 'PUT',
                body: payload
            })
        }),
        updateTitle: builder.mutation({
            query: (payload) => ({
                url: `/rooms/updateTitle`,
                method: 'PUT',
                body: payload
            })
        }),
        getLibray: builder.query({
            query: () => ({
                url: '/library/get'
            })
        }),
        deleteRoomById: builder.mutation({
            query: (payload) => ({
                url: '/rooms/deleteById',
                method: 'DELETE',
                body: payload
            })
        }),
        setMark: builder.mutation({
            query: (payload) => ({
                url: '/users/setMark',
                method: 'PUT',
                body: payload
            })
        }),
        logout: builder.mutation({
            query: (payload) => ({
                url: '/auth/logout',
                method: 'POST',
                body: payload
            })
        }),
        getTotalInfo: builder.mutation({
            query: (payload) => ({
                url: '/auth/getTotalInfo',
                method: 'POST',
                body: payload
            })
        }),
        updateStatus: builder.mutation({
            query: (payload) => ({
                url: '/grwthx/updateStatus',
                method: 'PUT',
                body: payload
            })
        }),
        getGrwthxInfo: builder.mutation({
            query: (payload) => ({
                url: `/grwthx/getInfo?roomId=${payload.roomId}&assignmentId=${payload.assignmentId}&userId=${payload.userId}`,
                method: 'GET'
            })
        }),
    })
});

export const {
    useGetAccessTokenQuery,
    useGetUserDataMutation,
    useGetAssignmentsQuery,
    useGetClassListQuery,
    useGetClassListOriginalQuery,
    useGetUserInfoQuery,
    useGetSubjectsQuery,
    useGetSubjectsOriginalQuery,
    useInsertAssignmentMutation,
    useGetClassUsersMutation,
    useDeleteAssignmentMutation,
    useGetAssignmentByIdMutation,
    useDeleteStudentByIdMutation,
    useGetAssignmentsByMutationMutation,
    useUpdateAssignmentMutation,
    useGetCommentsMutation,
    useCreateCommentMutation,
    useGetRoomsMutation,
    useGetRoomByIdMutation,
    useCreateRoomMutation,
    useToggleFavoriteMutation,
    useUpdateTitleMutation,
    useGetLibrayQuery,
    useDeleteRoomByIdMutation,
    useSetMarkMutation,
    useLogoutMutation,
    useGetTotalInfoMutation,
    useUpdateStatusMutation,
    useGetGrwthxInfoMutation,
} = dataApi;
