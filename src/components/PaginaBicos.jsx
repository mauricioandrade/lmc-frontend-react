// src/components/PaginaBicos.jsx
import React, { useState, useEffect } from 'react';
import * as api from '../services/api';
import { toast } from 'react-hot-toast';
import ModalBico from './ModalBico'; // Importa o modal

// Componente da Página Principal
function PaginaBicos() {
    const [bicos, setBicos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Controle do Modal
    const [showModal, setShowModal] = useState(false);
    const [bicoEmEdicao, setBicoEmEdicao] = useState(null); // null = Adicionar, (objeto) = Editar

    // Função para carregar os dados
    const fetchBicos = () => {
        setLoading(true);
        api.getTodosBicos() // Chama a nova função da api.js
            .then(response => {
                setBicos(response.data);
                setError(null);
            })
            .catch(err => {
                console.error("Erro ao buscar bicos:", err);
                setError("Não foi possível carregar os bicos.");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    // Carrega os dados quando o componente é montado
    useEffect(() => {
        fetchBicos();
    }, []);

    // Handlers do CRUD
    const handleAdicionar = () => {
        setBicoEmEdicao(null); 
        setShowModal(true);
    };

    const handleEditar = (bico) => {
        setBicoEmEdicao(bico);
        setShowModal(true);
    };

    const handleDeletar = async (id) => {
        if (!window.confirm("Tem certeza que deseja excluir este bico?")) {
            return;
        }
        try {
            await api.deletarBico(id);
            toast.success("Bico excluído com sucesso!");
            fetchBicos(); // Recarrega a lista
        } catch (error) {
            console.error("Erro ao deletar bico:", error);
            toast.error(error.response?.data?.message || "Falha ao excluir bico.");
        }
    };

    // Estilo do botão de adicionar (do seu app)
    const btnAdicionarStyle = { 
        color: '#2f81f7', 
        border: '1px solid #2f81f7',
        backgroundColor: 'transparent'
    };

    return (
        // Container principal com o estilo dark
        <div className="container" style={{ maxWidth: '900px', width: '100%', color: '#c9d1d9', paddingTop: '1rem' }}>
            
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 style={{ color: '#58a6ff' }}>Gerenciamento de Bicos</h2>
                <button 
                    onClick={handleAdicionar} 
                    className="btn btn-sm fw-bold" 
                    style={btnAdicionarStyle}
                    onMouseEnter={(e) => { e.target.style.backgroundColor = '#2f81f7'; e.target.style.color = 'white'; }}
                    onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#2f81f7'; }}
                >
                    + Adicionar Bico
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
                                        <th scope="col" style={{ borderTop: '0', padding: '1rem' }}>Tanque Associado</th>
                                        <th scope="col" style={{ borderTop: '0', padding: '1rem', width: '120px', textAlign: 'right' }}>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bicos.length === 0 && (
                                        <tr>
                                            <td colSpan="3" className="text-center" style={{ padding: '1rem' }}>Nenhum bico cadastrado.</td>
                                        </tr>
                                    )}
                                    {bicos.map(bico => (
                                        <tr key={bico.id}>
                                            <td style={{ verticalAlign: 'middle', padding: '1rem' }}>{bico.numero}</td>
                                            <td style={{ verticalAlign: 'middle', padding: '1rem' }}>{bico.tanqueNumero || 'N/A'}</td>
                                            <td style={{ verticalAlign: 'middle', padding: '1rem', textAlign: 'right' }}>
                                                <button 
                                                    onClick={() => handleEditar(bico)} 
                                                    className="btn btn-sm btn-link" 
                                                    style={{ color: '#58a6ff', textDecoration: 'none' }} 
                                                    title="Editar"
                                                >✏️</button>
                                                <button 
                                                    onClick={() => handleDeletar(bico.id)} 
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

            {/* --- Renderização Condicional do Modal --- */}
            {showModal && (
                <ModalBico
                    item={bicoEmEdicao}
                    onClose={() => setShowModal(false)}
                    onSalvar={() => {
                        setShowModal(false);
                        fetchBicos(); // Recarrega a lista de bicos
                    }}
                />
            )}
        </div>
    );
}

export default PaginaBicos;