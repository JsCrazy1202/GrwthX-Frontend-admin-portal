/**
 * Typography used in theme
 * @param {JsonObject} theme theme customization object
 */

export default function themeTypography(theme) {
    return {
        fontFamily: theme?.customization?.fontFamily,
        h6: {
            fontWeight: 500,
            color: theme.heading,
            fontSize: '0.75rem',
            fontFamily: 'Livvic',
        },
        h5: {
            fontSize: '0.875rem',
            color: theme.heading,
            fontWeight: 500,
            fontFamily: 'Livvic',
        },
        h4: {
            fontSize: '1rem',
            color: theme.heading,
            fontWeight: 600,
            fontFamily: 'Livvic',
        },
        h3: {
            fontSize: '1.25rem',
            color: theme.heading,
            fontWeight: 600,
            fontFamily: 'Livvic',
        },
        h2: {
            fontSize: '1.5rem',
            color: theme.heading,
            fontWeight: 700,
            fontFamily: 'Livvic',
        },
        h1: {
            fontSize: '2.125rem',
            color: theme.heading,
            fontWeight: 700,
            fontFamily: 'Livvic',
        },
        subtitle1: {
            fontSize: '0.875rem',
            fontWeight: 500,
            color: theme.textDark,
            fontFamily: 'Livvic',
        },
        subtitle2: {
            fontSize: '0.75rem',
            fontWeight: 400,
            color: theme.darkTextSecondary,
            fontFamily: 'Livvic',
        },
        caption: {
            fontSize: '30px',
            color: theme.darkTextSecondary,
            fontWeight: 200,
            fontFamily: 'Livvic',
        },
        body1: {
            fontSize: '0.875rem',
            fontWeight: 400,
            lineHeight: '1.334em',
            fontFamily: 'Livvic',
        },
        body2: {
            letterSpacing: '0em',
            fontWeight: 400,
            lineHeight: '1.5em',
            color: theme.darkTextPrimary,
            fontFamily: 'Livvic',
        },
        button: {
            textTransform: 'capitalize',
            fontFamily: 'Livvic',
        },
        customInput: {
            marginTop: 1,
            marginBottom: 1,
            '& > label': {
                top: 23,
                left: 0,
                color: theme.grey500,
                '&[data-shrink="false"]': {
                    top: 5
                }
            },
            '& > div > input': {
                padding: '30.5px 14px 11.5px !important'
            },
            '& legend': {
                display: 'none'
            },
            '& fieldset': {
                top: 0
            }
        },
        mainContent: {
            backgroundColor: theme.background,
            width: '100%',
            minHeight: 'calc(100vh - 88px)',
            flexGrow: 1,
            padding: '20px',
            marginTop: '50px',
            marginRight: '20px',
            borderRadius: `${theme?.customization?.borderRadius}px`,
            fontFamily: 'Livvic',
        },
        menuCaption: {
            fontSize: '0.875rem',
            fontWeight: 500,
            color: theme.heading,
            padding: '6px',
            textTransform: 'capitalize',
            marginTop: '10px',
            fontFamily: 'Livvic',
        },
        subMenuCaption: {
            fontSize: '0.6875rem',
            fontWeight: 500,
            color: theme.darkTextSecondary,
            textTransform: 'capitalize',
            fontFamily: 'Livvic',
        },
        commonAvatar: {
            cursor: 'pointer',
            borderRadius: '8px',
            fontFamily: 'Livvic',
        },
        smallAvatar: {
            width: '22px',
            height: '22px',
            fontSize: '1rem',
            fontFamily: 'Livvic',
        },
        mediumAvatar: {
            width: '34px',
            height: '34px',
            fontSize: '1.2rem',
            fontFamily: 'Livvic',
        },
        largeAvatar: {
            width: '44px',
            height: '44px',
            fontSize: '1.5rem',
            fontFamily: 'Livvic',
        },
        

    };
}
