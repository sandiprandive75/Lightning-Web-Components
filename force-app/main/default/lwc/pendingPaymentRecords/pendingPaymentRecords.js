import { LightningElement, api, wire, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getPatientList from '@salesforce/apex/fetchPaymentPendingPatients.getPatientList';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import showRecords from './showRecords.html';
import paymentComplete from './paymentComplete.html';

export default class PendingPaymentRecords extends NavigationMixin(LightningElement) {
    @track patientId;
    @track patients;
    @track patientRemainingAmount;
    @track error;
    @track paymentSelectedId;

    @wire(getPatientList)
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
        return this.showTemplateOne ? showRecords : paymentComplete;
    }

    switchTemplate(event){ 
        this.paymentSelectedId = event.target.value;
        this.patients.forEach(record => {
            if(record.Id == this.paymentSelectedId){
                this.patientRemainingAmount = record.Remaining_Amount_To_Pay__c;
            }
         })
        this.showTemplateOne = !this.showTemplateOne;
    }

    cancelPayment(){
        this.showTemplateOne = !this.showTemplateOne;
    }

    refreshPage(){
        const evt = new ShowToastEvent({
            title: `Payment Successful!`,
            message: `Thank You!`,
            variant: "success"
        });
        this.dispatchEvent(evt);
        this.showTemplateOne = !this.showTemplateOne;

        // go to patient record page
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.paymentSelectedId,
                actionName: 'view'
            }
        });
    }

    openPatient(event){
        this.patientId = event.target.value;
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.patientId,
                actionName: 'view'
            }
        });
    }
}