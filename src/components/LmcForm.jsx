import React, { useState, useEffect } from 'react';
import * as api from '../services/api';
import { toast } from 'react-hot-toast';
import FormularioCriacao from './FormularioCriacao';
import AreaDeEdicao from './AreaDeEdicao';

function LmcForm() {
  const [produtos, setProdutos] = useState([]);
  const [tanques, setTanques] = useState([]);
  const [bicos, setBicos] = useState([]);

  const [data, setData] = useState(new Date().toISOString().split('T')[0]);
  const [produtoId, setProdutoId] = useState('');

  const [folhaCarregada, setFolhaCarregada] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getProdutos()
      .then(response => setProdutos(response.data))
      .catch(err => {
        console.error('Erro ao buscar produtos:', err);
        setError('Não foi possível carregar os produtos da API.');
      });
  }, []);

  useEffect(() => {
    const fetchPrerequisitos = async (pid) => {
      try {
        const tanquesResponse = await api.getTanquesPorProduto(pid);
        const tanquesData = tanquesResponse.data;
        setTanques(tanquesData);

        let todosBicos = [];
        for (const tanque of tanquesData) {
          const bicosResponse = await api.getBicosPorTanque(tanque.id);
          const bicosComTanque = bicosResponse.data.map(b => ({
            ...b,
            nomeTanque: tanque.numero,
          }));
          todosBicos = [...todosBicos, ...bicosComTanque];
        }
        setBicos(todosBicos);
      } catch (err) {
        console.error('Erro ao buscar tanques/bicos:', err);
        setError('Não foi possível carregar os tanques e bicos.');
        throw err;
      }
    };

    const fetchFolha = async () => {
      if (!produtoId || !data) {
        setFolhaCarregada(null);
        setTanques([]);
        setBicos([]);
        return;
      }

      setLoading(true);
      setError(null);
      setFolhaCarregada(null);

      try {
        await fetchPrerequisitos(produtoId);

        const response = await api.getFolha(data, produtoId);
        setFolhaCarregada(response.data);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setFolhaCarregada(null);
        } else {
          console.error('Erro ao buscar folha:', err);
          setError('Não foi possível carregar os dados da folha.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFolha();
  }, [data, produtoId]);

  const handleAtualizacao = () => {
    toast.success('Dados atualizados!');
    const pid = produtoId;
    const currentData = data;
    setProdutoId('');
    setData('');
    setTimeout(() => {
      setData(currentData);
      setProdutoId(pid);
    }, 10);
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center py-4 px-3"
      style={{ background: 'linear-gradient(135deg, #0d1117 0%, #161b22 100%)' }}
    >
      <div className="container" style={{ maxWidth: '900px', width: '100%' }}>
        <div className="text-center mb-5">
          <h1 className="display-5 fw-bold mb-2" style={{ color: '#58a6ff' }}>
            📊 Sistema LMC
          </h1>
          <p className="fs-6" style={{ color: '#8b949e' }}>
            Gestão de Leituras de Medição de Combustível
          </p>
        </div>

        {error && (
          <div
            className="alert alert-danger alert-dismissible fade show shadow-sm mb-4"
            style={{ backgroundColor: '#3c1f1f', borderColor: '#8b3838', color: '#ff7b7b' }}
          >
            <strong>❌ Erro!</strong> {error}
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={() => setError(null)}
              aria-label="Close"
            ></button>
          </div>
        )}

        <div
          className="card shadow-lg rounded-4 mb-4"
          style={{ backgroundColor: '#161b22', border: '1px solid #30363d' }}
        >
          <div
            className="card-header py-3 rounded-top-4"
            style={{ backgroundColor: '#1f6feb', border: 'none' }}
          >
            <h4 className="mb-0 fw-bold text-white">
              {folhaCarregada ? '📝 Editando Registro Diário' : '📝 Novo Registro Diário'}
            </h4>
          </div>

          <div className="card-body p-4">
            <div className="row g-4 mb-4">
              <div className="col-md-6">
                <label htmlFor="produto" className="form-label fw-semibold" style={{ color: '#c9d1d9' }}>
                  1. Produto
                </label>
                <select
                  id="produto"
                  className="form-select form-select-lg"
                  style={{
                    backgroundColor: '#0d1117',
                    color: '#c9d1d9',
                    border: '1px solid #30363d',
                  }}
                  value={produtoId}
                  onChange={(e) => setProdutoId(e.target.value)}
                  disabled={loading}
                >
                  <option value="">Selecione um produto...</option>
                  {produtos.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label htmlFor="data" className="form-label fw-semibold" style={{ color: '#c9d1d9' }}>
                  2. Data
                </label>
                <input
                  type="date"
                  id="data"
                  className="form-control form-control-lg"
                  style={{
                    backgroundColor: '#0d1117',
                    color: '#c9d1d9',
                    border: '1px solid #30363d',
                  }}
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            {loading && (
              <div className="text-center py-5">
                <div className="spinner-border" style={{ color: '#58a6ff' }} role="status">
                  <span className="visually-hidden">Carregando...</span>
                </div>
              </div>
            )}

            {!loading && !error && produtoId && data && (
              folhaCarregada ? (
                <AreaDeEdicao
                  folha={folhaCarregada}
                  tanques={tanques}
                  onAtualizar={handleAtualizacao}
                />
              ) : (
                <FormularioCriacao
                  produtoId={produtoId}
                  data={data}
                  tanques={tanques}
                  bicos={bicos}
                  onSalvar={handleAtualizacao}
                />
              )
            )}
          </div>
        </div>

        <div className="text-center mt-4">
          <p className="small mb-0" style={{ color: '#8b949e' }}>
            © 2024 Sistema LMC - Todos os direitos reservados
          </p>
        </div>
      </div>
    </div>
  );
}

export default LmcForm;
