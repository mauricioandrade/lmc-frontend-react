import { useCallback, useEffect, useState } from 'react';
import * as api from '../services/api';

const defaultDate = new Date().toISOString().split('T')[0];

const initialFilters = {
  data: defaultDate,
  produtoId: '',
};

const initialStatus = {
  loading: false,
  error: null,
};

export const useLmcForm = () => {
  const [produtos, setProdutos] = useState([]);
  const [tanques, setTanques] = useState([]);
  const [bicos, setBicos] = useState([]);
  const [folhaCarregada, setFolhaCarregada] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [status, setStatus] = useState(initialStatus);

  const updateStatus = useCallback((updates) => {
    setStatus((previous) => ({ ...previous, ...updates }));
  }, []);

  const clearError = useCallback(() => updateStatus({ error: null }), [updateStatus]);

  const updateFilters = useCallback((updates) => {
    setFilters((previous) => ({ ...previous, ...updates }));
  }, []);

  const fetchProdutos = useCallback(async () => {
    try {
      const response = await api.getProdutos();
      setProdutos(response.data);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      updateStatus({ error: 'Não foi possível carregar os produtos da API.' });
    }
  }, [updateStatus]);

  useEffect(() => {
    fetchProdutos();
  }, [fetchProdutos]);

  const fetchPrerequisitos = useCallback(async (produtoId) => {
    const tanquesResponse = await api.getTanquesPorProduto(produtoId);
    const tanquesData = tanquesResponse.data;
    const tanquesValidos = tanquesData.filter((tanque) => Boolean(tanque?.id));

    if (tanquesValidos.length === 0) {
      return { tanques: tanquesData, bicos: [] };
    }

    const bicosPorTanque = await Promise.all(
      tanquesValidos.map(async (tanque) => {
        const response = await api.getBicosPorTanque(tanque.id);
        return response.data.map((bico) => ({
          ...bico,
          nomeTanque: tanque.numero,
        }));
      })
    );

    return { tanques: tanquesData, bicos: bicosPorTanque.flat() };
  }, []);

  const fetchFolha = useCallback(async () => {
    const { data, produtoId } = filters;

    if (!data || !produtoId) {
      setFolhaCarregada(null);
      setTanques([]);
      setBicos([]);
      updateStatus({ loading: false });
      return;
    }

    updateStatus({ loading: true, error: null });

    try {
      const { tanques: tanquesData, bicos: bicosData } = await fetchPrerequisitos(produtoId);
      setTanques(tanquesData);
      setBicos(bicosData);

      const response = await api.getFolha(data, produtoId);
      setFolhaCarregada(response.data);
      updateStatus({ loading: false });
    } catch (error) {
      if (error.response?.status === 404) {
        updateStatus({ loading: false });
        setFolhaCarregada(null);
        return;
      }

      console.error('Erro ao buscar folha:', error);
      updateStatus({ loading: false, error: 'Não foi possível carregar os dados da folha.' });
    }
  }, [fetchPrerequisitos, filters, updateStatus]);

  useEffect(() => {
    fetchFolha();
  }, [fetchFolha]);

  const refreshFolha = useCallback(() => {
    fetchFolha();
  }, [fetchFolha]);

  return {
    produtos,
    tanques,
    bicos,
    folhaCarregada,
    filters,
    updateFilters,
    loading: status.loading,
    error: status.error,
    clearError,
    refreshFolha,
  };
};
