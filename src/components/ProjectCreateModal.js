import React, { useState, useEffect } from 'react';
import AsyncSelect from 'react-select/async';
import './ProjectCreateModal.css';
import { getCustomers } from '../api/customerApi';
import { getBusinessUnits } from '../api/businessUnitApi';
import { fetchBillingTypes } from '../api/billingTypeApi';
import { getSegments } from '../api/segmentApi';

const initialState = {
  projectName: '',
  projectAbbreviation: '',
  customerID: null,
  buid: null,
  billingTypeID: null,
  segmentID: null,
  projectLocationCity: '',
  customerAddress: '',
  projectStartDate: '',
  projectEndDate: '',
  resourceRequirement: '',
};

const formatDateForInput = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toISOString().split('T')[0];
};

const ProjectCreateModal = ({ open, onClose, onSubmit, loading, error, project, onCreate }) => {
  const [form, setForm] = useState(initialState);
  const isEditMode = !!project;

  console.log('project', project);
  useEffect(() => {
    const loadEditData = async () => {
      if (isEditMode && project) {
        try {
          const [customers, businessUnits, billingTypes, segments] = await Promise.all([
            getCustomers(),
            getBusinessUnits(),
            fetchBillingTypes(),
            getSegments()
          ]);
  
          const customer = customers.data.find(c => c.customerID === project.customerID);
          const businessUnit = businessUnits.data.find(b => b.buid === project.buid);
          const billingType = billingTypes.data.find(b => b.billingTypeID === project.billingTypeID);
          const segment = segments.data.find(s => s.segmentID === project.segmentID);
  
          setForm({
            ...project,
            customerName: customer?.customerName || '',
            buName: businessUnit?.buName || '',
            billingTypeName: billingType?.billingTypeName || '',
            segmentName: segment?.segmentName || '',
            projectStartDate: formatDateForInput(project.projectStartDate),
            projectEndDate: formatDateForInput(project.projectEndDate),
          });
        } catch (error) {
          console.error('Failed to load edit data:', error);
        }
      } else {
        setForm(initialState);
      }
    };
  
    loadEditData();
  }, [project, isEditMode, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSelectChange = (selectedOption, { name }) => {
    const idField = name;
    const nameField = {
      customerID: 'customerName',
      buid: 'buName',
      billingTypeID: 'billingTypeName',
      segmentID: 'segmentName',
    }[idField];
  
    setForm(prevForm => ({
      ...prevForm,
      [idField]: selectedOption ? selectedOption.value : null,
      [nameField]: selectedOption ? selectedOption.label : '',
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('form', form);

    // the form data should be in below formate before submitting
    // {
    //   "projectName": "string",
    //   "projectAbbreviation": "stri",
    //   "customerID": 0,
    //   "buid": 0,
    //   "billingTypeID": 0,
    //   "segmentID": 0,
    //   "projectLocationCity": "string",
    //   "customerAddress": "string",
    //   "projectStartDate": "2025-07-24T07:18:44.722Z",
    //   "projectEndDate": "2025-07-24T07:18:44.722Z",
    //   "resourceRequirement": "string"
    // }

    const payload = {
      projectInternalID: form.projectInternalID,
      projectName: form.projectName,
      projectAbbreviation: form.projectAbbreviation,
      customerID: Number(form.customerID),
      buid: Number(form.buid),
      billingTypeID: Number(form.billingTypeID),
      segmentID: Number(form.segmentID),
      projectLocationCity: form.projectLocationCity,
      customerAddress: form.customerAddress,
      projectStartDate: form.projectStartDate,
      projectEndDate: form.projectEndDate,
      resourceRequirement: form.resourceRequirement
    };
    if(isEditMode && project){
      onSubmit(payload);
    }else{
      onCreate(payload);
    }
  };

  const loadOptions = (apiCall, labelKey, valueKey) => async (inputValue) => {
    try {
      const { data } = await apiCall();
      return data
        .filter(item => item[labelKey].toLowerCase().includes(inputValue.toLowerCase()))
        .map(item => ({ label: item[labelKey], value: item[valueKey] }));
    } catch (error) {
      console.error('Failed to load options:', error);
      return [];
    }
  };

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditMode ? 'Edit Project' : 'Create New Project'}</h2>
          <button onClick={onClose} className="close-button">&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="project-form">
            <div className="form-group">
              <label htmlFor="projectName">Project Name</label>
              <input id="projectName" name="projectName" value={form.projectName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="projectAbbreviation">Abbreviation (4 chars)</label>
              <input id="projectAbbreviation" name="projectAbbreviation" value={form.projectAbbreviation} onChange={handleChange} maxLength={4} required />
            </div>
            <div className="form-group">
              <label htmlFor="customerID">Customer</label>
              <AsyncSelect
                id="customerID"
                name="customerID"
                cacheOptions
                defaultOptions
                loadOptions={loadOptions(getCustomers, 'customerName', 'customerID')}
                value={form.customerID ? { 
                  label: form.customerName || 'Loading...', 
                  value: form.customerID 
                } : null}
                onChange={handleSelectChange}
                placeholder="Search for a customer..."
                isClearable
              />
            </div>
            <div className="form-group">
              <label htmlFor="buid">Business Unit</label>
              <AsyncSelect
                id="buid"
                name="buid"
                cacheOptions
                defaultOptions
                loadOptions={loadOptions(getBusinessUnits, 'buName', 'buid')}
                
                value={form.buid ? { 
                  label: form.buName || 'Loading...', 
                  value: form.buid 
                } : null}
                onChange={handleSelectChange}
                placeholder="Search for a business unit..."
                isClearable
              />
            </div>
            <div className="form-group">
              <label htmlFor="billingTypeID">Billing Type</label>
              <AsyncSelect
                id="billingTypeID"
                name="billingTypeID"
                cacheOptions
                defaultOptions
                loadOptions={loadOptions(fetchBillingTypes, 'billingTypeName', 'billingTypeID')}
                value={form.billingTypeID ? { 
                  label: form.billingTypeName || 'Loading...', 
                  value: form.billingTypeID 
                } : null}
                onChange={handleSelectChange}
                placeholder="Search for a billing type..."
                isClearable
              />
            </div>
            <div className="form-group">
              <label htmlFor="segmentID">Segment</label>
              <AsyncSelect
                id="segmentID"
                name="segmentID"
                cacheOptions
                defaultOptions
                loadOptions={loadOptions(getSegments, 'segmentName', 'segmentID')}
                value={form.segmentID ? { 
                  label: form.segmentName || 'Loading...', 
                  value: form.segmentID 
                } : null} 
                onChange={handleSelectChange}
                placeholder="Search for a segment..."
                isClearable
              />
            </div>
            <div className="form-group">
              <label htmlFor="projectLocationCity">City</label>
              <input id="projectLocationCity" name="projectLocationCity" value={form.projectLocationCity} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="customerAddress">Customer Address</label>
              <input id="customerAddress" name="customerAddress" value={form.customerAddress} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="projectStartDate">Start Date</label>
              <input id="projectStartDate" name="projectStartDate" value={form.projectStartDate} onChange={handleChange} type="date" required />
            </div>
            <div className="form-group">
              <label htmlFor="projectEndDate">End Date</label>
              <input id="projectEndDate" name="projectEndDate" value={form.projectEndDate} onChange={handleChange} type="date" required />
            </div>
            <div className="form-group full-width">
              <label htmlFor="resourceRequirement">Resource Requirement</label>
              <input id="resourceRequirement" name="resourceRequirement" value={form.resourceRequirement} onChange={handleChange} />
            </div>
            {error && <div className="error">{error}</div>}
          </div>
          <div className="modal-actions">
            <button type="button" className="btn" onClick={onClose} disabled={loading}>Cancel</button>
            <button type="submit" className="btn primary" disabled={loading}>{loading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Project' : 'Create Project')}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectCreateModal;
