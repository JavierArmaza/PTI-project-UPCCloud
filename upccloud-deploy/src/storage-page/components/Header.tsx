import React from 'react';
import styled from 'styled-components'
import SearchIcon from '@mui/icons-material/Search';
// @ts-ignore
import logo from '../../images/upccloud_logo.png';
import ToggleColorMode from '../../landing-page/components/ToggleColorMode.tsx';
import { PaletteMode } from '@mui/material';
import { styled as styledMui } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';

const HeaderContainer = styled.div`
    display: grid;
    grid-template-columns: 300px auto 200px;
    align-items: center;
    padding: 5px 20px;
    height: 60px;
    border-bottom: 1px solid lightgray;
`

const HeaderLogo = styled.div`
    display: flex;
    align-items: center;
    img {
        width: 40px;
    }
    span{
        font-size: 22px;
        margin-left: 10px;
        color: gray;
    }
`
const Search = styledMui('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: 
        theme.palette.mode === 'light'
            ? 'rgba(210, 210, 210, 0.4)'
            : 'rgba(0, 0, 0, 0.4)',
        '&:hover': {
            backgroundColor: 
                theme.palette.mode === 'light'
                    ? 'rgba(180, 180, 180, 0.4)'
                    : 'rgba(20, 20, 20, 0.4)',
        },
    border: '1px solid',
    borderColor:  
        theme.palette.mode === 'light'
            ? 'rgba(50, 50, 50, 0.4)'
            : 'rgba(80, 80, 80, 0.4)',
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  }));

const SearchIconWrapper = styledMui('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }));

  const StyledInputBase = styledMui(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '134ch',
      },
    },
  }));


interface HeaderProps {
    mode: PaletteMode;
    toggleColorMode: () => void;
    setInputTextState: (input_text: any) => void;
}

function Header ({ mode, toggleColorMode, setInputTextState}: HeaderProps) {    

    function handleChange (e) {
        setInputTextState(e.target.value)
    }

    return (
        <HeaderContainer>
            <HeaderLogo>
                <img src={logo} alt="UPC Cloud" />
                <span>UPC Cloud</span>
            </HeaderLogo>
            <Search>
                <SearchIconWrapper>
                    <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                    placeholder="Search…"
                    inputProps={{ 'aria-label': 'search' }}
                    onChange={handleChange}
                    />
            </Search>
            <div style = {{position:'relative', left:'169px', top:'0px'}}>
                <ToggleColorMode mode={mode} toggleColorMode={toggleColorMode} />
            </div>
        </HeaderContainer>
    )
}

export default Header;