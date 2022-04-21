import React, {useState, useEffect} from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import ListingItem from '../components/ListingItem'
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg'
import homeIcon from '../assets/svg/homeIcon.svg'
import {getAuth, updateProfile} from 'firebase/auth'
import {updateDoc, doc, collection, getDocs, query, where, orderBy, deleteDoc} from 'firebase/firestore'
import {db} from '../firebase.config'

function Profile() {
    const auth = getAuth()
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
      name: auth.currentUser.displayName,
      email: auth.currentUser.email
    })
    const [changeDetails, setChangeDetails] = useState(false)
    const [loading, setLoading] = useState(true)
    const [listings, setListings] = useState(null)
    
    const {name, email} = formData
    
    useEffect(() => {
      const fetchUserListings = async () => {
        const listingsRef = collection(db, 'listings')
        const q = query(listingsRef, where('userRef', '==', auth.currentUser.uid), orderBy('timestamp', 'desc'))
        
        const querySnap = await getDocs(q)

        let listings = []

        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data()
          })
        })

        setListings(listings)
        setLoading(false)
      }

      fetchUserListings()
    }, [auth.currentUser.uid])
    
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
    
    const onDelete = async (listingId) => {
      if(window.confirm('Are you sure you want to delete this listing?')) {
        await deleteDoc(doc(db, 'listings', listingId))
        const updatedListings = listings.filter((listing) => listing.id !== listingId)

        setListings(updatedListings)
        toast.success('Removed Listing')
      }
    }
    
    const onEdit = (listingId) => navigate(`/edit-listing/${listingId}`)
    
    return <div className='profile'>
      <header className="profileHeader">
        <p className="pageHeader">My Profile</p>

        <button type='button' className="logOut" onClick={onLogout}>Log Out</button>
      </header>

      <main>
        <div className="profileDetailsHeader">
          <p className="profileDetailsText">Personal Details</p>

          <p className="changePersonalDetails" onClick={() => {
            changeDetails && onSubmit()
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

        <Link to='/create-listing' className='createListing'>
          <img src={homeIcon} alt="Home" />

          <p>Sell or Rent your home</p>

          <img src={arrowRight} alt="Arrow Right" />
        </Link>

        {!loading && listings?.length > 0 && (
          <>
            <p className="listingText">Your Listings</p>

            <ul className="listingsList">
              {listings.map((listing) => (
                <ListingItem 
                  key={listing.id} 
                  listing={listing.data} 
                  id={listing.id}
                  onDelete={() => onDelete(listing.id)}
                  onEdit={() => onEdit(listing.id)}
                />
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
}

export default Profile