@isTest
public class AccountHistory_Test{  
    @isTest static void testingPostive(){
        list<Account> newAccList;
        Account myAcc = new Account(Name='Infy1', Active__c='Yes', Account_Type__c='Internal');
        insert myAcc;
        Contact myCon = new Contact(LastName='Test Name1', AccountId = myAcc.Id);
        insert myCon;
        
        Account oldAcc = [Select Id, Name, Account_Type__c from Account where Id=:myAcc.Id];
        oldAcc.Account_Type__c = 'External';
        update oldAcc;
        
		Contact resultCon = [select Id, Account_Type_History__c from Contact where AccountId=:oldAcc.Id];
        
        System.AssertEquals('Old: Internal, New: External', resultCon.Account_Type_History__c);
    }
}