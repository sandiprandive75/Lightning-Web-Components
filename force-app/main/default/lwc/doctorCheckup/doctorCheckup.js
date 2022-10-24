import { LightningElement, track, wire} from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getPatientsForCheckup from '@salesforce/apex/doctorAppointment.getPatientsForCheckup';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import patientCheckupList from './patientCheckupList.html';
import patientForm from './patientForm.html';

export default class DoctorCheckup extends NavigationMixin(LightningElement) {
    @track patientId;
    @track docId;
    @track patients;
    @track error;
    @track patientSelectedId;
    @track showOperationFields = false;

    @wire(getPatientsForCheckup)
    wiredPatientRecords({ error, data }) {
        if (data) {
            this.patients = data;
            this.error = undefined;
        } else if (error) {
            this.dispatchToast(error);
            this.error = error;
            this.patients = undefined;
        }
    }

    showTemplateOne = true;

    render() {
        return this.showTemplateOne ? patientCheckupList : patientForm;
    }

    switchTemplate(event){ 
        this.patientSelectedId = event.target.value;
        this.patients.forEach(record => {
            if(record.Id == this.patientSelectedId){
                this.docId = record.Doctor__c;
            }
         })
        this.showTemplateOne = !this.showTemplateOne;
    }

    cancelPayment(){
        this.showTemplateOne = !this.showTemplateOne;
    }

    openPatient(event){
        this.patientId = event.target.value;
        console.log(this.patientId);
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.patientId,
                actionName: 'view'
            }
        });
    }

    showOperationRecord(event){
        event.target.value?this.showOperationFields = true:this.showOperationFields = false;
    }

    operationRecordCreated(event){
        const evt = new ShowToastEvent({
            title: `Operation Scheduled Successfully!`,
            message: `Best wishes`,
            variant: "success"
        });
        this.dispatchEvent(evt);

        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.patientSelectedId,
                actionName: 'view'
            }
        });
    }

    patientEdited(){
        const evt = new ShowToastEvent({
            title: `Record changes Saved!`,
            message: `Patient checking Done!`,
            variant: "success"
        });
        this.dispatchEvent(evt);
    }
}