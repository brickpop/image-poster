import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import { upload } from '../lib/api';
import { loadAlbums } from '../lib/actions';
import { withRouter } from 'react-router-dom';
import Header from '../widgets/header.jsx';

@withRouter
@connect(({ app, albums }) => ({ app, albums }))
class Upload extends Component {
	static propTypes = {
		app: PropTypes.object.isRequired,
		// user: PropTypes.object.isRequired,
		albums: PropTypes.array.isRequired,
		match: PropTypes.object.isRequired,
		history: PropTypes.object.isRequired,
		dispatch: PropTypes.func.isRequired
	}

	state = {
		files: [],
		loading: false
	}

	onDrop(files) {
		this.setState({ files });
		setTimeout(() => this.textInput.focus(), 200)
	}

	onUpload(album) {
		if (!this.state.files.length) return alert("Please, select files to upload");

		const name = album && album.name || this.state.name;
		if (!name) return alert("Please, type a name for the album");

		this.setState({ loading: true });

		upload({ name, files: this.state.files })
			.then(id => {
				this.setState({ loading: false });
				if (id) {
					this.props.history.push(`/albums/${id}`);
					this.props.dispatch(loadAlbums())
				}
			})
			.catch(err => {
				this.setState({ loading: false });
				alert(err && err.message || err || "Unable to complete the request");
			})
	}

	renderHeader(album) {
		if (album && album._id) {
			return <Header title={album.name} leftLink={`/albums/${album._id}`} />
		}
		else {
			return <Header />;
		}
	}

	render() {
		var data = this.props.albums.filter(album => album._id == this.props.match.params.slug);
		const album = data[0];

		return (
			<div id="upload" className="container text-center">
				{this.renderHeader(album)}
				<div className="row">
					<div className="col-md-12">
						<div className="dropzone">
							<Dropzone accept="image/jpeg, image/png" onDrop={files => this.onDrop(files)}>
								<p><br /><br />Tap here or drop your images to continue.</p>
							</Dropzone>
						</div>
					</div>
				</div>
				<div className="row">
					{this.state.files.map((img, i) => (
						<div key={i} className="col-lg-3 col-md-4 col-sm-6 col-xs-12">
							<img className="preview" src={img.preview} />
						</div>
					))}
				</div>
				<div className="row">
					{this.state.loading ?
						<span>Loading...</span>
						: (
							this.state.files.length ? <div id="send-controls" className="col-md-12">
								{!album && <input type="text" onChange={ev => this.setState({ name: ev.target.value })} ref={input => { this.textInput = input }} placeholder="Type an album name" className="text-center" />}
								<br />
								<div onClick={() => this.onUpload(album)} className="btn btn-default btn-lg">Post images</div>
							</div> : null
						)
					}
				</div>
			</div>
		);
	}
}

export default Upload;
