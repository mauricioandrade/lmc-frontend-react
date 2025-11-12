import { useEffect, useMemo, useState } from 'react';

const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1050,
};

const cardStyle = {
    backgroundColor: '#161b22',
    border: '1px solid #30363d',
    width: '500px',
};

const headerStyle = {
    backgroundColor: '#1f6feb',
    border: 'none',
};

const inputStyle = {
    backgroundColor: '#0d1117',
    color: '#c9d1d9',
    border: '1px solid #30363d',
};

const footerStyle = {
    backgroundColor: '#161b22',
    borderTop: '1px solid #30363d',
};

const defaultFormValues = {
    nome: '',
};

function ModalProduto({ produto = null, onClose, onSubmit }) {
    const [formValues, setFormValues] = useState(defaultFormValues);
    const [errorMessage, setErrorMessage] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setFormValues(prevValues => ({
            ...prevValues,
            nome: produto?.nome ?? '',
        }));
    }, [produto]);

    const tituloModal = useMemo(
        () => (produto ? 'Editar Produto' : 'Adicionar Produto'),
        [produto]
    );

    const buttonLabel = useMemo(
        () => (isSaving ? 'Salvando...' : 'Salvar'),
        [isSaving]
    );

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormValues((currentValues) => ({
            ...currentValues,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSaving(true);
        setErrorMessage(null);

        try {
            await onSubmit({
                id: produto?.id ?? null,
                nome: formValues.nome.trim(),
            });
            onClose();
        } catch (error) {
            const fallbackMessage = 'Falha ao salvar produto.';
            setErrorMessage(error?.message || fallbackMessage);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div style={modalOverlayStyle} onClick={onClose}>
            <div
                className="card shadow-lg rounded-4"
                style={cardStyle}
                onClick={(event) => event.stopPropagation()}
            >
                <div className="card-header py-3" style={headerStyle}>
                    <h4 className="mb-0 fw-bold text-white">{tituloModal}</h4>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="card-body p-4">
                        {errorMessage && (
                            <div className="alert alert-danger">{errorMessage}</div>
                        )}

                        <div className="mb-3">
                            <label className="form-label fw-semibold small" style={{ color: '#c9d1d9' }}>
                                Nome do Produto
                            </label>
                            <input
                                name="nome"
                                type="text"
                                className="form-control"
                                style={inputStyle}
                                value={formValues.nome}
                                onChange={handleChange}
                                required
                                placeholder="Ex: Gasolina Aditivada"
                            />
                        </div>
                    </div>
                    <div className="card-footer border-0 p-4" style={footerStyle}>
                        <div className="d-flex justify-content-end gap-2">
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={onClose}
                                disabled={isSaving}
                            >
                                Cancelar
                            </button>
                            <button type="submit" className="btn btn-primary" disabled={isSaving}>
                                {buttonLabel}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ModalProduto;
