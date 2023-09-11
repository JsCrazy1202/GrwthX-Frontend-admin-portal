import { lazy } from 'react';
import { Navigate, useRoutes, useLocation } from 'react-router-dom';
// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import LogoOnlyLayout from '../layout/LogoOnlyLayout';
import { RoomMakerProject } from '../views/roomMakerProject';
import { RoomMaker } from 'views/roomMaker';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

// utilities routing
const UtilsTypography = Loadable(lazy(() => import('../views/utilities/Typography')));
const UtilsColor = Loadable(lazy(() => import('../views/utilities/Color')));
const UtilsShadow = Loadable(lazy(() => import('../views/utilities/Shadow')));
const UtilsMaterialIcons = Loadable(lazy(() => import('../views/utilities/MaterialIcons')));
const UtilsTablerIcons = Loadable(lazy(() => import('../views/utilities/TablerIcons')));

// sample page routing
const AssignmentsPage = Loadable(lazy(() => import('../views/assignments')));
const AssignmentEdit = Loadable(lazy(() => import('../views/assignmentedit')));
const StudentlistsPage = Loadable(lazy(() => import('../views/studentlists')));

const MyprojectsPage = Loadable(lazy(() => import('../views/myprojects')));
const SharedwithmePage = Loadable(lazy(() => import('../views/sharedwithme')));
const LibraryPage = Loadable(lazy(() => import('../views/library')));
const FavouritesPage = Loadable(lazy(() => import('../views/favourites')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/',
    element: <MainLayout />,
    children: [
        {
            path: '/',
            element: <DashboardDefault />
        },
        {
            path: '/assignmentedit/:userid',
            element: <AssignmentEdit />
        },
        {
            path: 'dashboard',
            children: [
                {
                    path: 'default',
                    element: <DashboardDefault />
                }
            ]
        },
        {
            path: 'utils',
            children: [
                {
                    path: 'util-typography',
                    element: <UtilsTypography />
                }
            ]
        },
        {
            path: 'utils',
            children: [
                {
                    path: 'util-color',
                    element: <UtilsColor />
                }
            ]
        },
        {
            path: 'utils',
            children: [
                {
                    path: 'util-shadow',
                    element: <UtilsShadow />
                }
            ]
        },
        {
            path: 'mylibrary',
            children: [
                {
                    path: 'room-obj',
                    element: <UtilsTablerIcons />
                }
            ]
        },
        {
            path: 'icons',
            children: [
                {
                    path: 'material-icons',
                    element: <UtilsMaterialIcons />
                }
            ]
        },
        {
            path: 'assignments',
            element: <AssignmentsPage />
        },
        {
            path: 'myprojects',
            element: <MyprojectsPage />
        },
        {
            path: 'sharedwithme',
            element: <SharedwithmePage />
        },
        {
            path: 'library',
            element: <LibraryPage />
        },
        {
            path: 'favourites',
            element: <FavouritesPage />
        },
        {
            path: 'studentlists/:assignmentId',
            element: <StudentlistsPage />
        },
        {
            path: 'roomId/:roomId/:assignmentId/:userId',
            element: <RoomMaker />
        },
        {
            path: 'roomId/:roomId/:assignmentId',
            element: <RoomMaker />
        },
        {
            path: 'createRoom/:roomId/:userId',
            element: <RoomMakerProject />
        },
        {
            path: 'createRoom/:roomId/:userId/:startobj',
            element: <RoomMakerProject />
        },
        {
            path: '*',
            element: <LogoOnlyLayout />,
        },
        { path: '*', element: <Navigate to="/404" replace /> }
    ]
};

export default MainRoutes;
