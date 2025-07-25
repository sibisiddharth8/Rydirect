import { useState, useEffect, useCallback } from 'react';
import { getLinks } from '../api/linksService';
import { getBatches, getTopBatches } from '../api/batchesService';

export const useLinksData = () => {
  const [data, setData] = useState({ links: [], batches: [], topBatches: [] });
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', batchId: '' });

  const fetchData = useCallback((page = 1) => {
    setLoading(true);
    Promise.all([
      getLinks({ page, limit: 10, ...filters }),
      getBatches(),
      getTopBatches(),
    ]).then(([linksData, batchesData, topBatchesData]) => {
      setData({ links: linksData.data, batches: batchesData, topBatches: topBatchesData });
      setPagination(linksData.pagination);
    }).catch(error => {
      console.error("Failed to fetch page data:", error);
    }).finally(() => {
      setLoading(false);
    });
  }, [filters]);

  useEffect(() => {
    fetchData(1);
  }, [fetchData]);

  return { data, pagination, loading, filters, setFilters, fetchData };
};