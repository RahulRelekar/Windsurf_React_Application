import React from 'react';
import './ProjectFilters.css';

const ProjectFilters = ({
  customers = [],
  businessUnits = [],
  billingTypes = [],
  segments = [],
  statuses = [],
  values = {},
  sortBy = 'createdDate',
  sortOrder = 'desc',
  onChange,
  onReset
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange && onChange(name, value);
  };

  const toggleSortOrder = () => {
    onChange && onChange('sortOrder', sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="projects-filters">
      <div className="filters-grid">
        <div className="filter-item">
          <label>Customer</label>
          <select name="customerID" value={values.customerID || ''} onChange={handleChange}>
            <option value="">All</option>
            {customers.map(c => (
              <option key={c.customerID} value={c.customerID}>{c.customerName}</option>
            ))}
          </select>
        </div>

        <div className="filter-item">
          <label>Business Unit</label>
          <select name="buid" value={values.buid || ''} onChange={handleChange}>
            <option value="">All</option>
            {businessUnits.map(b => (
              <option key={b.buid} value={b.buid}>{b.buName}</option>
            ))}
          </select>
        </div>

        <div className="filter-item">
          <label>Billing Type</label>
          <select name="billingTypeID" value={values.billingTypeID || ''} onChange={handleChange}>
            <option value="">All</option>
            {billingTypes.map(bt => (
              <option key={bt.billingTypeID} value={bt.billingTypeID}>{bt.billingTypeName}</option>
            ))}
          </select>
        </div>

        <div className="filter-item">
          <label>Segment</label>
          <select name="segmentID" value={values.segmentID || ''} onChange={handleChange}>
            <option value="">All</option>
            {segments.map(s => (
              <option key={s.segmentID} value={s.segmentID}>{s.segmentName}</option>
            ))}
          </select>
        </div>

        <div className="filter-item">
          <label>Status</label>
          <select name="status" value={values.status || ''} onChange={handleChange}>
            <option value="">All</option>
            {statuses.map(st => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>

        <div className="filter-item sort-by">
          <label>Sort By</label>
          <select name="sortBy" value={sortBy} onChange={handleChange}>
            <option value="createdDate">Created Date</option>
            <option value="projectName">Project Name</option>
            <option value="customerName">Customer</option>
            <option value="buName">Business Unit</option>
            <option value="status">Status</option>
          </select>
        </div>

        <div className="filter-item sort-order">
          <label>Order</label>
          <button type="button" className="btn btn-secondary" onClick={toggleSortOrder}>
            {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
          </button>
        </div>

        <div className="filter-item reset">
          <label>&nbsp;</label>
          <button type="button" className="btn btn-secondary" onClick={onReset}>Reset</button>
        </div>
      </div>
    </div>
  );
};

export default ProjectFilters;
