import { QrCode, Edit, Trash2, Search } from 'lucide-react';
import LinkStatus from './LinkStatus';
import Loader from '../ui/Loader';
import TablePagination from '../ui/TablePagination';
import EmptyState from '../ui/EmptyState';
import Button from '../ui/Button';
import BatchCard from './BatchCard';
import FilterDropdown from '../ui/form/FilterDropdown';
import SearchInput from '../ui/form/SearchInput';

const LinksTable = ({
  // Data
  links,
  batches,
  topBatches,
  pagination,
  loading,
  selectedLinks,
  setSelectedLinks,
  
  // State & Handlers
  filters,
  onFilterChange,
  onPageChange,
  onQrCode,
  onEdit,
  onDelete,
  onCreateLink,
  onBulkDelete,
}) => {

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

  return (
    <div className="flex flex-col flex-1 rounded-lg">
      
      <div className="py-4 flex-shrink-0">
        <div className="flex items-center justify-between gap-2">
          <div className='flex items-center gap-2'>
           
              <SearchInput 
                value={filters.search}
                onChange={(e) => onFilterChange('search', e.target.value)}
              />
              <FilterDropdown 
                value={filters.batchId} 
                onChange={(e) => onFilterChange('batchId', e.target.value)} 
                options={batches}
              />
          </div>
            {selectedLinks.length > 0 ? (
              <Button variant="danger" onClick={onBulkDelete}>
                <Trash2 size={16} /> <span className='hidden sm:block'>Delete</span> ({selectedLinks.length})
              </Button>
            ) : (
               <div className="" /> 
            )}
         
        </div>
        
        {topBatches.length > 0 && (
          <div className="flex items-center gap-3 p-2 mt-4 border-t border-slate-200 overflow-x-auto">
            <span className="text-sm font-semibold text-slate-600">Top (3) Batches:</span>
            {topBatches.map(batch => (
              <BatchCard key={batch.id} batch={batch} onClick={(id) => onFilterChange('batchId', filters.batchId === id ? '' : id)} isActive={filters.batchId === batch.id} />
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto rounded-lg">
        {loading ? (
           <div className="h-full flex items-center justify-center">
             <Loader text="Fetching links..." />
           </div>
        ) : links.length === 0 ? (
          <EmptyState 
            title="No links found"
            message="Adjust your filters or get started by creating a new link."
            actionText="Create Link"
            onAction={onCreateLink}
          />
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-200 text-slate-600 sticky top-0 z-10">
              <tr>
                <th className="p-4 w-12 text-center">
                  <input 
                    type="checkbox" 
                    onChange={handleSelectAll} 
                    checked={links.length > 0 && selectedLinks.length === links.length} 
                  />
                </th>
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
                  <td className="p-4 text-center">
                    <input 
                      type="checkbox" 
                      checked={selectedLinks.includes(link.id)} 
                      onChange={() => handleSelectOne(link.id)} 
                    />
                  </td>
                  <td className="p-4 font-medium text-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 flex-shrink-0 rounded-md bg-slate-100 flex items-center justify-center overflow-hidden">
                        {link.iconUrl ? (
                            <img src={link.iconUrl} alt="Icon" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-slate-200" />
                        )}
                      </div>
                      <span>{link.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-blue-600 font-medium">/{link.shortCode}</td>
                  <td className="p-4 text-center font-semibold text-slate-700">{link.clickCount}</td>
                  <td className="p-4 text-center"><LinkStatus link={link} /></td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => onQrCode(link.shortCode)} className="cursor-pointer p-2 rounded-md text-slate-500 hover:bg-slate-200 hover:text-green-600" title="Show QR Code"><QrCode size={16} /></button>
                      <button onClick={() => onEdit(link)} className="cursor-pointer p-2 rounded-md text-slate-500 hover:bg-slate-200 hover:text-blue-600" title="Edit Link"><Edit size={16} /></button>
                      <button onClick={() => onDelete(link.id)} className="cursor-pointer p-2 rounded-md text-slate-500 hover:bg-slate-200 hover:text-red-600" title="Delete Link"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
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