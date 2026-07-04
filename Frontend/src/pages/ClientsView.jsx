import { useState, useEffect } from "react";
import { sendRequest } from "../utils/api";
import styles from "./clientsView.module.css";
import ClientModal from "../components/modals/ClientModal.jsx";

function ClientsView() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Stati per gestire l'apertura della modale e l'elemento da modificare
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  // Funzione per caricare la lista dei clienti dal backend
  const fetchClients = async () => {
    try {
      setLoading(true);
      const data = await sendRequest("/clients");
      setClients(data || []);
    } catch (err) {
      setError(err.message || "Failed to load clients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Salvataggio
  const handleSaveClient = async (formData) => {
    try {
      if (editingClient) {
    
        await sendRequest(`/clients/${editingClient._id}`, {
          method: "PUT",
          body: JSON.stringify(formData),
        });
      } else {
       
        await sendRequest("/clients", {
          method: "POST",
          body: JSON.stringify(formData),
        });
      }
      setShowModal(false);
      fetchClients();
    } catch (err) {
      alert(err.message || "Something went wrong while saving.");
    }
  };

  // Eliminazione
  const handleDeleteClient = async (id) => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      try {
        await sendRequest(`/clients/${id}`, {
          method: "DELETE",
        });
        fetchClients();
      } catch (err) {
        alert(err.message || "Failed to delete client.");
      }
    }
  };

  return (
    <div className="container-fluid pt-3 text-white">
      <h2 className="text-white fw-bold">Clients Database</h2>
      <p className="text-white-50">Manage your clients' records and contact information.</p>

      <div className="card bg-dark text-white p-3 border-secondary">
        <button
          className="btn-flowbix mb-3 align-self-start"
          onClick={() => { setEditingClient(null); setShowModal(true); }}
        >
          + New Client
        </button>

        {loading && <p className="text-center my-4 text-white-50">Loading clients...</p>}
        {error && <p className="text-center text-danger my-4 fw-medium">{error}</p>}

        {/* Tabella dei Clienti */}
        {!loading && !error && (
          clients.length === 0 ? (
            <p className="text-center my-4 text-white-50">No clients found.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-dark table-hover table-striped align-middle m-0">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Company</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Notes</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client) => (
                    <tr key={client._id}>
                      <td className="fw-medium">{client.name}</td>
                      <td>{client.company || "-"}</td>
                      <td>{client.email || "-"}</td>
                      <td>{client.phone || "-"}</td>
                      <td className={styles.notesCell} title={client.notes || "No notes"}>
                        {client.notes || "-"}
                      </td>
                      <td className="text-end">

                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => { setEditingClient(client); setShowModal(true); }}
                        >
                          Edit
                        </button>
                  
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteClient(client._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>

      {/* Modale */}
      <ClientModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSave={handleSaveClient}
        editingClient={editingClient}
      />
    </div>
  );
}

export default ClientsView;