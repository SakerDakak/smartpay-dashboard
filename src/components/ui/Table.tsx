import React, { useState, useMemo } from 'react';
import { twMerge } from 'tailwind-merge';
import { ArrowUpIcon, ArrowDownIcon, ChevronLeftIcon, ChevronRightIcon, PlusIcon } from '@heroicons/react/24/outline';
import { Select } from './Select';

export interface Column<T> {
  header: string;
  key: string;
  render?: (item: T, index: number) => React.ReactNode;
  className?: string;
  sortable?: boolean;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  error?: string;
  emptyMessage?: string;
  headerClassName?: string;
  rowClassName?: (item: T, index: number) => string;
  className?: string;
  onRowClick?: (item: T, index: number) => void;
  keyExtractor?: (item: T, index: number) => string | number;
  showRowsPerPage?: boolean;
  showSorting?: boolean;
  showGlobalFilter?: boolean;
  onAddClick?: () => void;
  addButtonLabel?: string;
  currentPage?: number;
  totalPages?: number;
  totalRecords?: number;
  onPageChange?: (page: number) => void;
  rowsPerPage?: number;
  onRowsPerPageChange?: (value: number) => void;
  rowsPerPageOptions?: { value: string; label: string }[];
  searchInputProps?: {
    placeholder?: string;
    className?: string;
    rightIcon?: React.ReactNode;
    onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  };
}

const Table = <T extends Record<string, unknown>>({
  columns,
  data,
  loading = false,
  error,
  emptyMessage = 'لا توجد بيانات للعرض',
  headerClassName,
  rowClassName,
  className,
  onRowClick,
  keyExtractor = (_, index) => index,
  showRowsPerPage = true,
  showSorting = true,
  showGlobalFilter = false,
  onAddClick,
  addButtonLabel = 'إضافة جديد',
  currentPage: externalCurrentPage,
  totalPages: externalTotalPages,
  totalRecords: externalTotalRecords,
  onPageChange,
  rowsPerPage: externalRowsPerPage,
  onRowsPerPageChange,
  rowsPerPageOptions: externalRowsPerPageOptions,
  searchInputProps,
}: TableProps<T>) => {
  // حالة للترتيب
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  
  // حالة للتصفية العامة
  const [globalFilter, setGlobalFilter] = useState('');
  
  // حالة لعدد الصفوف
  const [internalCurrentPage, setInternalCurrentPage] = useState<number>(1);
  const [internalRowsPerPage, setInternalRowsPerPage] = useState<number>(10);
  
  // خيارات لعدد الصفوف في الصفحة (إضافة خيار عرض عنصر واحد)
  const currentPage = externalCurrentPage !== undefined ? externalCurrentPage : internalCurrentPage;
  const handlePageChange = onPageChange || setInternalCurrentPage;
  
  const rowsPerPage = externalRowsPerPage !== undefined ? externalRowsPerPage : internalRowsPerPage;
  
  const rowsPerPageOptions = externalRowsPerPageOptions || [
    { value: '10', label: '10' },
    { value: '25', label: '25' },
    { value: '50', label: '50' },
    { value: '100', label: '100' },
    { value: '-1', label: 'الكل' }
  ];

  // تطبيق الترتيب على البيانات
  const sortedData = useMemo(() => {
    const currentData = Array.isArray(data) ? data : []; // ضمان أن data مصفوفة
    if (!sortConfig) return currentData;
    
    return [...currentData].sort((a, b) => {
      const aValue = a[sortConfig.key as keyof typeof a];
      const bValue = b[sortConfig.key as keyof typeof b];
      
      if (aValue === undefined || bValue === undefined || aValue === null || bValue === null) {
        return 0;
      }
      
      if (aValue === bValue) {
        return 0;
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }
      
      return sortConfig.direction === 'asc'
        ? (aValue < bValue ? -1 : 1)
        : (bValue < aValue ? -1 : 1);
    });
  }, [data, sortConfig]);

  // تطبيق التصفية العامة على البيانات
  const filteredData = useMemo(() => {
    const currentSortedData = Array.isArray(sortedData) ? sortedData : []; // ضمان أن sortedData مصفوفة
    let result = currentSortedData;
    
    // تطبيق التصفية العامة
    if (globalFilter) {
      const lowercasedFilter = globalFilter.toLowerCase();
      result = currentSortedData.filter(item => { // استخدام currentSortedData الآمنة
        return Object.values(item).some(val => 
          val && String(val).toLowerCase().includes(lowercasedFilter)
        );
      });
    }
    
    return result;
  }, [sortedData, globalFilter]);

  // تطبيق التقسيم على البيانات
  const paginatedData = useMemo(() => {
    if (externalCurrentPage !== undefined && externalTotalPages !== undefined) {
      return filteredData;
    }
    
    const currentFilteredData = Array.isArray(filteredData) ? filteredData : [];
    if (rowsPerPage === -1) return currentFilteredData;
    
    const startIndex = (currentPage - 1) * rowsPerPage;
    return currentFilteredData.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredData, currentPage, rowsPerPage, externalCurrentPage, externalTotalPages]);

  // وظيفة لتغيير الترتيب
  const handleSort = (key: string) => {
    setSortConfig(prevSortConfig => {
      if (!prevSortConfig || prevSortConfig.key !== key) {
        return { key, direction: 'asc' };
      }
      
      if (prevSortConfig.direction === 'asc') {
        return { key, direction: 'desc' };
      }
      
      return null;
    });
  };

  // وظيفة لتغيير التصفية العامة
  const handleGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGlobalFilter(e.target.value);
    handlePageChange(1); // إعادة التعيين إلى الصفحة الأولى عند تغيير التصفية
  };

  // وظيفة لتغيير عدد الصفوف في الصفحة
  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = Number(e.target.value);
    
    if (onRowsPerPageChange) {
      onRowsPerPageChange(newValue);
    } else {
      setInternalRowsPerPage(newValue);
    }
    
    handlePageChange(1);
  };

  // تحديد ما إذا كانت هناك صفحات خارجية
  const isExternalPagination = externalCurrentPage !== undefined && externalTotalPages !== undefined;
  
  // تحديد إجمالي الصفحات
  const totalPages = externalTotalPages !== undefined 
    ? externalTotalPages 
    : (rowsPerPage === -1 ? 1 : Math.ceil(filteredData.length / rowsPerPage));

  const goToNextPage = () => {
    handlePageChange(Math.min(currentPage + 1, totalPages));
  };

  // وظيفة للانتقال إلى الصفحة السابقة
  const goToPreviousPage = () => {
    handlePageChange(Math.max(currentPage - 1, 1));
  };

  const tableClasses = twMerge(
    'min-w-full divide-y divide-grey-200 dark:divide-grey-700 border-0',
    className
  );

  const headerClasses = twMerge(
    'bg-grey-50 dark:bg-grey-800/50',
    headerClassName
  );

  // تقديم أدوات التصفية والترتيب وزر الإضافة
  const renderTableTools = () => (
    <div className="mb-8 mt-2 flex flex-col-reverse lg:flex-row justify-between items-start lg:items-center space-y-reverse space-y-4 lg:space-y-0 lg:space-x-4 space-x-reverse">
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center w-full md:w-auto">
        {showGlobalFilter && (
          <div className="relative w-full md:w-64">
            <input
              type="text"
              className={searchInputProps?.className || "w-full px-4 py-2 rounded-lg border border-grey-300 dark:border-grey-700 bg-white dark:bg-grey-800 text-grey-900 dark:text-white"}
              placeholder={searchInputProps?.placeholder || "بحث..."}
              value={globalFilter}
              onChange={searchInputProps?.onChange || handleGlobalFilterChange}
              onFocus={searchInputProps?.onFocus}
            />
            {searchInputProps?.rightIcon && (
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 mr-4 text-grey-500 dark:text-grey-400">
                {searchInputProps.rightIcon}
              </div>
            )}
          </div>
        )}
      </div>

      {onAddClick && (
        <button
          onClick={onAddClick}
          className="inline-flex items-center cursor-pointer justify-center gap-1 px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-base transition-colors"
          aria-label={addButtonLabel}
        >
          <PlusIcon className="h-4 w-4" />
          <span>{addButtonLabel}</span>
        </button>
      )}
    </div>
  );

  // تحسين شكل وعمل الترتيب
  const renderSortIcon = (column: Column<T>) => {
    if (!column.sortable) return null;

    const isActive = sortConfig?.key === column.key;

    return (
      <span className="inline-flex flex-col mr-1">
        <ArrowUpIcon 
          className={twMerge(
            "w-3 h-3 transition-all",
            isActive && sortConfig?.direction === 'asc' 
              ? 'text-primary-600 scale-125' 
              : 'text-grey-400'
          )} 
        />
        <ArrowDownIcon 
          className={twMerge(
            "w-3 h-3 -mt-1 transition-all",
            isActive && sortConfig?.direction === 'desc' 
              ? 'text-primary-600 scale-125' 
              : 'text-grey-400'
          )} 
        />
      </span>
    );
  };

  // تقديم عنوان الجدول
  const renderHeader = () => (
    <thead className={headerClasses}>
      {/* صف العناوين */}
      <tr>
        {columns.map((column, index) => (
          <th
            key={`header-${column.key}-${index}`}
            scope="col"
            className={twMerge(
              'px-6 py-3 text-right text-xs font-medium text-grey-500 dark:text-grey-400 uppercase tracking-wider',
              column.sortable && 'cursor-pointer hover:bg-grey-200/50 dark:hover:bg-grey-700/30',
              column.className
            )}
            onClick={column.sortable ? () => handleSort(column.key) : undefined}
          >
            <div className="flex items-center">
              {renderSortIcon(column)}
              <span className="mx-2 text-sm">{column.header}</span>
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );

  const renderBody = () => {
    if (loading) {
      // عرض هيكل الجدول أثناء التحميل مع تأثير نبض
      const skeletonRows = Array.from({ length: Math.max(3, externalRowsPerPage || 5) }, (_, index) => index);
      return (
        <tbody className="animate-pulse">
          {skeletonRows.map((rowIndex) => (
            <tr key={`skeleton-${rowIndex}`} className={`${rowIndex!==skeletonRows.length-1?'border-b border-grey-200 dark:border-grey-700':''}`}>
              {columns.map((column, colIndex) => (
                <td key={`skeleton-cell-${rowIndex}-${colIndex}`} className="px-6 py-4">
                  <div className={twMerge(
                    "h-4 bg-grey-200 dark:bg-grey-700 rounded",
                    colIndex === 0 ? "w-16" : 
                    colIndex === columns.length - 1 ? "w-12" : "w-3/4"
                  )}></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      );
    }

    if (error) {
      return (
        <tbody>
          <tr>
            <td colSpan={columns.length} className="px-6 py-4 text-center text-danger-500">
              {error}
            </td>
          </tr>
        </tbody>
      );
    }

    if (paginatedData.length === 0) {
      return (
        <tbody>
          <tr>
            <td colSpan={columns.length} className="px-6 py-4 text-center text-grey-500 dark:text-grey-400">
              {emptyMessage}
            </td>
          </tr>
        </tbody>
      );
    }

    return (
      <tbody className="bg-white dark:bg-grey-800/20 divide-y divide-grey-200 dark:divide-grey-700">
        {paginatedData.map((item, index) => {
          const key = keyExtractor(item, index);
          
          const defaultRowClasses = 'hover:bg-grey-50 dark:hover:bg-grey-800/40 transition-colors';
          const customRowClasses = rowClassName ? rowClassName(item, index) : '';
          
          return (
            <tr 
              key={`row-${key}`}
              className={twMerge(defaultRowClasses, customRowClasses)}
              onClick={onRowClick ? () => onRowClick(item, index) : undefined}
              style={onRowClick ? { cursor: 'pointer' } : undefined}
            >
              {columns.map((column, colIndex) => (
                <td 
                  key={`cell-${key}-${column.key}-${colIndex}`}
                  className={twMerge(
                    'px-6 py-4 whitespace-nowrap text-sm text-grey-500 dark:text-grey-400',
                    column.className
                  )}
                >
                  {column.render 
                    ? column.render(item, index)
                    : String(item[column.key as keyof typeof item] || '')
                  }
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    );
  };

  // تحسين شكل وعمل أزرار التصفح ونقل قسم العرض إلى الأسفل
  const renderPagination = () => {
    if (loading) {
      return (
        <div className="border-t border-grey-200 dark:border-grey-700 px-4 py-4 mt-1 -mb-3">
          <div className="grid grid-cols-1 md:grid-cols-3 items-center justify-between gap-4">
            <div className="col-span-3 h-6 bg-grey-100 dark:bg-grey-800 rounded animate-pulse"></div>
          </div>
        </div>
      );
    }
      
    if (filteredData.length === 0) {
      return null;
    }
    
    // عندما تكون البيانات قليلة (عدد الصفوف أقل من أو يساوي عدد السجلات المعروضة)
    // ولكن في حالة وجود تصفح خارجي من API يتم عرض الأزرار دائمًا
    if (!isExternalPagination && (rowsPerPage === -1 || filteredData.length <= rowsPerPage)) {
      return (
        <div className="border-t border-grey-200 dark:border-grey-700 px-4 py-4 mt-1 -mb-3">
          <div className="grid grid-cols-2 md:grid-cols-3 items-center justify-between gap-4 mt-1">
            {/* قسم العرض - يمين */}
            <div className="text-sm text-grey-600 dark:text-grey-400 order-1 md:order-1 flex items-center justify-start gap-2">
              <span>
                إجمالي السجلات: <span className="font-medium text-primary-700 dark:text-primary-300 px-2">
                  {externalTotalRecords !== undefined ? externalTotalRecords : filteredData.length}
                </span>
              </span>
            </div>
            
            {/* محتوى وسط - رقم الصفحة */}
            <div className="flex items-center justify-center space-x-2 space-x-reverse order-3 md:order-2 col-span-2 md:col-span-1">
              <span className="text-sm text-grey-600 dark:text-grey-400">
                صفحة <span className="font-medium text-primary-600">1</span> من <span className="font-medium">1</span>
              </span>
            </div>
            
            {/* خيار عدد الصفوف - يسار */}
            <div className="flex items-center justify-end space-x-2 space-x-reverse order-2 md:order-3">
              {showRowsPerPage && (
                <div className="flex items-center space-x-reverse">
                  <span className="text-sm text-grey-600 dark:text-grey-400 mx-2">عرض:</span>
                  <Select
                    options={rowsPerPageOptions}
                    value={String(rowsPerPage)}
                    onChange={handleRowsPerPageChange}
                    className="w-20 py-1 text-sm cursor-pointer"
                    fullWidth={false}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    // نحسب عدد الصفحات التي سنعرضها (بحد أقصى 5)
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    let fromRecord, toRecord, totalRecords;
    
    if (isExternalPagination) {
      fromRecord = (currentPage - 1) * rowsPerPage + 1;
      
      if (externalTotalRecords !== undefined) {
        totalRecords = externalTotalRecords;
        toRecord = Math.min(currentPage * rowsPerPage, externalTotalRecords);
      } else {
        toRecord = Math.min(currentPage * rowsPerPage, filteredData.length + (currentPage - 1) * rowsPerPage);
        totalRecords = filteredData.length === rowsPerPage ? `${toRecord}+` : filteredData.length + (currentPage - 1) * rowsPerPage;
      }
    } else {
      fromRecord = filteredData.length === 0 ? 0 : ((currentPage - 1) * rowsPerPage) + 1;
      toRecord = Math.min(currentPage * rowsPerPage, filteredData.length);
      totalRecords = filteredData.length;
    }

    return (
      <div className="border-t border-grey-200 dark:border-grey-700 px-4 py-4 -mb-3">
        <div className="grid grid-cols-2 md:grid-cols-3 items-center justify-between gap-4">
          {/* قسم العرض - يمين */}
          <div className="text-sm text-grey-600 dark:text-grey-400 order-1 md:order-1 flex items-center justify-start gap-2">
            <span>
              <span className="font-medium text-primary-600 dark:text-primary-400 px-1">{fromRecord}</span>-<span className="font-medium text-primary-600 dark:text-primary-400 px-1">{toRecord}</span> من <span className="font-medium text-primary-700 dark:text-primary-300 px-1">{totalRecords}</span> سجل
            </span>
          </div>

          {/* خيار عدد الصفوف - يسار */}
          <div className="flex items-center justify-end gap-2 order-2 md:order-3">
            {showRowsPerPage && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-grey-600 dark:text-grey-400">عرض:</span>
                <Select
                  options={rowsPerPageOptions}
                  value={String(rowsPerPage)}
                  onChange={handleRowsPerPageChange}
                  className="w-20 py-1 text-sm cursor-pointer"
                  fullWidth={false}
                  disabled={loading}
                />
              </div>
            )}
          </div>

          {/* أزرار التصفح المحسنة - وسط */}
          <div className="flex items-center justify-center gap-1 order-3 md:order-2 col-span-2 md:col-span-1 mt-3 md:mt-0">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1 || loading}
              className={twMerge(
                "px-2 py-1 rounded-md text-xs bg-grey-100 dark:bg-grey-800 text-grey-800 dark:text-grey-200",
                (currentPage === 1 || loading) ? "opacity-50" : "hover:bg-grey-200 dark:hover:bg-grey-700"
              )}
              aria-label="الصفحة الأولى"
            >
              الأولى
            </button>
          
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1 || loading}
              className={twMerge(
                "p-1 rounded-md bg-grey-100 dark:bg-grey-800 text-grey-800 dark:text-grey-200",
                (currentPage === 1 || loading) ? "opacity-50" : "hover:bg-grey-200 dark:hover:bg-grey-700"
              )}
              aria-label="الصفحة السابقة"
            >
              <ChevronRightIcon className="h-3.5 w-3.5" />
            </button>

            <div className="flex items-center gap-1 px-1">
              {pageNumbers.map(pageNumber => (
                <button
                  key={`page-${pageNumber}`}
                  onClick={() => handlePageChange(pageNumber)}
                  disabled={loading}
                  className={twMerge(
                    "w-6 h-6 flex items-center justify-center rounded-md text-xs",
                    currentPage === pageNumber
                      ? "bg-primary-600 text-white"
                      : "bg-grey-100 dark:bg-grey-800 text-grey-800 dark:text-grey-200 hover:bg-grey-200 dark:hover:bg-grey-700",
                    loading && "opacity-50 cursor-not-allowed"
                  )}
                  aria-label={`الصفحة ${pageNumber}`}
                  aria-current={currentPage === pageNumber ? "page" : undefined}
                >
                  {pageNumber}
                </button>
              ))}
            </div>

            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages || loading}
              className={twMerge(
                "p-1 rounded-md bg-grey-100 dark:bg-grey-800 text-grey-800 dark:text-grey-200",
                (currentPage === totalPages || loading) ? "opacity-50" : "hover:bg-grey-200 dark:hover:bg-grey-700"
              )}
              aria-label="الصفحة التالية"
            >
              <ChevronLeftIcon className="h-3.5 w-3.5" />
            </button>

            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages || loading}
              className={twMerge(
                "px-2 py-1 rounded-md text-xs bg-grey-100 dark:bg-grey-800 text-grey-800 dark:text-grey-200",
                (currentPage === totalPages || loading) ? "opacity-50" : "hover:bg-grey-200 dark:hover:bg-grey-700"
              )}
              aria-label="الصفحة الأخيرة"
            >
              الأخيرة
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-transparent rounded-lg shadow-none relative z-30">
      {(showSorting || showGlobalFilter || onAddClick) && renderTableTools()}
      <div className="overflow-x-auto">
        <table className={tableClasses}>
          {renderHeader()}
          {renderBody()}
        </table>
      </div>
      {renderPagination()}
    </div>
  );
};

export { Table }; 