import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
// import Media from 'react-media';
import Columns from 'react-columns';

import NotFound from './NotFound.jsx';
import Header from '../widgets/header.jsx';

const columnQueries = [{
  columns: 2,
  query: 'min-width: 600px'
}, {
  columns: 3,
  query: 'min-width: 1000px'
}];

@withRouter
@connect(({ app, albums }) => ({ app, albums }))
class Album extends Component {
	static propTypes = {
		app: PropTypes.object.isRequired,
		// user: PropTypes.object.isRequired,
		match: PropTypes.object.isRequired,
		albums: PropTypes.array.isRequired,
		dispatch: PropTypes.func.isRequired
	}

	render() {
		var data = this.props.albums.filter(album => album._id == this.props.match.params.slug);
		if(!data || !data[0]) return <NotFound/>;

		const album = data[0];

		return (
			<div id="album" className="container text-center">
				<Header title={album.name} rightLink={`/albums/${album._id}/upload`}/>
				<div className="row">
					<div className="col-xs-12">

						<Columns columns={3} queries={columnQueries} rootStyles={{}}>
							{album.pictures.map(picture => (
								<div className="img-container" key={picture._id}>
									<a href={`/media/${picture.fileName}`}>
										<img src={`/media/${picture.fileName}`} alt={album.name} />
									</a>
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

export default Album;
