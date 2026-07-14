const API_BASE_URL = "http://localhost:3001";

const apiServerClient = {
  fetch(endpoint, options = {}) {
    return fetch(`${API_BASE_URL}${endpoint}`, options);
  }
};

export default apiServerClient;