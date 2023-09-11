// assets
import { IconBrandChrome, IconChevronRight } from '@tabler/icons';

// constant
const icons = {
    IconBrandChrome,
    IconChevronRight
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const pages = {
    id: 'pages',
    type: 'group',
    children: [
        {
            id: 'authentication',
            title: 'From Library',
            type: 'collapse',
            icon: icons.IconBrandChrome,

            children: [
                {
                    id: 'login3',
                    title: 'Room',
                    type: 'item',
                    icon: icons.IconChevronRight,
                    url: '/pages/login/login3',
                    target: true
                },
                {
                    id: 'register3',
                    title: 'Object',
                    type: 'item',
                    icon: icons.IconChevronRight,
                    url: '/pages/register/register3',
                    target: true
                }
            ]
        }
    ]
};

export default pages;
