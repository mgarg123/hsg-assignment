import React, { Component } from 'react'
import '../statics/css/main.css'
import axios from 'axios'
import { CSVLink } from 'react-csv'
import UsersList from './UsersList'


export class Main extends Component {
    constructor(props) {
        super(props)

        this.state = {
            users: [],
            stats: [],
            count: 0,
            roleType: "Student",
            currentPage: 1,
            totalPage: 1,
            roleTypeId: 9,
            csvData: [],
            csvHeader: []
        }
        this.csvRef = React.createRef()
    }
    componentDidMount() {
        let roleTypeId = 9
        let offset = 0
        // let currPage = 2
        let itemPerPage = 15
        offset = ((itemPerPage * this.state.currentPage) - itemPerPage)
        let authToken = "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhZGRyZXNzIjpudWxsLCJyb2xlIjpbeyJyb2xlX3R5cGVfaWQiOjEwLCJjcmVhdGVkX3RpbWUiOiIyMDE3LTEwLTA0VDA3OjQ0OjI0LjI4NDUxIiwibW9kaWZpZWRfdGltZSI6IjIwMTctMTAtMDRUMDc6NDQ6MjQuMjg0NTEiLCJ1c2VyX2lkIjoxLCJyb2xlX2Rlc2MiOiJHdWVzdCIsImlkIjoxLCJyb2xlX2FjdGl2ZSI6MX1dLCJwcm9maWxlIjpudWxsLCJjdXN0b20iOm51bGwsImV4dF9wcm92aWRlcl9pZCI6bnVsbCwidXVpZCI6IkhTR18xIiwidG9rZW4iOm51bGwsInVzZXJfYWN0aXZlIjoxLCJwaG9uZSI6bnVsbCwib3JnYW5pemF0aW9uIjpudWxsLCJpZCI6MSwiaWF0IjoxNTA3MTE1ODg1LCJlbWFpbCI6bnVsbCwidXNlcm5hbWUiOiJndWVzdHVzZXJAaHNnLmNvbSIsInN0YXR1cyI6MjAwfQ==.P1iOu3IgTvv5WvinQ7yEIZCQC2bg58QF8RJAq82T_aU="
        let url = "http://35.154.246.223/api/v2/candidate/assignment/community/search"
        axios(url, {
            method: 'GET',
            headers: {
                "authorization": authToken,
                "Content-Type": "application/json",
                "x-select": `{ "inRoleTypeId": ${roleTypeId}, "inLimit": ${itemPerPage}, "inOffset": ${offset} }`
            }
        }).then(res => {
            // console.log(res.data.results[0]);
            let data = res.data.results[0]
            let count = data.count
            let stats = JSON.parse(data.stats)
            let users = JSON.parse(data.users)
            let totPage = Math.ceil(count / itemPerPage)
            this.setState({ users: users, stats: stats, count: count, totalPage: totPage })

        }).catch(err => console.log(err.message));
    }

    changeUserType = (event) => {
        // alert(JSON.stringify(process.env.REACT_APP_AUTH_TOKEN))
        let offset = 0
        // let currPage = 2
        let itemPerPage = 15
        offset = ((itemPerPage * 1) - itemPerPage)
        let roleTypeId = parseInt(event.target.value)
        let authToken = "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhZGRyZXNzIjpudWxsLCJyb2xlIjpbeyJyb2xlX3R5cGVfaWQiOjEwLCJjcmVhdGVkX3RpbWUiOiIyMDE3LTEwLTA0VDA3OjQ0OjI0LjI4NDUxIiwibW9kaWZpZWRfdGltZSI6IjIwMTctMTAtMDRUMDc6NDQ6MjQuMjg0NTEiLCJ1c2VyX2lkIjoxLCJyb2xlX2Rlc2MiOiJHdWVzdCIsImlkIjoxLCJyb2xlX2FjdGl2ZSI6MX1dLCJwcm9maWxlIjpudWxsLCJjdXN0b20iOm51bGwsImV4dF9wcm92aWRlcl9pZCI6bnVsbCwidXVpZCI6IkhTR18xIiwidG9rZW4iOm51bGwsInVzZXJfYWN0aXZlIjoxLCJwaG9uZSI6bnVsbCwib3JnYW5pemF0aW9uIjpudWxsLCJpZCI6MSwiaWF0IjoxNTA3MTE1ODg1LCJlbWFpbCI6bnVsbCwidXNlcm5hbWUiOiJndWVzdHVzZXJAaHNnLmNvbSIsInN0YXR1cyI6MjAwfQ==.P1iOu3IgTvv5WvinQ7yEIZCQC2bg58QF8RJAq82T_aU="
        let url = "http://35.154.246.223/api/v2/candidate/assignment/community/search"
        axios(url, {
            method: 'GET',
            headers: {
                "authorization": authToken,
                "Content-Type": "application/json",
                "x-select": `{ "inRoleTypeId": ${roleTypeId}, "inLimit": ${itemPerPage}, "inOffset": ${offset} }`
            }
        }).then(res => {
            // console.log(res.data.results[0]);
            let data = res.data.results[0]
            let count = data.count
            let stats = JSON.parse(data.stats)
            let users = JSON.parse(data.users)
            let roleType = roleTypeId === 9 ? "Student" : "Staff"
            let totPage = Math.ceil(count / itemPerPage)
            this.setState({
                roleTypeId: roleTypeId,
                users: users,
                stats: stats,
                count: count,
                roleType: roleType,
                totalPage: totPage,
                currentPage: 1
            })
        }).catch(err => console.log(err.message));

    }

    //Logic for exporting CSV data of all users
    exportToCSV = (event) => {
        let authToken = "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhZGRyZXNzIjpudWxsLCJyb2xlIjpbeyJyb2xlX3R5cGVfaWQiOjEwLCJjcmVhdGVkX3RpbWUiOiIyMDE3LTEwLTA0VDA3OjQ0OjI0LjI4NDUxIiwibW9kaWZpZWRfdGltZSI6IjIwMTctMTAtMDRUMDc6NDQ6MjQuMjg0NTEiLCJ1c2VyX2lkIjoxLCJyb2xlX2Rlc2MiOiJHdWVzdCIsImlkIjoxLCJyb2xlX2FjdGl2ZSI6MX1dLCJwcm9maWxlIjpudWxsLCJjdXN0b20iOm51bGwsImV4dF9wcm92aWRlcl9pZCI6bnVsbCwidXVpZCI6IkhTR18xIiwidG9rZW4iOm51bGwsInVzZXJfYWN0aXZlIjoxLCJwaG9uZSI6bnVsbCwib3JnYW5pemF0aW9uIjpudWxsLCJpZCI6MSwiaWF0IjoxNTA3MTE1ODg1LCJlbWFpbCI6bnVsbCwidXNlcm5hbWUiOiJndWVzdHVzZXJAaHNnLmNvbSIsInN0YXR1cyI6MjAwfQ==.P1iOu3IgTvv5WvinQ7yEIZCQC2bg58QF8RJAq82T_aU="
        let url = "http://35.154.246.223/api/v2/candidate/assignment/community/search"
        axios(url, {
            method: 'GET',
            headers: {
                "authorization": authToken,
                "Content-Type": "application/json",
                "x-select": `{ "inRoleTypeId": ${this.state.roleTypeId},"inLimit":${this.state.count} }`
            }
        }).then(res => {
            // console.log(res.data.results[0]);
            let data = res.data.results[0]
            let users = JSON.parse(data.users)
            // console.log(users)
            let csvData = []
            let csvHeader = []

            if (this.state.roleTypeId === 9) {
                csvHeader = [
                    { label: "Admission No.", key: "admissionNumber" },
                    { label: "Name", key: "name" },
                    { label: "HSG Id", key: "hsgId" },
                    { label: "Risk Status", key: "riskStatus" },
                    { label: "Class", key: "userClass" },
                    { label: "Section", key: "section" },
                    { label: "User Id", key: "userId" },
                    { label: "Role", key: "userRole" },

                ]
                for (let i in users) {
                    let obj = {
                        admissionNumber: users[i].admissionNumber,
                        name: users[i].name,
                        hsgId: users[i].hsgId,
                        riskStatus: users[i].riskStatus,
                        userClass: users[i].userClass,
                        section: users[i].section,
                        userId: users[i].userId,
                        userRole: users[i].userRole
                    }
                    csvData.push(obj)
                }
            } else {
                csvHeader = [
                    { label: "Admission No.", key: "admissionNumber" },
                    { label: "Name", key: "name" },
                    { label: "HSG Id", key: "hsgId" },
                    { label: "Risk Status", key: "riskStatus" },
                    { label: "User Id", key: "userId" },
                    { label: "Role", key: "userRole" },

                ]
                for (let i in users) {
                    let obj = {
                        admissionNumber: users[i].admissionNumber,
                        name: users[i].name,
                        hsgId: users[i].hsgId,
                        riskStatus: users[i].riskStatus,
                        userId: users[i].userId,
                        userRole: users[i].userRole
                    }
                    csvData.push(obj)
                }
            }
            this.setState({ csvData: csvData, csvHeader: csvHeader })

            //After setting the data to CSVLink we are simulating the click event
            this.csvRef.current.link.click()


            // console.log(this.csvRef.current.data);
        }).catch(err => console.log(err.message));
    }


    componentDidUpdate(prevProps, prevState) {
        if (this.state.currentPage !== prevState.currentPage) {
            let offset = 0
            // let currPage = 1
            let itemPerPage = 15
            offset = ((itemPerPage * this.state.currentPage) - itemPerPage)
            let authToken = "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhZGRyZXNzIjpudWxsLCJyb2xlIjpbeyJyb2xlX3R5cGVfaWQiOjEwLCJjcmVhdGVkX3RpbWUiOiIyMDE3LTEwLTA0VDA3OjQ0OjI0LjI4NDUxIiwibW9kaWZpZWRfdGltZSI6IjIwMTctMTAtMDRUMDc6NDQ6MjQuMjg0NTEiLCJ1c2VyX2lkIjoxLCJyb2xlX2Rlc2MiOiJHdWVzdCIsImlkIjoxLCJyb2xlX2FjdGl2ZSI6MX1dLCJwcm9maWxlIjpudWxsLCJjdXN0b20iOm51bGwsImV4dF9wcm92aWRlcl9pZCI6bnVsbCwidXVpZCI6IkhTR18xIiwidG9rZW4iOm51bGwsInVzZXJfYWN0aXZlIjoxLCJwaG9uZSI6bnVsbCwib3JnYW5pemF0aW9uIjpudWxsLCJpZCI6MSwiaWF0IjoxNTA3MTE1ODg1LCJlbWFpbCI6bnVsbCwidXNlcm5hbWUiOiJndWVzdHVzZXJAaHNnLmNvbSIsInN0YXR1cyI6MjAwfQ==.P1iOu3IgTvv5WvinQ7yEIZCQC2bg58QF8RJAq82T_aU="
            let url = "http://35.154.246.223/api/v2/candidate/assignment/community/search"
            axios(url, {
                method: 'GET',
                headers: {
                    "authorization": authToken,
                    "Content-Type": "application/json",
                    "x-select": `{ "inRoleTypeId": ${this.state.roleTypeId}, "inLimit": ${itemPerPage}, "inOffset": ${offset} }`
                }
            }).then(res => {
                // console.log(res.data.results[0]);
                let data = res.data.results[0]
                let count = data.count
                let stats = JSON.parse(data.stats)
                let users = JSON.parse(data.users)
                let roleType = this.state.roleTypeId === 9 ? "Student" : "Staff"
                let totPage = Math.ceil(count / itemPerPage)
                this.setState({ users: users, stats: stats, count: count, roleType: roleType, totalPage: totPage })
            }).catch(err => console.log(err.message));
        }
    }

    render() {
        let pageList = []
        for (let i = 1; i <= this.state.totalPage; i++) {
            pageList.push(i)
        }
        return (
            <div>
                {/* <span >Summary</span> */}
                <div className="summary-holder">
                    <h2>Total users: {this.state.count}</h2>
                </div>
                <div className="switch">
                    <label htmlFor="students">Students</label>
                    <input type="radio" name="userType" id="students" defaultChecked value={9} onChange={this.changeUserType} />
                    <label htmlFor="staff">Non Teaching Staff</label>
                    <input type="radio" name="userType" id="staff" value={20} onChange={this.changeUserType} />
                </div>
                <div className="user-lists">
                    <UsersList users={this.state.users} roleType={this.state.roleType} />
                </div>
                <div className="pagination">
                    <div className="left">
                        <p>Page {this.state.currentPage} of {this.state.totalPage}</p>
                    </div>
                    <div className="right">
                        <ul>
                            <li className={`prev ${this.state.currentPage === 1 && 'disabled'}`} onClick={() => this.setState(prevState => {
                                return ({ currentPage: prevState.currentPage - 1 })
                            })}>Prev</li>
                            {
                                pageList.map(index => {
                                    return (
                                        <li className={this.state.currentPage === index ? "active" : ""}
                                            onClick={() => this.setState({ currentPage: index })}
                                            key={index}
                                        >{index}</li>
                                    )
                                })
                            }
                            <li className={`next ${this.state.currentPage === this.state.totalPage ? "disabled" : ""}`} onClick={() => this.setState(prevState => {
                                return ({ currentPage: prevState.currentPage + 1 })
                            })}>Next</li>

                        </ul>
                    </div>
                </div>
                <div className="download-csv">
                    <button onClick={this.exportToCSV}>Export CSV</button>
                </div>
                <CSVLink
                    ref={this.csvRef}
                    headers={this.state.csvHeader}
                    data={this.state.csvData}
                    filename={`${this.state.roleTypeId === 9 ? "students" : "staffs"}-list.csv`}>
                </CSVLink>
            </div>
        )
    }
}

export default Main
