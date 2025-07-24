import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
// FIX: Import 'Edit' and other new icons
import { Plus, Search, Trash2, Edit, SlidersHorizontal } from 'lucide-react'; 
import { getLinks, createLink, updateLink, deleteLink, bulkUpdateLinks } from '../../api/linksService';
import { getBatches } from '../../api/batchesService';
import Loader from '../../components/ui/Loader';
import Pagination from '../../components/ui/Pagination';
import CreateLinkModal from '../../components/links/CreateLinkModal';
import Modal from '../../components/ui/Modal';
import LinkStatus from '../../components/links/LinkStatus';
import ManageBatchesModal from '../../components/links/ManageBatchesModal'; // Import the new modal

const LinksPage = () => {
  const [links, setLinks] = useState([]);
  const [batches, setBatches] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', batchId: '' });
  const [selectedLinks, setSelectedLinks] = useState([]);

  // Modal States
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false); // New state for batch modal
  const [editingLink, setEditingLink] = useState(null);
  const [linkToDelete, setLinkToDelete] = useState(null);

  const fetchLinks = async (page = 1) => {
    setLoading(true);
    try {
      const linksData = await getLinks({ page, limit: 10, ...filters });
      setLinks(linksData.data);
      setPagination(linksData.pagination);
    } catch (error) {
      console.error("Failed to fetch links:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchBatchesData = async () => {
    try {
        const batchesData = await getBatches();
        setBatches(batchesData);
    } catch (error) {
        console.error("Failed to fetch batches:", error);
    }
  }

  useEffect(() => {
    fetchLinks(1); // Fetch links on filter change, reset to page 1
  }, [filters]);

  useEffect(() => {
    fetchBatchesData(); // Fetch batches on initial load
  }, []);

  const handlePageChange = (page) => {
    fetchLinks(page);
  };
  
  // All other handlers (handleSaveLink, handleDeleteConfirm, etc.) remain the same...
    const handleSaveLink = async (linkData) => {
    try {
      if (editingLink) {
        await updateLink(editingLink.id, linkData);
      } else {
        await createLink(linkData);
      }
      fetchLinks(pagination.currentPage);
      setIsLinkModalOpen(false);
      setEditingLink(null);
    } catch (error) {
      console.error("Failed to save link:", error);
    }
  };
  
  const handleDeleteConfirm = async () => {
    if (!linkToDelete) return;
    try {
      await deleteLink(linkToDelete);
      fetchLinks(pagination.currentPage);
      setIsConfirmModalOpen(false);
      setLinkToDelete(null);
    } catch (error) {
      console.error("Failed to delete link:", error);
    }
  };

  const openDeleteModal = (id) => {
    setLinkToDelete(id);
    setIsConfirmModalOpen(true);
  };

  const handleSelectLink = (id) => {
    setSelectedLinks(prev => 
      prev.includes(id) ? prev.filter(linkId => linkId !== id) : [...prev, id]
    );
  };
  
  const handleBulkDelete = async () => {
      if (selectedLinks.length === 0) return;
      await bulkUpdateLinks('delete', selectedLinks);
      setSelectedLinks([]);
      fetchLinks(1);
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-800">Links</h1>
        <div className="flex items-center gap-2">
            {/* NEW: Manage Batches Button */}
            <button onClick={() => setIsBatchModalOpen(true)} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border rounded-md hover:bg-slate-50">
                <SlidersHorizontal size={16} /> Manage Batches
            </button>
            <button onClick={() => { setEditingLink(null); setIsLinkModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
              <Plus size={16} /> Create Link
            </button>
        </div>
      </div>

      {/* Filters and Actions (UI remains the same) */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
            {selectedLinks.length > 0 && (
                <button onClick={handleBulkDelete} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-100 rounded-md hover:bg-red-200">
                    <Trash2 size={16} /> Delete ({selectedLinks.length})
                </button>
            )}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search by name..." onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))} className="pl-10 pr-4 py-2 border rounded-md w-64" />
          </div>
          <select onChange={(e) => setFilters(prev => ({ ...prev, batchId: e.target.value }))} className="py-2 border rounded-md">
            <option value="">All Batches</option>
            {batches.map(batch => <option key={batch.id} value={batch.id}>{batch.name}</option>)}
          </select>
        </div>
      </div>

      {/* Table (UI remains the same, but the buttons will now work) */}
       <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? <div className="min-h-[400px] flex items-center justify-center"><Loader /></div> : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="p-4 w-12"><input type="checkbox" onChange={(e) => setSelectedLinks(e.target.checked ? links.map(l => l.id) : [])} /></th>
                <th className="p-4 text-left">Link</th>
                <th className="p-4 text-left">Short Code</th>
                <th className="p-4 text-center">Clicks</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {links.map(link => (
                <tr key={link.id} className="border-b">
                  <td className="p-4"><input type="checkbox" checked={selectedLinks.includes(link.id)} onChange={() => handleSelectLink(link.id)} /></td>
                  <td className="p-4 font-medium text-slate-800">{link.name}</td>
                  <td className="p-4 text-blue-600">/{link.shortCode}</td>
                  <td className="p-4 text-center font-semibold">{link.clickCount}</td>
                  <td className="p-4 text-center">
                    <LinkStatus link={link} />
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => { setEditingLink(link); setIsLinkModalOpen(true); }} className="p-2 text-slate-500 hover:text-blue-600"><Edit size={16} /></button>
                    <button onClick={() => openDeleteModal(link.id)} className="p-2 text-slate-500 hover:text-red-600"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {!loading && pagination.totalPages > 1 && <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} onPageChange={handlePageChange} />}

      <CreateLinkModal isOpen={isLinkModalOpen} onClose={() => setIsLinkModalOpen(false)} onSave={handleSaveLink} batches={batches} linkData={editingLink} />
      
      <Modal isOpen={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)} title="Confirm Deletion">
        <div>
          <p>Are you sure you want to delete this link? This action cannot be undone.</p>
          <div className="pt-4 flex justify-end gap-3">
            <button onClick={() => setIsConfirmModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200">Cancel</button>
            <button onClick={handleDeleteConfirm} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">Delete</button>
          </div>
        </div>
      </Modal>
      
      {/* NEW: Batch Management Modal */}
      <ManageBatchesModal 
        isOpen={isBatchModalOpen} 
        onClose={() => {
            setIsBatchModalOpen(false);
            fetchBatchesData(); // Refetch batches when modal closes to update dropdown
        }} 
      />
    </motion.div>
  );
};

export default LinksPage;