import * as React from 'react';
import { PaletteMode } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AppAppBar from './components/AppAppBar.tsx';
import Hero from './components/Hero.tsx';
import LogoCollection from './components/LogoCollection.tsx';
import Highlights from './components/Highlights.tsx';
import Pricing from './components/Pricing.tsx';
import Features from './components/Features.tsx';
import Specification from './components/Specification.tsx';
import FAQ from './components/FAQ.tsx';
import Footer from './components/Footer.tsx';
import getLPTheme from './getLPTheme.tsx';


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
      <AppAppBar mode={mode} toggleColorMode={toggleColorMode} />
      <Hero />
      <Box sx={{ bgcolor: 'background.default' }}>
        <LogoCollection />
        <Features />
        <Divider />
        <Specification/>
        <Divider />
        <Highlights />
        <Divider />
        <Pricing />
        <Divider />
        <FAQ />
        <Divider />
        <Footer />
      </Box>
    </ThemeProvider>
  );
}
