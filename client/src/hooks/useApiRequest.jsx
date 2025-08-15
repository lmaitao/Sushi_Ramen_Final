import { useState } from 'react';

const useApiRequest = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const makeRequest = async (apiCall, successCallback) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiCall();
      if (successCallback) successCallback(response);
      return response;
    } catch (err) {
      setError(err.response?.data?.error || 'Error en la solicitud');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, makeRequest };
};

export default useApiRequest;