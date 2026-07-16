import React, { useState, useEffect } from "react";
import { sendRequest } from "../utils/api";
import NewClientModal from "../components/modals/NewClientModal";
import "./ClientsView.css";

const ClientsView = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const loadClients = async () => {
      try {
        setLoading(true);
        const data = await sendRequest("/clients", { 
          method: "GET",
          signal: controller.signal 
        });
        const clientsList = Array.isArray(data) ? data : data.clients || [];
        setClients(clientsList);
        setError(null);
      } catch (err) {
        if (err.name === "AbortError") return;
        setError(err.message);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadClients();

    return () => {
      controller.abort();
    };
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;
    try {
      await sendRequest(`/clients/${id}`, { method: "DELETE" });
      setClients((prevClients) => prevClients.filter((client) => client._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleOpenNewModal = () => {
    setClientToEdit(null);
    setIsModalOpen(true);
  };

  const handleEdit = (client) => {
    setClientToEdit(client);
    setIsModalOpen(true);
  };

  const handleClientSaved = (savedClient, isEditing) => {
    if (isEditing) {
      setClients((prevClients) =>
        prevClients.map((client) => (client._id === savedClient._id ? savedClient : client))
      );
    } else {
      setClients((prevClients) => [...prevClients, savedClient]);
    }
  };

  return (
    <div className="clients-container">
      <div className="section-header">
        <div className="section-header-titles">
          <h2>Customer Master Data</h2>
          <p>Manage your customer data and contacts.</p>
        </div>
        <button className="btn-primary-custom" onClick={handleOpenNewModal}>
          New Client
        </button>
      </div>

      {loading && <p className="loading-text">Loading...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && !error && (
        <>
          <div className="table-responsive-custom desktop-table-view">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Compay</th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {clients.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="empty-text">No client found.</td>
                  </tr>
                ) : (
                  clients.map((client) => (
                    <tr key={client._id}>
                      <td title={client.name}>{client.name}</td>
                      <td title={client.email}>{client.email || "-"}</td>
                      <td title={client.phone}>{client.phone || "-"}</td>
                      <td title={client.company}>{client.company || "-"}</td>
                      <td className="comment-cell" title={client.notes}>{client.notes || "-"}</td>
                      <td>
                        <div className="action-icons-wrapper">
                          <button className="btn-icon-custom btn-edit-icon" onClick={() => handleEdit(client)} title="Modifica">
                            <i className="bi bi-pencil-square" />
                          </button>
                          <button className="btn-icon-custom btn-delete-icon" onClick={() => handleDelete(client._id)} title="Elimina">
                            <i className="bi bi-trash-fill" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="clients-cards-mobile">
            {clients.length === 0 ? (
              <p className="empty-text">No client found.</p>
            ) : (
              clients.map((client) => (
                <div key={client._id} className="client-card-item">
                  <div className="client-card-header">
                    <h4 title={client.name}>{client.name}</h4>
                    <div className="action-icons-wrapper">
                      <button className="btn-icon-custom btn-edit-icon" onClick={() => handleEdit(client)} title="Modifica">
                        <i className="bi bi-pencil-square" />
                      </button>
                      <button className="btn-icon-custom btn-delete-icon" onClick={() => handleDelete(client._id)} title="Elimina">
                        <i className="bi bi-trash-fill" />
                      </button>
                    </div>
                  </div>
                  <div className="client-card-body">
                    <p><span>Email:</span> <span className="card-val" title={client.email}>{client.email || "-"}</span></p>
                    <p><span>Phone:</span> <span className="card-val" title={client.phone}>{client.phone || "-"}</span></p>
                    <p><span>Company:</span> <span className="card-val" title={client.company}>{client.company || "-"}</span></p>
                    <p><span>Notes:</span> <span className="card-val" title={client.notes}>{client.notes || "-"}</span></p>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      <NewClientModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setClientToEdit(null);
        }}
        clientToEdit={clientToEdit}
        onClientSaved={handleClientSaved}
      />
    </div>
  );
};

export default ClientsView;