import React from 'react';
import Navbar from './shared/UIElements/Navbar';
import Auth from './users/pages/Auth';
import Feed from './posts/pages/Feed';
import Dashboard from './users/pages/Dashboard';
import { AuthContext } from './shared/context/auth-context';
import { useAuth } from './shared/hooks/auth-hook';
import { BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom';
import './posts/components/css/AddPost.css';
import './App.css';

const App = () => {
  const { token, login, logout, user } = useAuth();

  let routes;

  routes =
  (!token)
  ? (
    <Switch>
      <Route path="/auth" exact>
        <Auth />
      </Route>
      <Redirect to="/auth" />
    </Switch>
  )
  : (
    <Switch>
    <Route path="/" exact>
      <Feed />
    </Route>
    <Route path="/posts/:userId" exact>
      <Dashboard />
    </Route>
    <Redirect to="/" />
  </Switch>
  );

  return (
    <AuthContext.Provider 
    value={{
      isLoggedIn: !!token,
      token: token,
      user: user, 
      login: login, 
      logout: logout}}>
      <Router>
        <Navbar />
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
