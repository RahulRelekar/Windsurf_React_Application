import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listRoles, createRole, updateRole, deleteRole } from '../actions/roleActions';
import { ROLE_CREATE_RESET, ROLE_UPDATE_RESET } from '../constants/roleConstants';
import Modal from '../components/Modal';
import RoleForm from '../components/RoleForm';

const RolesPage = () => {
  const dispatch = useDispatch();

  const { loading, error, roles } = useSelector((state) => state.roleList);
  const { loading: loadingCreate, error: errorCreate, success: successCreate } = useSelector((state) => state.roleCreate);
  const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = useSelector((state) => state.roleUpdate);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  useEffect(() => {
    dispatch(listRoles());

    if (successCreate) {
      setIsModalOpen(false);
      dispatch({ type: ROLE_CREATE_RESET });
    }

    if (successUpdate) {
      setIsModalOpen(false);
      dispatch({ type: ROLE_UPDATE_RESET });
    }
  }, [dispatch, successCreate, successUpdate]);

  const handleAddRole = () => {
    setSelectedRole(null);
    setIsModalOpen(true);
  };

  const handleEdit = (role) => {
    setSelectedRole(role);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      dispatch(deleteRole(id));
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedRole(null);
  };

  const handleFormSubmit = (formData) => {
    if (selectedRole) {
      dispatch(updateRole(selectedRole.roleId, formData));
    } else {
      dispatch(createRole(formData));
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

  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
        <button className="btn" onClick={handleAddRole}>Add Role</button>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleModalClose} title={selectedRole ? 'Edit Role' : 'Add Role'}>
        <RoleForm
          onSubmit={handleFormSubmit}
          onCancel={handleModalClose}
          initialData={selectedRole}
          loading={loadingCreate || loadingUpdate}
        />
        {(errorCreate || errorUpdate) && renderErrors(errorCreate || errorUpdate)}
      </Modal>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>RoleID</th>
              <th>Role Name</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role.roleId}>
                <td>{role.roleId}</td>
                <td>{role.roleName}</td>
                <td>
                  <span className={`status ${role.isActive ? 'active' : 'inactive'}`}>
                    {role.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <a href="#!" className="action-link" onClick={() => handleEdit(role)}>Edit</a>
                  {' | '}
                  <a href="#!" className="action-link delete" onClick={() => handleDelete(role.roleId)}>Delete</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
};

export default RolesPage;

