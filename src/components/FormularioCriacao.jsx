import React, { useState, useEffect } from 'react';
import * as api from '../services/api';
import { toast } from 'react-hot-toast';

function FormularioCriacao({ produtoId, data, tanques, bicos, onSalvar }) {
  const [observacoes, setObservacoes] = useState('');
  const [medicoes, setMedicoes] = useState([]);
  const [vendas, setVendas] = useState([]);
  const [compras, setCompras] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (tanques.length > 0) {
      setMedicoes(
        tanques.map((t) => ({
          tanqueId: t.id,
          nome: t.numero,
          estoqueAbertura: '',
          estoqueFechamentoFisico: '',
        })),
      );
    }

    if (bicos.length > 0) {
      setVendas(
        bicos.map((b) => ({
          bicoId: b.id,
          nome: b.numero,
          nomeTanque: b.nomeTanque,
          precoNaBomba: '',
          encerranteAbertura: '',
          encerranteFechamento: '',
          afericoes: '0',
        })),
      );
    }

    setCompras([]);
    setObservacoes('');
  }, [tanques, bicos]);

  const handleMedicaoChange = (index, field, value) => {
    const novasMedicoes = [...medicoes];
    novasMedicoes[index][field] = value;
    setMedicoes(novasMedicoes);
  };

  const handleVendaChange = (index, field, value) => {
    const novasVendas = [...vendas];
    novasVendas[index][field] = value;
    setVendas(novasVendas);
  };

  const handleCompraChange = (index, field, value) => {
    const novasCompras = [...compras];
    novasCompras[index][field] = value;
    setCompras(novasCompras);
  };

  const adicionarCompra = () => {
    setCompras([
      ...compras,
      { tanqueDescargaId: '', numeroDocumentoFiscal: '', volumeRecebido: '' },
    ]);
  };

  const removerCompra = (index) => {
    const novasCompras = compras.filter((_, i) => i !== index);
    setCompras(novasCompras);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!produtoId || !data) {
      setError('Produto e Data são obrigatórios.');
      setLoading(false);
      return;
    }

    const lmcData = {
      data,
      produtoId,
      observacoes,
      medicoes: medicoes.map((m) => ({
        tanqueId: m.tanqueId,
        estoqueAbertura: parseFloat(m.estoqueAbertura) || 0,
        estoqueFechamentoFisico: parseFloat(m.estoqueFechamentoFisico) || 0,
      })),
      vendas: vendas.map((v) => ({
        bicoId: v.bicoId,
        precoNaBomba: parseFloat(v.precoNaBomba) || 0,
        encerranteAbertura: parseFloat(v.encerranteAbertura) || 0,
        encerranteFechamento: parseFloat(v.encerranteFechamento) || 0,
        afericoes: parseFloat(v.afericoes) || 0,
      })),
      compras: compras.map((c) => ({
        tanqueDescargaId: c.tanqueDescargaId,
        numeroDocumentoFiscal: c.numeroDocumentoFiscal,
        volumeRecebido: parseFloat(c.volumeRecebido) || 0,
      })),
    };

    try {
      await api.salvarFolhaLMC(lmcData);
      toast.success('Folha LMC salva com sucesso!');
      onSalvar();
    } catch (apiError) {
      console.error('Erro ao salvar LMC:', apiError);
      const errorMessage = apiError.response?.data?.message || 'Ocorreu um erro desconhecido.';
      setError(errorMessage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div
          className="alert alert-danger alert-dismissible fade show shadow-sm mb-4"
          role="alert"
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

      <div className="border-top pt-4 mt-4" style={{ borderColor: '#30363d' }}>
        <h5 className="fw-bold mb-3" style={{ color: '#58a6ff' }}>
          <span className="badge me-2" style={{ backgroundColor: '#1f6feb' }}>3</span>
          Medição dos Tanques
        </h5>
        <p className="small mb-3" style={{ color: '#8b949e' }}>
          Campos 3, 7 e 9 do LMC
        </p>

        {medicoes.map((med, index) => (
          <div
            key={med.tanqueId}
            className="card mb-3 shadow-sm"
            style={{ backgroundColor: '#0d1117', border: '1px solid #30363d' }}
          >
            <div className="card-body">
              <div className="row g-3 align-items-end">
                <div className="col-md-4">
                  <label className="form-label fw-semibold small" style={{ color: '#c9d1d9' }}>
                    🛢️ Tanque
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    style={{ backgroundColor: '#161b22', color: '#8b949e', border: '1px solid #30363d' }}
                    value={med.nome}
                    readOnly
                    disabled
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-semibold small" style={{ color: '#c9d1d9' }}>
                    📊 Estoque Abertura (L)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    style={{ backgroundColor: '#0d1117', color: '#c9d1d9', border: '1px solid #30363d' }}
                    value={med.estoqueAbertura}
                    onChange={(e) => handleMedicaoChange(index, 'estoqueAbertura', e.target.value)}
                    required
                    placeholder="0.00"
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-semibold small" style={{ color: '#c9d1d9' }}>
                    📏 Fechamento Físico (L)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    style={{ backgroundColor: '#0d1117', color: '#c9d1d9', border: '1px solid #30363d' }}
                    value={med.estoqueFechamentoFisico}
                    onChange={(e) => handleMedicaoChange(index, 'estoqueFechamentoFisico', e.target.value)}
                    required
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-top pt-4 mt-4" style={{ borderColor: '#30363d' }}>
        <h5 className="fw-bold mb-3" style={{ color: '#58a6ff' }}>
          <span className="badge me-2" style={{ backgroundColor: '#1f6feb' }}>4</span>
          Vendas por Bico
        </h5>
        <p className="small mb-3" style={{ color: '#8b949e' }}>
          Campos 13 a 18 do LMC
        </p>

        {vendas.map((venda, index) => (
          <div
            key={venda.bicoId}
            className="card mb-3 shadow-sm"
            style={{ backgroundColor: '#0d1117', border: '1px solid #30363d' }}
          >
            <div className="card-body">
              <div className="row g-3 align-items-end">
                <div className="col-md-3">
                  <label className="form-label fw-semibold small" style={{ color: '#c9d1d9' }}>
                    ⛽ Bico
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    style={{ backgroundColor: '#161b22', color: '#8b949e', border: '1px solid #30363d' }}
                    value={venda.nome}
                    readOnly
                    disabled
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label fw-semibold small" style={{ color: '#c9d1d9' }}>
                    🛢️ Tanque
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    style={{ backgroundColor: '#161b22', color: '#8b949e', border: '1px solid #30363d' }}
                    value={venda.nomeTanque}
                    readOnly
                    disabled
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label fw-semibold small" style={{ color: '#c9d1d9' }}>
                    💲 Preço na Bomba
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    style={{ backgroundColor: '#0d1117', color: '#c9d1d9', border: '1px solid #30363d' }}
                    value={venda.precoNaBomba}
                    onChange={(e) => handleVendaChange(index, 'precoNaBomba', e.target.value)}
                    required
                    placeholder="0.00"
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label fw-semibold small" style={{ color: '#c9d1d9' }}>
                    ⚖️ Aferições (L)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    style={{ backgroundColor: '#0d1117', color: '#c9d1d9', border: '1px solid #30363d' }}
                    value={venda.afericoes}
                    onChange={(e) => handleVendaChange(index, 'afericoes', e.target.value)}
                    required
                    placeholder="0.00"
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label fw-semibold small" style={{ color: '#c9d1d9' }}>
                    🔢 Encerrante Abertura
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    style={{ backgroundColor: '#0d1117', color: '#c9d1d9', border: '1px solid #30363d' }}
                    value={venda.encerranteAbertura}
                    onChange={(e) => handleVendaChange(index, 'encerranteAbertura', e.target.value)}
                    required
                    placeholder="0.00"
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label fw-semibold small" style={{ color: '#c9d1d9' }}>
                    🔢 Encerrante Fechamento
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    style={{ backgroundColor: '#0d1117', color: '#c9d1d9', border: '1px solid #30363d' }}
                    value={venda.encerranteFechamento}
                    onChange={(e) => handleVendaChange(index, 'encerranteFechamento', e.target.value)}
                    required
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-top pt-4 mt-4" style={{ borderColor: '#30363d' }}>
        <h5 className="fw-bold mb-3" style={{ color: '#58a6ff' }}>
          <span className="badge me-2" style={{ backgroundColor: '#1f6feb' }}>5</span>
          Recebimentos (Compras)
        </h5>
        <p className="small mb-3" style={{ color: '#8b949e' }}>
          Campos 10 e 11 do LMC
        </p>

        {compras.map((compra, index) => (
          <div
            key={index}
            className="card mb-3 shadow-sm"
            style={{ backgroundColor: '#0d1117', border: '1px solid #30363d' }}
          >
            <div className="card-body">
              <div className="row g-3 align-items-end">
                <div className="col-md-4">
                  <label className="form-label fw-semibold small" style={{ color: '#c9d1d9' }}>
                    🛢️ Tanque de Descarga
                  </label>
                  <select
                    className="form-select"
                    style={{ backgroundColor: '#0d1117', color: '#c9d1d9', border: '1px solid #30363d' }}
                    value={compra.tanqueDescargaId}
                    onChange={(e) => handleCompraChange(index, 'tanqueDescargaId', e.target.value)}
                    required
                  >
                    <option value="">Selecione...</option>
                    {tanques.map((tanque) => (
                      <option key={tanque.id} value={tanque.id}>
                        {tanque.numero}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-semibold small" style={{ color: '#c9d1d9' }}>
                    📄 NF
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    style={{ backgroundColor: '#0d1117', color: '#c9d1d9', border: '1px solid #30363d' }}
                    value={compra.numeroDocumentoFiscal}
                    onChange={(e) => handleCompraChange(index, 'numeroDocumentoFiscal', e.target.value)}
                    required
                    placeholder="Documento"
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-semibold small" style={{ color: '#c9d1d9' }}>
                    🚚 Volume Recebido (L)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    style={{ backgroundColor: '#0d1117', color: '#c9d1d9', border: '1px solid #30363d' }}
                    value={compra.volumeRecebido}
                    onChange={(e) => handleCompraChange(index, 'volumeRecebido', e.target.value)}
                    required
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="text-end mt-3">
                <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => removerCompra(index)}>
                  Remover
                </button>
              </div>
            </div>
          </div>
        ))}

        <button type="button" className="btn btn-outline-primary" onClick={adicionarCompra}>
          Adicionar Compra
        </button>
      </div>

      <div className="border-top pt-4 mt-4" style={{ borderColor: '#30363d' }}>
        <h5 className="fw-bold mb-3" style={{ color: '#58a6ff' }}>
          <span className="badge me-2" style={{ backgroundColor: '#1f6feb' }}>6</span>
          Observações Gerais
        </h5>
        <textarea
          className="form-control shadow-sm"
          rows="4"
          style={{ backgroundColor: '#0d1117', color: '#c9d1d9', border: '1px solid #30363d' }}
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
          placeholder="Justificativas para variações de estoque, perdas ou ganhos."
        ></textarea>
      </div>

      <div className="d-flex justify-content-end gap-2 mt-4">
        <button type="reset" className="btn btn-outline-secondary" disabled={loading}>
          Limpar
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar Folha LMC'}
        </button>
      </div>
    </form>
  );
}

export default FormularioCriacao;
