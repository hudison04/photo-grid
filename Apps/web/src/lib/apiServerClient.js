import pb from '@/lib/pocketbaseClient';
import { ENV } from '@/config/environment';

const buildHeaders = (headers = {}) => {
  const result = {
    ...headers,
  };

  if (pb.authStore.token) {
    result.Authorization = `Bearer ${pb.authStore.token}`;
  }

  return result;
};

const apiServerClient = {
  async fetch(path, options = {}) {
    const response = await fetch(`${ENV.apiUrl}${path}`, {
      ...options,
      headers: buildHeaders(options.headers),
    });

    return response;
  },
};

export default apiServerClient;