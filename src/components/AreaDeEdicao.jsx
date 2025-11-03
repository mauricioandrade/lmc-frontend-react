// src/components/AreaDeEdicao.jsx
import React, { useState } from 'react';
import * as api from '../services/api';
import { toast } from 'react-hot-toast';
import ModalMedicao from './ModalMedicao'; // <-- 1. IMPORTE O MODAL

// Componente simples para uma linha (pode ser movido para um arquivo separado)
// Adaptado para seu estilo Bootstrap Dark
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
  
  // --- 2. ESTADOS PARA CONTROLAR OS MODAIS ---
  const [showModal, setShowModal] = useState(false);
  const [editandoItem, setEditandoItem] = useState(null);
  const [tipoModal, setTipoModal] = useState(''); // 'medicoes', 'compras', 'vendas'

  const handleExcluir = async (tipo, id) => {
    if (!window.confirm(`Tem certeza que deseja excluir este item (ID: ${id})?`)) {
        return;
    }
    
    try {
        switch (tipo) {
            case 'medicoes':
                await api.deletarMedicao(id);
                break;
            case 'compras':
                await api.deletarCompra(id);
                break;
            case 'vendas':
                await api.deletarVenda(id);
                break;
            default:
                throw new Error("Tipo de exclusão desconhecido");
        }
        
        toast.success("Item excluído com sucesso!");
        onAtualizar(); // Recarrega os dados na página principal
    } catch (error) {
        console.error("Erro ao excluir:", error);
        toast.error("Falha ao excluir o item.");
    }
  };

  // --- 3. ATUALIZA OS HANDLERS PARA ABRIR O MODAL ---
  const handleEditar = (item, tipo) => {
    setEditandoItem(item);
    setTipoModal(tipo);
    if (tipo === 'medicoes') {
        setShowModal(true); // Abre o modal
    } else {
        toast.error(`Função "Editar ${tipo}" ainda não implementada.`);
    }
  };
  
  const handleAdicionar = (tipo) => {
    setEditandoItem(null); // 'null' significa que é um item novo
    setTipoModal(tipo);
    if (tipo === 'medicoes') {
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

  // Estilo do botão de adicionar
  const btnAdicionarStyle = { 
    color: '#2f81f7', 
    border: '1px solid #2f81f7',
    backgroundColor: 'transparent'
  };

  return (
    <div className="area-edicao">
      
      {/* Bloco de Medições */}
      <div className="border-top pt-4 mt-4" style={{ borderColor: '#30363d !important' }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold mb-0" style={{ color: '#58a6ff' }}>Medições dos Tanques</h5>
          <button 
            onClick={() => handleAdicionar('medicoes')} 
            className="btn btn-sm fw-bold" 
            style={btnAdicionarStyle}
            onMouseEnter={(e) => { e.target.style.backgroundColor = '#2f81f7'; e.target.style.color = 'white'; }}
            onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#2f81f7'; }}
          >+ Adicionar</button>
        </div>
        
        {folha.medicoesTanque.map((med) => (
          <ItemLinha
              key={med.id}
              label={`Tanque ${med.tanque.numero}:`}
              details={`${med.estoqueFechamentoFisico} L (Abertura: ${med.estoqueAbertura} L)`}
              onEdit={() => handleEditar(med, 'medicoes')}
              onDelete={() => handleExcluir('medicoes', med.id)}
          />
        ))}
      </div>

      {/* Bloco de Compras */}
      <div className="border-top pt-4 mt-4" style={{ borderColor: '#30363d !important' }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold mb-0" style={{ color: '#58a6ff' }}>Recebimentos (Compras)</h5>
          <button 
            onClick={() => handleAdicionar('compras')} 
            className="btn btn-sm fw-bold" 
            style={btnAdicionarStyle}
            onMouseEnter={(e) => { e.target.style.backgroundColor = '#2f81f7'; e.target.style.color = 'white'; }}
            onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#2f81f7'; }}
          >+ Adicionar</button>
        </div>
        
        {folha.compras.length === 0 && <p className="small" style={{ color: '#8b949e' }}>Nenhuma compra registrada.</p>}
        {folha.compras.map((compra) => (
          <ItemLinha
              key={compra.id}
              label={`NF ${compra.numeroDocumentoFiscal}:`}
              details={`${compra.volumeRecebido} L`}
              onEdit={() => handleEditar(compra, 'compras')}
              onDelete={() => handleExcluir('compras', compra.id)}
          />
        ))}
      </div>

      {/* Bloco de Vendas */}
      <div className="border-top pt-4 mt-4" style={{ borderColor: '#30363d !important' }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold mb-0" style={{ color: '#58a6ff' }}>Vendas por Bico</h5>
          <button 
            onClick={() => handleAdicionar('vendas')} 
            className="btn btn-sm fw-bold" 
            style={btnAdicionarStyle}
            onMouseEnter={(e) => { e.target.style.backgroundColor = '#2f81f7'; e.target.style.color = 'white'; }}
            onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#2f81f7'; }}
          >+ Adicionar</button>
        </div>

        {folha.vendasBico.length === 0 && <p className="small" style={{ color: '#8b949e' }}>Nenhuma venda registrada.</p>}
        {folha.vendasBico.map((venda) => (
          <ItemLinha
              key={venda.id}
              label={`Bico ${venda.bico.numero}:`}
              details={`${venda.vendasBico} L (Enc: ${venda.encerranteFechamento})`}
              onEdit={() => handleEditar(venda, 'vendas')}
              onDelete={() => handleExcluir('vendas', venda.id)}
          />
        ))}
      </div>

      {/* Bloco de Observações */}
      <div className="border-top pt-4 mt-4" style={{ borderColor: '#30363d !important' }}>
         <h5 className="fw-bold mb-3" style={{ color: '#58a6ff' }}>Observações</h5>
         <textarea 
           className="form-control shadow-sm" 
           rows="4"
           style={{ backgroundColor: '#0d1117', color: '#c9d1d9', border: '1px solid #30363d' }}
           defaultValue={folha.observacoes || ''} // Usar defaultValue para leitura/edição
           placeholder="Justificativas para variações de estoque..."
           // TODO: Adicionar um botão "Salvar Observações" que chama um endpoint PUT
         ></textarea>
         <button 
           onClick={() => toast.error('Salvar observações não implementado.')} 
           className="btn btn-sm btn-primary mt-2"
         >
           Salvar Observações
         </button>
      </div>

       {/* --- 4. RENDERIZAÇÃO CONDICIONAL DO MODAL --- */}
       {showModal && tipoModal === 'medicoes' && (
         <ModalMedicao 
           item={editandoItem} // Passa o item para edição (ou null para adição)
           folhaId={folha.id}
           tanquesDisponiveis={tanques}
           onClose={handleCloseModal}
           onSalvar={() => {
             handleCloseModal(); // Fecha o modal
             onAtualizar();      // Recarrega a página
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