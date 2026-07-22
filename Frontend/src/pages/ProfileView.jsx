import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import './ProfileView.css'

function ProfileView() {
  const { user, logout } = useContext(AuthContext)

  // Calcolo delle iniziali utente
  const getInitials = (firstName, lastName) => {
    if (!firstName && !lastName) return 'U'
    const first = firstName ? firstName[0] : ''
    const last = lastName ? lastName[0] : ''
    return `${first}${last}`.toUpperCase()
  }

  // Determina il provider di autenticazione dell'utente
  const getAuthProviderDetails = () => {
    if (user?.googleId) {
      return {
        label: 'Google Linked',
        icon: 'bi-google',
        badgeClass: 'providerBadge googleBadge',
      }
    }
    if (user?.githubId) {
      return {
        label: 'GitHub Account',
        icon: 'bi-github',
        badgeClass: 'providerBadge githubBadge',
      }
    }
    return {
      label: 'Standard Account',
      icon: 'bi-envelope-check',
      badgeClass: 'providerBadge emailBadge',
    }
  }

  const provider = getAuthProviderDetails()

  if (!user) {
    return (
      <div className="profileLoadingState">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="profilePageContainer">
      <div className="profileCard">
        
        {/* Header della Card */}
        <div className="profileCardHeader">
          <div className="profileAvatarWrapper">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={`${user.firstName} ${user.lastName}`}
                className="profileAvatarImg"
              />
            ) : (
              <div className="profileAvatarInitials">
                {getInitials(user.firstName, user.lastName)}
              </div>
            )}
          </div>

          <div className="profileTitleSection">
            <h2 className="profileName">
              {user.firstName} {user.lastName}
            </h2>
            <div className={provider.badgeClass}>
              <i className={`bi ${provider.icon}`} />
              <span>{provider.label}</span>
            </div>
          </div>
        </div>

        <hr className="profileDivider" />

        {/* Dettagli dell'utente */}
        <div className="profileDetailsGrid">
          <div className="profileDetailItem">
            <span className="detailLabel">First Name</span>
            <span className="detailValue">{user.firstName || '-'}</span>
          </div>

          <div className="profileDetailItem">
            <span className="detailLabel">Last Name</span>
            <span className="detailValue">{user.lastName || '-'}</span>
          </div>

          <div className="profileDetailItem fullWidth">
            <span className="detailLabel">Email Address</span>
            <span className="detailValue">{user.email}</span>
          </div>
        </div>

        <hr className="profileDivider" />

        {/* Azioni Profilo */}
        <div className="profileActions">
          <button className="profileLogoutBtn" onClick={logout}>
            <i className="bi bi-box-arrow-right" />
            Logout
          </button>
        </div>

      </div>
    </div>
  )
}

export default ProfileView