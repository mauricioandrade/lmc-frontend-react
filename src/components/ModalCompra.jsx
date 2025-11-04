// src/components/ModalCompra.jsx
import React, { useState } from 'react';
import * as api from '../services/api';
import { toast } from 'react-hot-toast';

function ModalCompra({ item, folhaId, tanquesDisponiveis, onClose, onSalvar }) {
    
    // O 'item' é a compra (se for edição) ou 'null' (se for adição)
    const [formData, setFormData] = useState({
        tanqueDescargaId: item ? item.tanqueDescarga.id : '',
        numeroDocumentoFiscal: item ? item.numeroDocumentoFiscal : '',
        volumeRecebido: item ? item.volumeRecebido : ''
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

        // Este é o DTO que o LmcService espera
        const dto = {
            tanqueDescargaId: formData.tanqueDescargaId,
            numeroDocumentoFiscal: formData.numeroDocumentoFiscal,
            volumeRecebido: formData.volumeRecebido
        };

        try {
            if (item) {
                // MODO EDIÇÃO (PUT)
                // Chama api.atualizarCompra(id, dto)
                await api.atualizarCompra(item.id, dto);
                toast.success("Compra atualizada com sucesso!");
            } else {
                // MODO CRIAÇÃO (POST)
                // Chama api.adicionarCompra(folhaId, dto)
                await api.adicionarCompra(folhaId, dto);
                toast.success("Compra adicionada com sucesso!");
            }
            onSalvar(); // Recarrega os dados da página principal
            onClose();  // Fecha o modal
        } catch (error) {
            console.error("Erro ao salvar compra:", error);
            setError(error.response?.data?.message || "Falha ao salvar.");
        } finally {
            setLoading(false);
        }
    };

    // Estilo do modal (igual aos outros)
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
                onClick={e => e.stopPropagation()} // Impede de fechar ao clicar dentro
            >
                <div className="card-header py-3" style={{ backgroundColor: '#1f6feb', border: 'none' }}>
                    <h4 className="mb-0 fw-bold text-white">
                        {item ? 'Editar Compra' : 'Adicionar Compra'}
                    </h4>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className="card-body p-4">
                        
                        {error && (
                            <div className="alert alert-danger">{error}</div>
                        )}

                        <div className="mb-3">
                            <label className="form-label fw-semibold small" style={{ color: '#c9d1d9' }}>Nº Nota Fiscal</label>
                            <input 
                                name="numeroDocumentoFiscal"
                                type="text" className="form-control"
                                style={{ backgroundColor: '#0d1117', color: '#c9d1d9', border: '1px solid #30363d' }}
                                value={formData.numeroDocumentoFiscal}
                                onChange={handleChange}
                                required placeholder="Nº da NF-e"
                            />
                        </div>

                        <div className="row g-2">
                            <div className="col-6">
                                <label className="form-label fw-semibold small" style={{ color: '#c9d1d9' }}>🛢️ Tanque de Descarga</label>
                                <select
                                    name="tanqueDescargaId"
                                    className="form-select"
                                    style={{ backgroundColor: '#0d1117', color: '#c9d1d9', border: '1px solid #30363d' }}
                                    value={formData.tanqueDescargaId}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Selecione...</option>
                                    {tanquesDisponiveis.map(t => (
                                        <option key={t.id} value={t.id}>{t.numero}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-6">
                                <label className="form-label small fw-semibold" style={{ color: '#c9d1d9' }}>Volume Recebido (L)</label>
                                <input 
                                    name="volumeRecebido"
                                    type="number" step="0.01" className="form-control"
                                    style={{ backgroundColor: '#0d1117', color: '#c9d1d9', border: '1px solid #30363d' }}
                                    value={formData.volumeRecebido}
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

export default ModalCompra;