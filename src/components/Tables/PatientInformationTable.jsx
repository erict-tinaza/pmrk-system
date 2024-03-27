import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { PatientService } from '../../service/PatientService';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Rating } from 'primereact/rating';
import { Toolbar } from 'primereact/toolbar';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton } from 'primereact/radiobutton';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
export default function PatientInformationTable() {
  let emptyPatient = {
    recordNum: null,
    firstName: '',
    middleName: '',
    lastName: '',
    gender: '',
    age: null,
    address: '',
    contactNo: '',
    userName: '',
    password: '',
  };
  const [patients, setPatients] = useState(null);
  const [patientDialog, setPatientDialog] = useState(false);
  const [deletePatientDialog, setDeletePatientDialog] = useState(false);
  const [deletePatientDialogs, setDeletePatientsDialog] = useState(false);
  const [patient, setPatient] = useState(emptyPatient);
  const [selectedPatients, setSelectedPatients] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);

  useEffect(() => {
    PatientService.getPatients().then((data) => setPatients(data));
  }, []);
  //JS for new btn
  const openNew = () => {
    setPatient(emptyPatient);
    setSubmitted(false);
    setPatientDialog(true);
  };
  const hideDialog = () => {
    setSubmitted(false);
    setPatientDialog(false);
  };

  const hideDeletePatientDialog = () => {
    setDeletePatientDialog(false);
  };

  const hideDeletePatientsDialog = () => {
    setDeletePatientsDialog(false);
  };

  //function for saving new patient
  const savePatient = () => {
    setSubmitted(true);

    if (patient.firsName.trim()) {
      let _patients = [...patients];
      let _patient = { ...patient };

      if (patient.id) {
        const index = findIndexById(patient.id);

        _patients[index] = _patient;
        toast.current.show({
          severity: 'success',
          summary: 'Successful',
          detail: 'Patient Updated',
          life: 3000,
        });
      } else {
        _patient.id = createId();
        _patients.push(_patient);
        toast.current.show({
          severity: 'success',
          summary: 'Successful',
          detail: 'Patient Created',
          life: 3000,
        });
      }

      setPatients(_patients);
      setPatientDialog(false);
      setPatient(emptyPatient);
    }
  };

  const editPatient = (patient) => {
    setPatient({ ...patient });
    setPatientDialog(true);
  };

  const deletePatient = () => {
    let _patients = patients.filter(
      (val) => val.recordNum !== patient.recordNum,
    );

    setPatients(_patients);
    setDeletePatientDialog(false);
    setPatient(emptyPatient);
    toast.current.show({
      severity: 'success',
      summary: 'Successful',
      detail: 'Patient Deleted',
      life: 3000,
    });
  };
  const findIndexByRecordNum = (recordNum) => {
    let index = -1;

    for (let i = 0; i < patients.length; i++) {
      if (patients[i].recordNum === recordNum) {
        index = i;
        break;
      }
    }

    return index;
  };
  const createRecordNum = () => {
    let recordNum = '';
    let chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 5; i++) {
      recordNum += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return recordNum;
  };
  const exportCSV = () => {
    dt.current.exportCSV();
  };

  const confirmDeleteSelected = () => {
    setDeletePatientsDialog(true);
  };
  const deleteSelectedPatients = () => {
    let _patients = patients.filter((val) => !selectedPatients.includes(val));

    setPatients(_patients);
    setDeletePatientsDialog(false);
    setSelectedPatients(null);
    toast.current.show({
      severity: 'success',
      summary: 'Successful',
      detail: 'Patients Deleted',
      life: 3000,
    });
  };

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _patient = { ...patient };

    _patient[`${name}`] = val;

    setPatient(_patient);
  };

  const onInputNumberChange = (e, name) => {
    const val = e.value || 0;
    let _patient = { ...patient };

    _patient[`${name}`] = val;

    setPatient(_patient);
  };

  const onGenderChange = (e) => {
    let _patient = { ...patient };

    _patient['gender'] = e.value;
    setPatient(_patient);
  };

  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button
          label="New"
          icon="pi pi-plus"
          severity="success"
          onClick={openNew}
        />
        <Button
          label="Delete"
          icon="pi pi-trash"
          severity="danger"
          onClick={confirmDeleteSelected}
          disabled={!selectedPatients || !selectedPatients.length}
        />
      </div>
    );
  };

  const rightToolbarTemplate = () => {
    return (
      <Button
        label="Export"
        icon="pi pi-upload"
        className="p-button-help"
        onClick={exportCSV}
      />
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-pencil"
          rounded
          outlined
          className="mr-2"
          onClick={() => editProduct(rowData)}
        />
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          severity="danger"
          onClick={() => confirmDeleteProduct(rowData)}
        />
      </React.Fragment>
    );
  };
  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h4 className="m-0">Manage Products</h4>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          onInput={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search..."
        />
      </span>
    </div>
  );
  const patientDialogFooter = (
    <React.Fragment>
      <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
      <Button label="Save" icon="pi pi-check" onClick={savePatient} />
    </React.Fragment>
  );
  const deletePatientDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={hideDeletePatientDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={deletePatient}
      />
    </React.Fragment>
  );
  const deletePatientsDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={hideDeletePatientsDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={deleteSelectedPatients}
      />
    </React.Fragment>
  );

  return (
    <div>
      <Toast ref={toast} />
      <div className="card">
        <Toolbar
          className="mb-4"
          left={
            <Button
              label="New"
              icon="pi pi-plus"
              severity="success"
              onClick={openNew}
            />
          }
        ></Toolbar>

        <DataTable
          ref={dt}
          value={patients}
          selection={selectedPatients}
          onSelectionChange={(e) => setSelectedPatients(e.value)}
          dataKey="recordNum"
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} patients"
          globalFilter={globalFilter}
          header={header}
        >
          <Column selectionMode="multiple" exportable={false}></Column>
          <Column
            field="recordNum"
            header="Record Number"
            sortable
            style={{ minWidth: '12rem' }}
          ></Column>
          <Column
            field="firstName"
            header="First Name"
            sortable
            style={{ minWidth: '12rem' }}
          ></Column>
          <Column
            field="middleName"
            header="Middle Name"
            sortable
            style={{ minWidth: '12rem' }}
          ></Column>
          <Column
            field="lastName"
            header="Last Name"
            sortable
            style={{ minWidth: '12rem' }}
          ></Column>
          <Column
            field="gender"
            header="Gender"
            sortable
            style={{ minWidth: '10rem' }}
          ></Column>
          <Column
            field="age"
            header="Age"
            sortable
            style={{ minWidth: '8rem' }}
          ></Column>
          <Column
            field="address"
            header="Address"
            sortable
            style={{ minWidth: '16rem' }}
          ></Column>
          <Column
            field="contactNo"
            header="Contact Number"
            sortable
            style={{ minWidth: '12rem' }}
          ></Column>
          <Column
            field="userName"
            header="Username"
            sortable
            style={{ minWidth: '12rem' }}
          ></Column>
          <Column
            body={actionBodyTemplate}
            exportable={false}
            style={{ minWidth: '12rem' }}
          ></Column>
        </DataTable>

        <Dialog
          visible={patientDialog}
          style={{ width: '32rem' }}
          breakpoints={{ '960px': '75vw', '641px': '90vw' }}
          header="Patient Details"
          modal
          className="p-fluid"
          footer={patientDialogFooter}
          onHide={hideDialog}
        >
          <div className="field">
            <label htmlFor="firstName" className="font-bold">
              First Name
            </label>
            <InputText
              id="firstName"
              value={patient.firstName}
              onChange={(e) => onInputChange(e, 'firstName')}
              required
              autoFocus
              className={classNames({
                'p-invalid': submitted && !patient.firstName,
              })}
            />
            {submitted && !patient.firstName && (
              <small className="p-error">First Name is required.</small>
            )}
          </div>
          <div className="field">
            <label htmlFor="middleName" className="font-bold">
              Middle Name
            </label>
            <InputText
              id="middleName"
              value={patient.middleName}
              onChange={(e) => onInputChange(e, 'middleName')}
            />
          </div>
          <div className="field">
            <label htmlFor="lastName" className="font-bold">
              Last Name
            </label>
            <InputText
              id="lastName"
              value={patient.lastName}
              onChange={(e) => onInputChange(e, 'lastName')}
              required
              className={classNames({
                'p-invalid': submitted && !patient.lastName,
              })}
            />
            {submitted && !patient.lastName && (
              <small className="p-error">Last Name is required.</small>
            )}
          </div>
          <div className="field">
            <label className="mb-3 font-bold">Gender</label>
            <div className="formgrid grid">
              <div className="field-radiobutton col-6">
                <RadioButton
                  inputId="gender1"
                  name="gender"
                  value="Male"
                  onChange={onGenderChange}
                  checked={patient.gender === 'Male'}
                />
                <label htmlFor="gender1">Male</label>
              </div>
              <div className="field-radiobutton col-6">
                <RadioButton
                  inputId="gender2"
                  name="gender"
                  value="Female"
                  onChange={onGenderChange}
                  checked={patient.gender === 'Female'}
                />
                <label htmlFor="gender2">Female</label>
              </div>
            </div>
          </div>
          <div className="field">
            <label htmlFor="age" className="font-bold">
              Age
            </label>
            <InputNumber
              id="age"
              value={patient.age}
              onValueChange={(e) => onInputNumberChange(e, 'age')}
            />
          </div>
          <div className="field">
            <label htmlFor="address" className="font-bold">
              Address
            </label>
            <InputText
              id="address"
              value={patient.address}
              onChange={(e) => onInputChange(e, 'address')}
            />
          </div>
          <div className="field">
            <label htmlFor="contactNo" className="font-bold">
              Contact Number
            </label>
            <InputText
              id="contactNo"
              value={patient.contactNo}
              onChange={(e) => onInputChange(e, 'contactNo')}
            />
          </div>
          <div className="field">
            <label htmlFor="userName" className="font-bold">
              Username
            </label>
            <InputText
              id="userName"
              value={patient.userName}
              onChange={(e) => onInputChange(e, 'userName')}
            />
          </div>
          <div className="field">
            <label htmlFor="password" className="font-bold">
              Password
            </label>
            <InputText
              id="password"
              value={patient.password}
              onChange={(e) => onInputChange(e, 'password')}
            />
          </div>
        </Dialog>

        <Dialog
          visible={deletePatientDialog}
          style={{ width: '32rem' }}
          breakpoints={{ '960px': '75vw', '641px': '90vw' }}
          header="Confirm"
          modal
          footer={deletePatientDialogFooter}
          onHide={hideDeletePatientDialog}
        >
          <div className="confirmation-content">
            <i
              className="pi pi-exclamation-triangle mr-3"
              style={{ fontSize: '2rem' }}
            />
            {patient && (
              <span>
                Are you sure you want to delete <b>{patient.firstName}</b>?
              </span>
            )}
          </div>
        </Dialog>

        <Dialog
          visible={deletePatientDialog}
          style={{ width: '32rem' }}
          breakpoints={{ '960px': '75vw', '641px': '90vw' }}
          header="Confirm"
          modal
          footer={deletePatientsDialogFooter}
          onHide={hideDeletePatientsDialog}
        >
          <div className="confirmation-content">
            <i
              className="pi pi-exclamation-triangle mr-3"
              Astyle={{ fontSize: '2rem' }}
            />
            {patient && (
              <span>
                Are you sure you want to delete the selected patients?
              </span>
            )}
          </div>
        </Dialog>
      </div>
    </div>
  );
}
