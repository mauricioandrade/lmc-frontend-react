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

    return (
        <section className="page-section">
            <div className="page-toolbar">
                <div className="page-toolbar__content">
                    <h2 className="page-section__title page-section__title--secondary mb-1">Gerenciamento de Tanques</h2>
                    <p className="page-section__subtitle page-section__subtitle--left">
                        Controle as capacidades e os produtos associados a cada tanque de armazenamento.
                    </p>
                </div>
                <button
                    onClick={handleAdicionar}
                    className="btn btn-outline-accent page-toolbar__action"
                >
                    + Adicionar Tanque
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
                                        <th scope="col">Produto</th>
                                        <th scope="col">Capacidade</th>
                                        <th scope="col" className="text-end">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tanques.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="text-center py-4">Nenhum tanque cadastrado.</td>
                                        </tr>
                                    )}
                                    {tanques.map(tanque => (
                                        <tr key={tanque.id}>
                                            <td className="py-3">{tanque.numero}</td>
                                            <td className="py-3">{tanque.produtoNome || 'N/A'}</td>
                                            <td className="py-3">{tanque.capacidadeNominal} L</td>
                                            <td className="py-3 text-end">
                                                <button
                                                    onClick={() => handleEditar(tanque)}
                                                    className="btn btn-link btn-link-accent"
                                                    title="Editar"
                                                >✏️</button>
                                                <button
                                                    onClick={() => handleDeletar(tanque.id)}
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
                <ModalTanque
                    item={tanqueEmEdicao}
                    onClose={() => setShowModal(false)}
                    onSalvar={() => {
                        setShowModal(false);
                        fetchTanques();
                    }}
                />
            )}
        </section>
    );
}

export default PaginaTanques;
