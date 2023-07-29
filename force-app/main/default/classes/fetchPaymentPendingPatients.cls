public with sharing class fetchPaymentPendingPatients {
    public fetchPaymentPendingPatients() {

    }
    @AuraEnabled(cacheable=true)
    public static List<Patient__c> getPatientList() {
        return [
            SELECT Id, Patient_Name__c, Mobile_Number__c, Remaining_Amount_To_Pay__c, Doctor__r.Doctor_Name__c
                    FROM Patient__c
                    WHERE Remaining_Amount_To_Pay__c >= 0 AND Patient_Status__c = 'Under Treatment'
                    ORDER BY CreatedDate DESC
        ];
    }
}
