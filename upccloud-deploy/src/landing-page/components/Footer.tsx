import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import MenuItem from '@mui/material/MenuItem';

// @ts-ignore
import logo from '../../images/upccloud_logo.png';
//@ts-ignore
import logoName from '../../images/upccloud_name.png';
//@ts-ignore
import terms from '../../images/terms-conditions.jpg';
//@ts-ignore
import careers from '../../images/careers.gif';
//@ts-ignore
import press from '../../images/press.gif';
//@ts-ignore
import privacy from '../../images/privacy.gif';


function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" mt={1}>
      {'Copyright © '}
      <Link href="/">UPC Cloud&nbsp;</Link>
      {new Date().getFullYear()}
    </Typography>
  );
}

function handleTerms() {
  window.open(terms);
}

function handlePrivacy() {
  window.open(privacy);
}

function handleCareers() {
  window.open(careers);
}

function handlePress() {
  window.open(press);
}

function handleAbout() {
  //@ts-ignore
  window.location = '/about-us';
}

export default function Footer() {

  const scrollToSection = (sectionId: string) => {
    const sectionElement = document.getElementById(sectionId);
    const offset = 128;
    if (sectionElement) {
      const targetScroll = sectionElement.offsetTop - offset;
      sectionElement.scrollIntoView({ behavior: 'smooth' });
      window.scrollTo({
        top: targetScroll,
        behavior: 'smooth',
      });
    }
  };

  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: { xs: 4, sm: 8 },
        py: { xs: 8, sm: 10 },
        textAlign: { sm: 'center', md: 'left' },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          width: '100%',
          justifyContent: 'space-between',
        }}
      >
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <Typography variant="body2" fontWeight={600}>
            Product
          </Typography>
          <MenuItem
            onClick={() => scrollToSection('features')}
            sx={{ py: '0px', px: '0px' }}
          >
            <Typography variant="body2" color="text.secondary">
              Features
            </Typography>
          </MenuItem>
          <MenuItem
            onClick={() => scrollToSection('specification')}
            sx={{ py: '0px', px: '0px' }}
          >
            <Typography variant="body2" color="text.secondary">
              Specification
            </Typography>
          </MenuItem>
          <MenuItem
            onClick={() => scrollToSection('highlights')}
            sx={{ py: '0px', px: '0px' }}
          >
            <Typography variant="body2" color="text.secondary">
              Highlights
            </Typography>
          </MenuItem>
          <MenuItem
            onClick={() => scrollToSection('pricing')}
            sx={{ py: '0px', px: '0px' }}
          >
            <Typography variant="body2" color="text.secondary">
              Pricing
            </Typography>
          </MenuItem>
          <MenuItem
            onClick={() => scrollToSection('faq')}
            sx={{ py: '0px', px: '0px' }}
          >
            <Typography variant="body2" color="text.secondary">
              FAQs
            </Typography>
          </MenuItem>
        </Box>
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <Typography variant="body2" fontWeight={600}>
            Company
          </Typography>
          <Link style={{cursor:'pointer'}} color="text.secondary" onClick={handleAbout}>
            About us
          </Link>
          <Link style={{cursor:'pointer'}} color="text.secondary" onClick={handleCareers}>
            Careers
          </Link>
          <Link style={{cursor:'pointer'}} color="text.secondary" onClick={handlePress}>
            Press
          </Link>
        </Box>
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <Typography variant="body2" fontWeight={600}>
            Legal
          </Typography>
          <Link style={{cursor:'pointer'}} color="text.secondary" onClick={handleTerms}>
            Terms
          </Link>
          <Link style={{cursor:'pointer'}} color="text.secondary" onClick={handlePrivacy}>
            Privacy
          </Link>
          <Link style={{cursor:'pointer'}} color="text.secondary" onClick={handleAbout}>
            Contact
          </Link>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          pt: { xs: 4, sm: 8 },
          width: '100%',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <div>
          <Link style={{cursor:'pointer'}} color="text.secondary" onClick={handlePrivacy}>
            Privacy Policy
          </Link>
          <Typography display="inline" sx={{ mx: 0.5, opacity: 0.5 }}>
            &nbsp;•&nbsp;
          </Typography>
          <Link style={{cursor:'pointer'}} color="text.secondary" onClick={handleTerms}>
            Terms of Service
          </Link>
          <Copyright />
        </div>
        <Stack
          direction="column"
          justifyContent="left"
          spacing={1}
          useFlexGap
          sx={{
            color: 'text.secondary',
          }}
        >

          <img src={logo} width={'80px'} alt='logo'/>
          <img src={logoName} width={'80px'} alt='name'/>
        </Stack>
      </Box>
    </Container>
  );
}
