import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  listCustomers,
  createCustomerAction,
  updateCustomerAction,
  deleteCustomerAction
} from '../actions/customerActions';
import CustomerForm from '../components/CustomerForm';
import Modal from '../components/Modal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import '../styles/customer-module-overrides.css';

const CustomerList = () => {
  const dispatch = useDispatch();
  const customerList = useSelector((state) => state.customerList);
  const { loading, customers, error } = customerList;

  const customerCreate = useSelector((state) => state.customerCreate);
  const { loading: loadingCreate, error: errorCreate, success: successCreate } = customerCreate;

  const customerUpdate = useSelector((state) => state.customerUpdate);
  const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = customerUpdate;

  const customerDelete = useSelector((state) => state.customerDelete);
  const { loading: loadingDelete, error: errorDelete, success: successDelete } = customerDelete;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  useEffect(() => {
    dispatch(listCustomers());
  }, [dispatch, successCreate, successUpdate, successDelete]);

  const handleAdd = () => {
    setSelectedCustomer(null);
    setIsModalOpen(true);
  };
  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedCustomer(null);
  };

  const handleDelete = (customer) => {
    setDeleteId(customer.customerID);
    setDeleteError(null);
    setDeleteSuccess(false);
  };
  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setIsDeleteLoading(true);
    try {
      await dispatch(deleteCustomerAction(deleteId));
      setDeleteSuccess(true);
    } catch (err) {
      setDeleteError('Failed to delete.');
    }
    setIsDeleteLoading(false);
    setDeleteId(null);
  };
  const handleDeleteCancel = () => {
    setDeleteId(null);
    setIsDeleteLoading(false);
    setDeleteError(null);
    setDeleteSuccess(false);
  };

  const handleFormSubmit = (formData) => {
    if (selectedCustomer) {
      dispatch(updateCustomerAction(selectedCustomer.customerID, formData));
      setIsModalOpen(false);
    } else {
      dispatch(createCustomerAction(formData));
      setIsModalOpen(false);
    }
  };

  const renderErrors = (errors) => {
    if (typeof errors === 'string') {
      return <p className="error-message">{errors}</p>;
    }
    if (typeof errors === 'object' && errors !== null) {
      return Object.entries(errors).map(([field, messages]) => (
        <p key={field} className="error-message">
          {Array.isArray(messages) ? messages.join(', ') : messages}
        </p>
      ));
    }
    return null;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const renderCustomerCards = () => (
    <div className="customer-cards" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {customers.map((customer) => (
        <div
          key={customer.customerID}
          className="customer-card"
          style={{
            border: '1px solid #ddd',
            borderRadius: 8,
            padding: '1rem',
            background: '#fff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            width: '100%',
            maxWidth: 480,
            margin: '0 auto',
          }}
        >
          <div className="row" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem 1rem' }}>
            <div style={{ flex: 1, minWidth: 120 }}><strong>ID:</strong> {customer.customerID}</div>
            <div style={{ flex: 1, minWidth: 120 }}><strong>Name:</strong> {customer.customerName}</div>
          </div>
          <div className="row" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem 1rem' }}>
            <div style={{ flex: 1, minWidth: 120 }}><strong>Active:</strong> {customer.isActive ? 'Yes' : 'No'}</div>
            <div style={{ flex: 1, minWidth: 120 }}><strong>Created By:</strong> {customer.createdByUserName}</div>
          </div>
          <div className="customer-actions" style={{ display: 'flex', gap: '1rem', marginTop: 8 }}>
            <button
              className="btn-text btn-edit"
              onClick={() => handleEdit(customer)}
              aria-label="Edit customer"
            >
              <i className="fas fa-edit" /> Edit
            </button>
            <button
              className="btn-text btn-delete"
              onClick={() => handleDelete(customer)}
              aria-label="Delete customer"
            >
              <i className="fas fa-trash" /> Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  // {
  //   "customerID": 1,
  //   "customerName": "test111",
  //   "customerAbbreviation": "STRI",
  //   "customerCode": "100",
  //   "assignedBUID": 2,
  //   "buName": "",
  //   "buCode": "",
  //   "gstDocumentPath": "string",
  //   "fullPostalAddress": "string",
  //   "city": "string",
  //   "isActive": true,
  //   "createdDate": "2025-07-14T08:49:18.1066667",
  //   "createdByUserName": ""
  // },
  return (
    <section className="scrollable w-50">
      {!error && (
        <div style={{ 
            display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          marginBottom: '10px'
        }}>
          <h1>Customers</h1>
        <div className="add-button-container">
          <button className="btn btn-add" onClick={handleAdd}>Add Customer</button>
        </div>
        </div>
      )}
      <Modal isOpen={isModalOpen} onClose={handleModalClose} title={selectedCustomer ? 'Edit Customer' : 'Add Customer'} customClass="wide-modal scrollable-modal">
        <CustomerForm
          onSubmit={handleFormSubmit}
          onCancel={handleModalClose}
          initialData={selectedCustomer}
          loading={loadingCreate || loadingUpdate}
        />
        {(errorCreate || errorUpdate) && renderErrors(errorCreate || errorUpdate)}
      </Modal>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        renderErrors(error)
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="desktop-view scrollable scrollable-table">
            <table className="user-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Abbreviation</th>
                  <th>CustomerCode</th>
                  <th>Assigned BUID</th>
                  <th>BU Name</th>
                  <th>BU Code</th>
                  <th>GST Document Path</th>
                  <th>Full Postal Address</th>
                  <th>City</th> 
                  <th>Active</th>
                  <th>Created Date</th>
                  <th>Created By</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.customerID}>
                    <td>{customer.customerID}</td>
                    <td>{customer.customerName}</td>
                    <td>{customer.customerAbbreviation}</td>
                    <td>{customer.customerCode}</td>
                    <td>{customer.assignedBUID}</td>
                    <td>{customer.buName}</td>
                    <td>{customer.buCode}</td>
                    <td>{customer.gstDocumentPath}</td>
                    <td>{customer.fullPostalAddress}</td>
                    <td>{customer.city}</td>
                    <td>{customer.isActive ? 'Yes' : 'No'}</td>
                    <td>{formatDate(customer.createdDate)}</td>
                    <td>{customer.createdByUserName}</td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="btn-text btn-edit"
                          onClick={() => handleEdit(customer)}
                          aria-label="Edit customer"
                        >
                          <i className="fas fa-edit"></i> Edit
                        </button>
                        <button
                          className="btn-text btn-delete"
                          onClick={() => handleDelete(customer)}
                          aria-label="Delete customer"
                        >
                          <i className="fas fa-trash"></i> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Mobile Card View */}
          <div className="mobile-view">
            {renderCustomerCards()}
          </div>
        </>
      )}
      <DeleteConfirmModal
        isOpen={!!deleteId}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        loading={isDeleteLoading}
        error={deleteError}
        entityName={customers?.find((c) => c.customerID === deleteId)?.customerName}
      />
    </section>
  );
};

export default CustomerList;
