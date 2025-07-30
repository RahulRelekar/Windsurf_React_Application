import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../styles/customer-form-3col.css';

const CustomerForm = ({
  initialData = {},
  onSubmit,
  onCancel,
  loading,
  errors = {},
}) => {
  // Example API shape:
  // {
  //   customerID: 1,
  //   customerName: 'Acme Corp',
  //   isActive: true,
  //   createdDate: '2023-07-22T00:00:00',
  //   createdByUserName: 'admin'
  // }
  const isEdit = !!initialData?.customerID;
  const [customerName, setCustomerName] = useState(initialData?.customerName || '');
  const [customerAbbreviation, setCustomerAbbreviation] = useState(initialData?.customerAbbreviation || '');
  const [customerCode, setCustomerCode] = useState(initialData?.customerCode || '');
  const [assignedBUID, setAssignedBUID] = useState(initialData?.assignedBUID || '');
  const [buName, setBuName] = useState(initialData?.buName || '');
  const [buCode, setBuCode] = useState(initialData?.buCode || '');
  const [gstDocumentPath, setGstDocumentPath] = useState(initialData?.gstDocumentPath || '');
  const [fullPostalAddress, setFullPostalAddress] = useState(initialData?.fullPostalAddress || '');
  const [city, setCity] = useState(initialData?.city || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [type, setType] = useState(initialData?.type || '');
  const [isActive, setIsActive] = useState(
    typeof initialData?.isActive === 'boolean' ? initialData?.isActive : true
  );

  useEffect(() => {
    setCustomerName(initialData?.customerName || '');
    setCustomerAbbreviation(initialData?.customerAbbreviation || '');
    setCustomerCode(initialData?.customerCode || '');
    setAssignedBUID(initialData?.assignedBUID || '');
    setBuName(initialData?.buName || '');
    setBuCode(initialData?.buCode || '');
    setGstDocumentPath(initialData?.gstDocumentPath || '');
    setFullPostalAddress(initialData?.fullPostalAddress || '');
    setCity(initialData?.city || '');
    setEmail(initialData?.email || '');
    setPhone(initialData?.phone || '');
    setType(initialData?.type || '');
    setIsActive(typeof initialData?.isActive === 'boolean' ? initialData?.isActive : true);
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      id: initialData?.customerID,
      customerName,
      customerAbbreviation,
      customerCode,
      assignedBUID,
      buName,
      buCode,
      gstDocumentPath,
      fullPostalAddress,
      city,
      email,
      phone,
      type,
      isActive,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="form-responsive customer-form-grid scrollable ">
      {isEdit && (
        <div className="form-group">
          <label>ID</label>
          <input type="text" className="form-control" value={initialData?.customerID} disabled readOnly />
        </div>
      )}
      <div className="form-group">
        <label htmlFor="customerName">Name<span style={{ color: 'red' }}>*</span></label>
        <input
          id="customerName"
          type="text"
          className={`form-control ${errors.customerName ? 'is-invalid' : ''}`}
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          disabled={loading}
          required
        />
        {errors.customerName && <div className="invalid-feedback">{errors.customerName}</div>}
      </div>
      <div className="form-group">
        <label htmlFor="customerAbbreviation">Abbreviation</label>
        <input
          id="customerAbbreviation"
          type="text"
          className={`form-control ${errors.customerAbbreviation ? 'is-invalid' : ''}`}
          value={customerAbbreviation}
          onChange={(e) => setCustomerAbbreviation(e.target.value)}
          disabled={loading}
        />
        {errors.customerAbbreviation && <div className="invalid-feedback">{errors.customerAbbreviation}</div>}
      </div>
      <div className="form-group">
        <label htmlFor="customerCode">Customer Code</label>
        <input
          id="customerCode"
          type="text"
          className={`form-control ${errors.customerCode ? 'is-invalid' : ''}`}
          value={customerCode}
          onChange={(e) => setCustomerCode(e.target.value)}
          disabled={loading}
        />
        {errors.customerCode && <div className="invalid-feedback">{errors.customerCode}</div>}
      </div>
      <div className="form-group">
        <label htmlFor="assignedBUID">Assigned BUID</label>
        <input
          id="assignedBUID"
          type="number"
          className={`form-control ${errors.assignedBUID ? 'is-invalid' : ''}`}
          value={assignedBUID}
          onChange={(e) => setAssignedBUID(e.target.value)}
          disabled={loading}
        />
        {errors.assignedBUID && <div className="invalid-feedback">{errors.assignedBUID}</div>}
      </div>
      <div className="form-group">
        <label htmlFor="buName">BU Name</label>
        <input
          id="buName"
          type="text"
          className={`form-control ${errors.buName ? 'is-invalid' : ''}`}
          value={buName}
          onChange={(e) => setBuName(e.target.value)}
          disabled={loading}
        />
        {errors.buName && <div className="invalid-feedback">{errors.buName}</div>}
      </div>
      <div className="form-group">
        <label htmlFor="buCode">BU Code</label>
        <input
          id="buCode"
          type="text"
          className={`form-control ${errors.buCode ? 'is-invalid' : ''}`}
          value={buCode}
          onChange={(e) => setBuCode(e.target.value)}
          disabled={loading}
        />
        {errors.buCode && <div className="invalid-feedback">{errors.buCode}</div>}
      </div>
      <div className="form-group">
        <label htmlFor="gstDocumentPath">GST Document Path</label>
        <input
          id="gstDocumentPath"
          type="text"
          className={`form-control ${errors.gstDocumentPath ? 'is-invalid' : ''}`}
          value={gstDocumentPath}
          onChange={(e) => setGstDocumentPath(e.target.value)}
          disabled={loading}
        />
        {errors.gstDocumentPath && <div className="invalid-feedback">{errors.gstDocumentPath}</div>}
      </div>
      <div className="form-group">
        <label htmlFor="fullPostalAddress">Full Postal Address</label>
        <input
          id="fullPostalAddress"
          type="text"
          className={`form-control ${errors.fullPostalAddress ? 'is-invalid' : ''}`}
          value={fullPostalAddress}
          onChange={(e) => setFullPostalAddress(e.target.value)}
          disabled={loading}
        />
        {errors.fullPostalAddress && <div className="invalid-feedback">{errors.fullPostalAddress}</div>}
      </div>
      <div className="form-group">
        <label htmlFor="city">City</label>
        <input
          id="city"
          type="text"
          className={`form-control ${errors.city ? 'is-invalid' : ''}`}
          value={city}
          onChange={(e) => setCity(e.target.value)}
          disabled={loading}
        />
        {errors.city && <div className="invalid-feedback">{errors.city}</div>}
      </div>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          className={`form-control ${errors.email ? 'is-invalid' : ''}`}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
      </div>
      <div className="form-group">
        <label htmlFor="phone">Phone</label>
        <input
          id="phone"
          type="text"
          className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={loading}
        />
        {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
      </div>
      <div className="form-group">
        <label htmlFor="type">Type</label>
        <input
          id="type"
          type="text"
          className={`form-control ${errors.type ? 'is-invalid' : ''}`}
          value={type}
          onChange={(e) => setType(e.target.value)}
          disabled={loading}
        />
        {errors.type && <div className="invalid-feedback">{errors.type}</div>}
      </div>
      <div className="form-group">
        <label htmlFor="customerActive">Active</label>
        <select
          id="customerActive"
          className="form-control"
          value={isActive ? 'true' : 'false'}
          onChange={(e) => setIsActive(e.target.value === 'true')}
          disabled={loading}
        >
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </div>
      {isEdit && initialData?.createdByUserName && (
        <div className="form-group">
          <label>Created By</label>
          <input type="text" className="form-control" value={initialData?.createdByUserName} disabled readOnly />
        </div>
      )}
      {errors.general && (
        <div className="alert alert-danger mt-2">{errors.general}</div>
      )}
      <div className="customer-actions" style={{ display: 'flex', gap: '1rem', marginTop: 8 }}>
        <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
};

CustomerForm.propTypes = {
  initialData: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  errors: PropTypes.object,
};

export default CustomerForm;
