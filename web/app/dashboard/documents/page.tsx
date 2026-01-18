'use client';

import { useEffect, useState } from 'react';

interface Document {
    id: string;
    name: string;
    category: string;
    uploadedAt: string;
    url: string;
}

export default function DocumentsPage() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [isProcessingAI, setIsProcessingAI] = useState(false);

    // Upload Form
    const [file, setFile] = useState<File | null>(null);
    const [category, setCategory] = useState('FACTURA');

    const fetchDocs = async () => {
        try {
            const res = await fetch('http://localhost:3001/documents', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.ok) setDocuments(await res.json());
        } catch (e) { }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchDocs(); }, []);

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        if (category === 'FACTURA') {
            setIsProcessingAI(true);
            // Simulate AI Processing time
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        const formData = new FormData();
        formData.append('file', file); // In real app

        // Mock upload using JSON for this demo environment (since we don't have real file upload backend setup yet perfectly for multipart in the simplified controller)
        // We will simulate the metadata creation.

        const res = await fetch('http://localhost:3001/documents/upload', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                name: file.name,
                category,
                isSmartUpload: category === 'FACTURA' // Flag to trigger automation
            })
        });

        setIsProcessingAI(false);

        if (res.ok) {
            const data = await res.json();
            setShowForm(false);
            setFile(null);
            fetchDocs();

            if (data.autoCreatedTransaction) {
                alert(`✨ IA COMPLETADA:\n\nHemos detectado una factura de ${data.autoCreatedTransaction.amount}€.\n\n✅ Se ha guardado el documento.\n✅ Se ha creado el apunte contable Automáticamente.`);
            } else {
                alert('Documento subido correctamente.');
            }
        } else {
            alert('Error al subir documento');
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`¿Borrar ${name}?`)) return;
        const res = await fetch(`http://localhost:3001/documents/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (res.ok) fetchDocs();
    };

    if (loading) return <div className="p-8 text-white">Cargando documentos...</div>;

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">Gestión Documental</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors font-semibold shadow-lg flex items-center gap-2"
                >
                    <span>📄</span> Subir Documento
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleUpload} className="mb-8 bg-white/10 p-6 rounded-xl border border-white/20">
                    <div className="grid gap-4 mb-4">
                        <div>
                            <label className="block text-sm text-gray-300 mb-2">Seleccionar Archivo</label>
                            <input
                                type="file"
                                className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                                onChange={e => setFile(e.target.files ? e.target.files[0] : null)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-300 mb-2">Categoría</label>
                            <select
                                className="w-full p-3 rounded bg-black/30 border border-white/10 text-white"
                                value={category} onChange={e => setCategory(e.target.value)}
                            >
                                <option value="FACTURA">🧾 Factura (Procesamiento IA)</option>
                                <option value="ACTA">📝 Acta</option>
                                <option value="CONTRATO">🤝 Contrato</option>
                                <option value="POLIZA">🛡️ Póliza Seguros</option>
                                <option value="OTHER">Otro</option>
                            </select>
                        </div>
                        {category === 'FACTURA' && (
                            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded text-emerald-300 text-sm flex items-center gap-2">
                                <span>✨</span>
                                El sistema analizará esta factura y creará el apunte de Gasto en Cuentas automáticamente.
                            </div>
                        )}
                    </div>
                    <button
                        type="submit"
                        disabled={isProcessingAI}
                        className={`px-6 py-2 bg-emerald-600 text-white rounded-lg font-bold flex items-center gap-2 ${isProcessingAI ? 'opacity-75 cursor-wait' : ''}`}
                    >
                        {isProcessingAI ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Analizando documento...
                            </>
                        ) : 'Subir y Procesar'}
                    </button>
                </form>
            )}

            <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="border-b border-white/20 bg-white/5">
                        <tr>
                            <th className="p-4 text-slate-300">Documento</th>
                            <th className="p-4 text-slate-300">Categoría</th>
                            <th className="p-4 text-slate-300">Fecha Subida</th>
                            <th className="p-4 text-right text-slate-300">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {documents.map(doc => (
                            <tr key={doc.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                                <td className="p-4 font-semibold text-white flex items-center gap-3">
                                    <span className="text-2xl">
                                        {doc.category === 'FACTURA' ? '🧾' :
                                            doc.category === 'ACTA' ? '📝' :
                                                doc.category === 'CONTRATO' ? '🤝' : '📄'}
                                    </span>
                                    {doc.name}
                                </td>
                                <td className="p-4">
                                    <span className="px-3 py-1 bg-slate-700 rounded-full text-xs text-slate-200">
                                        {doc.category === 'ACTA' ? 'Acta' :
                                            doc.category === 'CONTRATO' ? 'Contrato' :
                                                doc.category === 'FACTURA' ? 'Factura' :
                                                    doc.category === 'POLIZA' ? 'Póliza' : 'Otro'}
                                    </span>
                                </td>
                                <td className="p-4 text-gray-400">{new Date(doc.uploadedAt).toLocaleDateString('es-ES')}</td>
                                <td className="p-4 text-right flex justify-end gap-2">
                                    {/*  
                            <button className="p-2 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 transition-colors" title="Descargar">
                                ⬇️
                            </button>
                           */}
                                    <button
                                        onClick={() => handleDelete(doc.id, doc.name)}
                                        className="p-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors" title="Eliminar"
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
    );
}
