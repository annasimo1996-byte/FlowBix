const VITE_API_URL = import.meta.env.VITE_API_URL;

export const sendRequest = async (endpoint, options = {}) => {
    // Estrae skipAuth per evitare di aggiungere il token nelle rotte pubbliche
    const { skipAuth = false, ...fetchOptions } = options;
    const token = localStorage.getItem("token");

    const headers = {
        "Content-Type": "application/json",
        ...fetchOptions.headers,
    };

    if (!skipAuth && token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const config = {
        ...fetchOptions,
        headers,
    };

    const response = await fetch(`${VITE_API_URL}${endpoint}`, config);

    if (!response.ok) {
        // Toke che scade mentre l'utente è loggato 
        if ((response.status === 401 || response.status === 403) && !skipAuth) {
            // Evento globale intercettabile da AuthContext
            window.dispatchEvent(new CustomEvent("auth:unauthorized"));
        }
        
        const contentType = response.headers.get("content-type");
        let errorData = {};

        if (contentType && contentType.includes("application/json")) {
            errorData = await response.json().catch(() => ({}));
        } else {
            const text = await response.text().catch(() => "");
            errorData = { message: text || `Request failed (${response.status})` };
        }

        const apiError = new Error(errorData.message || `Request failed (${response.status})`);
        apiError.status = response.status;
        apiError.data = errorData;

        throw apiError;
    }

    if (response.status === 204) return null;

    const textData = await response.text();
    if (!textData.trim()) return null;

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        try {
            return JSON.parse(textData);
        } catch {
            return textData;
        }
    }

    return textData;
};