import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { dateToString } from '../../../lib/util';
// import Media from 'react-media';
import Columns from 'react-columns';

const columnQueries = [{
  columns: 2,
  query: 'min-width: 600px'
}, {
  columns: 3,
  query: 'min-width: 1000px'
}];

@connect(({ app, albums }) => ({ app, albums }))
class Albums extends Component {
	static propTypes = {
		app: PropTypes.object.isRequired,
		// user: PropTypes.object.isRequired,
		albums: PropTypes.array.isRequired,
		dispatch: PropTypes.func.isRequired
	}

	render() {
		return (
			<div id="albums" className="container text-center">
				<h3>Albums</h3>
				<div className="row">
					<div className="col-xs-12">

						<Columns columns={3} queries={columnQueries} rootStyles={{}}>
							{this.props.albums.map(album => (
								<div className="img-container" key={album._id}>
									<img src={`/media/${album.pictures[0].fileName}`} alt={album.name} />
									<p className="album-name">
										{album.name}
									</p>
									{album.created ? <p className="album-created">{dateToString(album.created)}</p> : ''}
								</div>
							))}
						</Columns>

						{/*{ this.props.albums.map((album, i) => ( <AlbumEntry key={i} album={album} /> )) }*/}
					</div>
				</div>
			</div>
		);
	}
}

export default Albums;
