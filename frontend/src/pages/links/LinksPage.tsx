import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, SlidersHorizontal } from 'lucide-react';

// Custom Hook
import { useLinksData } from '../../hooks/useLinksData';

// API Services
import { createLink, updateLink, deleteLink, bulkUpdateLinks } from '../../api/linksService';

// UI Components
import PageHeader from '../../components/layout/PageHeader';
import Modal from '../../components/ui/Modal';
import LinksTable from '../../components/links/LinksTable';
import CreateLinkModal from '../../components/links/CreateLinkModal';
import ManageBatchesModal from '../../components/links/ManageBatchesModal';
import QrCodeModal from '../../components/links/QrCodeModal';
import Button from '../../components/ui/Button';

const LinksPage = () => {
    const { data, pagination, loading, filters, setFilters, fetchData } = useLinksData();
    const [selectedLinks, setSelectedLinks] = useState<string[]>([]);
    
    // Modal & Action State
    const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
    const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
    const [editingLink, setEditingLink] = useState(null);
    const [qrCodeLink, setQrCodeLink] = useState<string | null>(null);
    const [confirmAction, setConfirmAction] = useState<{ title: string; message: string; onConfirm: () => void; } | null>(null);
    
    const handleSaveLink = async (linkData) => {
        try {
            if (editingLink) { await updateLink(editingLink.id, linkData); } 
            else { await createLink(linkData); }
            setIsLinkModalOpen(false);
            setEditingLink(null);
            fetchData(editingLink ? pagination.currentPage : 1);
        } catch (error) { throw error; }
    };
    
    const handleDeleteLink = (id: string) => {
        setConfirmAction({
            title: 'Confirm Deletion',
            message: 'Are you sure you want to delete this link?',
            onConfirm: async () => {
                await deleteLink(id);
                setConfirmAction(null);
                fetchData(pagination.currentPage);
            },
        });
    };
    
    const handleBulkDelete = () => {
        if (selectedLinks.length === 0) return;
        setConfirmAction({
            title: `Delete ${selectedLinks.length} Links`,
            message: `Are you sure you want to delete these ${selectedLinks.length} links?`,
            onConfirm: async () => {
                await bulkUpdateLinks('delete', selectedLinks);
                setSelectedLinks([]);
                setConfirmAction(null);
                fetchData(1);
            },
        });
    };

    return (
        <div className="flex flex-col min-h-full">
            <PageHeader title="Links">
                <Button variant="secondary" onClick={() => setIsBatchModalOpen(true)}>
                    <SlidersHorizontal size={16} /> <span className='hidden sm:block'>Manage Batches</span>
                </Button>
                <Button onClick={() => { setEditingLink(null); setIsLinkModalOpen(true); }}>
                    <Plus size={16} /> <span className='hidden sm:block'>Create Link</span>
                </Button>
            </PageHeader>

            <LinksTable
                links={data.links}
                batches={data.batches}
                topBatches={data.topBatches}
                loading={loading}
                selectedLinks={selectedLinks}
                setSelectedLinks={setSelectedLinks}
                pagination={pagination}
                filters={filters}
                onFilterChange={(key, value) => setFilters(prev => ({...prev, [key]: value}))}
                onPageChange={(page) => fetchData(page)}
                onQrCode={(shortCode) => { const baseUrl = import.meta.env.VITE_LINKS_BASE_URL || window.location.origin; setQrCodeLink(`${baseUrl}/${shortCode}`); }}
                onEdit={(link) => { setEditingLink(link); setIsLinkModalOpen(true); }}
                onDelete={handleDeleteLink}
                onBulkDelete={handleBulkDelete}
                onCreateLink={() => { setEditingLink(null); setIsLinkModalOpen(true); }}
            />

            <CreateLinkModal isOpen={isLinkModalOpen} onClose={() => setIsLinkModalOpen(false)} onSave={handleSaveLink} batches={data.batches} linkData={editingLink} />
            {confirmAction && ( <Modal isOpen={!!confirmAction} onClose={() => setConfirmAction(null)} title={confirmAction.title}>
                    <div>
                        <p>{confirmAction.message}</p>
                        <div className="pt-4 flex justify-end gap-3">
                            <Button variant="secondary" onClick={() => setConfirmAction(null)}>Cancel</Button>
                            <Button variant="danger" onClick={confirmAction.onConfirm}>Confirm</Button>
                        </div>
                    </div>
            </Modal> )}
            <ManageBatchesModal isOpen={isBatchModalOpen} onClose={() => { setIsBatchModalOpen(false); fetchData(); }} />
            <QrCodeModal isOpen={!!qrCodeLink} onClose={() => setQrCodeLink(null)} shortUrl={qrCodeLink} />
        </div>
    );
};

export default LinksPage;