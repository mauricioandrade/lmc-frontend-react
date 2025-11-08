import React, { useState, useEffect } from 'react';
import * as api from '../services/api';
import { toast } from 'react-hot-toast';

function ModalTanque({ item, onClose, onSalvar }) {
    const [formData, setFormData] = useState({
        numero: item ? item.numero : '',
        capacidadeNominal: item ? item.capacidadeNominal : '',
        produtoId: item ? item.produtoId : ''
    });
    const [produtos, setProdutos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        api.getProdutos()
            .then(res => setProdutos(res.data))
            .catch(err => {
                console.error(err);
                setError("Não foi possível carregar a lista de produtos.");
            });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const tanqueData = {
            id: item ? item.id : null,
            numero: formData.numero,
            capacidadeNominal: formData.capacidadeNominal,
            produtoId: formData.produtoId
        };

        try {
            await api.salvarTanque(tanqueData);
            toast.success(`Tanque ${item ? 'atualizado' : 'criado'} com sucesso!`);
            onSalvar();
            onClose();
        } catch (error) {
            console.error("Erro ao salvar tanque:", error);
            setError(error.response?.data?.message || "Falha ao salvar tanque.");
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
                        {item ? 'Editar Tanque' : 'Adicionar Tanque'}
                    </h4>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="card-body p-4">
                        {error && <div className="alert alert-danger">{error}</div>}

                        <div className="mb-3">
                            <label className="form-label fw-semibold small" style={{ color: '#c9d1d9' }}>Produto Associado</label>
                            <select
                                name="produtoId"
                                className="form-select"
                                style={{ backgroundColor: '#0d1117', color: '#c9d1d9', border: '1px solid #30363d' }}
                                value={formData.produtoId}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Selecione o produto...</option>
                                {produtos.map(p => (
                                    <option key={p.id} value={p.id}>{p.nome}</option>
                                ))}
                            </select>
                        </div>

                        <div className="row g-2">
                            <div className="col-6">
                                <label className="form-label small fw-semibold" style={{ color: '#c9d1d9' }}>Número do Tanque</label>
                                <input
                                    name="numero"
                                    type="text" className="form-control"
                                    style={{ backgroundColor: '#0d1117', color: '#c9d1d9', border: '1px solid #30363d' }}
                                    value={formData.numero}
                                    onChange={handleChange}
                                    required placeholder="Ex: TQ-01"
                                />
                            </div>
                            <div className="col-6">
                                <label className="form-label small fw-semibold" style={{ color: '#c9d1d9' }}>Capacidade Nominal (L)</label>
                                <input
                                    name="capacidadeNominal"
                                    type="number" step="0.01" className="form-control"
                                    style={{ backgroundColor: '#0d1117', color: '#c9d1d9', border: '1px solid #30363d' }}
                                    value={formData.capacidadeNominal}
                                    onChange={handleChange}
                                    required placeholder="Ex: 20000.00"
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
};

export default ModalTanque;