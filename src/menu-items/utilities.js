// assets
import { IconTypography, IconPalette, IconShadow, IconWindmill, IconChevronRight } from '@tabler/icons';

// constant
const icons = {
    IconTypography,
    IconPalette,
    IconShadow,
    IconWindmill,
    IconChevronRight
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const utilities = {
    id: 'utilities',
    type: 'group',
    children: [
        {
            id: 'icons',
            title: 'My Library',
            type: 'collapse',
            icon: icons.IconWindmill,
            children: [
                {
                    id: 'tabler-icons',
                    title: 'Created by me',
                    type: 'item',
                    icon: icons.IconChevronRight,
                    url: '/mylibrary/room-obj',
                    breadcrumbs: false
                },
                {
                    id: 'material-icons',
                    title: 'Shared with me',
                    type: 'item',
                    icon: icons.IconChevronRight,
                    url: '/icons/material-icons',
                    breadcrumbs: false
                },
                {
                    id: 'favourites',
                    title: 'Favourites',
                    type: 'item',
                    icon: icons.IconChevronRight,
                    url: '/icons/material-icons',
                    breadcrumbs: false
                }
            ]
        }
    ]
};

export default utilities;
