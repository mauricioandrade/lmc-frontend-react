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

    return (
        <section className="page-section">
            <div className="page-toolbar">
                <div className="page-toolbar__content">
                    <h2 className="page-section__title page-section__title--secondary mb-1">Gerenciamento de Produtos</h2>
                    <p className="page-section__subtitle page-section__subtitle--left">
                        Organize os itens comercializados e mantenha o catálogo sempre atualizado.
                    </p>
                </div>
                <button
                    onClick={handleAdicionar}
                    className="btn btn-outline-accent page-toolbar__action"
                >
                    + Adicionar Produto
                </button>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            {loading && <p className="text-muted">Carregando produtos...</p>}

            {!loading && !error && (
                <div className="card surface-card">
                    <div className="card-body p-0">
                        <table className="table table-dark table-hover mb-0 align-middle">
                            <thead>
                                <tr>
                                    <th scope="col">ID</th>
                                    <th scope="col">Nome</th>
                                    <th scope="col" className="text-end">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {produtos.length === 0 && (
                                    <tr>
                                        <td colSpan="3" className="text-center py-4">Nenhum produto cadastrado.</td>
                                    </tr>
                                )}
                                {produtos.map(produto => (
                                    <tr key={produto.id}>
                                        <td className="py-3">{produto.id}</td>
                                        <td className="py-3">{produto.nome}</td>
                                        <td className="py-3 text-end">
                                            <button
                                                onClick={() => handleEditar(produto)}
                                                className="btn btn-link btn-link-accent"
                                                title="Editar"
                                            >✏️</button>
                                            <button
                                                onClick={() => handleDeletar(produto.id)}
                                                className="btn btn-link btn-link-danger"
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
        </section>
    );
}

export default PaginaProdutos;