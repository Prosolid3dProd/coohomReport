
/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ['class'],
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        colors: {
            white: '#FFFFFF',
            bckLogin: '#f7f7f7',
            black: '#000000',
            yellow: '#F4D160',
            blue: '#1a7af8',
            skyBlue: '#80B7FF',
            gray: '#f8f9f9',
            border: '#e8e8e9',
            slate: '#CFCFCF',
            green: '#1a7a',
            general: '#0B2447',
            cuerpo: '#19376D',
            blueDark: '#303B69',
            lowBlueDark: '#6575B5',
            red: '#FF4733',
            orange: '#F74F19'
        },
        fontFamily: {
            default: 'Helvetica Neue,sans-serif;',
            login: 'Muli,sans-serif'
        },
        fontSize: {
            sm: '8px',
            smd: '12px',
            md: '16px',
            sv: '24px',
            lg: '32px',
            xl: '40px',
            xxl: '80px'
        },
        padding: {
            inputs: '20px'
        },
        extend: {
            backgroundImage: {
                'login': "url('../../../assets/loginBg.jpg')",
            },
            animation: {
                'editable': 'animate-pulse'
            },
            screens:{
                'tableHeader': {'max':'768px'} 
            }
        },

        plugins: [],
    }
}