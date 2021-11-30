const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  prefix: '',
  mode:"jit",
  purge: {
    enabled: true,
    content: [
      './src/**/*.{html,ts}',
    ]
  },
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
          menu_primary: '#F4F4FC',
          text_primary: '#32166C',
          text_user_role: '#363636',
          text_primary_inner: '#5C3298',
          text_secondary: '#7B7B7B',
          text_general: '#171736',
          login_button: '#E1B262',
          footer_bg: '#452A7F',
          jdpower: '#CF2332'
      },
      screens: {
        'xs': '380px',
        ...defaultTheme.screens,
      },
    },
    fontFamily: {
      raleway: ['Raleway-Regular']
    }
  },
  variants: {
    extend: {
      backgroundColor: ['disabled'],
    },
  },
  plugins: [require('@tailwindcss/typography'),require('@tailwindcss/forms')],
};
