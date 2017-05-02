import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import { upload } from '../lib/api';
import { withRouter } from 'react-router-dom';

@withRouter
@connect(({ app }) => ({ app }))
class Upload extends Component {
	static propTypes = {
		app: PropTypes.object.isRequired,
		user: PropTypes.object.isRequired,
		albums: PropTypes.array.isRequired,
		dispatch: PropTypes.func.isRequired
	}

	state = {
		files: []
	}

	onDrop(files){
		this.setState({files});
		setTimeout(() => this.textInput.focus(), 200)
	}

	onUpload(){
		if(!this.state.files.length) return alert("Please, select files to upload");
		else if(!this.state.name) return alert("Please, type a name for the album");

		upload({name: this.state.name, files: this.state.files})
		.then(id => {
			// if(id) location.href = `/albums/${id}`
		})
		.catch(err => {
			alert(err && err.message || err || "Unable to complete the request");
		})
	}

	render() {
		return (
			<div id="upload" className="container text-center">
				<h3>Upload</h3>
				<div className="row">
					<div className="col-md-12">
						<div className="dropzone">
							<Dropzone accept="image/jpeg, image/png" onDrop={files => this.onDrop(files)}>
								<p><br/><br/>Tap here or drop your images to continue.</p>
							</Dropzone>
						</div>
					</div>
				</div>
				<div className="row">
					{ this.state.files.map((img, i) => (
						<div className="col-lg-3 col-md-4 col-sm-6 col-xs-12">
							<img className="preview" src={img.preview}/>
						</div>
					)) }
				</div>
				<div className="row">
					{ this.state.files.length ? <div id="send-controls" className="col-md-12">
						<input type="text" onChange={ev => this.setState({name: ev.target.value})} ref={input => { this.textInput = input }} placeholder="Type an album name" className="text-center" />
						<br/>
						<div onClick={() => this.onUpload()} className="btn btn-default btn-lg">Post images</div>
					</div> : null }
				</div>
			</div>
		);
	}
}

export default Upload;
