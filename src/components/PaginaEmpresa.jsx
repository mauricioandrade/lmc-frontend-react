import React, { useState, useEffect } from 'react';
import * as api from '../services/api';
import { toast } from 'react-hot-toast';
import ModalEmpresa from './ModalEmpresa'; // Importa o modal

// Componente da Página Principal
function PaginaEmpresa() {
    const [empresas, setEmpresas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Controle do Modal
    const [showModal, setShowModal] = useState(false);
    const [empresaEmEdicao, setEmpresaEmEdicao] = useState(null); 

    // Função para carregar os dados
    const fetchEmpresas = () => {
        setLoading(true);
        api.getTodasEmpresas()
            .then(response => {
                setEmpresas(response.data);
                setError(null);
            })
            .catch(err => {
                console.error("Erro ao buscar empresas:", err);
                setError("Não foi possível carregar as empresas.");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    // Carrega os dados quando o componente é montado
    useEffect(() => {
        fetchEmpresas();
    }, []);

    // Handlers do CRUD
    const handleAdicionar = () => {
        setEmpresaEmEdicao(null); 
        setShowModal(true);
    };

    const handleEditar = (empresa) => {
        setEmpresaEmEdicao(empresa);
        setShowModal(true);
    };

    const handleDeletar = async (id) => {
        if (!window.confirm("Tem certeza que deseja excluir esta empresa?")) {
            return;
        }
        try {
            await api.deletarEmpresa(id);
            toast.success("Empresa excluída com sucesso!");
            fetchEmpresas(); // Recarrega a lista
        } catch (error) {
            console.error("Erro ao deletar empresa:", error);
            toast.error(error.response?.data?.message || "Falha ao excluir empresa.");
        }
    };

    // Estilo do botão de adicionar (do seu app)
    const btnAdicionarStyle = { 
        color: '#2f81f7', 
        border: '1px solid #2f81f7',
        backgroundColor: 'transparent'
    };

    return (
        <div className="container" style={{ maxWidth: '900px', width: '100%', color: '#c9d1d9', paddingTop: '1rem' }}>
            
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 style={{ color: '#58a6ff' }}>Gerenciamento de Empresas</h2>
                <button 
                    onClick={handleAdicionar} 
                    className="btn btn-sm fw-bold" 
                    style={btnAdicionarStyle}
                    onMouseEnter={(e) => { e.target.style.backgroundColor = '#2f81f7'; e.target.style.color = 'white'; }}
                    onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#2f81f7'; }}
                >
                    + Adicionar Empresa
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
                                        <th scope="col" style={{ borderTop: '0', padding: '1rem' }}>Razão Social</th>
                                        <th scope="col" style={{ borderTop: '0', padding: '1rem' }}>CNPJ</th>
                                        <th scope="col" style={{ borderTop: '0', padding: '1rem' }}>Ativa?</th>
                                        <th scope="col" style={{ borderTop: '0', padding: '1rem', width: '120px', textAlign: 'right' }}>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {empresas.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="text-center" style={{ padding: '1rem' }}>Nenhuma empresa cadastrada.</td>
                                        </tr>
                                    )}
                                    {empresas.map(empresa => (
                                        <tr key={empresa.id}>
                                            <td style={{ verticalAlign: 'middle', padding: '1rem' }}>{empresa.razaoSocial}</td>
                                            <td style={{ verticalAlign: 'middle', padding: '1rem' }}>{empresa.cnpj}</td>
                                            <td style={{ verticalAlign: 'middle', padding: '1rem' }}>
                                                {empresa.isAtiva ? (
                                                    <span className="badge" style={{ backgroundColor: '#238636', color: '#ffffff' }}>Sim</span>
                                                ) : (
                                                    <span className="badge" style={{ backgroundColor: '#30363d', color: '#8b949e' }}>Não</span>
                                                )}
                                            </td>
                                            <td style={{ verticalAlign: 'middle', padding: '1rem', textAlign: 'right' }}>
                                                <button 
                                                    onClick={() => handleEditar(empresa)} 
                                                    className="btn btn-sm btn-link" 
                                                    style={{ color: '#58a6ff', textDecoration: 'none' }} 
                                                    title="Editar"
                                                >✏️</button>
                                                <button 
                                                    onClick={() => handleDeletar(empresa.id)} 
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
                <ModalEmpresa
                    item={empresaEmEdicao}
                    onClose={() => setShowModal(false)}
                    onSalvar={() => {
                        setShowModal(false);
                        fetchEmpresas(); // Recarrega a lista
                    }}
                />
            )}

        </div>
    );
}

export default PaginaEmpresa;