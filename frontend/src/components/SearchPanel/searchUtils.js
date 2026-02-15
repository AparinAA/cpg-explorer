import debounce from 'debounce';
import { functionsApi } from '../../api';
import { DEFAULTS } from '../../shared/constants';

export const debouncedSearch = debounce(
  async (searchQuery, pkg, setLoadingFn, setFunctionsFn, setTotalFn) => {
    setLoadingFn(true);
    try {
      const data = await functionsApi.search({
        search: searchQuery,
        package: pkg,
        limit: DEFAULTS.searchLimit,
        offset: 0,
      });
      setFunctionsFn(data.functions || []);
      setTotalFn(data.total || 0);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setLoadingFn(false);
    }
  },
  DEFAULTS.debounceMs
);

export async function loadMoreFunctions(
  searchQuery,
  pkg,
  offset,
  existingFunctions,
  setFunctionsFn,
  setLoadingMoreFn
) {
  setLoadingMoreFn(true);
  try {
    const data = await functionsApi.search({
      search: searchQuery,
      package: pkg,
      limit: DEFAULTS.searchLimit,
      offset,
    });
    setFunctionsFn([...existingFunctions, ...(data.functions || [])]);
  } catch (err) {
    console.error(err);
  } finally {
    setLoadingMoreFn(false);
  }
}
