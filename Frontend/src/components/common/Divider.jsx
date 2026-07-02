function Divider() {
  return (
    <div className="d-flex align-items-center gap-3 my-3">
      <span className="bg-secondary flex-grow-1" style={{ height: '1px', opacity: 0.2 }} />
      <span className="text-muted small text-uppercase">or</span>
      <span className="bg-secondary flex-grow-1" style={{ height: '1px', opacity: 0.2 }} />
    </div>
  )
}

export default Divider