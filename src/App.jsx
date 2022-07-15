import React, { Component } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Chat from './pages/Chat'
import SetAvatar from './pages/SetAvatar'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path='/setavatar' element={<SetAvatar />} />
        <Route path='/' element={<Chat />} />
      </Routes>
    </BrowserRouter>
  )
}

// class App extends Component {
//   constructor() {
//     super()
//     this.state = {
//       fullName: '',
//       userName: '',
//       email: '',
//       password: '',
//       courseEnrolled: [],
//     }
//     this.changeFullName = this.changeFullName.bind(this)
//     this.changeUsername = this.changeUsername.bind(this)
//     this.changeEmail = this.changeEmail.bind(this)
//     this.changePassword = this.changePassword.bind(this)
//     this.changeCourseEnrolled = this.changeCourseEnrolled.bind(this)
//     this.onSubmit = this.onSubmit.bind(this)
//   }

//   changeFullName(event) {
//     this.setState({
//       fullname: event.target.value,
//     })
//   }

//   changeUsername(event) {
//     this.setState({
//       userName: event.target.value,
//     })
//   }

//   changeEmail(event) {
//     this.setState({
//       email: event.target.value,
//     })
//   }

//   changePassword(event) {
//     this.setState({
//       password: event.target.value,
//     })
//   }

//   changeCourseEnrolled(event) {
//     this.setState({
//       courseEnrolled: event.target.value,
//     })
//   }

//   onSubmit(event) {
//     event.preventDefault()

//     const registered = {
//       fullName: this.state.fullName,
//       userName: this.state.userName,
//       email: this.state.email,
//       password: this.state.password,
//       courseEnrolled: this.state.courseEnrolled,
//     }

//     axios
//       .post('http://localhost:4000/nuscoursechat/signup', registered)
//       .then((response) => console.log(response.data))

//     this.setState({
//       fullName: '',
//       userName: '',
//       email: '',
//       password: '',
//       courseEnrolled: [],
//     })
//   }

//   render() {
//     return (
//       <div>
//         <div className='container'>
//           <div className='form-div'>
//             <form onSubmit={this.onSubmit}>
//               <input
//                 type='text'
//                 placeholder='Full Name'
//                 onChange={this.changeFullName}
//                 value={this.state.fullname}
//                 className='form-control form-group'
//               />

//               <input
//                 type='text'
//                 placeholder='Username'
//                 onChange={this.changeUsername}
//                 value={this.state.userName}
//                 className='form-control form-group'
//               />

//               <input
//                 type='text'
//                 placeholder='E-mail'
//                 onChange={this.changeEmail}
//                 value={this.state.email}
//                 className='form-control form-group'
//               />

//               <input
//                 type='text'
//                 placeholder='Password'
//                 onChange={this.changePassword}
//                 value={this.state.password}
//                 className='form-control form-group'
//               />

//               <input
//                 type='text'
//                 placeholder='Course Enrolled'
//                 onChange={this.changeCourseEnrolled}
//                 value={this.state.courseEnrolled}
//                 className='form-control form-group'
//               />

//               <input
//                 type='submit'
//                 className='btn btn-danger btn-block'
//                 value='Submit'
//               />
//             </form>
//           </div>
//         </div>
//       </div>
//     )
//   }
// }
