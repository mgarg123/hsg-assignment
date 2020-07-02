import React, { Component, Fragment } from 'react'

export class UsersList extends Component {
    render() {
        return (
            <div className="table-container">
                <table className="user-data-table">
                    <thead>
                        <tr>
                            <th>Admission No.</th>
                            <th>Name</th>
                            <th>HSG ID</th>
                            <th>Risk Status</th>
                            {
                                this.props.roleType === "Student" &&
                                <Fragment>
                                    <th>Class</th>
                                    <th>Section</th>
                                </Fragment>
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.users.map(user => {
                                return (
                                    <tr key={user.userId}>
                                        <td>{user.admissionNumber}</td>
                                        <td>{user.name}</td>
                                        <td>{user.hsgId}</td>
                                        <td>{user.riskStatus}</td>
                                        {
                                            this.props.roleType === "Student" &&
                                            <Fragment>
                                                <td>{user.userClass.split("-")[0].trim()}</td>
                                                <td>{user.section}</td>
                                            </Fragment>
                                        }
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        )
    }
}

export default UsersList
