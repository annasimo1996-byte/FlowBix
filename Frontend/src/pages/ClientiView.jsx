function ClientiView() {
  return (
    <div className="container-fluid pt-3">
      <h2>Anagrafica Clienti</h2>
      <p className="text-muted">Gestisci i dati e i contatti dei tuoi clienti.</p>
      <div className="card bg-dark text-white p-3">
        <button className="btn btn-sm btn-primary mb-3 align-self-start">+ Nuovo Cliente</button>
        <p className="text-center my-4">Nessun cliente inserito.</p>
      </div>
    </div>
  )
}

export default ClientiView