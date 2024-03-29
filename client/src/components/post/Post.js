import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Link } from "react-router-dom"
import PropTypes from 'prop-types';
import { getPost } from "../../actions/postActions"
import Spinner from '../common/Spinner';
import PostItem from "../posts/PostItem"
import CommentForm from "./CommentForm"
import CommentFeed from "./CommentFeed"


class Post extends Component {

  componentDidMount() {
    if (this.props.match.params.post_id) {
      this.props.getPost(this.props.match.params.post_id)
    }
  }


  render() {
    const { post, loading } = this.props.post

    let postContent
    if (post === null || loading || Object.keys(post).length === 0) {
      postContent = <Spinner />
    } else {
      postContent = (
        <div>
          <PostItem post={post} showActions={false} />
          <CommentForm id={post._id} />
          <CommentFeed comments={post.comments} postId={post._id} />
        </div>
      )
    }

    return (
      <div className="post">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <Link to="/feed" className="btn btn-light mb-3">Back to Feed</Link>
              {postContent}
            </div>
          </div>
        </div>
      </div>
    )
  }
}


Post.propTypes = {
  getPost: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired
}


const mapStateToProps = state => ({
  post: state.post
})


export default connect(mapStateToProps, { getPost })(Post)

