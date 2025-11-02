// src/components/LmcForm.jsx
import React, { useState, useEffect } from 'react';
import * as api from '../services/api'; 

function LmcForm() {
  // --- Estados de Dados ---
  const [produtos, setProdutos] = useState([]); 
  const [tanques, setTanques] = useState([]);
  const [bicos, setBicos] = useState([]);

  // --- Estados do Formulário ---
  const [data, setData] = useState(new Date().toISOString().split('T')[0]);
  const [produtoId, setProdutoId] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [medicoes, setMedicoes] = useState([]);
  const [vendas, setVendas] = useState([]);

  // --- Estados de UI (Feedback) ---
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // --- Efeito de Carregamento Inicial (Produtos) ---
  useEffect(() => {
    console.log('🔍 Buscando produtos...');
    
    api.getProdutos()
      .then(response => {
        console.log('✅ Sucesso! response.data:', response.data);
        setProdutos(response.data);
      })
      .catch(err => {
        console.error("❌ Erro ao buscar produtos:", err);
        setError("Não foi possível carregar os produtos da API.");
      });
  }, []);

  // --- Lógica de Seleção em Cascata ---
  const handleProdutoChange = async (e) => {
    const pid = e.target.value;
    setProdutoId(pid);
    
    setTanques([]);
    setBicos([]);
    setMedicoes([]);
    setVendas([]);
    setError(null);
    setSuccess(null);

    if (!pid) return;

    setLoading(true);
    try {
      const tanquesResponse = await api.getTanquesPorProduto(pid);
      const tanquesData = tanquesResponse.data;
      setTanques(tanquesData);

      const medicoesIniciais = tanquesData.map(t => ({
        tanqueId: t.id,
        nome: t.numero,
        estoqueAbertura: '',
        estoqueFechamentoFisico: ''
      }));
      setMedicoes(medicoesIniciais);

      let todosBicos = [];
      for (const tanque of tanquesData) {
        const bicosResponse = await api.getBicosPorTanque(tanque.id);
        const bicosComTanque = bicosResponse.data.map(b => ({
          ...b,
          nomeTanque: tanque.numero
        }));
        todosBicos = [...todosBicos, ...bicosComTanque];
      }
      setBicos(todosBicos);

      const vendasIniciais = todosBicos.map(b => ({
        bicoId: b.id,
        nome: b.numero,
        nomeTanque: b.nomeTanque,
        precoNaBomba: '',
        encerranteAbertura: '',
        encerranteFechamento: '',
        afericoes: '0'
      }));
      setVendas(vendasIniciais);

    } catch (err) {
      console.error("Erro ao buscar tanques/bicos:", err);
      setError("Não foi possível carregar os tanques e bicos.");
    }
    setLoading(false);
  };

  // --- Handlers para Atualizar os Estados Complexos ---
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

  // --- Lógica de Submissão ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const lmcData = {
      data: data,
      produtoId: produtoId,
      observacoes: observacoes,
      medicoes: medicoes.map(m => ({
        tanqueId: m.tanqueId,
        estoqueAbertura: m.estoqueAbertura,
        estoqueFechamentoFisico: m.estoqueFechamentoFisico
      })),
      vendas: vendas.map(v => ({
        bicoId: v.bicoId,
        precoNaBomba: v.precoNaBomba,
        encerranteAbertura: v.encerranteAbertura,
        encerranteFechamento: v.encerranteFechamento,
        afericoes: v.afericoes
      })),
      compras: []
    };

    try {
      const response = await api.salvarFolhaLMC(lmcData);
      setSuccess(`Folha LMC salva com sucesso! (ID: ${response.data.id})`);
      setProdutoId('');
      setMedicoes([]);
      setVendas([]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (apiError) {
      console.error("Erro ao salvar LMC:", apiError);
      const errorMessage = apiError.response?.data?.message || "Ocorreu um erro desconhecido.";
      setError(errorMessage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setLoading(false);
  };

  // --- Renderização (JSX) ---
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center py-4 px-3" style={{ 
      backgroundColor: '#0d1117',
      width: '100%',
      margin: 0,
      padding: '2rem 1rem'
    }}>
      <div className="container" style={{ maxWidth: '900px', width: '100%' }}>
        
        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="display-5 fw-bold mb-2" style={{ color: '#58a6ff' }}>
            ⛽ LMC - Livro de Movimentação de Combustíveis
          </h1>
          <p className="fs-6" style={{ color: '#8b949e' }}>
            Registro diário (React + Bootstrap) - Resolução ANP Nº 884
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="alert alert-dismissible fade show shadow-sm mb-4" role="alert" style={{ backgroundColor: '#da3633', color: '#ffffff', border: 'none' }}>
            <strong>❌ Erro!</strong> {error}
            <button type="button" className="btn-close btn-close-white" onClick={() => setError(null)}></button>
          </div>
        )}
        
        {success && (
          <div className="alert alert-dismissible fade show shadow-sm mb-4" role="alert" style={{ backgroundColor: '#238636', color: '#ffffff', border: 'none' }}>
            <strong>✅ Sucesso!</strong> {success}
            <button type="button" className="btn-close btn-close-white" onClick={() => setSuccess(null)}></button>
          </div>
        )}

        {/* Formulário Principal */}
        <div onSubmit={handleSubmit}>
          <div className="card shadow-lg rounded-4 mb-4" style={{ backgroundColor: '#161b22', border: '1px solid #30363d' }}>
            <div className="card-header py-3 rounded-top-4" style={{ backgroundColor: '#1f6feb', border: 'none' }}>
              <h4 className="mb-0 fw-bold text-white">📝 Novo Registro Diário</h4>
            </div>
            
            <div className="card-body p-4">
              <div className="row g-4 mb-4">
                <div className="col-md-6">
                  <label htmlFor="produto" className="form-label fw-semibold" style={{ color: '#c9d1d9' }}>
                    <span className="badge me-2" style={{ backgroundColor: '#1f6feb' }}>1</span>
                    Produto
                  </label>
                  <select 
                    id="produto" 
                    className="form-select form-select-lg shadow-sm" 
                    style={{ backgroundColor: '#0d1117', color: '#c9d1d9', border: '1px solid #30363d' }}
                    value={produtoId} 
                    onChange={handleProdutoChange}
                    disabled={loading}
                  >
                    <option value="">Selecione um produto...</option>
                    {produtos.map(p => (
                      <option key={p.id} value={p.id}>{p.nome}</option>
                    ))}
                  </select>
                </div>
                
                <div className="col-md-6">
                  <label htmlFor="data" className="form-label fw-semibold" style={{ color: '#c9d1d9' }}>
                    <span className="badge me-2" style={{ backgroundColor: '#1f6feb' }}>2</span>
                    Data
                  </label>
                  <input 
                    type="date" 
                    id="data" 
                    className="form-control form-control-lg shadow-sm"
                    style={{ backgroundColor: '#0d1117', color: '#c9d1d9', border: '1px solid #30363d' }}
                    value={data}
                    onChange={e => setData(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              {loading && (
                <div className="text-center py-5">
                  <div className="spinner-border" role="status" style={{ width: '3rem', height: '3rem', color: '#58a6ff' }}>
                    <span className="visually-hidden">Carregando...</span>
                  </div>
                  <p className="mt-3" style={{ color: '#8b949e' }}>Carregando dados...</p>
                </div>
              )}

              {produtoId && !loading && (
                <>
                  {/* Medição dos Tanques */}
                  <div className="border-top pt-4 mt-4" style={{ borderColor: '#30363d !important' }}>
                    <h5 className="fw-bold mb-3" style={{ color: '#58a6ff' }}>
                      <span className="badge me-2" style={{ backgroundColor: '#1f6feb' }}>3</span>
                      Medição dos Tanques
                    </h5>
                    <p className="small mb-3" style={{ color: '#8b949e' }}>Campos 3, 7 e 9 do LMC</p>
                    
                    {medicoes.map((med, index) => (
                      <div key={med.tanqueId} className="card mb-3 shadow-sm" style={{ backgroundColor: '#0d1117', border: '1px solid #30363d' }}>
                        <div className="card-body">
                          <div className="row g-3 align-items-end">
                            <div className="col-md-4">
                              <label className="form-label fw-semibold small" style={{ color: '#c9d1d9' }}>🛢️ Tanque</label>
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
                              <label className="form-label fw-semibold small" style={{ color: '#c9d1d9' }}>📊 Estoque Abertura (L)</label>
                              <input 
                                type="number" 
                                step="0.01"
                                className="form-control"
                                style={{ backgroundColor: '#0d1117', color: '#c9d1d9', border: '1px solid #30363d' }}
                                value={med.estoqueAbertura}
                                onChange={e => handleMedicaoChange(index, 'estoqueAbertura', e.target.value)} 
                                required 
                                placeholder="0.00"
                              />
                            </div>
                            <div className="col-md-4">
                              <label className="form-label fw-semibold small" style={{ color: '#c9d1d9' }}>📏 Fechamento Físico (L)</label>
                              <input 
                                type="number" 
                                step="0.01"
                                className="form-control" 
                                style={{ backgroundColor: '#0d1117', color: '#c9d1d9', border: '1px solid #30363d' }}
                                value={med.estoqueFechamentoFisico}
                                onChange={e => handleMedicaoChange(index, 'estoqueFechamentoFisico', e.target.value)} 
                                required
                                placeholder="0.00"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Vendas por Bico */}
                  <div className="border-top pt-4 mt-4" style={{ borderColor: '#30363d !important' }}>
                    <h5 className="fw-bold mb-3" style={{ color: '#58a6ff' }}>
                      <span className="badge me-2" style={{ backgroundColor: '#1f6feb' }}>4</span>
                      Vendas por Bico
                    </h5>
                    <p className="small mb-3" style={{ color: '#8b949e' }}>Campo 5 do LMC</p>
                    
                    <div className="row g-3">
                      {vendas.map((venda, index) => (
                        <div key={venda.bicoId} className="col-md-6">
                          <div className="card shadow-sm h-100" style={{ backgroundColor: '#0d1117', border: '1px solid #30363d' }}>
                            <div className="card-header" style={{ backgroundColor: '#161b22', border: 'none' }}>
                              <h6 className="mb-0 fw-bold" style={{ color: '#c9d1d9' }}>⛽ {venda.nome}</h6>
                              <small style={{ color: '#8b949e' }}>{venda.nomeTanque}</small>
                            </div>
                            <div className="card-body">
                              <div className="row g-2">
                                <div className="col-6">
                                  <label className="form-label small fw-semibold" style={{ color: '#c9d1d9' }}>Enc. Abertura</label>
                                  <input 
                                    type="number" 
                                    className="form-control form-control-sm"
                                    style={{ backgroundColor: '#0d1117', color: '#c9d1d9', border: '1px solid #30363d' }}
                                    value={venda.encerranteAbertura}
                                    onChange={e => handleVendaChange(index, 'encerranteAbertura', e.target.value)}
                                    required
                                    placeholder="0"
                                  />
                                </div>
                                <div className="col-6">
                                  <label className="form-label small fw-semibold" style={{ color: '#c9d1d9' }}>Enc. Fechamento</label>
                                  <input 
                                    type="number" 
                                    className="form-control form-control-sm"
                                    style={{ backgroundColor: '#0d1117', color: '#c9d1d9', border: '1px solid #30363d' }}
                                    value={venda.encerranteFechamento}
                                    onChange={e => handleVendaChange(index, 'encerranteFechamento', e.target.value)}
                                    required
                                    placeholder="0"
                                  />
                                </div>
                                <div className="col-6">
                                  <label className="form-label small fw-semibold" style={{ color: '#c9d1d9' }}>💰 Preço (R$)</label>
                                  <input 
                                    type="number" 
                                    step="0.001" 
                                    className="form-control form-control-sm"
                                    style={{ backgroundColor: '#0d1117', color: '#c9d1d9', border: '1px solid #30363d' }}
                                    value={venda.precoNaBomba}
                                    onChange={e => handleVendaChange(index, 'precoNaBomba', e.target.value)}
                                    required
                                    placeholder="0.000"
                                  />
                                </div>
                                <div className="col-6">
                                  <label className="form-label small fw-semibold" style={{ color: '#c9d1d9' }}>🔧 Aferições (L)</label>
                                  <input 
                                    type="number" 
                                    step="0.01" 
                                    className="form-control form-control-sm"
                                    style={{ backgroundColor: '#0d1117', color: '#c9d1d9', border: '1px solid #30363d' }}
                                    value={venda.afericoes}
                                    onChange={e => handleVendaChange(index, 'afericoes', e.target.value)}
                                    required
                                    placeholder="0.00"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Observações */}
                  <div className="border-top pt-4 mt-4" style={{ borderColor: '#30363d !important' }}>
                    <h5 className="fw-bold mb-3" style={{ color: '#58a6ff' }}>
                      <span className="badge me-2" style={{ backgroundColor: '#1f6feb' }}>5</span>
                      Observações
                    </h5>
                    <p className="small mb-3" style={{ color: '#8b949e' }}>Campo 13 - Justificativas (obrigatório se variação &gt; 0.6%)</p>
                    
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
                </>
              )}
            </div>

            <div className="card-footer border-0 p-4 rounded-bottom-4" style={{ backgroundColor: '#161b22', borderTop: '1px solid #30363d' }}>
              <div className="d-grid">
                <button 
                  type="button"
                  onClick={handleSubmit}
                  className="btn btn-lg fw-bold shadow"
                  disabled={!produtoId || loading}
                  style={{ 
                    backgroundColor: '#238636', 
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '10px',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#2ea043'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#238636'}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Salvando...
                    </>
                  ) : (
                    <>💾 Salvar Registro Diário</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-4">
          <p className="small mb-0" style={{ color: '#8b949e' }}>
            © 2025 Sistema LMC - Desenvolvido com React + Bootstrap
          </p>
        </div>
      </div>
    </div>
  );
}

export default LmcForm;