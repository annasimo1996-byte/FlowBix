function SocialButtons() {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const handleSocialLogin = (provider) => {
    window.location.href = `${apiUrl}/auth/${provider}`;
  };

  return (
    <div className="row g-2 mb-3">
      <div className="col-12 col-sm-6">
        <button
          type="button"
          onClick={() => handleSocialLogin('google')}
          className="btn btn-outline-light w-100 rounded-3 d-flex align-items-center justify-content-center gap-2"
        >
          <i className="bi bi-google" style={{ color: '#ea4335' }} />
          Google
        </button>
      </div>
      <div className="col-12 col-sm-6">
        <button
          type="button"
          onClick={() => handleSocialLogin('github')}
          className="btn btn-outline-light w-100 rounded-3 d-flex align-items-center justify-content-center gap-2"
        >
          <i className="bi bi-github" />
          GitHub
        </button>
      </div>
    </div>
  )
}

export default SocialButtons