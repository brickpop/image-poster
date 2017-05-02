import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, Route, Switch, Redirect } from 'react-router-dom';

import Albums from './views/albums.jsx';
import Album from './views/album.jsx';
import Upload from './views/upload.jsx';
import NotFound from './views/NotFound.jsx';

@withRouter
@connect(({ app, user }) => ({ app, user }))
class App extends React.Component {
  static propTypes = {
    app: PropTypes.object.isRequired,
    // user: PropTypes.object.isRequired,
    albums: PropTypes.array.isRequired,
    children: PropTypes.object,
    params: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired
  }

  state = {
    width: 0
  }

  // componentDidMount() {
  //   this.updateWindowWidth();
  //   window.addEventListener("resize", this.updateWindowWidth.bind(this));
  // }

  // componentWillUnmount() {
  //   window.removeEventListener("resize", this.updateWindowWidth.bind(this));
  // }

  // updateWindowWidth() {
  //   if (typeof document != 'undefined') {
  //     var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
  //     this.setState({ width: w });
  //   }
  // }

  render() {
    return (
      <div id="app">
        <Switch>
          <Route exact path="/" render={() => (
            (this.props.albums && this.props.albums.length) ? (
              <Redirect to="/albums" />
            ) : (
              <Redirect to="/upload" />
            )
          )} />
          <Route path="/albums/:slug/upload" component={Upload} />
          <Route path="/albums/:slug" component={Album} />
          <Route path="/albums" component={Albums} />
          <Route path="/upload" exact component={Upload} />
          <Route component={NotFound} />
        </Switch>
      </div>
    );
  }
}

export default App;
