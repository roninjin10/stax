import { createTheme, style } from '@vanilla-extract/css'

export const [themeClass, vars] = createTheme({
  color: {
    brand: '#2f2f2f',
    white: '#fff',
  },
  font: {
    body: 'sans-serif',
  },
})

export const navbarStyle = style({
  backgroundColor: vars.color.brand,
  padding: 10,
  display: 'flex',
  justifyContent: 'space-evenly',
  fontFamily: vars.font.body,
})

export const navbarUlStyle = style({
  listStyleType: 'none',
  margin: 0,
  padding: 0,
})

export const navbarLiStyle = style({
  display: 'inline-block',
  padding: '0 10px',
})

export const navbarLiAStyle = style({
  color: vars.color.white,
  textDecoration: 'none',
})

export const sideNavStyle = style({
  width: '20%',
  float: 'left',
  backgroundColor: '#eee',
  padding: 10,
})

export const sideNavUlStyle = style({
  listStyleType: 'none',
  margin: 0,
  padding: 0,
})

export const sideNavLiStyle = style({
  padding: 5,
})

export const mainContentStyle = style({
  width: '80%',
  float: 'left',
  padding: 20,
})

export const footerStyle = style({
  backgroundColor: vars.color.brand,
  color: vars.color.white,
  textAlign: 'center',
  padding: 10,
  marginTop: 20,
})
