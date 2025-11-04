// src/components/AreaDeEdicao.jsx
import React, { useState } from 'react';
import * as api from '../services/api';
import { toast } from 'react-hot-toast';
import ModalMedicao from './ModalMedicao'; 
import ModalVenda from './ModalVenda'; // <-- 1. IMPORTE O NOVO MODAL

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

  // --- 2. ATUALIZA O HANDLER PARA INCLUIR 'vendas' ---
  const handleEditar = (item, tipo) => {
    setEditandoItem(item);
    setTipoModal(tipo);
    
    if (tipo === 'medicoes' || tipo === 'vendas') { // <-- MUDANÇA AQUI
        setShowModal(true); // Abre o modal
    } else {
        toast.error(`Função "Editar ${tipo}" ainda não implementada.`);
    }
  };
  
  // --- 3. ATUALIZA O HANDLER PARA INCLUIR 'vendas' ---
  const handleAdicionar = (tipo) => {
    setEditandoItem(null); // 'null' significa que é um item novo
    setTipoModal(tipo);

    if (tipo === 'medicoes' || tipo === 'vendas') { // <-- MUDANÇA AQUI
        setShowModal(true); // Abre o modal
    } else {
        toast.error(`Função "Adicionar ${tipo}" ainda não implementada.`);
    }
  }

  const handleCloseModal = () => {
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


  return (
    <div className="area-edicao">
      
      {/* Bloco de Medições (sem mudanças) */}
      <div className="border-top pt-4 mt-4" style={{ borderColor: '#30363d !important' }}>
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

      {/* Bloco de Compras (sem mudanças, ainda mostra toast) */}
      <div className="border-top pt-4 mt-4" style={{ borderColor: '#30363d !important' }}>
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

      {/* Bloco de Vendas (sem mudanças, os handlers foram atualizados) */}
      <div className="border-top pt-4 mt-4" style={{ borderColor: '#30363d !important' }}>
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

      {/* Bloco de Observações (sem mudanças) */}
      <div className="border-top pt-4 mt-4" style={{ borderColor: '#30363d !important' }}>
         <h5 className="fw-bold mb-0" style={{ color: '#58a6ff' }}>Observações</h5>
         <textarea 
           className="form-control shadow-sm mt-3" 
           rows="4"
           style={{ backgroundColor: '#0d1117', color: '#c9d1d9', border: '1px solid #30363d' }}
           defaultValue={folha.observacoes || ''} 
           placeholder="Justificativas para variações de estoque..."
         ></textarea>
         <button 
           onClick={() => toast.error('Salvar observações não implementado.')} 
           className="btn btn-sm btn-primary mt-2"
         >
           Salvar Observações
         </button>
      </div>

       {/* --- 4. RENDERIZAÇÃO CONDICIONAL DOS MODAIS --- */}
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

       {/* {showModal && tipoModal === 'compras' && (
         <ModalCompra ... />
       )} */}
    </div>
  );
}

export default AreaDeEdicao;