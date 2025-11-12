import { useCallback, useEffect, useRef, useState } from 'react';
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
  const prerequisitesCacheRef = useRef(new Map());
  const prerequisitesPromiseRef = useRef(new Map());
  const activeRequestIdRef = useRef(0);

  const updateStatus = useCallback((updates) => {
    setStatus((previous) => {
      const next = { ...previous, ...updates };

      if (previous.loading === next.loading && previous.error === next.error) {
        return previous;
      }

      return next;
    });
  }, []);

  const clearError = useCallback(() => updateStatus({ error: null }), [updateStatus]);

  const updateFilters = useCallback((updates) => {
    setFilters((previous) => {
      const next = { ...previous, ...updates };

      if (previous.data === next.data && previous.produtoId === next.produtoId) {
        return previous;
      }

      return next;
    });
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

  const fetchPrerequisitos = useCallback(async (produtoId, { forceRefresh = false } = {}) => {
    const cache = prerequisitesCacheRef.current;
    const promiseCache = prerequisitesPromiseRef.current;

    if (forceRefresh) {
      cache.delete(produtoId);
      promiseCache.delete(produtoId);
    }

    if (cache.has(produtoId)) {
      const cached = cache.get(produtoId);
      return {
        tanques: [...cached.tanques],
        bicos: [...cached.bicos],
      };
    }

    if (promiseCache.has(produtoId)) {
      return promiseCache.get(produtoId);
    }

    const fetchPromise = (async () => {
      const tanquesResponse = await api.getTanquesPorProduto(produtoId);
      const tanquesData = tanquesResponse.data;
      const tanquesValidos = tanquesData.filter((tanque) => Boolean(tanque?.id));

      if (tanquesValidos.length === 0) {
        const resultadoVazio = { tanques: [...tanquesData], bicos: [] };
        cache.set(produtoId, resultadoVazio);
        promiseCache.delete(produtoId);
        return {
          tanques: [...resultadoVazio.tanques],
          bicos: [],
        };
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

      const bicosList = bicosPorTanque.flat();
      const resultado = { tanques: [...tanquesData], bicos: [...bicosList] };
      cache.set(produtoId, resultado);
      promiseCache.delete(produtoId);
      return {
        tanques: [...resultado.tanques],
        bicos: [...resultado.bicos],
      };
    })();

    promiseCache.set(produtoId, fetchPromise);
    return fetchPromise;
  }, []);

  const fetchFolha = useCallback(async ({ forceRefresh = false } = {}) => {
    const { data, produtoId } = filters;

    if (!data || !produtoId) {
      setFolhaCarregada(null);
      setTanques([]);
      setBicos([]);
      updateStatus({ loading: false });
      return;
    }

    const requestId = activeRequestIdRef.current + 1;
    activeRequestIdRef.current = requestId;
    updateStatus({ loading: true, error: null });

    try {
      const { tanques: tanquesData, bicos: bicosData } = await fetchPrerequisitos(produtoId, {
        forceRefresh,
      });

      if (activeRequestIdRef.current !== requestId) {
        return;
      }

      setTanques(() => [...tanquesData]);
      setBicos(() => [...bicosData]);

      const response = await api.getFolha(data, produtoId);

      if (activeRequestIdRef.current !== requestId) {
        return;
      }

      setFolhaCarregada(response.data);
      updateStatus({ loading: false });
    } catch (error) {
      if (activeRequestIdRef.current !== requestId) {
        return;
      }

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

  const refreshFolha = useCallback(
    (options = {}) => fetchFolha({ ...options, forceRefresh: true }),
    [fetchFolha]
  );

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
