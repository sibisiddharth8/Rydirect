import { QrCode, Edit, Trash2 } from 'lucide-react';
import LinkStatus from './LinkStatus';
import Loader from '../ui/Loader';
import TablePagination from '../ui/TablePagination';
import EmptyState from '../ui/EmptyState';

const LinksTable = ({
  links, pagination, loading, selectedLinks, setSelectedLinks,
  onPageChange, onQrCode, onEdit, onDelete, onCreateLink,
}: any) => {
  const handleSelectOne = (id: string) => {
    setSelectedLinks(prev => 
      prev.includes(id) 
        ? prev.filter(linkId => linkId !== id) 
        : [...prev, id]
    );
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedLinks(links.map(l => l.id));
    } else {
      setSelectedLinks([]);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center rounded-lg">
        <Loader text="Fetching links..." />
      </div>
    );
  }

  if (links.length === 0) {
    return (
      <div className="bg-white rounded-lg">
        <EmptyState 
          title="No links found"
          message="Adjust your filters or get started by creating a new link."
          actionText="Create Link"
          onAction={onCreateLink}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 rounded-lg overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-200 text-slate-600 sticky top-0 z-10">
            <tr>
              <th className="p-4 w-12 text-center"><input type="checkbox" onChange={handleSelectAll} checked={links.length > 0 && selectedLinks.length === links.length} /></th>
              <th className="p-4 text-left font-semibold">Link</th>
              <th className="p-4 text-left font-semibold">Short Code</th>
              <th className="p-4 text-center font-semibold">Clicks</th>
              <th className="p-4 text-center font-semibold">Status</th>
              <th className="p-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {links.map(link => (
              <tr key={link.id} className={`hover:bg-slate-50 transition-colors ${selectedLinks.includes(link.id) ? 'bg-blue-50' : ''}`}>
                <td className="p-4 text-center"><input type="checkbox" checked={selectedLinks.includes(link.id)} onChange={() => handleSelectOne(link.id)} /></td>
                <td className="p-4 font-medium text-slate-800">{link.name}</td>
                <td className="p-4 text-blue-600 font-medium">/{link.shortCode}</td>
                <td className="p-4 text-center font-semibold text-slate-700">{link.clickCount}</td>
                <td className="p-4 text-center"><LinkStatus link={link} /></td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => onQrCode(link.shortCode)} className="p-2 rounded-md text-slate-500 hover:bg-slate-200 hover:text-green-600" title="Show QR Code"><QrCode size={16} /></button>
                    <button onClick={() => onEdit(link)} className="p-2 rounded-md text-slate-500 hover:bg-slate-200 hover:text-blue-600" title="Edit Link"><Edit size={16} /></button>
                    <button onClick={() => onDelete(link.id)} className="p-2 rounded-md text-slate-500 hover:bg-slate-200 hover:text-red-600" title="Delete Link"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <TablePagination 
        currentPage={pagination.currentPage} 
        totalPages={pagination.totalPages} 
        onPageChange={onPageChange}
        totalItems={pagination.total}
        limit={10}
      />
    </div>
  );
};

export default LinksTable;