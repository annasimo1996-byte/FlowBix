const VITE_API_URL = import.meta.env.VITE_API_URL;

export const sendRequest = async (endpoint, options = {}) => {

    //Se c'è il token memorizza
    const token = localStorage.getItem("token");

    //Preparo gli headers evitando di sovrascrivere eventuali altri dati passatti
    const headers = {
        "Content-Type": "application/json",
        ...options.headers,
    };

    //Sei il token esiste aggiunge la riga Authorization
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    //Unisce tutte le opzioni agli headers
    const config = {
        ...options,
        headers,
    };

    //Esecuzione della fetch
    const response = await fetch(`${VITE_API_URL}${endpoint}`, config);



    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Something went wrong!");
    }

    if (response.status === 204) return null;
    return await response.json();
}; 

