import React, {useEffect, useState} from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import {getAuth, updateProfile} from 'firebase/auth'
import {updateDoc, doc} from 'firebase/firestore'
import {db} from '../firebase.config'

function Profile() {
    const auth = getAuth()

    const [formData, setFormData] = useState({
      name: auth.currentUser.displayName,
      email: auth.currentUser.email
    })
   
    const [changeDetails, setChangeDetails] = useState(false)
    
    const {name, email} = formData
    
    const onLogout = () => {
      auth.signOut()
      navigate('/')
    }
    
    const onSubmit = async () => {
      try {
        if(auth.currentUser.displayName !== name) {
          await updateProfile(auth.currentUser, {
            displayName: name,
          })

          const userRef = doc(db, 'users', auth.currentUser.uid)
          await updateDoc(userRef, {
            name,
          })
        }
      } catch (error) {
        console.log(error)
        toast.error('Failed to update profile details')
      }
    }
    
    const onChange = (event) => {
      setFormData((prevState) => ({
        ...prevState,
        [event.target.id]: event.target.value
      }))
    }
    
    const navigate = useNavigate()
    
    return <div className='profile'>
      <header className="profileHeader">
        <p className="pageHeader">My Profile</p>

        <button type='button' className="logOut" onClick={onLogout}>Log Out</button>
      </header>

      <main>
        <div className="profileDetailsHeader">
          <p className="profileDetailsText">Personal Details</p>

          <p className="changePersonalDetails" onClick={() => {
            {changeDetails && onSubmit()}
            setChangeDetails((prevState) => !prevState)
          }}>
            {changeDetails ? 'Done' : 'Change'}
          </p>
        </div>

        <div className="profileCard">
          <form>
            <input 
              type="text" 
              id='name' 
              className={!changeDetails ? 'profileName' : 'profileNameActive'}
              disabled={!changeDetails}
              value={name}
              onChange={onChange}
            />

            <input 
              type="text" 
              id='email' 
              className={!changeDetails ? 'profileEmail' : 'profileEmailActive'}
              disabled={!changeDetails}
              value={email}
              onChange={onChange}
            />
          </form>
        </div>
      </main>
    </div>
}

export default Profile