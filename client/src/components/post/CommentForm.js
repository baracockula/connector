import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import TextAreaFieldGroup from '../common/TextAreaFieldGroup'
import { addComment } from '../../actions/postActions'
import { getCurrentProfile } from "../../actions/profileActions"


class CommentForm extends Component {

  constructor() {
    super()
    this.state = {
      text: "",
      errors: {}
    }
  }


  componentDidMount() {
    this.props.getCurrentProfile()
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors })
    }
  }


  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }


  onSubmit = e => {
    e.preventDefault()

    const { profile, id } = this.props

    const postData = {
      text: this.state.text,
      handle: profile.profile ? profile.profile.handle : null
    }

    this.props.addComment(id, postData)
    this.setState({ text: "" })
  }

  render() {
    const { errors } = this.state

    return (
      <div className="post-form mb-3">
        <div className="card card-info">
          <div className="card-header bg-info text-white">
            Make a comment...
          </div>
          <div className="card-body">
            <form onSubmit={this.onSubmit}>
              <div className="form-group">
                <TextAreaFieldGroup
                  placeholder="Reply to post"
                  name="text"
                  value={this.state.text}
                  onChange={this.onChange}
                  error={errors.text}
                />
                <button type="submit" className="btn btn-dark">Submit</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }
}


CommentForm.propTypes = {
  addComment: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  profile: PropTypes.object
}


const mapStateToProps = state => ({
  errors: state.errors,
  profile: state.profile
})


export default connect(mapStateToProps, { addComment, getCurrentProfile })(CommentForm)

