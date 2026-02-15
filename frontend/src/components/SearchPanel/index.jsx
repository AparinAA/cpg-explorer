import { useState, useEffect, useRef } from 'react';
import { List } from 'react-window';
import { useAppStore } from '../../store';
import { debouncedSearch, loadMoreFunctions } from './searchUtils';
import { SearchFilters } from './SearchFilters';
import { ResultsCount } from './ResultsCount';
import { VirtualFunctionItem } from './FunctionItem';

const ITEM_HEIGHT = 70;

export default function SearchPanel() {
  const { packages, loadPackages, selectedFunction, selectFunction } = useAppStore();

  const [query, setQuery] = useState('');
  const [functions, setFunctions] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [total, setTotal] = useState(0);
  const containerRef = useRef(null);
  const [listHeight, setListHeight] = useState(400);

  useEffect(() => {
    loadPackages();
    debouncedSearch(query, selectedPackage, setLoading, setFunctions, setTotal);
  }, [loadPackages]);

  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        setListHeight(containerRef.current.clientHeight);
      }
    };
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  const handleQueryChange = value => {
    setQuery(value);
    debouncedSearch(value, selectedPackage, setLoading, setFunctions, setTotal);
  };

  const handlePackageChange = value => {
    setSelectedPackage(value);
    debouncedSearch(query, value, setLoading, setFunctions, setTotal);
  };

  const handleRowsRendered = visibleRows => {
    if (loadingMore || loading) return;
    const hasMore = functions.length < total;
    const nearEnd = visibleRows.stopIndex >= functions.length - 5;

    if (hasMore && nearEnd) {
      loadMoreFunctions(
        query,
        selectedPackage,
        functions.length,
        functions,
        setFunctions,
        setLoadingMore
      );
    }
  };

  const selectedId = selectedFunction?.id;

  return (
    <div className="flex flex-col h-full">
      <SearchFilters
        query={query}
        onQueryChange={handleQueryChange}
        selectedPackage={selectedPackage}
        onPackageChange={handlePackageChange}
        packages={packages}
      />

      <ResultsCount loading={loading} total={total} shown={functions.length} />

      <div ref={containerRef} className="flex-1 overflow-hidden relative">
        {functions.length > 0 && (
          <List
            defaultHeight={listHeight}
            rowCount={functions.length}
            rowHeight={ITEM_HEIGHT}
            onRowsRendered={handleRowsRendered}
            rowComponent={VirtualFunctionItem}
            rowProps={{ functions, selectedId, selectFunction }}
          />
        )}
        {loadingMore && (
          <div className="flex justify-center py-2 absolute bottom-0 left-0 right-0 bg-[#161b22]">
            <div className="spinner" />
          </div>
        )}
      </div>
    </div>
  );
}
