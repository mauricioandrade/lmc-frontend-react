import React, { useMemo, useState } from 'react';
import * as api from '../services/api';
import { toast } from 'react-hot-toast';
import ModalMedicao from './ModalMedicao';
import ModalVenda from './ModalVenda';
import ModalCompra from './ModalCompra';

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

const modalConfigurations = {
  medicoes: {
    component: ModalMedicao,
    getProps: ({ tanques }) => ({ tanquesDisponiveis: tanques }),
  },
  vendas: {
    component: ModalVenda,
    getProps: ({ bicos }) => ({ bicosDisponiveis: bicos }),
  },
  compras: {
    component: ModalCompra,
    getProps: ({ tanques }) => ({ tanquesDisponiveis: tanques }),
  },
};

const deletionStrategies = {
  medicoes: api.deletarMedicao,
  compras: api.deletarCompra,
  vendas: api.deletarVenda,
};

const btnAdicionarStyle = {
  color: '#2f81f7',
  border: '1px solid #2f81f7',
  backgroundColor: 'transparent',
};

function AreaDeEdicao({ folha, tanques, bicos, onAtualizar }) {
  const [showModal, setShowModal] = useState(false);
  const [editandoItem, setEditandoItem] = useState(null);
  const [tipoModal, setTipoModal] = useState('');
  const [observacoes, setObservacoes] = useState(folha.observacoes || '');
  const [savingObs, setSavingObs] = useState(false);

  const modalStrategy = useMemo(() => modalConfigurations[tipoModal], [tipoModal]);

  const resetModal = () => {
    setShowModal(false);
    setEditandoItem(null);
    setTipoModal('');
  };

  const handleSalvar = () => {
    resetModal();
    onAtualizar();
  };

  const openModal = (tipo, item = null) => {
    if (!modalConfigurations[tipo]) {
      toast.error(`Função "${tipo}" não disponível.`);
      return;
    }
    setEditandoItem(item);
    setTipoModal(tipo);
    setShowModal(true);
  };

  const handleExcluir = async (tipo, id) => {
    const remover = deletionStrategies[tipo];
    if (!remover) {
      toast.error('Operação não suportada.');
      return;
    }
    if (!window.confirm(`Tem certeza que deseja excluir este item (ID: ${id})?`)) {
      return;
    }
    try {
      await remover(id);
      toast.success('Item excluído com sucesso!');
      onAtualizar();
    } catch (error) {
      console.error('Erro ao excluir:', error);
      toast.error('Falha ao excluir o item.');
    }
  };

  const handleSalvarObservacoes = async () => {
    setSavingObs(true);
    try {
      await api.atualizarObservacoes(folha.id, observacoes);
      toast.success('Observações salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar observações:', error);
      toast.error(error.response?.data?.message || 'Falha ao salvar observações.');
    } finally {
      setSavingObs(false);
    }
  };

  const renderModal = () => {
    if (!showModal || !modalStrategy) {
      return null;
    }
    const ModalComponent = modalStrategy.component;
    const specificProps = modalStrategy.getProps({ tanques, bicos });

    return (
      <ModalComponent
        item={editandoItem}
        folhaId={folha.id}
        onClose={resetModal}
        onSalvar={handleSalvar}
        {...specificProps}
      />
    );
  };

  return (
    <div className="area-edicao">
      <div className="border-top pt-4 mt-4" style={{ borderColor: '#30363d !important' }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold mb-0" style={{ color: '#58a6ff' }}>Medições dos Tanques</h5>
          <button
            onClick={() => openModal('medicoes')}
            className="btn btn-sm fw-bold"
            style={btnAdicionarStyle}
            onMouseEnter={(event) => {
              event.target.style.backgroundColor = '#2f81f7';
              event.target.style.color = 'white';
            }}
            onMouseLeave={(event) => {
              event.target.style.backgroundColor = 'transparent';
              event.target.style.color = '#2f81f7';
            }}
          >
            + Adicionar
          </button>
        </div>
        {folha.medicoesTanque.map((medicao) => (
          <ItemLinha
            key={medicao.id}
            label={`Tanque ${medicao.tanque?.numero || 'Inválido'}:`}
            details={`${medicao.estoqueFechamentoFisico} L (Abertura: ${medicao.estoqueAbertura} L)`}
            onEdit={() => openModal('medicoes', medicao)}
            onDelete={() => handleExcluir('medicoes', medicao.id)}
          />
        ))}
      </div>

      <div className="border-top pt-4 mt-4" style={{ borderColor: '#30363d !important' }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold mb-0" style={{ color: '#58a6ff' }}>Recebimentos (Compras)</h5>
          <button
            onClick={() => openModal('compras')}
            className="btn btn-sm fw-bold"
            style={btnAdicionarStyle}
            onMouseEnter={(event) => {
              event.target.style.backgroundColor = '#2f81f7';
              event.target.style.color = 'white';
            }}
            onMouseLeave={(event) => {
              event.target.style.backgroundColor = 'transparent';
              event.target.style.color = '#2f81f7';
            }}
          >
            + Adicionar
          </button>
        </div>
        {folha.compras.length === 0 && (
          <p className="small" style={{ color: '#8b949e' }}>Nenhuma compra registrada.</p>
        )}
        {folha.compras.map((compra) => (
          <ItemLinha
            key={compra.id}
            label={`NF ${compra.numeroDocumentoFiscal}:`}
            details={`${compra.volumeRecebido} L (Tanque: ${compra.tanqueDescarga?.numero || 'N/A'})`}
            onEdit={() => openModal('compras', compra)}
            onDelete={() => handleExcluir('compras', compra.id)}
          />
        ))}
      </div>

      <div className="border-top pt-4 mt-4" style={{ borderColor: '#30363d !important' }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold mb-0" style={{ color: '#58a6ff' }}>Vendas por Bico</h5>
          <button
            onClick={() => openModal('vendas')}
            className="btn btn-sm fw-bold"
            style={btnAdicionarStyle}
            onMouseEnter={(event) => {
              event.target.style.backgroundColor = '#2f81f7';
              event.target.style.color = 'white';
            }}
            onMouseLeave={(event) => {
              event.target.style.backgroundColor = 'transparent';
              event.target.style.color = '#2f81f7';
            }}
          >
            + Adicionar
          </button>
        </div>
        {folha.vendasBico.length === 0 && (
          <p className="small" style={{ color: '#8b949e' }}>Nenhuma venda registrada.</p>
        )}
        {folha.vendasBico.map((venda) => (
          <ItemLinha
            key={venda.id}
            label={`Bico ${venda.bico?.numero || 'Inválido'}:`}
            details={`${venda.vendasBico} L (Enc: ${venda.encerranteFechamento})`}
            onEdit={() => openModal('vendas', venda)}
            onDelete={() => handleExcluir('vendas', venda.id)}
          />
        ))}
      </div>

      <div className="border-top pt-4 mt-4" style={{ borderColor: '#30363d !important' }}>
        <h5 className="fw-bold mb-0" style={{ color: '#58a6ff' }}>Observações</h5>
        <textarea
          className="form-control shadow-sm mt-3"
          rows="4"
          style={{ backgroundColor: '#0d1117', color: '#c9d1d9', border: '1px solid #30363d' }}
          value={observacoes}
          onChange={(event) => setObservacoes(event.target.value)}
          placeholder="Justificativas para variações de estoque..."
        ></textarea>
        <button onClick={handleSalvarObservacoes} className="btn btn-sm btn-primary mt-2" disabled={savingObs}>
          {savingObs ? 'Salvando...' : 'Salvar Observações'}
        </button>
      </div>

      {renderModal()}
    </div>
  );
}

export default AreaDeEdicao;
