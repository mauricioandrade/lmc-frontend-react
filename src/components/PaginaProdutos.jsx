import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';
import ModalProduto from './ModalProduto';
import { deletarProduto, getProdutos, salvarProduto } from '../services/api';

function PaginaProdutos() {
    const [produtos, setProdutos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);
    const [produtoSelecionado, setProdutoSelecionado] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const carregarProdutos = useCallback(async () => {
        setIsLoading(true);
        setErrorMessage(null);

        try {
            const response = await getProdutos();
            setProdutos(response.data);
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
            setErrorMessage('Não foi possível carregar os produtos.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        carregarProdutos();
    }, [carregarProdutos]);

    const abrirModal = useCallback((produto = null) => {
        setProdutoSelecionado(produto);
        setIsModalOpen(true);
    }, []);

    const fecharModal = useCallback(() => {
        setIsModalOpen(false);
        setProdutoSelecionado(null);
    }, []);

    const handleSubmitProduto = useCallback(async ({ id, nome }) => {
        try {
            await salvarProduto({ id, nome });
            toast.success(`Produto ${id ? 'atualizado' : 'criado'} com sucesso!`);
            await carregarProdutos();
        } catch (error) {
            console.error('Erro ao salvar produto:', error);
            const message = error?.response?.data?.message || 'Falha ao salvar produto.';
            throw new Error(message);
        }
    }, [carregarProdutos]);

    const handleDeleteProduto = useCallback(async (id) => {
        const shouldDelete = window.confirm('Tem certeza que deseja excluir este produto?');

        if (!shouldDelete) {
            return;
        }

        try {
            await deletarProduto(id);
            toast.success('Produto excluído com sucesso!');
            await carregarProdutos();
        } catch (error) {
            console.error('Erro ao deletar produto:', error);
            const message = error?.response?.data?.message || 'Falha ao excluir produto.';
            toast.error(message);
        }
    }, [carregarProdutos]);

    const produtosOrdenados = useMemo(
        () => [...produtos].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR')),
        [produtos]
    );

    return (
        <section className="page-section">
            <div className="page-toolbar">
                <div className="page-toolbar__content">
                    <h2 className="page-section__title page-section__title--secondary mb-1">
                        Gerenciamento de Produtos
                    </h2>
                    <p className="page-section__subtitle page-section__subtitle--left">
                        Organize os itens comercializados e mantenha o catálogo sempre atualizado.
                    </p>
                </div>
                <button
                    onClick={() => abrirModal()}
                    className="btn btn-outline-accent page-toolbar__action"
                >
                    + Adicionar Produto
                </button>
            </div>

            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            {isLoading && <p className="text-muted">Carregando produtos...</p>}

            {!isLoading && !errorMessage && (
                <div className="card surface-card" style={{ borderRadius: 0 }}>
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
                                {produtosOrdenados.length === 0 && (
                                    <tr>
                                        <td colSpan="3" className="text-center py-4">
                                            Nenhum produto cadastrado.
                                        </td>
                                    </tr>
                                )}
                                {produtosOrdenados.map((produto) => (
                                    <tr key={produto.id}>
                                        <td className="py-3">{produto.id}</td>
                                        <td className="py-3">{produto.nome}</td>
                                        <td className="py-3 text-end">
                                            <button
                                                onClick={() => abrirModal(produto)}
                                                className="btn btn-link btn-link-accent"
                                                title="Editar"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                onClick={() => handleDeleteProduto(produto.id)}
                                                className="btn btn-link btn-link-danger"
                                                title="Excluir"
                                            >
                                                🗑️
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {isModalOpen && (
                <ModalProduto
                    produto={produtoSelecionado}
                    onClose={fecharModal}
                    onSubmit={handleSubmitProduto}
                />
            )}
        </section>
    );
}

export default PaginaProdutos;
