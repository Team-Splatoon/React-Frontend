import styled from 'styled-components'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {
  signupRoute,
  autoCreateGroupChatRoute,
  fetchAllGroupChatsRoute,
} from '../utils/APIRoutes'
import { ChatState } from '../Context/ChatProvider'

function Signup() {
  Array.prototype.unique = function () {
    var a = this.concat()
    for (var i = 0; i < a.length; ++i) {
      for (var j = i + 1; j < a.length; ++j) {
        if (a[i] === a[j]) a.splice(j--, 1)
      }
    }
    return a
  }
  const navigate = useNavigate()
  const toastOptions = {
    position: 'bottom-right',
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: 'dark',
  }
  const {
    currGroupNameList,
    setCurrGroupNameList,
    currGroupChatList,
    setCurrGroupChatList,
    chats,
    setChats,
  } = ChatState()

  const [values, setValues] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    identity: '--Select User Type--',
    coursesEnrolled: '',
    coursesTeach: '',
  })

  useEffect(() => {
    if (localStorage.getItem('chat-app-user')) {
      navigate('/')
    }
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (handleValidation()) {
      const {
        fullName,
        username,
        email,
        password,
        identity,
        coursesEnrolled,
        coursesTeach,
      } = values
      const coursesEnrolledSplit = coursesEnrolled
        .split(/\s*,+\s*/)
        .map((course) => course.toUpperCase())

      const coursesTeachSplit = coursesTeach
        .split(/\s*,+\s*/)
        .map((course) => course.toUpperCase())

      const { data } = await axios.post(signupRoute, {
        fullName,
        username,
        email,
        password,
        identity,
        coursesEnrolledSplit,
        coursesTeachSplit,
      })

      if (data.status === false) {
        toast.error(data.msg, toastOptions)
      }
      if (data.status === true) {
        localStorage.setItem('chat-app-user', JSON.stringify(data.user))
        navigate('/')
      }

      const currentUser = data.user
      const allCoursesSplit = [
        ...coursesEnrolledSplit,
        ...coursesTeachSplit,
      ].filter((course) => course !== '')
      console.log(allCoursesSplit)
      console.log(JSON.stringify(currentUser._id))
      console.log(currentUser)
      console.log(currGroupChatList)

      try {
        const { data: groupChats } = await axios.get(fetchAllGroupChatsRoute)
        setCurrGroupChatList(groupChats)
        console.log(groupChats)
      } catch (error) {
        toast({
          title: 'Error Occured!',
          description: 'Failed to Load the chats',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'bottom-left',
        })
      }

      try {
        const { data: newGroupChats } = await axios.post(
          autoCreateGroupChatRoute,
          {
            groupNames: allCoursesSplit,
            users: JSON.stringify(currentUser._id),
            currUser: currentUser,
            currGroupChatExist: currGroupChatList,
          }
        )
        console.log(newGroupChats)
        setChats(newGroupChats.concat(chats))
        const deduplicateMergedCourses = allCoursesSplit
          .concat(currGroupNameList)
          .unique()
        setCurrGroupNameList(deduplicateMergedCourses)
        toast({
          title: 'Auto Joined Groups Successfully!',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'bottom',
        })
      } catch (error) {
        toast({
          title: 'Failed to Join the Groups!',
          description: error.response.data,
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'bottom',
        })
      }

      console.log(chats)
      console.log(currGroupChatList)
    }
  }

  const handleValidation = () => {
    const {
      password,
      confirmPassword,
      username,
      email,
      fullName,
      identity,
      coursesEnrolled,
      coursesTeach,
    } = values

    if (password !== confirmPassword) {
      toast.error('Password and confirm password should be same.', toastOptions)
      return false
    } else if (fullName === '') {
      toast.error('Full Name is required.', toastOptions)
      return false
    } else if (identity === '--Select User Type--') {
      toast.error('Identity is required.', toastOptions)
      return false
    } else if (username.length < 3) {
      toast.error('Username should be greater than 3 characters.', toastOptions)
      return false
    } else if (password.length < 8) {
      toast.error(
        'Password should be equal or greater than 8 characters.',
        toastOptions
      )
      return false
    } else if (email === '') {
      toast.error('Email is required.', toastOptions)
      return false
    } else if (identity === 'Student' && coursesEnrolled === '') {
      toast.error('Courses Enrolled are required.', toastOptions)
      return false
    } else if (identity === 'Staff' && coursesTeach === '') {
      toast.error('Courses Teach are required.', toastOptions)
      return false
    }
    return true
  }

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value })
  }

  return (
    <>
      <FormContainer>
        <form onSubmit={(event) => handleSubmit(event)}>
          <div className='brand'>
            <h1>NUSCourseChat</h1>
          </div>
          <input
            type='text'
            placeholder='Full Name'
            name='fullName'
            onChange={(eve) => handleChange(eve)}
          />
          <input
            type='text'
            placeholder='Username'
            name='username'
            onChange={(eve) => handleChange(eve)}
          />
          <input
            type='email'
            placeholder='Email'
            name='email'
            onChange={(eve) => handleChange(eve)}
          />
          <input
            type='password'
            placeholder='Password'
            name='password'
            onChange={(eve) => handleChange(eve)}
          />
          <input
            type='password'
            placeholder='Confirm Password'
            name='confirmPassword'
            onChange={(eve) => handleChange(eve)}
          />
          <select
            name='identity'
            onChange={(eve) => handleChange(eve)}
            value={values.identity}
          >
            <option value='--Select User Type--'>--Select User Type--</option>
            <option value='Student'>Student</option>
            <option value='Staff'>Staff</option>
          </select>
          {values.identity === 'Student' && (
            <input
              type='text'
              placeholder='Courses Enrolled'
              name='coursesEnrolled'
              onChange={(eve) => handleChange(eve)}
            />
          )}
          {values.identity === 'Staff' && (
            <input
              type='text'
              placeholder='Courses Teach'
              name='coursesTeach'
              onChange={(eve) => handleChange(eve)}
            />
          )}
          <button type='submit'>Create User</button>
          <span>
            Already have an account ? <Link to='/login'> Login</Link>
          </span>
        </form>
      </FormContainer>
      <ToastContainer />
    </>
  )
}

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    h1 {
      color: white;
    }
  }
  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 3rem 5rem;
  }
  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #4e0eff;
    border-radius: 0.4rem;
    color: white;
    width: 100%;
    font-size: 1rem;
    &:focus {
      border: 0.1rem solid #997af0;
      outline: none;
    }
  }
  select {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #4e0eff;
    border-radius: 0.4rem;
    color: white;
    width: 100%;
    font-size: 1rem;
    &:focus {
      border: 0.1rem solid #997af0;
      outline: none;
    }
  }
  button {
    background-color: #997af0;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #4e0eff;
    }
  }
  span {
    color: white;
    text-transform: uppercase;
    a {
      color: #4e0eff;
      text-decoration: none;
      font-weight: bold;
    }
  }
`

export default Signup
