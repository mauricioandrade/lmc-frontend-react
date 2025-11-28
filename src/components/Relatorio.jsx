import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { getRelatorio } from '../services/api';

const formatarData = (dataString) => {
  if (!dataString) return 'N/A';

  const [ano, mes, dia] = dataString.split('T')[0].split('-');
  return `${dia}/${mes}/${ano}`;
};

const formatarLitros = (valor) => `${Number(valor || 0).toFixed(2)} L`;

function Relatorio() {
  const [relatorios, setRelatorios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [dataFim, setDataFim] = useState(() => new Date().toISOString().split('T')[0]);
  const [dataInicio, setDataInicio] = useState(() =>
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString()
      .split('T')[0]
  );

  const buscarRelatorio = useCallback((inicio, fim) => {
    setLoading(true);
    setError(null);
    setRelatorios([]);

    getRelatorio(inicio, fim)
      .then((response) => {
        setRelatorios(response.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erro ao buscar relatório:', err);
        setError('Não foi possível carregar o relatório.');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    buscarRelatorio(dataInicio, dataFim);
    // Executa apenas na montagem para evitar requisições duplicadas ao alterar filtros
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBuscarRelatorio = useCallback(() => {
    buscarRelatorio(dataInicio, dataFim);
  }, [buscarRelatorio, dataFim, dataInicio]);

  const exportarPdfUrl = useMemo(
    () => `http://localhost:8080/api/lmc/relatorio/pdf?inicio=${dataInicio}&fim=${dataFim}`,
    [dataFim, dataInicio]
  );

  const relatoriosProcessados = useMemo(() => {
    if (!Array.isArray(relatorios)) {
      return [];
    }

    return relatorios.map((folha) => {
      const medicoesTanque = Array.isArray(folha.medicoesTanque) ? folha.medicoesTanque : [];
      const estoqueAberturaTotal = medicoesTanque.reduce(
        (acc, medicao) => acc + Number(medicao?.estoqueAbertura || 0),
        0
      );

      return {
        id: folha.id,
        dataFormatada: formatarData(folha.data),
        produtoNome: folha.produto?.nome || 'N/A',
        estoqueAbertura: formatarLitros(estoqueAberturaTotal),
        totalRecebido: formatarLitros(folha.totalRecebido),
        totalVendas: formatarLitros(folha.totalVendasDia),
        estoqueEscritural: formatarLitros(folha.estoqueEscritural),
        estoqueFisico: formatarLitros(folha.estoqueFechamento),
        perdasGanhos: formatarLitros(folha.perdasGanhos),
        perdasGanhosClass: (Number(folha.perdasGanhos) || 0) < 0 ? 'text-danger' : 'text-success',
      };
    });
  }, [relatorios]);

  const handleSubmit = (event) => {
    event.preventDefault();
    handleBuscarRelatorio();
  };

  return (
    <section className="page-section">
      <div className="page-section__header page-section__header--left">
        <h2 className="page-section__title page-section__title--secondary">Relatório de Movimentações</h2>
        <p className="page-section__subtitle">
          Consulte rapidamente o histórico de entradas e saídas por período e exporte os dados em PDF.
        </p>
      </div>

      <div className="card surface-card">
        <div className="card-body surface-card__body">
          <form onSubmit={handleSubmit} className="mb-4">
            <div className="row g-3 align-items-end">
              <div className="col-md-4">
                <label htmlFor="dataInicio" className="form-label">Data Início</label>
                <input
                  type="date"
                  className="form-control"
                  id="dataInicio"
                  value={dataInicio}
                  onChange={e => setDataInicio(e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="dataFim" className="form-label">Data Fim</label>
                <input
                  type="date"
                  className="form-control"
                  id="dataFim"
                  value={dataFim}
                  onChange={e => setDataFim(e.target.value)}
                />
              </div>
              <div className="col-md-4 d-flex flex-column flex-md-row gap-2">
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? 'Buscando...' : 'Buscar'}
                </button>
                <a
                  href={exportarPdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-light w-100"
                >
                  Exportar PDF
                </a>
              </div>
            </div>
          </form>

          {loading && (
            <div className="text-center text-muted mt-5">
              <div className="spinner-border text-primary" role="status" />
              <p className="mt-3">Carregando relatórios...</p>
            </div>
          )}

          {error && <div className="alert alert-danger">{error}</div>}

          {!loading && (
            <>
              {relatoriosProcessados.length === 0 ? (
                <p className="card-text text-muted mb-0">Nenhum registro encontrado no período.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-dark table-striped table-hover align-middle">
                    <thead>
                      <tr>
                        <th scope="col">Data</th>
                        <th scope="col">Produto</th>
                        <th scope="col">Est. Abertura</th>
                        <th scope="col">Recebido</th>
                        <th scope="col">Vendas</th>
                        <th scope="col">Est. Escritural</th>
                        <th scope="col">Est. Físico</th>
                        <th scope="col">Perdas/Ganhos</th>
                      </tr>
                    </thead>
                    <tbody>
                      {relatoriosProcessados.map((folha) => (
                        <tr key={folha.id}>
                          <td>{folha.dataFormatada}</td>
                          <td>{folha.produtoNome}</td>
                          <td>{folha.estoqueAbertura}</td>
                          <td>{folha.totalRecebido}</td>
                          <td>{folha.totalVendas}</td>
                          <td>{folha.estoqueEscritural}</td>
                          <td>{folha.estoqueFisico}</td>
                          <td className={folha.perdasGanhosClass}>{folha.perdasGanhos}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default Relatorio;