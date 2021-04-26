import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
} from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import { auth } from '../modules/module.auth/controllers/auth.controller';

const isActive = (history, path) => {
  if (history.location.pathname == path) return { color: '#ffa726' };
  else return { color: '#ffffff' };
};

export const NavigationMenu = withRouter(({ history }) => (
  <AppBar position="static">
    <Toolbar>
      <Typography variant="h6" color="inherit">
        ЛІКАР+
      </Typography>
      <Link to="/">
        <IconButton aria-label="Home" style={isActive(history, '/')}>
          <HomeIcon />
        </IconButton>
      </Link>
      {!auth.isAuthenticated() && (
        <span>
          <Link to="/signup">
            <Button style={isActive(history, '/signup')}>Реэстрація</Button>
          </Link>
          <Link to="/signin">
            <Button style={isActive(history, '/signin')}>Вхід</Button>
          </Link>
        </span>
      )}
      {auth.isAuthenticated() && (
        <span>
          <Link to={'/user/' + auth.isAuthenticated().user._id}>
            <Button
              style={isActive(
                history,
                '/user/' + auth.isAuthenticated().user._id
              )}
            >
              Мій профіль
            </Button>
          </Link>
          <Button
            color="inherit"
            onClick={() => {
              auth.clearJWT(() => history.push('/'));
            }}
          >
            Вихід
          </Button>
        </span>
      )}
    </Toolbar>
  </AppBar>
));
