import React, { Component } from 'react'
import '../statics/css/main.css'
import { CSVLink } from 'react-csv'
import UsersList from './UsersList'
import fetchData, { fetchAllData } from '../helper/fetchData'


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

        fetchData(roleTypeId, itemPerPage, offset).then(res => {
            this.setState({
                users: res.users,
                stats: res.stats,
                count: res.count,
                totalPage: res.totalPage,
                roleType: res.roleType
            })
        }).catch(err => console.log(err.message));
    }

    changeUserType = (event) => {
        // alert(JSON.stringify(process.env.REACT_APP_AUTH_TOKEN))
        let offset = 0
        // let currPage = 2
        let itemPerPage = 15
        offset = ((itemPerPage * 1) - itemPerPage)
        let roleTypeId = parseInt(event.target.value)

        fetchData(roleTypeId, itemPerPage, offset, true).then(res => {
            this.setState({
                roleTypeId: roleTypeId,
                users: res.users,
                stats: res.stats,
                count: res.count,
                totalPage: res.totalPage,
                roleType: res.roleType,
                currentPage: res.currentPage
            })
        }).catch(err => console.log(err.message));

    }

    //Logic for exporting CSV data of all users
    exportToCSV = (event) => {
        fetchAllData(this.state.roleTypeId, this.state.count).then(res => {
            this.setState({
                csvData: res.csvData,
                csvHeader: res.csvHeader
            })

            //After setting the data to CSVLink we are simulating the click event
            this.csvRef.current.link.click()
        }).catch(err => console.log(err.message));
    }


    componentDidUpdate(prevProps, prevState) {
        if (this.state.currentPage !== prevState.currentPage) {
            let offset = 0
            // let currPage = 1
            let itemPerPage = 15
            offset = ((itemPerPage * this.state.currentPage) - itemPerPage)

            //API call
            fetchData(this.state.roleTypeId, itemPerPage, offset).then(res => {
                this.setState({ users: res.users, stats: res.stats, count: res.count, roleType: res.roleType, totalPage: res.totalPage })
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
