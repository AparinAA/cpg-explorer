export function SearchFilters({
  query,
  onQueryChange,
  selectedPackage,
  onPackageChange,
  packages,
}) {
  return (
    <div className="p-3 border-b border-[#30363d]">
      <input
        type="text"
        value={query}
        onChange={e => onQueryChange(e.target.value)}
        placeholder="Search functions..."
        className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-md text-[#c9d1d9] placeholder-[#484f58] focus:outline-none focus:border-[#58a6ff]"
      />
      <select
        value={selectedPackage}
        onChange={e => onPackageChange(e.target.value)}
        className="w-full mt-2 px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-md text-[#c9d1d9] focus:outline-none focus:border-[#58a6ff]"
      >
        <option value="">All packages</option>
        {packages.map(pkg => (
          <option key={pkg.package} value={pkg.package}>
            {pkg.package} ({pkg.function_count})
          </option>
        ))}
      </select>
    </div>
  );
}
