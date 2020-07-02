import axios from 'axios'

let authToken = "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhZGRyZXNzIjpudWxsLCJyb2xlIjpbeyJyb2xlX3R5cGVfaWQiOjEwLCJjcmVhdGVkX3RpbWUiOiIyMDE3LTEwLTA0VDA3OjQ0OjI0LjI4NDUxIiwibW9kaWZpZWRfdGltZSI6IjIwMTctMTAtMDRUMDc6NDQ6MjQuMjg0NTEiLCJ1c2VyX2lkIjoxLCJyb2xlX2Rlc2MiOiJHdWVzdCIsImlkIjoxLCJyb2xlX2FjdGl2ZSI6MX1dLCJwcm9maWxlIjpudWxsLCJjdXN0b20iOm51bGwsImV4dF9wcm92aWRlcl9pZCI6bnVsbCwidXVpZCI6IkhTR18xIiwidG9rZW4iOm51bGwsInVzZXJfYWN0aXZlIjoxLCJwaG9uZSI6bnVsbCwib3JnYW5pemF0aW9uIjpudWxsLCJpZCI6MSwiaWF0IjoxNTA3MTE1ODg1LCJlbWFpbCI6bnVsbCwidXNlcm5hbWUiOiJndWVzdHVzZXJAaHNnLmNvbSIsInN0YXR1cyI6MjAwfQ==.P1iOu3IgTvv5WvinQ7yEIZCQC2bg58QF8RJAq82T_aU="
let url = "http://35.154.246.223/api/v2/candidate/assignment/community/search"

async function fetchData(roleTypeId, itemPerPage, offset, changeUser = false) {
    return axios(url, {
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
            // console.log(data)
        let obj = {
            users: users,
            stats: stats,
            count: count,
            roleType: roleType,
            totalPage: totPage
        }
        if (changeUser) {
            obj.currentPage = 1
        }
        return obj;

    }).catch(err => console.log(err.message));
}

export async function fetchAllData(roleTypeId, count) {
    return axios(url, {
        method: 'GET',
        headers: {
            "authorization": authToken,
            "Content-Type": "application/json",
            "x-select": `{ "inRoleTypeId": ${roleTypeId},"inLimit":${count} }`
        }
    }).then(res => {
        // console.log(res.data.results[0]);
        let data = res.data.results[0]
        let users = JSON.parse(data.users)
            // console.log(users)
        let csvData = []
        let csvHeader = [
            { label: "Admission No.", key: "admissionNumber" },
            { label: "Name", key: "name" },
            { label: "HSG Id", key: "hsgId" },
            { label: "Risk Status", key: "riskStatus" },
            { label: "User Id", key: "userId" },
            { label: "Role", key: "userRole" },

        ]

        if (roleTypeId === 9) {
            csvHeader.push({ label: "Class", key: "userClass" })
            csvHeader.push({ label: "Section", key: "section" })
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
        let obj = {
                csvData: csvData,
                csvHeader: csvHeader
            }
            // console.log(obj)
        return obj;
        // console.log(this.csvRef.current.data);
    }).catch(err => console.log(err.message));
}

export default fetchData