import * as React from 'react';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';

//@ts-ignore
import nginxLogo from '../../images/nginx_logo.png';
//@ts-ignore
import frontLogo from '../../images/react_logo.png';
//@ts-ignore
import backLogo from '../../images/back_logo.png';
//@ts-ignore
import dockLogo from '../../images/dock_logo.png';
//@ts-ignore
import ipfsLogo from '../../images/ipfs_logo.png';
//@ts-ignore
import kubeLogo from '../../images/kube_logo.png';
//@ts-ignore
import blockLogo from '../../images/block_logo.png';

const items = [
    {
      icon: nginxLogo,
      title: 'Nginx',
      description:
        "We use the light-wighted and high-performance Nginx as our primary web server. " +
        "Nginx lets us serve the corresponding content to our customers and thanks to it's low resource usage, " +
        "we are able to attend thousands of simulatenous users working on their account."
    },
    {
      icon: frontLogo,
      title: 'React.js',
      description:
        "Using React as our main programming language to implement the front-end, " +
        "we are able to provide a comfortable and cozy full customizable visual interface to maximize the productivity of our clients."
    },
    {
      icon: backLogo,
      title: 'MongoDB & Node.js',
      description:
        "We use MongoDB to implement our non-SQL database, in which we store all the necessary data to maintain the user accounts and its files." +
        "The implementation responible of manage this database is done with the powerful Node.js, "+
        "wich makes the database highly scalable and minimized the wait time thanks to the asynchonous calls that implemets.",
    },
    {
      icon: dockLogo,
      title: 'Docker',
      description:
        "The storage in our disk system is managed by Docker, which lets us fully automatize the configuration needed to function with IPFS.",
    },
    {
      icon: ipfsLogo,
      title: 'Inter Planetary File System',
      description:
        "With IPFS we are capable of having a fully secure and distributed storage system, making our storage system more resilient and redundant.",
    },
    {
      icon: kubeLogo,
      title: 'Kubernetes',
      description:
        "Thanks to Kubernetes, our storage system is fully automatized, and can create a new storage IPFS node when the system space is running low" +
        "or it is able to duplicate an existent one to provide better security against crashes through an awesome redundancy.",
    },
    {
      icon: blockLogo,
      title: 'Blockchain',
      description:
          "The implementation of a Blockchain in our system allows the users to see the popularity of their shared files, " +
          "how many times it was downloaded and is completelly immutable thanks to the way this technology works.",
    },  
  ];


const logoStyle = {
  width: '64px',
  opacity: 0.7,
};

export default function Specification() {

  return (
    <Container
    id="specification"
    sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: { xs: 3, sm: 6 },
    }}
    >
    <Box
        sx={{
        width: { sm: '100%', md: '60%' },
        textAlign: { sm: 'left', md: 'center' },
        }}
    >
        <Typography component="h2" variant="h4" color="text.primary">
        Specification
        </Typography>
        <Typography variant="body1" color="text.secondary">
        Discover the internal architecture of our system and understand how the different technologies implemented comunicates with each other.
        </Typography>
    </Box>

    <div style={{display:'flex'}}>
        <Box
            sx={{
            m: 'auto',
            alignSelf: 'center',
            width: 800,
            height: 600,
            margin: '10px',
            backgroundSize: 'contain',
            backgroundImage: 'url("/img/schem.png")',
            backgroundRepeat: 'no-repeat',
            border: '1px solid',
            borderRadius: '10px',
            borderColor: 'divider',
            boxShadow: (theme) =>
                theme.palette.mode === 'light'
                ? `0 0 1px rgba(85, 166, 246, 0.1), 1px 1.5px 2px -1px rgba(85, 166, 246, 0.15), 4px 4px 12px -2.5px rgba(85, 166, 246, 0.15)`
                : '0 0 1px rgba(2, 31, 59, 0.7), 1px 1.5px 2px -1px rgba(2, 31, 59, 0.65), 4px 4px 12px -2.5px rgba(2, 31, 59, 0.65)',
            }}
        />

        <Stack
            margin='25px'
            direction="column"
            justifyContent="center"
            alignItems="flex-start"
            spacing={2}
            useFlexGap
            sx={{ width: '100%', display: { xs: 'none', sm: 'flex' } }}
            >
            {items.map(({ icon, title, description }, index) => (
              <Card
                key={index}
                variant="outlined"
                sx={{
                  p: 3,
                  height: 'fit-content',
                  width: '100%',
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
                    textAlign: 'left',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: { md: 'center' },
                    gap: 2.5,
                  }}
                >
                  <Box
                    sx={{
                      color: 'primary.main'
                    }}
                  >
                    <img src={icon} style={logoStyle} alt='logo'/>
                  </Box>
                  <Box sx={{ textTransform: 'none' }}>
                    <Typography
                      color="text.primary"
                      variant="body2"
                      fontWeight="bold"
                    >
                      {title}
                    </Typography>
                    <Typography
                      color="text.secondary"
                      variant="body2"
                      sx={{ my: 0.5 }}
                    >
                      {description}
                    </Typography>

                  </Box>
                </Box>
              </Card>
            ))}
          </Stack>
        
    </div>
    </Container>
  );
}
