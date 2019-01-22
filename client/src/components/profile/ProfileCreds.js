import React, { Component } from 'react'
import Moment from 'react-moment'


class ProfileCreds extends Component {

  render() {
    const { experience, education } = this.props

    const expItems = experience.map(exp => (

      <li key={exp._id} className="list-group-item">
        {/* company */}
        <h4>
          {exp.company}
        </h4>
        {/* date from/to */}
        <p>
          <Moment format="YYYY/MM/DD">{exp.from}</Moment> -
          {exp.to === null ? (' Now') : (<Moment format="YYYY/MM/DD">{exp.to}</Moment>)}
        </p>
        {/* title */}
        <p>
          <strong>Position:</strong> {exp.title}
        </p>
        {/* location /not required - check first*/}
        <p>
          {exp.location === '' ? null : (<span><strong>Location: </strong> {exp.location}</span>)}
        </p>
        <p>
          {/* description /not required - check first*/}
          {exp.description === '' ? null : (<span><strong>Description: </strong> {exp.description} </span>)}
        </p>
      </li>
    ))

    // map through education
    const eduItems = education.map(edu => (

      <li key={edu._id} className="list-group-item">
        {/* school */}
        <h4>
          {edu.school}
        </h4>
        {/* date from/to */}
        <p>
          <Moment format="YYYY/MM/DD">{edu.from}</Moment> -
          {edu.to === null ? (' Now') : (<Moment format="YYYY/MM/DD">{edu.to}</Moment>)}
        </p>
        {/* degree */}
        <p>
          <strong>Degree:</strong> {edu.degree}
        </p>
        {/* field of study */}
        <p>
          <strong>Field Of Study:</strong> {edu.fieldofstudy}
        </p>
        {/* description */}
        <p>
          {edu.description === '' ? null : (<span><strong>Description: </strong> {edu.description}</span>)}
        </p>
      </li>
    ))

    return (
      <div className="row">
        <div className="col-md-6">
          <h3 className="text-center text-info">Experience</h3>
          {expItems.length > 0 ? (<ul className="list-group">{expItems}</ul>) :
            (<p className="text-center">No Experience Listed</p>)}
        </div>

        <div className="col-md-6">
          <h3 className="text-center text-info">Education</h3>
          {/* first check if there is any education so we dont get error / edu is actually an array*/}
          {eduItems.length > 0 ? (<ul className="list-group">{eduItems}</ul>) :
            (<p className="text-center">No Education Listed</p>)}
        </div>
      </div>
    )
  }
}


export default ProfileCreds
