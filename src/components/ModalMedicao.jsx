import React, { useState } from 'react';
import * as api from '../services/api';
import { toast } from 'react-hot-toast';

function ModalMedicao({ item, folhaId, tanquesDisponiveis, onClose, onSalvar }) {
  const [formData, setFormData] = useState({
    tanqueId: item ? item.tanque.id : '',
    estoqueAbertura: item ? item.estoqueAbertura : '',
    estoqueFechamentoFisico: item ? item.estoqueFechamentoFisico : '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const dto = {
      tanqueId: formData.tanqueId,
      estoqueAbertura: formData.estoqueAbertura,
      estoqueFechamentoFisico: formData.estoqueFechamentoFisico,
    };

    try {
      if (item) {
        await api.atualizarMedicao(item.id, dto);
        toast.success('Medição atualizada com sucesso!');
      } else {
        await api.adicionarMedicao({ folhaId, ...dto });
        toast.success('Medição adicionada com sucesso!');
      }
      onSalvar();
      onClose();
    } catch (error) {
      console.error('Erro ao salvar medição:', error);
      setError(error.response?.data?.message || 'Falha ao salvar.');
    } finally {
      setLoading(false);
    }
  };

  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1050,
  };

  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <div
        className="card shadow-lg rounded-4"
        style={{ backgroundColor: '#161b22', border: '1px solid #30363d', width: '500px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="card-header py-3" style={{ backgroundColor: '#1f6feb', border: 'none' }}>
          <h4 className="mb-0 fw-bold text-white">{item ? 'Editar Medição' : 'Adicionar Medição'}</h4>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="card-body p-4">
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="mb-3">
              <label className="form-label fw-semibold small" style={{ color: '#c9d1d9' }}>
                🛢️ Tanque
              </label>
              <select
                name="tanqueId"
                className="form-select"
                style={{ backgroundColor: '#0d1117', color: '#c9d1d9', border: '1px solid #30363d' }}
                value={formData.tanqueId}
                onChange={handleChange}
                required
                disabled={!!item}
              >
                <option value="">Selecione...</option>
                {tanquesDisponiveis.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.numero}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold small" style={{ color: '#c9d1d9' }}>
                📊 Estoque Abertura (L)
              </label>
              <input
                name="estoqueAbertura"
                type="number"
                step="0.01"
                className="form-control"
                style={{ backgroundColor: '#0d1117', color: '#c9d1d9', border: '1px solid #30363d' }}
                value={formData.estoqueAbertura}
                onChange={handleChange}
                required
                placeholder="0.00"
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold small" style={{ color: '#c9d1d9' }}>
                📏 Fechamento Físico (L)
              </label>
              <input
                name="estoqueFechamentoFisico"
                type="number"
                step="0.01"
                className="form-control"
                style={{ backgroundColor: '#0d1117', color: '#c9d1d9', border: '1px solid #30363d' }}
                value={formData.estoqueFechamentoFisico}
                onChange={handleChange}
                required
                placeholder="0.00"
              />
            </div>
          </div>
          <div className="card-footer border-0 p-4" style={{ backgroundColor: '#161b22', borderTop: '1px solid #30363d' }}>
            <div className="d-flex justify-content-end gap-2">
              <button type="button" className="btn btn-outline-secondary" onClick={onClose} disabled={loading}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalMedicao;
