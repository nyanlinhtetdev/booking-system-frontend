import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router";
import { getResourceCategories, getResources } from "./resourceApi";

export function ResourcesPage() {
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 12;

  const {
    data: resources,
    isLoading,
    isPlaceholderData,
  } = useQuery({
    queryKey: ["resources", { pageNumber, pageSize, search, categoryId }],
    queryFn: () => getResources(pageNumber, pageSize, search, categoryId),
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    placeholderData: keepPreviousData,
  });

  const { data: categories } = useQuery({
    queryKey: ["resource-categories"],
    queryFn: getResourceCategories,
    staleTime: Infinity,
  });

  const hasResources = resources && resources.items.length > 0;
  const resultCount = resources?.totalRecords ?? 0;

  function selectCategory(nextCategoryId: string) {
    setCategoryId(nextCategoryId);
    setPageNumber(1);
    setSearch("");
  }

  return (
    <main className="min-h-[calc(100vh-81px)] bg-[#eaf3f7] text-[#173148]">
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-12 lg:py-16">
        <header className="border-b border-[#c8dce5] pb-10">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#55798d]">
                Student life&nbsp; / &nbsp;resource directory
              </p>
              <h1 className="font-serif text-5xl leading-none tracking-[-0.04em] text-[#142d43] sm:text-7xl">
                Find your <em className="text-[#4d879d]">place.</em>
              </h1>
            </div>
            <p className="max-w-[170px] pb-1 text-right font-serif text-base leading-6 text-[#55798d]">
              A campus index of spaces
              <br />
              for every kind of work.
            </p>
          </div>

          <div className="flex flex-col gap-5 border-t border-[#c8dce5] pt-6">
            <label className="relative block w-full max-w-[440px]">
              <span className="sr-only">Search resources</span>
              <svg
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#64869a]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.7"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-4.35-4.35m2.1-5.4a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z"
                />
              </svg>
              <input
                type="search"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPageNumber(1);
                }}
                placeholder="Search resources"
                className="h-12 w-full border border-[#c8dce5] bg-[#f7fbfc] pl-12 pr-4 text-sm text-[#173148] outline-none transition placeholder:text-[#7793a2] focus:border-[#285571] focus:ring-1 focus:ring-[#285571]"
              />
            </label>

            <div className="flex flex-wrap gap-2" aria-label="Filter by category">
              <button
                type="button"
                onClick={() => selectCategory("")}
                className={`cursor-pointer border px-4 py-2.5 text-xs font-semibold transition ${
                  categoryId === ""
                    ? "border-[#285571] bg-[#285571] text-white"
                    : "border-[#c8dce5] bg-transparent text-[#55798d] hover:border-[#285571] hover:text-[#285571]"
                }`}
              >
                All resources
              </button>
              {categories?.map((category) => (
                <button
                  key={category.resourceCategoryId}
                  type="button"
                  onClick={() => selectCategory(category.resourceCategoryId)}
                  className={`cursor-pointer border px-4 py-2.5 text-xs font-semibold transition ${
                    categoryId === category.resourceCategoryId
                      ? "border-[#285571] bg-[#285571] text-white"
                      : "border-[#c8dce5] bg-transparent text-[#55798d] hover:border-[#285571] hover:text-[#285571]"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </header>

        <section className="py-7">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#55798d]">
                Browse the collection
              </p>
              <h2 className="font-serif text-3xl tracking-[-0.03em] text-[#142d43]">
                Spaces across campus
              </h2>
            </div>
            <p className="text-right text-sm text-[#55798d]">
              <span className="font-serif text-2xl text-[#142d43]">{resultCount}</span>{" "}
              resources
            </p>
          </div>

          {isLoading ? (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-48 animate-pulse border border-[#c8dce5] bg-[#f7fbfc]"
                />
              ))}
            </div>
          ) : hasResources ? (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {resources.items.map((resource) => (
                <Link
                  key={resource.resourceId}
                  to={`/resources/${resource.resourceId}`}
                  className="group flex min-h-48 flex-col border border-[#c8dce5] bg-[#f7fbfc] p-[18px] transition hover:-translate-y-0.5 hover:border-[#6f9bad] hover:shadow-[0_8px_24px_rgba(40,85,113,0.08)]"
                >
                  <span className="w-fit bg-[#e4eff3] px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#416d82]">
                    {resource.resourceCategoryName}
                  </span>
                  <h3 className="mt-5 font-serif text-2xl leading-tight tracking-[-0.03em] text-[#142d43] [font-variant-numeric:lining-nums] group-hover:text-[#285571]">
                    {resource.name}
                  </h3>
                  <div className="mt-auto flex items-end justify-between gap-4 border-t border-[#e1ebef] pt-3 text-xs text-[#55798d]">
                    <span>{resource.location}</span>
                    <span className="text-right">
                      <strong className="block font-serif text-lg leading-4 text-[#142d43]">
                        {resource.capacity ?? "—"}
                      </strong>
                      <span className="text-[9px] uppercase tracking-[0.12em]">
                        {resource.capacity === 1 ? "person" : "people"}
                      </span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="border border-[#c8dce5] bg-[#f7fbfc] px-6 py-16 text-center">
              <h3 className="font-serif text-2xl text-[#142d43]">
                No spaces found
              </h3>
              <p className="mt-2 text-sm text-[#55798d]">
                Try a different search or category.
              </p>
            </div>
          )}

          {resources && resources.totalPages > 1 && (
            <div className="mt-8 flex items-center justify-between border-t border-[#c8dce5] pt-5">
              <button
                type="button"
                onClick={() => setPageNumber((previous) => previous - 1)}
                disabled={pageNumber === 1 || isPlaceholderData}
                className="cursor-pointer border border-[#c8dce5] px-4 py-2 text-xs font-semibold text-[#55798d] transition hover:border-[#285571] hover:text-[#285571] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-xs text-[#55798d]">
                Page <strong className="text-[#142d43]">{pageNumber}</strong> of{" "}
                <strong className="text-[#142d43]">{resources.totalPages}</strong>
              </span>
              <button
                type="button"
                onClick={() => setPageNumber((previous) => previous + 1)}
                disabled={
                  pageNumber >= resources.totalPages || isPlaceholderData
                }
                className="cursor-pointer border border-[#c8dce5] px-4 py-2 text-xs font-semibold text-[#55798d] transition hover:border-[#285571] hover:text-[#285571] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
