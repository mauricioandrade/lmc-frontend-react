import React, { useState, useEffect } from 'react';
import * as api from '../services/api';
import { toast } from 'react-hot-toast';
import ModalBico from './ModalBico';

function PaginaBicos() {
    const [bicos, setBicos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [bicoEmEdicao, setBicoEmEdicao] = useState(null);

    const fetchBicos = () => {
        setLoading(true);
        api.getTodosBicos()
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

    useEffect(() => {
        fetchBicos();
    }, []);

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
            fetchBicos();
        } catch (error) {
            console.error("Erro ao deletar bico:", error);
            toast.error(error.response?.data?.message || "Falha ao excluir bico.");
        }
    };

    return (
        <section className="page-section">
            <div className="page-toolbar">
                <div className="page-toolbar__content">
                    <h2 className="page-section__title page-section__title--secondary mb-1">Gerenciamento de Bicos</h2>
                    <p className="page-section__subtitle page-section__subtitle--left">
                        Cadastre e mantenha os bicos associados a cada tanque para facilitar o controle diário.
                    </p>
                </div>
                <button
                    onClick={handleAdicionar}
                    className="btn btn-outline-accent page-toolbar__action"
                >
                    + Adicionar Bico
                </button>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            {loading && (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Carregando...</span>
                    </div>
                </div>
            )}

            {!loading && !error && (
                <div className="card surface-card" style={{ borderRadius: 0 }}>
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-dark table-hover mb-0 align-middle">
                                <thead>
                                    <tr>
                                        <th scope="col">Número</th>
                                        <th scope="col">Tanque Associado</th>
                                        <th scope="col" className="text-end">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bicos.length === 0 && (
                                        <tr>
                                            <td colSpan="3" className="text-center py-4">Nenhum bico cadastrado.</td>
                                        </tr>
                                    )}
                                    {bicos.map(bico => (
                                        <tr key={bico.id}>
                                            <td className="py-3">{bico.numero}</td>
                                            <td className="py-3">{bico.tanqueNumero || 'N/A'}</td>
                                            <td className="py-3 text-end">
                                                <button
                                                    onClick={() => handleEditar(bico)}
                                                    className="btn btn-link btn-link-accent"
                                                    title="Editar"
                                                >✏️</button>
                                                <button
                                                    onClick={() => handleDeletar(bico.id)}
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
                </div>
            )}

            {showModal && (
                <ModalBico
                    item={bicoEmEdicao}
                    onClose={() => setShowModal(false)}
                    onSalvar={() => {
                        setShowModal(false);
                        fetchBicos();
                    }}
                />
            )}
        </section>
    );
}

export default PaginaBicos;
