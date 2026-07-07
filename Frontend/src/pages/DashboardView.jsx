function DashboardView() {
  return (
    <div className="container-fluid pt-3">
      <h2>Dashboard Generale</h2>
      <p className="text-muted">Benvenuto nel pannello di controllo di FlowBix.</p>
      <div className="row g-3">
        <div className="col-md-4">
          <div className="card p-3 bg-dark text-white">
            <h5>Clienti Totali</h5>
            <h3>0</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-3 bg-dark text-white">
            <h5>Appuntamenti Oggi</h5>
            <h3>0</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-3 bg-dark text-white">
            <h5>Bilancio Mensile</h5>
            <h3 className="text-success">+0,00 €</h3>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardView