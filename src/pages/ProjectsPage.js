import React, { useEffect, useState, useCallback } from 'react';
import ProjectCard from '../components/ProjectCard';
import ProjectCreateModal from '../components/ProjectCreateModal';
import {
  getProjects,
  updateProject,
  generateProjectPID,
  submitProjectForAdminReview,
  adminApproveProject,
  adminRejectProject,
  superadminApproveProject,
  superadminRejectProject,
  deleteProject,
  submitProjectForSuperAdminReview
} from '../api/projectApi';
import { useSelector, useDispatch } from 'react-redux';
import { listCustomers } from '../actions/customerActions';
import { listBusinessUnits } from '../actions/businessUnitActions';
import { listBillingTypes } from '../actions/billingTypeActions';
import { listSegments } from '../actions/segmentActions';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import SuperAdminRemarksModal from '../components/SuperAdminRemarksModal';
import '../styles/ProjectsPage.css';

// Dummy: Replace with real auth/user context
const getUser = () => JSON.parse(localStorage.getItem('userInfo')) || {};

const ProjectsPage = () => {
  const [showCreate, setShowCreate] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState('');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [actionLoading, setActionLoading] = useState(null); // project id
  const user = getUser();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const dispatch = useDispatch();

  const customerList = useSelector((state) => state.customerList);
  const { customers } = customerList;

  const businessUnitList = useSelector((state) => state.businessUnitList);
  const { businessUnits } = businessUnitList;

  const billingTypeList = useSelector((state) => state.billingTypeList);
  const { billingTypes } = billingTypeList;

  const segmentList = useSelector((state) => state.segmentList);
  const { segments } = segmentList;

  const loadProjects = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await getProjects();
      if (Array.isArray(data)) {
        const enrichedProjects = data.map((project) => {
          const customer = customers.find((c) => c.customerID === project.customerID);
          const bu = businessUnits.find((b) => b.buid === project.buid);
          const billingType = billingTypes.find((bt) => bt.billingTypeID === project.billingTypeID);
          const segment = segments.find((s) => s.segmentID === project.segmentID);
          return {
            ...project,
            customerName: customer ? customer.customerName : '',
            customerAbbreviation: customer ? customer.customerAbbreviation : '',
            customerCode: customer ? customer.customerCode : '',
            buName: bu ? bu.buName : '',
            buCode: bu ? bu.buCode : '',
            billingTypeName: billingType ? billingType.billingTypeName : '',
            billingTypeCode: billingType ? billingType.billingTypeCode : '',
            segmentName: segment ? segment.segmentName : '',
          };
        });
        setProjects(enrichedProjects);
      } else {
        setProjects([]);
      }
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  }, [customers, businessUnits, billingTypes, segments]);

  useEffect(() => {
    dispatch(listCustomers());
    dispatch(listBusinessUnits());
    dispatch(listBillingTypes());
    dispatch(listSegments());
  }, [dispatch]);

  useEffect(() => {
    if (customers.length > 0 && businessUnits.length > 0 && billingTypes.length > 0 && segments.length > 0) {
      loadProjects();
    }
  }, [loadProjects, customers, businessUnits, billingTypes, segments]);

  const handleEdit = (project) => {
    setShowCreate(true);
    setSelectedProject(project);
  };
  const handleUpdate = async (project) => {
    setActionLoading(project.projectInternalID);
    setError(''); setSuccess('');
    try {
      await updateProject(project.coreProjectID, project);
      setShowCreate(false);
      loadProjects();
    } catch (e) {
      setError(e.message);
    }
    setActionLoading(null);
  };
  const handleGeneratePID = async (project) => {
    setActionLoading(project.projectInternalID);
    setError(''); setSuccess('');
    try { 
      await generateProjectPID(project.coreProjectID);
      setSuccess('PID generated successfully.');
      setSelectedProject(null);
      loadProjects();
    } catch (e) {
      setError(e.message);
    }
    setActionLoading(null);
  };
  const onSubmitForSuperAdminReview = async (project) => {
    setActionLoading(project.projectInternalID);
    setError(''); setSuccess('');
    try {
      await submitProjectForSuperAdminReview(project.coreProjectID);
      setSelectedProject(null);
      loadProjects();
    } catch (e) {
      setError(e.message);
    }
    setActionLoading(null);
  };
  const handleAdminApprove = async (project) => {
    setActionLoading(project.projectInternalID);
    setError(''); setSuccess('');
    try {
      await adminApproveProject(project.coreProjectID, 'Approved by admin');
      setSuccess('Project approved by admin.');
      setSelectedProject(null);
      loadProjects(); 
    } catch (e) {
      setError(e.message);
    }
    setActionLoading(null);
  };
  const handleAdminReject = async (project) => {
    setActionLoading(project.projectInternalID);
    setError(''); setSuccess('');
    try {
      await adminRejectProject(project.projectInternalID, 'Rejected by admin');
      setSuccess('Project rejected by admin.');
      setSelectedProject(null);
      loadProjects();
    } catch (e) {
      setError(e.message);
    }
    setActionLoading(null);
  };
  // Super Admin Remarks Modal State
  const [showSuperAdminRemarksModal, setShowSuperAdminRemarksModal] = useState(false);
  const [superAdminActionType, setSuperAdminActionType] = useState(null); // 'approve' or 'reject'
  const [superAdminActionLoading, setSuperAdminActionLoading] = useState(false);
  const [superAdminActionProject, setSuperAdminActionProject] = useState(null);

  const handleSuperadminApprove = async (project, remarks = 'Approved by superadmin') => {
    setActionLoading(project.projectInternalID);
    setSuperAdminActionLoading(true);
    setError(''); setSuccess('');
    try {
      await superadminApproveProject(project.coreProjectID, remarks);
      setSuccess('Project approved by superadmin.');
      setSelectedProject(null);
      loadProjects();
    } catch (e) {
      setError(e.message);
    }
    setActionLoading(null);
    setSuperAdminActionLoading(false);
    setShowSuperAdminRemarksModal(false);
    setSuperAdminActionProject(null);
    setSuperAdminActionType(null);
  };

  const handleSuperadminReject = async (project, remarks = 'Rejected by superadmin') => {
    setActionLoading(project.projectInternalID);
    setSuperAdminActionLoading(true);
    setError(''); setSuccess('');
    try {
      await superadminRejectProject(project.coreProjectID, remarks);
      setSuccess('Project rejected by superadmin.');
      setSelectedProject(null);
      loadProjects();
    } catch (e) {
      setError(e.message);
    }
    setActionLoading(null);
    setSuperAdminActionLoading(false);
    setShowSuperAdminRemarksModal(false);
    setSuperAdminActionProject(null);
    setSuperAdminActionType(null);
  };

  // Open modal for approve/reject
  const openSuperAdminRemarksModal = (project, actionType) => {
    setSuperAdminActionProject(project);
    setSuperAdminActionType(actionType);
    setShowSuperAdminRemarksModal(true);
  };

  // On modal submit
  const handleSuperAdminRemarksSubmit = (remarks) => {
    if (superAdminActionType === 'approve') {
      handleSuperadminApprove(superAdminActionProject, remarks);
    } else if (superAdminActionType === 'reject') {
      handleSuperadminReject(superAdminActionProject, remarks);
    }
  };

  const handleDeleteConfirm = async(project)=>{
    setDeleteLoading(true);
    setActionLoading(project.projectInternalID);
    setError(''); setSuccess('');
    try {
      await deleteProject(project.projectInternalID);
      setSelectedProject(null);
    setShowDeleteModal(false);

      loadProjects();
    } catch (e) {
      setError(e.message);
    }
    setActionLoading(null);
    setDeleteLoading(false);
  } 

  const handleOpenDeleteModal = (project) => {
    setShowDeleteModal(true);
    setSelectedProject(project);
  };


  return (
    <div className="projects-page">
      <div className="projects-header">
  <h1>Projects</h1>
  {(user.role === 'Admin' || user.role === 'SuperAdmin') && (
    <button 
      className="btn btn-add" 
      onClick={() => {setShowCreate(true); setSelectedProject(null)}}
      style={{
        marginLeft: 'auto'
      }}
    >
      Add Project
    </button>
  )}
</div>
      {showDeleteModal && (
        <DeleteConfirmModal
          isOpen={showDeleteModal}
          onClose={() => {setShowDeleteModal(false); setDeleteLoading(false);}}
          onConfirm={() => handleDeleteConfirm(selectedProject)}
          loading={deleteLoading}
          entityName={selectedProject?.projectName}
        />
      )}
      {showSuperAdminRemarksModal && (
        <SuperAdminRemarksModal
          isOpen={showSuperAdminRemarksModal}
          onClose={() => setShowSuperAdminRemarksModal(false)}
          onSubmit={handleSuperAdminRemarksSubmit}
          loading={superAdminActionLoading}
          actionType={superAdminActionType}
          project={superAdminActionProject}
        />
      )}
      <ProjectCreateModal
      project={selectedProject}
        open={showCreate}
        onClose={() => { setShowCreate(false); setCreateError(''); }}
        onCreate={async (form) => {
          setCreateLoading(true);
          setCreateError('');
          try {
            // convert IDs to numbers if needed
            const payload = {
              ...form,
              customerID: Number(form.customerID),
              buid: Number(form.buid),
              billingTypeID: Number(form.billingTypeID),
              segmentID: Number(form.segmentID)
            };
            await require('../api/projectApi').createProject(payload);
            setShowCreate(false);
            setSuccess('Project created successfully.');
            setSelectedProject(null);
            loadProjects();
          } catch (e) {
            setCreateError(e.message);
          }
          setCreateLoading(false);
        }}
        loading={createLoading}
        error={createError}
        onSubmit={handleUpdate}
      />
      {loading ? (
        <p>Loading projects...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <div className="projects-list">
        {[...projects] // make a copy to avoid mutating state
  .sort((a, b) => {
    const dateA = new Date(a.createdDate).getTime();
    const dateB = new Date(b.createdDate).getTime();
    return dateB - dateA; // newest first
  })
            .map((project) => (
              <ProjectCard
                key={project.projectInternalID}
                project={project}
                role={user.role}
                onEdit={handleEdit}
                onDelete={handleOpenDeleteModal}
                onUpdate={handleUpdate}
                onGeneratePID={handleGeneratePID}
                onSubmitForSuperAdminReview={onSubmitForSuperAdminReview}
                onAdminApprove={handleAdminApprove}
                onAdminReject={handleAdminReject}
                onSuperadminApprove={() => openSuperAdminRemarksModal(project, 'approve')}
                onSuperadminReject={() => openSuperAdminRemarksModal(project, 'reject')}
                loading={actionLoading === project.projectInternalID}
              />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
