import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../layout/DefaultLayout';
import PatientInformationTable from '../components/Tables/PatientInformationTable';
import "primereact/resources/themes/lara-light-cyan/theme.css";
const PatientInformationModule = () => {
  return (
   <DefaultLayout>
    <Breadcrumb pageName="Patients" />
    <PatientInformationTable/>
   </DefaultLayout>
  );
};

export default PatientInformationModule;
