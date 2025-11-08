import React, { useState, useEffect } from 'react';
import * as api from '../services/api';
import { toast } from 'react-hot-toast';
import ModalTanque from './ModalTanque';

function PaginaTanques() {
    const [tanques, setTanques] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [tanqueEmEdicao, setTanqueEmEdicao] = useState(null);

    const fetchTanques = () => {
        setLoading(true);
        api.getTodosTanques()
            .then(response => {
                setTanques(response.data);
                setError(null);
            })
            .catch(err => {
                console.error("Erro ao buscar tanques:", err);
                setError("Não foi possível carregar os tanques.");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchTanques();
    }, []);

    const handleAdicionar = () => {
        setTanqueEmEdicao(null);
        setShowModal(true);
    };

    const handleEditar = (tanque) => {
        setTanqueEmEdicao(tanque);
        setShowModal(true);
    };

    const handleDeletar = async (id) => {
        if (!window.confirm("Tem certeza que deseja excluir este tanque?")) {
            return;
        }
        try {
            await api.deletarTanque(id);
            toast.success("Tanque excluído com sucesso!");
            fetchTanques();
        } catch (error) {
            console.error("Erro ao deletar tanque:", error);
            toast.error(error.response?.data?.message || "Falha ao excluir tanque.");
        }
    };

    const btnAdicionarStyle = {
        color: '#2f81f7',
        border: '1px solid #2f81f7',
        backgroundColor: 'transparent'
    };

    return (
        <div className="container" style={{ maxWidth: '900px', width: '100%', color: '#c9d1d9', paddingTop: '1rem' }}>

            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 style={{ color: '#58a6ff' }}>Gerenciamento de Tanques</h2>
                <button
                    onClick={handleAdicionar}
                    className="btn btn-sm fw-bold"
                    style={btnAdicionarStyle}
                    onMouseEnter={(e) => { e.target.style.backgroundColor = '#2f81f7'; e.target.style.color = 'white'; }}
                    onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#2f81f7'; }}
                >
                    + Adicionar Tanque
                </button>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            {loading && (
                <div className="text-center py-5">
                    <div className="spinner-border" role="status" style={{ color: '#58a6ff' }}>
                        <span className="visually-hidden">Carregando...</span>
                    </div>
                </div>
            )}

            {!loading && !error && (
                <div className="card shadow-lg rounded-4" style={{ backgroundColor: '#161b22', border: '1px solid #30363d' }}>
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-dark table-hover mb-0" style={{ borderRadius: '0.5rem', overflow: 'hidden' }}>
                                <thead>
                                    <tr>
                                        <th scope="col" style={{ borderTop: '0', padding: '1rem' }}>Número</th>
                                        <th scope="col" style={{ borderTop: '0', padding: '1rem' }}>Produto</th>
                                        <th scope="col" style={{ borderTop: '0', padding: '1rem' }}>Capacidade</th>
                                        <th scope="col" style={{ borderTop: '0', padding: '1rem', width: '120px', textAlign: 'right' }}>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tanques.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="text-center" style={{ padding: '1rem' }}>Nenhum tanque cadastrado.</td>
                                        </tr>
                                    )}
                                    {tanques.map(tanque => (
                                        <tr key={tanque.id}>
                                            <td style={{ verticalAlign: 'middle', padding: '1rem' }}>{tanque.numero}</td>
                                            <td style={{ verticalAlign: 'middle', padding: '1rem' }}>{tanque.produtoNome || 'N/A'}</td>
                                            <td style={{ verticalAlign: 'middle', padding: '1rem' }}>{tanque.capacidadeNominal} L</td>
                                            <td style={{ verticalAlign: 'middle', padding: '1rem', textAlign: 'right' }}>
                                                <button
                                                    onClick={() => handleEditar(tanque)}
                                                    className="btn btn-sm btn-link"
                                                    style={{ color: '#58a6ff', textDecoration: 'none' }}
                                                    title="Editar"
                                                >✏️</button>
                                                <button
                                                    onClick={() => handleDeletar(tanque.id)}
                                                    className="btn btn-sm btn-link"
                                                    style={{ color: '#da3633', textDecoration: 'none' }}
                                                    title="Excluir"
                                                >🗑️</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            
            {showModal && (
                <ModalTanque
                    item={tanqueEmEdicao}
                    onClose={() => setShowModal(false)}
                    onSalvar={() => {
                        setShowModal(false);
                        fetchTanques();
                    }}
                />
            )}
        </div>
    );
}

export default PaginaTanques;