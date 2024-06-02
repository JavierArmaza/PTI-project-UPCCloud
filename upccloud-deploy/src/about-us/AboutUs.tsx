import * as React from 'react';
import { PaletteMode } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import getLPTheme from './getLPTheme.tsx';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import ToggleColorMode from './components/ToggleColorMode.tsx';
import { alpha } from '@mui/material';

//@ts-ignore
import nginxLogo from '../images/nginx_logo.png';
//@ts-ignore
import frontLogo from '../images/react_logo.png';
//@ts-ignore
import backLogo from '../images/back_logo.png';
//@ts-ignore
import dockLogo from '../images/dock_logo.png';
//@ts-ignore
import ipfsLogo from '../images/ipfs_logo.png';
//@ts-ignore
import kubeLogo from '../images/kube_logo.png';
//@ts-ignore
import blockLogo from '../images/block_logo.png';

//@ts-ignore
import javier from '../images/javier.jpg';
//@ts-ignore
import sergi from '../images/sergi.jpg';
//@ts-ignore
import sofia from '../images/sofia.jpg';
//@ts-ignore
import pablo from '../images/pablo.jpg';

// @ts-ignore
import logo from '../images/upccloud_logo.png';
//@ts-ignore
import logoName from '../images/upccloud_name.png';



const logoStyle = {
    width: '64px',
    margin: '0px 10px 0px 10px',
    opacity: 0.8,
};

const profileStyle = {
    width: '128px',
    margin: '0px 10px 0px 10px',
    opacity: 0.9,
    borderRadius : '10px',
};

export default function LandingPage() {
  const start_mode = (localStorage.getItem("mode") === null ? 'light' : localStorage.getItem("mode"));
  //@ts-ignore
  const [mode, setMode] = React.useState<PaletteMode>(start_mode);
  const LPtheme = createTheme(getLPTheme(mode));

  const toggleColorMode = () => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
    localStorage.setItem("mode",mode === 'light' ? 'dark' : 'light');
  };

    return (
        <ThemeProvider theme={LPtheme}>
            <CssBaseline />
            <Stack
                direction="column"
                spacing={2}
                useFlexGap
                sx={{ width: '100%', display: { xs: 'flex', sm: 'flex' } }}
                >
                <Box 
                    sx={(theme) => ({
                        width: '100%',
                        backgroundImage:
                        theme.palette.mode === 'light'
                            ? 'linear-gradient(180deg, #CEE5FD, #FFF)'
                            : `linear-gradient(#02294F, ${alpha('#090E10', 0.0)})`,
                        backgroundSize: '100% 30%',
                        backgroundRepeat: 'no-repeat',
                    })}>
                    <Box sx={{
                            width: '100%',
                            alignItems: { md: 'center' },
                            gap: 2.5,
                            margin: '0px 0px 50px 0px'
                            }}>
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        sx={{
                            position: { xs: 'static', sm: 'fixed' },
                            width: '100%',
                            p: { xs: 2, sm: 4 },
                        }}
                        >
                        <Button
                            startIcon={<ArrowBackRoundedIcon />}
                            component="a"
                            href="/"
                        >
                            Back
                        </Button>
                        <ToggleColorMode mode={mode} toggleColorMode={toggleColorMode} />
                    </Stack>
                </Box>
                <Box style={{margin:'0px 0px 30px 0px'}}>
                    <Stack
                    direction="column"
                    alignItems="center"
                    spacing={2}
                    useFlexGap
                    sx={{ width: '100%', display: { xs: 'flex', sm: 'flex' } }}
                    >
                        <img src={logo} width={'30%'} alt='logo'/>
                        <img src={logoName} width={'30%'} alt='name'/>
                    </Stack>
                </Box>
                <Divider />
                <Stack
                    margin='25px 25px 25px 25px'
                    direction="row"
                    justifyContent="center"
                    alignItems="flex-start"
                    alignSelf="center"
                    spacing={2}
                    useFlexGap
                    sx={{ width: '97%', display: { xs: 'flex', sm: 'flex' } }}
                    >
                    <Card
                    variant="outlined"
                    sx={{
                        alignItems:'center',
                        alignSelf: 'center',
                        p: 3,
                        height: '410px',
                        width: '23%',
                        background: 'none',
                        borderColor: (theme) => {
                        if (theme.palette.mode === 'light') {
                            return 'primary.light';
                        }
                        return 'primary.dark';
                        },
                    }}
                    >
                        <Box
                            sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'column' },
                            alignItems: { md: 'center' },
                            gap: 2.5,
                            }}
                        >
                            <Box
                            sx={{
                                color: 'primary.main'
                            }}
                            >
                            <img src={javier} style={profileStyle} alt='javier'/>
                            </Box>
                            <Box sx={{ textTransform: 'none' }}>
                                <Typography
                                    color="text.primary"
                                    variant="body2"
                                    fontWeight="bold"
                                    align='center'
                                >
                                    Javier Armaza Bravo
                                </Typography>
                                <Typography
                                    color="text.secondary"
                                    variant="body2"
                                    align='left'
                                    sx={{ my: 0.5 }}
                                >
                                    <b>Contact:</b> javier.armaza@estudiantat.upc.edu <br/>
                                    <b>Work done:</b> Web server & Front-end
                                </Typography>
                            </Box>
                            <Box sx={{display:'flex', alignSelf:'center', alignItems:'center'}}>
                                <img src={nginxLogo} style={logoStyle} alt='nginx'/>
                                <img src={frontLogo} style={logoStyle} alt='react'/>
                            </Box>
                        </Box>
                    </Card>
                    <Card
                    variant="outlined"
                    sx={{
                        alignItems:'center',
                        alignSelf: 'center',
                        p: 3,
                        height: '410px',
                        width: '23%',
                        background: 'none',
                        borderColor: (theme) => {
                        if (theme.palette.mode === 'light') {
                            return 'primary.light';
                        }
                        return 'primary.dark';
                        },
                    }}
                    >
                        <Box
                            sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'column' },
                            alignItems: { md: 'center' },
                            gap: 2.5,
                            }}
                        >
                            <Box
                            sx={{
                                color: 'primary.main'
                            }}
                            >
                            <img src={sergi} style={profileStyle} alt='sergi'/>
                            </Box>
                            <Box sx={{ textTransform: 'none' }}>
                                <Typography
                                    color="text.primary"
                                    variant="body2"
                                    fontWeight="bold"
                                    align='center'
                                >
                                    Sergi Colomer Segalés
                                </Typography>
                                <Typography
                                    color="text.secondary"
                                    variant="body2"
                                    align='left'
                                    sx={{ my: 0.5 }}
                                >
                                    <b>Contact:</b> sergi.colomer.segales@estudiantat.upc.edu <br/>
                                    <b>Work done:</b> Docker & Kubernetes
                                </Typography>
                            </Box>
                            <Box sx={{display:'flex', alignSelf:'center', alignItems:'center'}}>
                                <img src={dockLogo} style={logoStyle} alt='docker'/>
                                <img src={kubeLogo} style={logoStyle} alt='kubernetes'/>
                            </Box>
                        </Box>
                    </Card>
                </Stack>
                <Stack
                    margin='0px 25px 25px 25px'
                    direction="row"
                    justifyContent="center"
                    alignItems="flex-start"
                    spacing={2}
                    useFlexGap
                    sx={{ width: '97%', display: { xs: 'flex', sm: 'flex' } }}
                    >
                    <Card
                    variant="outlined"
                    sx={{
                        alignItems:'center',
                        alignSelf: 'center',
                        p: 3,
                        height: '410px',
                        width: '23%',
                        background: 'none',
                        borderColor: (theme) => {
                        if (theme.palette.mode === 'light') {
                            return 'primary.light';
                        }
                        return 'primary.dark';
                        },
                    }}
                    >
                        <Box
                            sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'column' },
                            alignItems: { md: 'center' },
                            gap: 2.5,
                            }}
                        >
                            <Box
                            sx={{
                                color: 'primary.main'
                            }}
                            >
                            <img src={sofia} style={profileStyle} alt='sofia'/>
                            </Box>
                            <Box sx={{ textTransform: 'none' }}>
                                <Typography
                                    color="text.primary"
                                    variant="body2"
                                    fontWeight="bold"
                                    align='center'
                                >
                                    Sofía López Olivares
                                </Typography>
                                <Typography
                                    color="text.secondary"
                                    variant="body2"
                                    align='left'
                                    sx={{ my: 0.5 }}
                                >
                                    <b>Contact:</b> sofia.paz.lopez@estudiantat.upc.edu <br/>
                                    <b>Work done:</b> Back-end & Blockchain
                                </Typography>
                            </Box>
                            <Box sx={{display:'flex', alignSelf:'center', alignItems:'center'}}>
                                <img src={backLogo} style={logoStyle} alt='backend'/>
                                <img src={blockLogo} style={logoStyle} alt='backend'/>
                            </Box>
                        </Box>
                    </Card>
                    <Card
                    variant="outlined"
                    sx={{
                        alignItems:'center',
                        alignSelf: 'center',
                        p: 3,
                        height: '410px',
                        width: '23%',
                        background: 'none',
                        borderColor: (theme) => {
                        if (theme.palette.mode === 'light') {
                            return 'primary.light';
                        }
                        return 'primary.dark';
                        },
                    }}
                    >
                        <Box
                            sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'column' },
                            alignItems: { md: 'center' },
                            gap: 2.5,
                            }}
                        >
                            <Box
                            sx={{
                                color: 'primary.main'
                            }}
                            >
                            <img src={pablo} style={profileStyle} alt='pablo'/>
                            </Box>
                            <Box sx={{ textTransform: 'none' }}>
                                <Typography
                                    color="text.primary"
                                    variant="body2"
                                    fontWeight="bold"
                                    align='center'
                                >
                                    Pablo Rosas Roda
                                </Typography>
                                <Typography
                                    color="text.secondary"
                                    variant="body2"
                                    align='left'
                                    sx={{ my: 0.5 }}
                                >
                                    <b>Contact:</b> pablo.rosas@estudiantat.upc.edu <br/>
                                    <b>Work done:</b> IPFS & a bit of Back-end
                                </Typography>
                            </Box>
                            <Box sx={{display:'flex', alignSelf:'center', alignItems:'center'}}>
                                <img src={ipfsLogo} style={logoStyle} alt='IPFS'/>
                                <img src={backLogo} style={logoStyle} alt='backend'/>
                            </Box>
                        </Box>
                    </Card>
                </Stack>
                </Box> 
            </Stack>
        </ThemeProvider>
  );
}
