public with sharing class doctorAppointment {
    public doctorAppointment() {
    }

    @AuraEnabled(cacheable=true)
    public static List<Patient__c> getPatientsForCheckup() {
        return [
            SELECT Id, Patient_Name__c, Problem_Description__c, Need_Help_In__c, Patient_Admit_Date__c,
                    Mobile_Number__c, Doctor__r.Doctor_Name__c FROM Patient__c
                    WHERE Patient_Status__c = 'Appointment Confirm' ORDER BY CreatedDate DESC
        ];
    }
}
