import React, { useState } from 'react';
import * as api from '../services/api';
import { toast } from 'react-hot-toast';
import ModalMedicao from './ModalMedicao';

const ItemLinha = ({ label, details, onEdit, onDelete }) => (
  <div
    className="d-flex justify-content-between align-items-center p-2 mb-2 rounded"
    style={{ backgroundColor: '#0d1117', border: '1px solid #30363d' }}
  >
    <span style={{ color: '#c9d1d9' }}>
      <strong style={{ color: '#c9d1d9' }}>{label}</strong> {details}
    </span>
    <div>
      <button
        onClick={onEdit}
        className="btn btn-sm btn-link"
        style={{ color: '#58a6ff', textDecoration: 'none' }}
        title="Editar"
      >
        ✏️
      </button>
      <button
        onClick={onDelete}
        className="btn btn-sm btn-link"
        style={{ color: '#da3633', textDecoration: 'none' }}
        title="Excluir"
      >
        🗑️
      </button>
    </div>
  </div>
);

function AreaDeEdicao({ folha, tanques, onAtualizar }) {
  const [showModal, setShowModal] = useState(false);
  const [editandoItem, setEditandoItem] = useState(null);
  const [tipoModal, setTipoModal] = useState('');

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
          throw new Error('Tipo de exclusão desconhecido');
      }

      toast.success('Item excluído com sucesso!');
      onAtualizar();
    } catch (error) {
      console.error('Erro ao excluir:', error);
      toast.error('Falha ao excluir o item.');
    }
  };

  const handleEditar = (item, tipo) => {
    setEditandoItem(item);
    setTipoModal(tipo);
    if (tipo === 'medicoes') {
      setShowModal(true);
    } else {
      toast.error(`Função "Editar ${tipo}" ainda não implementada.`);
    }
  };

  const handleAdicionar = (tipo) => {
    setEditandoItem(null);
    setTipoModal(tipo);
    if (tipo === 'medicoes') {
      setShowModal(true);
    } else {
      toast.error(`Função "Adicionar ${tipo}" ainda não implementada.`);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditandoItem(null);
    setTipoModal('');
  };

  const btnAdicionarStyle = {
    color: '#2f81f7',
    border: '1px solid #2f81f7',
    backgroundColor: 'transparent',
  };

  return (
    <div className="area-edicao">
      <div className="border-top pt-4 mt-4" style={{ borderColor: '#30363d' }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold mb-0" style={{ color: '#58a6ff' }}>Medições dos Tanques</h5>
          <button
            onClick={() => handleAdicionar('medicoes')}
            className="btn btn-sm fw-bold"
            style={btnAdicionarStyle}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#2f81f7';
              e.target.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#2f81f7';
            }}
          >
            + Adicionar
          </button>
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

      <div className="border-top pt-4 mt-4" style={{ borderColor: '#30363d' }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold mb-0" style={{ color: '#58a6ff' }}>Recebimentos (Compras)</h5>
          <button
            onClick={() => handleAdicionar('compras')}
            className="btn btn-sm fw-bold"
            style={btnAdicionarStyle}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#2f81f7';
              e.target.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#2f81f7';
            }}
          >
            + Adicionar
          </button>
        </div>

        {folha.compras.length === 0 && (
          <p className="small" style={{ color: '#8b949e' }}>
            Nenhuma compra registrada.
          </p>
        )}
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

      <div className="border-top pt-4 mt-4" style={{ borderColor: '#30363d' }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold mb-0" style={{ color: '#58a6ff' }}>Vendas por Bico</h5>
          <button
            onClick={() => handleAdicionar('vendas')}
            className="btn btn-sm fw-bold"
            style={btnAdicionarStyle}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#2f81f7';
              e.target.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#2f81f7';
            }}
          >
            + Adicionar
          </button>
        </div>

        {folha.vendasBico.length === 0 && (
          <p className="small" style={{ color: '#8b949e' }}>
            Nenhuma venda registrada.
          </p>
        )}
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

      <div className="border-top pt-4 mt-4" style={{ borderColor: '#30363d' }}>
        <h5 className="fw-bold mb-3" style={{ color: '#58a6ff' }}>Observações</h5>
        <textarea
          className="form-control shadow-sm"
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
    </div>
  );
}

export default AreaDeEdicao;
