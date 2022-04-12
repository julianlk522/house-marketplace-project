import React, {useState} from 'react'
import {getAuth, createUserWithEmailAndPassword, updateProfile} from 'firebase/auth'
import {db} from '../firebase.config'
import {setDoc, doc, serverTimestamp} from 'firebase/firestore'
import {Link, useNavigate} from 'react-router-dom'
import {ReactComponent as ArrowRightIcon} from '../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'

function SignUp() {
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
      email: '',
      password: '',
      name: ''
    })

    const {email, password, name} = formData

    const navigate = useNavigate()
  
    const onChange = (event) => {
      setFormData((prevState) => ({
        ...prevState,
        [event.target.id]: event.target.value
      }))
    }

    const onSubmit = async (event) => {
      event.preventDefault()

      try {
        const auth = getAuth()

        const userCredential = await createUserWithEmailAndPassword(auth, email, password)

        const user = userCredential.user

        updateProfile(auth.currentUser, {
          displayName: name
        })

        const formDataCopy = {...formData}
        delete formDataCopy.password
        formDataCopy.timestamp = serverTimestamp()

        await setDoc(doc(db, 'users', user.uid), formDataCopy)
        
        navigate('/')

      } catch(error) {
        console.log(error)
      }
    }
    
    return (
        <>
          <div className="pageContainer">
            <header>
              <p className="pageHeader">Welcome Back!</p>
            </header>

            <form onSubmit={onSubmit}>
              <input 
                type='email' 
                className='emailInput'
                id='email'
                value={email}
                onChange = {onChange}
              />

              <input 
                type='text' 
                className='nameInput'
                id='name'
                value={name}
                onChange = {onChange}
              />

              <div className="passwordInputDiv">
                <input 
                  type={showPassword ? 'text' : 'password'}
                  className='passwordInput'
                  placeholder='Password'
                  id='password'
                  value={password}
                  onChange={onChange}
                />

                <img src={visibilityIcon} alt="Show Password" className="showPassword" onClick={() => setShowPassword((prevState) => !prevState)}/>
              </div>

              <Link to='/forgot-password' className='forgotPasswordLink'>
                Forgot Password
              </Link>

              <div className="signUpBar">
                <p className="signUpText">
                  Sign Up
                </p>

                <button className="signUpButton">
                  <ArrowRightIcon fill='white' width='34px' height='34px'/>
                </button>
              </div>
            </form>

            <Link to='/sign-in' className='registerLink'>
              Sign In
            </Link>
          </div>
        </>
    )
}

export default SignUp