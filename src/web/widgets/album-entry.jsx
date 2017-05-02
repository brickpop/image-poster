import React, { Component } from 'react';
import PropTypes from 'prop-types';

class AlbumEntry extends Component {
  static propTypes = {
    album: PropTypes.object.isRequired
  }

  render() {
    const pictures = [];

    const style = {
      backgroundImage: `url(/media/${this.props.album.pictures[0].fileName})`,
      // width: 100,
      // height: 100,
      backgroundSize: 'cover',
      backgroundPosition: 0
    };
    return (
      <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12" style={style}>
      </div>
    );
  }
}

export default AlbumEntry;
