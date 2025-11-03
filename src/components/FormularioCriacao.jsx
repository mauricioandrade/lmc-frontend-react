// src/components/FormularioCriacao.jsx
// Este é o componente filho para "Criação" de novos registros

import React, { useState, useEffect } from 'react';
import * as api from '../services/api'; 
import { toast } from 'react-hot-toast';

function FormularioCriacao({ produtoId, data, tanques, bicos, onSalvar }) {
  // Estados do Formulário
  const [observacoes, setObservacoes] = useState('');
  const [medicoes, setMedicoes] = useState([]);
  const [vendas, setVendas] = useState([]);
  const [compras, setCompras] = useState([]);
  
  // Estados de UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Efeito para popular os formulários vazios quando tanques/bicos (props) mudarem
  useEffect(() => {
    if (tanques.length > 0) {
      setMedicoes(tanques.map(t => ({
        tanqueId: t.id,
        nome: t.numero,
        estoqueAbertura: '',
        estoqueFechamentoFisico: ''
      })));
    }
    
    if (bicos.length > 0) {
      setVendas(bicos.map(b => ({
        bicoId: b.id,
        nome: b.numero,
        nomeTanque: b.nomeTanque,
        precoNaBomba: '',
        encerranteAbertura: '',
        encerranteFechamento: '',
        afericoes: '0'
      })));
    }

    setCompras([]);
    setObservacoes('');

  }, [tanques, bicos]);

  // Handlers
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
      { tanqueDescargaId: '', numeroDocumentoFiscal: '', volumeRecebido: '' }
    ]);
  };

  const removerCompra = (index) => {
    const novasCompras = compras.filter((_, i) => i !== index);
    setCompras(novasCompras);
  };
  
  // Lógica de Submissão (POST)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!produtoId || !data) {
      setError("Produto e Data são obrigatórios.");
      setLoading(false);
      return;
    }

    const lmcData = {
      data: data,
      produtoId: produtoId,
      observacoes: observacoes,
      medicoes: medicoes.map(m => ({
        tanqueId: m.tanqueId,
        estoqueAbertura: parseFloat(m.estoqueAbertura) || 0,
        estoqueFechamentoFisico: parseFloat(m.estoqueFechamentoFisico) || 0
      })),
      vendas: vendas.map(v => ({
        bicoId: v.bicoId,
        precoNaBomba: parseFloat(v.precoNaBomba) || 0,
        encerranteAbertura: parseFloat(v.encerranteAbertura) || 0,
        encerranteFechamento: parseFloat(v.encerranteFechamento) || 0,
        afericoes: parseFloat(v.afericoes) || 0
      })),
      compras: compras.map(c => ({
        tanqueDescargaId: c.tanqueDescargaId,
        numeroDocumentoFiscal: c.numeroDocumentoFiscal,
        volumeRecebido: parseFloat(c.volumeRecebido) || 0
      }))
    };

    try {
      await api.salvarFolhaLMC(lmcData);
      toast.success("Folha LMC salva com sucesso!");
      onSalvar();
    } catch (apiError) {
      console.error("Erro ao salvar LMC:", apiError);
      const errorMessage = apiError.response?.data?.message || "Ocorreu um erro desconhecido.";
      setError(errorMessage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="alert alert-danger alert-dismissible fade show shadow-sm mb-4" 
             role="alert" 
             style={{ backgroundColor: '#3c1f1f', borderColor: '#8b3838', color: '#ff7b7b' }}>
          <strong>❌ Erro!</strong> {error}
          <button type="button" 
                  className="btn-close btn-close-white" 
                  onClick={() => setError(null)}
                  aria-label="Close"></button>
        </div>
      )}

      {/* Medição dos Tanques */}
      <div className="border-top pt-4 mt-4" style={{ borderColor: '#30363d' }}>
        <h5 className="fw-bold mb-3" style={{ color: '#58a6ff' }}>
          <span className="badge me-2" style={{ backgroundColor: '#1f6feb' }}>3</span>
          Medição dos Tanques
        </h5>
        <p className="small mb-3" style={{ color: '#8b949e' }}>
          Campos 3, 7 e 9 do LMC
        </p>
        
        {medicoes.map((med, index) => (
          <div key={med.tanqueId} 
               className="card mb-3 shadow-sm" 
               style={{ backgroundColor: '#0d1117', border: '1px solid #30363d' }}>
            <div className="card-body">
              <div className="row g-3 align-items-end">
                <div className="col-md-4">
                  <label className="form-label fw-semibold small" 
                         style={{ color: '#c9d1d9' }}>
                    🛢️ Tanque
                  </label>
                  <input type="text" 
                         className="form-control" 
                         style={{ backgroundColor: '#161b22', color: '#8b949e', border: '1px solid #30363d' }}
                         value={med.nome} 
                         readOnly 
                         disabled />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-semibold small" 
                         style={{ color: '#c9d1d9' }}>
                    📊 Estoque Abertura (L)
                  </label>
                  <input type="number" 
                         step="0.01" 
                         className="form-control" 
                         style={{ backgroundColor: '#0d1117', color: '#c9d1d9', border: '1px solid #30363d' }}
                         value={med.estoqueAbertura}
                         onChange={e => handleMedicaoChange(index, 'estoqueAbertura', e.target.value)}
                         required 
                         placeholder="0.00" />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-semibold small" 
                         style={{ color: '#c9d1d9' }}>
                    📏 Fechamento Físico (L)
                  </label>
                  <input type="number" 
                         step="0.01" 
                         className="form-control" 
                         style={{ backgroundColor: '#0d1117', color: '#c9d1d9', border: '1px solid #30363d' }}
                         value={med.estoqueFechamentoFisico}
                         onChange={e => handleMedicaoChange(index, 'estoqueFechamentoFisico', e.target.value)}
                         required 
                         placeholder="0.00" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recebimentos (Compras) */}
      <div className="border-top pt-4 mt-4" style={{ borderColor: '#30363d' }}>
        <h5 className="fw-bold mb-3" style={{ color: '#58a6ff' }}>
          <span className="badge me-2" style={{ backgroundColor: '#1f6feb' }}>4</span>
          Recebimentos (Compras)
        </h5>
        <p className="small mb-3" style={{ color: '#8b949e' }}>Campo 4 do LMC</p>
        
        {compras.map((compra, index) => (
          <div key={index} 
               className="card mb-3 shadow-sm" 
               style={{ backgroundColor: '#0d1117', border: '1px solid #30363d' }}>
            <div className="card-body">
              <div className="row g-3 align-items-end">
                <div className="col-md-4">
                  <label className="form-label fw-semibold small" 
                         style={{ color: '#c9d1d9' }}>
                    Nº Nota Fiscal
                  </label>
                  <input type="text" 
                         className="form-control" 
                         style={{ backgroundColor: '#0d1117', color: '#c9d1d9', border: '1px solid #30363d' }}
                         value={compra.numeroDocumentoFiscal}
                         onChange={e => handleCompraChange(index, 'numeroDocumentoFiscal', e.target.value)}
                         required 
                         placeholder="Nº da NF-e" />
                </div>
                <div className="col-md-3">
                  <label className="form-label fw-semibold small" 
                         style={{ color: '#c9d1d9' }}>
                    Tanque Descarga
                  </label>
                  <select className="form-select" 
                          style={{ backgroundColor: '#0d1117', color: '#c9d1d9', border: '1px solid #30363d' }}
                          value={compra.tanqueDescargaId}
                          onChange={e => handleCompraChange(index, 'tanqueDescargaId', e.target.value)}
                          required>
                    <option value="">Selecione...</option>
                    {tanques.map(t => (
                      <option key={t.id} value={t.id}>{t.numero}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label fw-semibold small" 
                         style={{ color: '#c9d1d9' }}>
                    Volume Recebido (L)
                  </label>
                  <input type="number" 
                         step="0.01" 
                         className="form-control" 
                         style={{ backgroundColor: '#0d1117', color: '#c9d1d9', border: '1px solid #30363d' }}
                         value={compra.volumeRecebido}
                         onChange={e => handleCompraChange(index, 'volumeRecebido', e.target.value)}
                         required 
                         placeholder="0.00" />
                </div>
                <div className="col-md-2">
                  <button type="button" 
                          className="btn btn-sm w-100" 
                          style={{ backgroundColor: '#da3633', color: 'white', border: 'none' }}
                          onClick={() => removerCompra(index)}>
                    Remover
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        <div className="text-end mb-3">
          <button 
            type="button" 
            className="btn btn-sm fw-bold"
            style={{ 
              color: '#2f81f7', 
              border: '1px solid #2f81f7',
              backgroundColor: 'transparent',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => { 
              e.target.style.backgroundColor = '#2f81f7'; 
              e.target.style.color = 'white'; 
            }}
            onMouseLeave={(e) => { 
              e.target.style.backgroundColor = 'transparent'; 
              e.target.style.color = '#2f81f7'; 
            }}
            onClick={adicionarCompra}>
            + Adicionar Compra
          </button>
        </div>
      </div>

      {/* Vendas por Bico */}
      <div className="border-top pt-4 mt-4" style={{ borderColor: '#30363d' }}>
        <h5 className="fw-bold mb-3" style={{ color: '#58a6ff' }}>
          <span className="badge me-2" style={{ backgroundColor: '#1f6feb' }}>5</span>
          Vendas por Bico
        </h5>
        <p className="small mb-3" style={{ color: '#8b949e' }}>Campo 5 do LMC</p>
        
        <div className="row g-3">
          {vendas.map((venda, index) => (
            <div key={venda.bicoId} className="col-md-6">
              <div className="card shadow-sm h-100" 
                   style={{ backgroundColor: '#0d1117', border: '1px solid #30363d' }}>
                <div className="card-header" 
                     style={{ backgroundColor: '#161b22', border: 'none' }}>
                  <h6 className="mb-0 fw-bold" style={{ color: '#c9d1d9' }}>
                    ⛽ {venda.nome}
                  </h6>
                  <small style={{ color: '#8b949e' }}>{venda.nomeTanque}</small>
                </div>
                <div className="card-body">
                  <div className="row g-2">
                    <div className="col-6">
                      <label className="form-label small fw-semibold" 
                             style={{ color: '#c9d1d9' }}>
                        Enc. Abertura
                      </label>
                      <input type="number" 
                             className="form-control form-control-sm" 
                             style={{ backgroundColor: '#0d1117', color: '#c9d1d9', border: '1px solid #30363d' }}
                             value={venda.encerranteAbertura}
                             onChange={e => handleVendaChange(index, 'encerranteAbertura', e.target.value)}
                             required 
                             placeholder="0" />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold" 
                             style={{ color: '#c9d1d9' }}>
                        Enc. Fechamento
                      </label>
                      <input type="number" 
                             className="form-control form-control-sm" 
                             style={{ backgroundColor: '#0d1117', color: '#c9d1d9', border: '1px solid #30363d' }}
                             value={venda.encerranteFechamento}
                             onChange={e => handleVendaChange(index, 'encerranteFechamento', e.target.value)}
                             required 
                             placeholder="0" />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold" 
                             style={{ color: '#c9d1d9' }}>
                        💰 Preço (R$)
                      </label>
                      <input type="number" 
                             step="0.001" 
                             className="form-control form-control-sm" 
                             style={{ backgroundColor: '#0d1117', color: '#c9d1d9', border: '1px solid #30363d' }}
                             value={venda.precoNaBomba}
                             onChange={e => handleVendaChange(index, 'precoNaBomba', e.target.value)}
                             required 
                             placeholder="0.000" />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold" 
                             style={{ color: '#c9d1d9' }}>
                        🔧 Aferições (L)
                      </label>
                      <input type="number" 
                             step="0.01" 
                             className="form-control form-control-sm" 
                             style={{ backgroundColor: '#0d1117', color: '#c9d1d9', border: '1px solid #30363d' }}
                             value={venda.afericoes}
                             onChange={e => handleVendaChange(index, 'afericoes', e.target.value)}
                             required 
                             placeholder="0.00" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Observações */}
      <div className="border-top pt-4 mt-4" style={{ borderColor: '#30363d' }}>
        <h5 className="fw-bold mb-3" style={{ color: '#58a6ff' }}>
          <span className="badge me-2" style={{ backgroundColor: '#1f6feb' }}>6</span>
          Observações
        </h5>
        <p className="small mb-3" style={{ color: '#8b949e' }}>
          Campo 13 - Justificativas (obrigatório se variação &gt; 0.6%)
        </p>
        
        <textarea 
          className="form-control shadow-sm" 
          id="observacoes" 
          rows="4"
          style={{ backgroundColor: '#0d1117', color: '#c9d1d9', border: '1px solid #30363d' }}
          value={observacoes}
          onChange={e => setObservacoes(e.target.value)}
          placeholder="Digite aqui justificativas para variações de estoque superiores a 0,6%..."
        ></textarea>
      </div>

      {/* Botão de Salvar */}
      <div className="card-footer border-0 p-4 rounded-bottom-4" 
           style={{ backgroundColor: '#161b22', borderTop: '1px solid #30363d' }}>
        <div className="d-grid">
          <button 
            type="submit" 
            className="btn btn-lg fw-bold shadow"
            disabled={!produtoId || loading}
            style={{ 
              backgroundColor: loading ? '#1a7f37' : '#238636',
              color: '#ffffff',
              border: 'none',
              transition: 'all 0.3s ease',
              opacity: (!produtoId || loading) ? 0.6 : 1,
              cursor: (!produtoId || loading) ? 'not-allowed' : 'pointer'
            }}
            onMouseEnter={(e) => {
              if (!loading && produtoId) {
                e.target.style.backgroundColor = '#2ea043';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = '#238636';
              }
            }}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Salvando...
              </>
            ) : (
              '💾 Salvar Registro Diário'
            )}
          </button>
        </div>
      </div>
    </form>
  );
}

export default FormularioCriacao;