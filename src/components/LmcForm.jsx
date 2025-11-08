import React from 'react';
import { toast } from 'react-hot-toast';
import { useLmcForm } from '../hooks/useLmcForm';
import FormularioCriacao from './FormularioCriacao';
import AreaDeEdicao from './AreaDeEdicao';

function LmcForm() {
  const {
    produtos,
    tanques,
    bicos,
    folhaCarregada,
    filters,
    updateFilters,
    loading,
    error,
    clearError,
    refreshFolha,
  } = useLmcForm();

  const handleAtualizacao = () => {
    toast.success('Dados atualizados!');
    refreshFolha();
  };

  const handleProdutoChange = (event) => {
    updateFilters({ produtoId: event.target.value });
  };

  const handleDataChange = (event) => {
    updateFilters({ data: event.target.value });
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center py-4 px-3"
      style={{
        backgroundColor: '#0d1117',
        width: '100%',
        margin: 0,
        padding: '2rem 1rem',
      }}
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
              onClick={clearError}
              aria-label="Close"
            ></button>
          </div>
        )}

        <div
          className="card shadow-lg rounded-4 mb-4"
          style={{ backgroundColor: '#161b22', border: '1px solid #30363d' }}
        >
          <div className="card-header py-3 rounded-top-4" style={{ backgroundColor: '#1f6feb', border: 'none' }}>
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
                  value={filters.produtoId}
                  onChange={handleProdutoChange}
                  disabled={loading}
                >
                  <option value="">Selecione um produto...</option>
                  {produtos.map((produto) => (
                    <option key={produto.id} value={produto.id}>
                      {produto.nome}
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
                  value={filters.data}
                  onChange={handleDataChange}
                  disabled={loading}
                />
              </div>
            </div>

            {loading && (
              <p className="text-center" style={{ color: '#8b949e' }}>
                Carregando dados...
              </p>
            )}

            {!loading && !folhaCarregada && filters.produtoId && (
              <FormularioCriacao
                produtoId={filters.produtoId}
                dataSelecionada={filters.data}
                tanques={tanques}
                bicos={bicos}
                onAtualizar={handleAtualizacao}
              />
            )}

            {!loading && folhaCarregada && (
              <AreaDeEdicao
                folha={folhaCarregada}
                tanques={tanques}
                bicos={bicos}
                onAtualizar={handleAtualizacao}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LmcForm;
