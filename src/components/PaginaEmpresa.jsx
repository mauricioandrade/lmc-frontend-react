import React, { useState, useEffect } from 'react';
import * as api from '../services/api';
import { toast } from 'react-hot-toast';
import ModalEmpresa from './ModalEmpresa';

function PaginaEmpresa() {
    const [empresas, setEmpresas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [empresaEmEdicao, setEmpresaEmEdicao] = useState(null);

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

    useEffect(() => {
        fetchEmpresas();
    }, []);

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
            fetchEmpresas();
        } catch (error) {
            console.error("Erro ao deletar empresa:", error);
            toast.error(error.response?.data?.message || "Falha ao excluir empresa.");
        }
    };

    return (
        <section className="page-section">
            <div className="page-toolbar">
                <div className="page-toolbar__content">
                    <h2 className="page-section__title page-section__title--secondary mb-1">Gerenciamento de Empresas</h2>
                    <p className="page-section__subtitle page-section__subtitle--left">
                        Cadastre as empresas atendidas e mantenha o controle de clientes corporativos.
                    </p>
                </div>
                <button
                    onClick={handleAdicionar}
                    className="btn btn-outline-accent page-toolbar__action"
                >
                    + Adicionar Empresa
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
                <div className="card surface-card">
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-dark table-hover mb-0 align-middle">
                                <thead>
                                    <tr>
                                        <th scope="col">Razão Social</th>
                                        <th scope="col">CNPJ</th>
                                        <th scope="col">Ativa?</th>
                                        <th scope="col" className="text-end">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {empresas.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="text-center py-4">Nenhuma empresa cadastrada.</td>
                                        </tr>
                                    )}
                                    {empresas.map(empresa => (
                                        <tr key={empresa.id}>
                                            <td className="py-3">{empresa.razaoSocial}</td>
                                            <td className="py-3">{empresa.cnpj}</td>
                                            <td className="py-3">
                                                {empresa.isAtiva ? (
                                                    <span className="badge rounded-pill bg-success-soft">Sim</span>
                                                ) : (
                                                    <span className="badge rounded-pill bg-muted-soft">Não</span>
                                                )}
                                            </td>
                                            <td className="py-3 text-end">
                                                <button
                                                    onClick={() => handleEditar(empresa)}
                                                    className="btn btn-link btn-link-accent"
                                                    title="Editar"
                                                >✏️</button>
                                                <button
                                                    onClick={() => handleDeletar(empresa.id)}
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
                <ModalEmpresa
                    item={empresaEmEdicao}
                    onClose={() => setShowModal(false)}
                    onSalvar={() => {
                        setShowModal(false);
                        fetchEmpresas();
                    }}
                />
            )}
        </section>
    );
}

export default PaginaEmpresa;
