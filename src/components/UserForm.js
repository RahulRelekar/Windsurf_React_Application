import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

// A reusable form component for creating and editing users.
const UserForm = ({ onSubmit, onCancel, initialData, loading, error }) => {
  // State to hold the form's data.
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    roleId: '',
    isActive: true,
  });

  // Fetches the list of roles to populate the dropdown.
  const { roles } = useSelector((state) => state.roleList);

  // Determines if the form is in 'edit' mode based on the presence of initialData.
  const isEditMode = !!initialData;

  // This effect pre-fills the form when in 'edit' mode (when initialData is provided).
  useEffect(() => {
    if (isEditMode) {
      setFormData({
        username: initialData.username || '',
        email: initialData.email || '',
        password: '', // Password should not be pre-filled
        firstName: initialData.firstName || '',
        lastName: initialData.lastName || '',
        roleId: initialData.roleId || '',
        isActive: initialData.isActive !== undefined ? initialData.isActive : true,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handles the form submission.
  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSubmit = { ...formData };

    // In edit mode, if the password field is empty, we don't want to change it.
    // We remove it from the data payload so the backend doesn't receive an empty password.
    if (isEditMode && !dataToSubmit.password) {
      delete dataToSubmit.password;
    }

    onSubmit(dataToSubmit);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Display a general error message if the error is a string */}
      {error && typeof error === 'string' && <p className="error-message">{error}</p>}

            <div className="form-group">
        <label htmlFor="username">Username</label>
        <input type="text" id="username" name="username" required value={formData.username} onChange={handleChange} />
        {/* Display validation error for this field */}
        {error && error.Username && <p className="error-message">{error.Username[0]}</p>}
      </div>
            <div className="form-group">
        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" required value={formData.email} onChange={handleChange} />
        {error && error.Email && <p className="error-message">{error.Email[0]}</p>}
      </div>
            <div className="form-group">
        <label htmlFor="password">Password</label>
        <input type="password" id="password" name="password" required={!isEditMode} value={formData.password} onChange={handleChange} placeholder={isEditMode ? 'Leave blank to keep unchanged' : ''} />
        {error && error.Password && <p className="error-message">{error.Password[0]}</p>}
      </div>
      <div className="form-group">
        <label htmlFor="firstName">First Name</label>
        <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label htmlFor="lastName">Last Name</label>
        <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label htmlFor="roleId">Role</label>
        <select id="roleId" name="roleId" required value={formData.roleId} onChange={handleChange}>
          <option value="">Select a role</option>
          {roles.map((role) => (
            <option key={role.roleId} value={role.roleId}>{role.roleName}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>
          <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} />
          {' '}Active
        </label>
      </div>
      <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
};

export default UserForm;
