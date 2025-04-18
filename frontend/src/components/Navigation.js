import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';

const Root = styled('div')(({ theme }) => ({
  flexGrow: 1,
  marginBottom: theme.spacing(4),
}));

const Title = styled(Typography)(({ theme }) => ({
  flexGrow: 1,
}));

function Navigation() {
  return (
    <Root>
      <AppBar position="static">
        <Toolbar>
          <Title variant="h6">
            Social Media Analytics
          </Title>
          <Button color="inherit" component={RouterLink} to="/">
            Feed
          </Button>
          <Button color="inherit" component={RouterLink} to="/top-users">
            Top Users
          </Button>
          <Button color="inherit" component={RouterLink} to="/trending">
            Trending Posts
          </Button>
        </Toolbar>
      </AppBar>
    </Root>
  );
}

export default Navigation; 