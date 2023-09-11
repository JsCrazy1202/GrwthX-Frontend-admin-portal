// assets
import {
    IconBrandChrome,
    IconHelp,
    IconHome,
    IconTrash,
    IconUserCircle,
    IconBrandGithub,
    IconShare,
    IconHeart,
    IconArchive
} from '@tabler/icons';
import LocalLibraryOutlinedIcon from '@mui/icons-material/LocalLibraryOutlined';
import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import Assignments from 'assets/images/icons/Assignments.webp';
// constant
const icons = { IconBrandChrome, IconHelp, IconHome, IconTrash, IconUserCircle, IconBrandGithub, IconShare, IconHeart, IconArchive };

// ==============================|| SAMPLE PAGE & DOCUMENTATION MENU ITEMS ||============================== //

const other = {
    id: 'sample-docs-roadmap',
    type: 'group',
    children: [
        {
            id: 'assignments-page',
            title: 'Assignments',
            type: 'item',
            url: '/assignments',
            icon: AssignmentOutlinedIcon,
            breadcrumbs: false
        },

        {
            id: 'myprojects-page',
            title: 'My Projects',
            type: 'item',
            url: '/myprojects',
            icon: FormatListBulletedOutlinedIcon,
            breadcrumbs: false
        },
        // {
        //     id: 'sharedwithme-page',
        //     title: 'Shared with me',
        //     type: 'item',
        //     url: '/sharedwithme',
        //     icon: icons.IconShare,
        //     breadcrumbs: false
        // },
        {
            id: 'library-page',
            title: 'Library',
            type: 'item',
            url: '/library',
            icon: icons.IconArchive,
            breadcrumbs: false
        },
        {
            id: 'favourites-page',
            title: 'Favourites',
            type: 'item',
            url: '/favourites',
            icon: icons.IconHeart,
            breadcrumbs: false
        },

        // {
        //     id: 'documentation',
        //     title: 'Trash',
        //     type: 'item',
        //     // url: 'https://codedthemes.gitbook.io/berry/',
        //     url: 'https://play.grwth.hk/?assignments=room1',
        //     icon: icons.IconTrash,
        //     external: true,
        //     target: true
        // }
    ]
};

export default other;
