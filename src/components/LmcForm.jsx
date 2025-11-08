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
    <section className="page-section">
      <div className="page-section__header">
        <h1 className="page-section__title">📊 Sistema LMC</h1>
        <p className="page-section__subtitle">
          Gestão de Leituras de Medição de Combustível com foco em clareza e produtividade.
        </p>
      </div>

      {error && (
        <div className="feedback-banner feedback-banner--error" role="alert">
          <strong>❌ Erro!</strong>
          <span>{error}</span>
          <button
            type="button"
            className="feedback-banner__close"
            onClick={clearError}
            aria-label="Fechar alerta"
          >
            ×
          </button>
        </div>
      )}

      <div className="card surface-card">
        <div className="card-header surface-card__header">
          <h4 className="mb-0 fw-bold">
            {folhaCarregada ? '📝 Editando Registro Diário' : '📝 Novo Registro Diário'}
          </h4>
        </div>

        <div className="card-body surface-card__body">
          <div className="row g-4 mb-4">
            <div className="col-md-6">
              <label htmlFor="produto" className="form-label fw-semibold">
                1. Produto
              </label>
              <select
                id="produto"
                className="form-select form-select-lg"
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
              <label htmlFor="data" className="form-label fw-semibold">
                2. Data
              </label>
              <input
                type="date"
                id="data"
                className="form-control form-control-lg"
                value={filters.data}
                onChange={handleDataChange}
                disabled={loading}
              />
            </div>
          </div>

          {loading && (
            <p className="text-center text-muted mb-0">Carregando dados...</p>
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
    </section>
  );
}

export default LmcForm;
