import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import axios from "axios"

class ProfileGitHub extends Component {
  constructor(props) {
    super(props);
    this.state = {
      repos: []
    };
  }


  componentDidMount() {
    const { username } = this.props
    axios.get(`/api/profile/github/${username}`)
      .then(data => {
        if (this.refs.myRef) {
          console.log(data)
          this.setState({ repos: data.data.repos })
        }
      })
      .catch(err => console.log(err))
  }


  render() {
    const { repos } = this.state

    // map through repos 
    const repoItems = repos.map(repo => (
      <div key={repo.id} className="card card-body mb-2">
        <div className="row">
          <div className="col-md-6">
            <h4>
              <Link to={repo.html_url} className="text-info" target="_blank">{repo.name}</Link>
            </h4>
            <p>{repo.description}</p>
          </div>
          <div className="col-md-6">
            <span className="badge badge-info mr-1">
              Stars: {repo.stargazers_count}
            </span>
            <span className="badge badge-secondary mr-1">
              Watchers: {repo.watchers_count}
            </span>
            <span className="badge badge-success">
              Forks: {repo.forks_count}
            </span>
          </div>
        </div>
      </div>
    ))


    return (
      <div ref="myRef">
        <hr />
        <h3 className="mb-4">Latest Github Repos</h3>
        {repoItems}
      </div>
    )
  }
}


ProfileGitHub.propTypes = {
  username: PropTypes.string.isRequired
}


export default ProfileGitHub
