// src/components/AreaDeEdicao.jsx
import React, { useState } from 'react';
import * as api from '../services/api';
import { toast } from 'react-hot-toast';
import ModalMedicao from './ModalMedicao'; 
import ModalVenda from './ModalVenda'; 
import ModalCompra from './ModalCompra'; 

// ... (Componente ItemLinha) ...
const ItemLinha = ({ label, details, onEdit, onDelete }) => (
    <div className="d-flex justify-content-between align-items-center p-2 mb-2 rounded" style={{ backgroundColor: '#0d1117', border: '1px solid #30363d' }}>
        <span style={{ color: '#c9d1d9' }}>
          <strong style={{ color: '#c9d1d9' }}>{label}</strong> {details}
        </span>
        <div>
            <button onClick={onEdit} className="btn btn-sm btn-link" style={{ color: '#58a6ff', textDecoration: 'none' }} title="Editar">✏️</button>
            <button onClick={onDelete} className="btn btn-sm btn-link" style={{ color: '#da3633', textDecoration: 'none' }} title="Excluir">🗑️</button>
        </div>
    </div>
);


function AreaDeEdicao({ folha, tanques, bicos, onAtualizar }) {
  
  const [showModal, setShowModal] = useState(false);
  const [editandoItem, setEditandoItem] = useState(null);
  const [tipoModal, setTipoModal] = useState(''); // 'medicoes', 'compras', 'vendas'
  
  // --- 1. ESTADO PARA OBSERVAÇÕES E LOADING DO BOTÃO ---
  const [observacoes, setObservacoes] = useState(folha.observacoes || '');
  const [savingObs, setSavingObs] = useState(false);


  const handleExcluir = async (tipo, id) => {
    // ... (seu método de excluir) ...
    if (!window.confirm(`Tem certeza que deseja excluir este item (ID: ${id})?`)) {
        return;
    }
    try {
        switch (tipo) {
            case 'medicoes': await api.deletarMedicao(id); break;
            case 'compras': await api.deletarCompra(id); break;
            case 'vendas': await api.deletarVenda(id); break;
            default: throw new Error("Tipo de exclusão desconhecido");
        }
        toast.success("Item excluído com sucesso!");
        onAtualizar(); 
    } catch (error) {
        console.error("Erro ao excluir:", error);
        toast.error("Falha ao excluir o item.");
    }
  };

  const handleEditar = (item, tipo) => {
    // ... (seu método de editar) ...
    setEditandoItem(item);
    setTipoModal(tipo);
    if (tipo === 'medicoes' || tipo === 'vendas' || tipo === 'compras') { 
        setShowModal(true); 
    } else {
        toast.error(`Função "Editar ${tipo}" ainda não implementada.`);
    }
  };
  
  const handleAdicionar = (tipo) => {
    // ... (seu método de adicionar) ...
    setEditandoItem(null); 
    setTipoModal(tipo);
    if (tipo === 'medicoes' || tipo === 'vendas' || tipo === 'compras') { 
        setShowModal(true); 
    } else {
        toast.error(`Função "Adicionar ${tipo}" ainda não implementada.`);
    }
  }

  const handleCloseModal = () => {
    // ... (seu método de fechar modal) ...
    setShowModal(false);
    setEditandoItem(null);
    setTipoModal('');
  }
  
  // ... (Estilo btnAdicionarStyle) ...
  const btnAdicionarStyle = { 
    color: '#2f81f7', 
    border: '1px solid #2f81f7',
    backgroundColor: 'transparent'
  };

  // --- 2. NOVA FUNÇÃO PARA SALVAR OBSERVAÇÕES ---
  const handleSalvarObservacoes = async () => {
    setSavingObs(true);
    try {
      // Chama a nova função da API
      await api.atualizarObservacoes(folha.id, observacoes);
      toast.success("Observações salvas com sucesso!");
      // Opcional: recarregar a folha inteira caso a validação de 0.6% mude algo
      // onAtualizar(); 
    } catch (error) {
      console.error("Erro ao salvar observações:", error);
      toast.error(error.response?.data?.message || "Falha ao salvar observações.");
    } finally {
      setSavingObs(false);
    }
  };

  return (
    <div className="area-edicao">
      
      {/* Bloco de Medições (sem mudanças) */}
      <div className="border-top pt-4 mt-4" style={{ borderColor: '#30363d !important' }}>
        {/* ... (código do bloco de medições) ... */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold mb-0" style={{ color: '#58a6ff' }}>Medições dos Tanques</h5>
          <button onClick={() => handleAdicionar('medicoes')} className="btn btn-sm fw-bold" style={btnAdicionarStyle}
            onMouseEnter={(e) => { e.target.style.backgroundColor = '#2f81f7'; e.target.style.color = 'white'; }}
            onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#2f81f7'; }}
          >
            + Adicionar
          </button>
        </div>
        {folha.medicoesTanque.map((med) => (
          <ItemLinha
              key={med.id}
              label={`Tanque ${med.tanque?.numero || 'Inválido'}:`}
              details={`${med.estoqueFechamentoFisico} L (Abertura: ${med.estoqueAbertura} L)`}
              onEdit={() => handleEditar(med, 'medicoes')}
              onDelete={() => handleExcluir('medicoes', med.id)}
          />
        ))}
      </div>

      {/* Bloco de Compras (sem mudanças) */}
      <div className="border-top pt-4 mt-4" style={{ borderColor: '#30363d !important' }}>
        {/* ... (código do bloco de compras) ... */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold mb-0" style={{ color: '#58a6ff' }}>Recebimentos (Compras)</h5>
          <button onClick={() => handleAdicionar('compras')} className="btn btn-sm fw-bold" style={btnAdicionarStyle}
            onMouseEnter={(e) => { e.target.style.backgroundColor = '#2f81f7'; e.target.style.color = 'white'; }}
            onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#2f81f7'; }}
          >
            + Adicionar
          </button>
        </div>
        {folha.compras.length === 0 && <p className="small" style={{ color: '#8b949e' }}>Nenhuma compra registrada.</p>}
        {folha.compras.map((compra) => (
          <ItemLinha
              key={compra.id}
              label={`NF ${compra.numeroDocumentoFiscal}:`}
              details={`${compra.volumeRecebido} L (Tanque: ${compra.tanqueDescarga?.numero || 'N/A'})`}
              onEdit={() => handleEditar(compra, 'compras')}
              onDelete={() => handleExcluir('compras', compra.id)}
          />
        ))}
      </div>

      {/* Bloco de Vendas (sem mudanças) */}
      <div className="border-top pt-4 mt-4" style={{ borderColor: '#30363d !important' }}>
        {/* ... (código do bloco de vendas) ... */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold mb-0" style={{ color: '#58a6ff' }}>Vendas por Bico</h5>
          <button onClick={() => handleAdicionar('vendas')} className="btn btn-sm fw-bold" style={btnAdicionarStyle}
            onMouseEnter={(e) => { e.target.style.backgroundColor = '#2f81f7'; e.target.style.color = 'white'; }}
            onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#2f81f7'; }}
          >
            + Adicionar
          </button>
        </div>
        {folha.vendasBico.length === 0 && <p className="small" style={{ color: '#8b949e' }}>Nenhuma venda registrada.</p>}
        {folha.vendasBico.map((venda) => (
          <ItemLinha
              key={venda.id}
              label={`Bico ${venda.bico?.numero || 'Inválido'}:`}
              details={`${venda.vendasBico} L (Enc: ${venda.encerranteFechamento})`}
              onEdit={() => handleEditar(venda, 'vendas')}
              onDelete={() => handleExcluir('vendas', venda.id)}
          />
        ))}
      </div>

      {/* --- 3. BLOCO DE OBSERVAÇÕES ATUALIZADO --- */}
      <div className="border-top pt-4 mt-4" style={{ borderColor: '#30363d !important' }}>
         <h5 className="fw-bold mb-0" style={{ color: '#58a6ff' }}>Observações</h5>
         <textarea 
           className="form-control shadow-sm mt-3" 
           rows="4"
           style={{ backgroundColor: '#0d1117', color: '#c9d1d9', border: '1px solid #30363d' }}
           value={observacoes} // <-- MUDANÇA: Controlado pelo state
           onChange={(e) => setObservacoes(e.target.value)} // <-- MUDANÇA: Atualiza o state
           placeholder="Justificativas para variações de estoque..."
         ></textarea>
         <button 
           onClick={handleSalvarObservacoes} // <-- MUDANÇA: Chama o handler
           className="btn btn-sm btn-primary mt-2"
           disabled={savingObs} // <-- MUDANÇA: Desabilita ao salvar
         >
           {savingObs ? 'Salvando...' : 'Salvar Observações'}
         </button>
      </div>

       {/* --- 4. RENDERIZAÇÃO CONDICIONAL DOS MODAIS (Sem mudanças) --- */}
       {showModal && tipoModal === 'medicoes' && (
         <ModalMedicao 
           item={editandoItem} 
           folhaId={folha.id}
           tanquesDisponiveis={tanques}
           onClose={handleCloseModal}
           onSalvar={() => {
             handleCloseModal(); 
             onAtualizar();      
           }} 
         />
       )}

       {showModal && tipoModal === 'vendas' && (
         <ModalVenda 
           item={editandoItem} 
           folhaId={folha.id}
           bicosDisponiveis={bicos}
           onClose={handleCloseModal}
           onSalvar={() => {
             handleCloseModal(); 
             onAtualizar();      
           }} 
         />
       )}

       {showModal && tipoModal === 'compras' && (
         <ModalCompra 
           item={editandoItem} 
           folhaId={folha.id}
           tanquesDisponiveis={tanques} 
           onClose={handleCloseModal}
           onSalvar={() => {
             handleCloseModal(); 
             onAtualizar();      
           }} 
         />
       )}
    </div>
  );
}

export default AreaDeEdicao;