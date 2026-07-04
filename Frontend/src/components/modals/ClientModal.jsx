import { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

function ClientModal({ show, onHide, onSave, editingClient }) {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    notes: ""
  });

  useEffect(() => {
    if (editingClient) {
      setFormData({
        name: editingClient.name || "",
        company: editingClient.company || "",
        email: editingClient.email || "",
        phone: editingClient.phone || "",
        notes: editingClient.notes || ""
      });
    } else {
      setFormData({ name: "", company: "", email: "", phone: "", notes: "" });
    }
  }, [editingClient, show]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData); 
  };

  return (
    <Modal show={show} onHide={onHide} centered data-bs-theme="dark" >
      <Modal.Header closeButton className="border-secondary">
        <Modal.Title>{editingClient ? "Edit Client" : "Add New Client"}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Company</Form.Label>
            <Form.Control type="text" value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Phone</Form.Label>
            <Form.Control type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Notes</Form.Label>
            <Form.Control as="textarea" rows={3} value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="border-secondary">
          <Button variant="secondary" onClick={onHide}>Cancel</Button>
          <Button variant="primary" type="submit">Save Client</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default ClientModal;