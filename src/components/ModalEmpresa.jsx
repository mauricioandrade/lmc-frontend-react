import React, { useState } from 'react';
import * as api from '../services/api';
import { toast } from 'react-hot-toast';

function ModalEmpresa({ item, onClose, onSalvar }) {
    const [formData, setFormData] = useState({
        razaoSocial: item ? item.razaoSocial : '',
        cnpj: item ? item.cnpj : '',
        inscricaoEstadual: item ? item.inscricaoEstadual : '',
        enderecoCompleto: item ? item.enderecoCompleto : '',
        isAtiva: item ? item.isAtiva : false
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const empresaData = {
            id: item ? item.id : null,
            ...formData
        };

        try {
            await api.salvarEmpresa(empresaData);
            toast.success(`Empresa ${item ? 'atualizada' : 'criada'} com sucesso!`);
            onSalvar();
            onClose();
        } catch (error) {
            console.error("Erro ao salvar empresa:", error);
            setError(error.response?.data?.message || "Falha ao salvar empresa.");
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
                        {item ? 'Editar Empresa' : 'Adicionar Empresa'}
                    </h4>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="card-body p-4">
                        {error && <div className="alert alert-danger">{error}</div>}

                        <div className="mb-3">
                            <label className="form-label fw-semibold small" style={{ color: '#c9d1d9' }}>Razão Social</label>
                            <input
                                name="razaoSocial"
                                type="text" className="form-control"
                                style={{ backgroundColor: '#0d1117', color: '#c9d1d9', border: '1px solid #30363d' }}
                                value={formData.razaoSocial}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="row g-2">
                            <div className="col-6">
                                <label className="form-label small fw-semibold" style={{ color: '#c9d1d9' }}>CNPJ</label>
                                <input
                                    name="cnpj"
                                    type="text" className="form-control"
                                    style={{ backgroundColor: '#0d1117', color: '#c9d1d9', border: '1px solid #30363d' }}
                                    value={formData.cnpj}
                                    onChange={handleChange}
                                    required placeholder="00.000.000/0001-00"
                                />
                            </div>
                            <div className="col-6">
                                <label className="form-label small fw-semibold" style={{ color: '#c9d1d9' }}>Inscrição Estadual</label>
                                <input
                                    name="inscricaoEstadual"
                                    type="text" className="form-control"
                                    style={{ backgroundColor: '#0d1117', color: '#c9d1d9', border: '1px solid #30363d' }}
                                    value={formData.inscricaoEstadual}
                                    onChange={handleChange}
                                    placeholder="Opcional"
                                />
                            </div>
                        </div>

                        <div className="mb-3 mt-3">
                            <label className="form-label fw-semibold small" style={{ color: '#c9d1d9' }}>Endereço Completo</label>
                            <input
                                name="enderecoCompleto"
                                type="text" className="form-control"
                                style={{ backgroundColor: '#0d1117', color: '#c9d1d9', border: '1px solid #30363d' }}
                                value={formData.enderecoCompleto}
                                onChange={handleChange}
                                required
                                placeholder="Rua, Número - Bairro, Cidade - UF"
                            />
                        </div>

                        <div className="form-check mt-3">
                            <input
                                name="isAtiva"
                                type="checkbox"
                                className="form-check-input"
                                id="isAtivaCheck"
                                checked={formData.isAtiva}
                                onChange={handleChange}
                            />
                            <label className="form-check-label" htmlFor="isAtivaCheck" style={{ color: '#c9d1d9' }}>
                                Empresa ativa para os relatórios?
                            </label>
                            <small className="d-block text-muted">Apenas uma empresa pode estar ativa por vez.</small>
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

export default ModalEmpresa;