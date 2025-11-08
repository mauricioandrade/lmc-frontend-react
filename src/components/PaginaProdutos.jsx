import React, { useState, useEffect } from 'react';
import * as api from '../services/api';
import { toast } from 'react-hot-toast';

const ModalProduto = ({ item, onClose, onSalvar }) => {
    const [nome, setNome] = useState(item ? item.nome : '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const produtoData = {
            id: item ? item.id : null,
            nome: nome
        };

        try {
            await api.salvarProduto(produtoData);
            toast.success(`Produto ${item ? 'atualizado' : 'criado'} com sucesso!`);
            onSalvar();
            onClose();
        } catch (error) {
            console.error("Erro ao salvar produto:", error);
            setError(error.response?.data?.message || "Falha ao salvar produto.");
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
                style={{ backgroundColor: '#161b22', border: '1px solid #30363d', width: '500px' }}
                onClick={e => e.stopPropagation()}
            >
                <div className="card-header py-3" style={{ backgroundColor: '#1f6feb', border: 'none' }}>
                    <h4 className="mb-0 fw-bold text-white">
                        {item ? 'Editar Produto' : 'Adicionar Produto'}
                    </h4>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="card-body p-4">
                        {error && <div className="alert alert-danger">{error}</div>}

                        <div className="mb-3">
                            <label className="form-label fw-semibold small" style={{ color: '#c9d1d9' }}>Nome do Produto</label>
                            <input
                                name="nome"
                                type="text" className="form-control"
                                style={{ backgroundColor: '#0d1117', color: '#c9d1d9', border: '1px solid #30363d' }}
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                required
                                placeholder="Ex: Gasolina Aditivada"
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
};


function PaginaProdutos() {
    const [produtos, setProdutos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [produtoEmEdicao, setProdutoEmEdicao] = useState(null);

    const fetchProdutos = () => {
        setLoading(true);
        api.getProdutos()
            .then(response => {
                setProdutos(response.data);
                setError(null);
            })
            .catch(err => {
                console.error("Erro ao buscar produtos:", err);
                setError("Não foi possível carregar os produtos.");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchProdutos();
    }, []);

    const handleAdicionar = () => {
        setProdutoEmEdicao(null);
        setShowModal(true);
    };

    const handleEditar = (produto) => {
        setProdutoEmEdicao(produto);
        setShowModal(true);
    };

    const handleDeletar = async (id) => {
        if (!window.confirm("Tem certeza que deseja excluir este produto?")) {
            return;
        }
        try {
            await api.deletarProduto(id);
            toast.success("Produto excluído com sucesso!");
            fetchProdutos();
        } catch (error) {
            console.error("Erro ao deletar produto:", error);
            toast.error(error.response?.data?.message || "Falha ao excluir produto.");
        }
    };

    const btnAdicionarStyle = {
        color: '#2f81f7',
        border: '1px solid #2f81f7',
        backgroundColor: 'transparent'
    };

    return (
        <div className="container" style={{ maxWidth: '900px', width: '100%', color: '#c9d1d9', paddingTop: '2rem' }}>

            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 style={{ color: '#58a6ff' }}>Gerenciamento de Produtos</h2>
                <button
                    onClick={handleAdicionar}
                    className="btn btn-sm fw-bold"
                    style={btnAdicionarStyle}
                    onMouseEnter={(e) => { e.target.style.backgroundColor = '#2f81f7'; e.target.style.color = 'white'; }}
                    onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#2f81f7'; }}
                >
                    + Adicionar Produto
                </button>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            {loading && <p>Carregando produtos...</p>}

            {!loading && !error && (
                <div className="card shadow-lg rounded-4" style={{ backgroundColor: '#161b22', border: '1px solid #30363d' }}>
                    <div className="card-body p-0">
                        <table className="table table-dark table-hover mb-0" style={{ borderRadius: '0.5rem', overflow: 'hidden' }}>
                            <thead>
                                <tr>
                                    <th scope="col" style={{ borderTop: '0', padding: '1rem' }}>ID</th>
                                    <th scope="col" style={{ borderTop: '0', padding: '1rem' }}>Nome</th>
                                    <th scope="col" style={{ borderTop: '0', padding: '1rem', width: '120px' }}>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {produtos.length === 0 && (
                                    <tr>
                                        <td colSpan="3" className="text-center" style={{ padding: '1rem' }}>Nenhum produto cadastrado.</td>
                                    </tr>
                                )}
                                {produtos.map(produto => (
                                    <tr key={produto.id}>
                                        <td style={{ verticalAlign: 'middle', padding: '1rem' }}>{produto.id}</td>
                                        <td style={{ verticalAlign: 'middle', padding: '1rem' }}>{produto.nome}</td>
                                        <td style={{ verticalAlign: 'middle', padding: '1rem' }}>
                                            <button
                                                onClick={() => handleEditar(produto)}
                                                className="btn btn-sm btn-link"
                                                style={{ color: '#58a6ff', textDecoration: 'none' }}
                                                title="Editar"
                                            >✏️</button>
                                            <button
                                                onClick={() => handleDeletar(produto.id)}
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
            )}

            
            {showModal && (
                <ModalProduto
                    item={produtoEmEdicao}
                    onClose={() => setShowModal(false)}
                    onSalvar={() => {
                        setShowModal(false);
                        fetchProdutos();
                    }}
                />
            )}

        </div>
    );
}

export default PaginaProdutos;