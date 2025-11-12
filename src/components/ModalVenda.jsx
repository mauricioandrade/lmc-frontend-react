import React, { useState } from 'react';
import * as api from '../services/api';
import { toast } from 'react-hot-toast';

function ModalVenda({ item, folhaId, bicosDisponiveis, onClose, onSalvar }) {

    const [formData, setFormData] = useState({
        bicoId: item ? item.bico.id : '',
        precoNaBomba: item ? item.precoNaBomba : '',
        encerranteAbertura: item ? item.encerranteAbertura : '',
        encerranteFechamento: item ? item.encerranteFechamento : '',
        afericoes: item ? item.afericoes : '0'
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const dto = {
            bicoId: formData.bicoId,
            precoNaBomba: formData.precoNaBomba,
            encerranteAbertura: formData.encerranteAbertura,
            encerranteFechamento: formData.encerranteFechamento,
            afericoes: formData.afericoes
        };

        try {
            if (item) {
                await api.atualizarVenda(item.id, dto);
                toast.success("Venda atualizada com sucesso!");
            } else {
                await api.adicionarVenda(folhaId, dto);
                toast.success("Venda adicionada com sucesso!");
            }
            onSalvar();
            onClose();
        } catch (error) {
            console.error("Erro ao salvar venda:", error);
            setError(error.response?.data?.message || "Falha ao salvar.");
        } finally {
            setLoading(false);
        }
    };

    const modalOverlayStyle = {
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex',
        alignItems: 'center', justifyContent: 'center', zIndex: 1050
    };

    return (
        <div style={modalOverlayStyle} onClick={onClose}>
            <div
                className="card shadow-lg rounded-4"
                style={{ backgroundColor: '#161b22', border: '1px solid #30363d', width: '600px' }}
                onClick={e => e.stopPropagation()}
            >
                <div className="card-header py-3" style={{ backgroundColor: '#1f6feb', border: 'none' }}>
                    <h4 className="mb-0 fw-bold text-white">
                        {item ? 'Editar Venda' : 'Adicionar Venda'}
                    </h4>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="card-body p-4">

                        {error && (
                            <div className="alert alert-danger">{error}</div>
                        )}

                        <div className="mb-3">
                            <label className="form-label fw-semibold small" style={{ color: '#c9d1d9' }}>⛽ Bico</label>
                            <select
                                name="bicoId"
                                className="form-select"
                                style={{ backgroundColor: '#0d1117', color: '#c9d1d9', border: '1px solid #30363d' }}
                                value={formData.bicoId}
                                onChange={handleChange}
                                required
                                disabled={!!item}
                            >
                                <option value="">Selecione...</option>
                                {bicosDisponiveis.map(b => (
                                    <option key={b.id} value={b.id}>{b.numero} (Tanque {b.nomeTanque})</option>
                                ))}
                            </select>
                        </div>

                        <div className="row g-2">
                            <div className="col-6">
                                <label className="form-label small fw-semibold" style={{ color: '#c9d1d9' }}>Enc. Abertura</label>
                                <input
                                    name="encerranteAbertura"
                                    type="number" className="form-control"
                                    style={{ backgroundColor: '#0d1117', color: '#c9d1d9', border: '1px solid #30363d' }}
                                    value={formData.encerranteAbertura}
                                    onChange={handleChange}
                                    required placeholder="0"
                                />
                            </div>
                            <div className="col-6">
                                <label className="form-label small fw-semibold" style={{ color: '#c9d1d9' }}>Enc. Fechamento</label>
                                <input
                                    name="encerranteFechamento"
                                    type="number" className="form-control"
                                    style={{ backgroundColor: '#0d1117', color: '#c9d1d9', border: '1px solid #30363d' }}
                                    value={formData.encerranteFechamento}
                                    onChange={handleChange}
                                    required placeholder="0"
                                />
                            </div>
                        </div>

                        <div className="row g-2 mt-2">
                            <div className="col-6">
                                <label className="form-label small fw-semibold" style={{ color: '#c9d1d9' }}>💰 Preço (R$)</label>
                                <input
                                    name="precoNaBomba"
                                    type="number" step="0.001" className="form-control"
                                    style={{ backgroundColor: '#0d1117', color: '#c9d1d9', border: '1px solid #30363d' }}
                                    value={formData.precoNaBomba}
                                    onChange={handleChange}
                                    required placeholder="0.000"
                                />
                            </div>
                            <div className="col-6">
                                <label className="form-label small fw-semibold" style={{ color: '#c9d1d9' }}>🔧 Aferições (L)</label>
                                <input
                                    name="afericoes"
                                    type="number" step="0.01" className="form-control"
                                    style={{ backgroundColor: '#0d1117', color: '#c9d1d9', border: '1px solid #30363d' }}
                                    value={formData.afericoes}
                                    onChange={handleChange}
                                    required placeholder="0.00"
                                />
                            </div>
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

export default ModalVenda;