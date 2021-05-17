import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { NavigationMenu, HomePage } from '.';
import Signin from '../modules/module.auth/views/Signin';
import PrivateRoute from '../modules/module.auth/views/PrivateRoute';
import {
  EditProfile,
  Profile,
  Signup,
  Users,
} from '../modules/module.user/views';

export const MainRouter = () => {
  return (
    <div>
      <NavigationMenu suppressHydrationWarning />
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/users" component={Users} />
        <Route path="/signup" component={Signup} />
        <Route path="/signin" component={Signin} />
        <PrivateRoute path="/user/edit/:userId" component={EditProfile} />
        <Route path="/user/:userId" component={Profile} />
      </Switch>
    </div>
  );
};
