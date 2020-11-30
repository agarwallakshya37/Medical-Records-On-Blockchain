pragma experimental ABIEncoderV2;
pragma solidity ^0.5.0;

contract medRec{
    
    // structure to store the patient information
    struct Patient{
	address doctorAddress;
       	address patientAddress;
        string doctorName;
        string patientName;
        string gender;
        uint age;
	string dateOfVisit;
	string purposeOfVisit;
        string uniqueKey;
    }
    
    mapping(address=> mapping(address=>bool))internal addPermit; // mapping for the doctor's add Permission
    mapping(address=> mapping(address=>bool))internal viewPermit;  // mapping for the doctor's view Permission
    mapping(address=>uint)public noOfRecords; // mapping of all the records for individual patient
    mapping(address=>mapping(uint=>Patient))public patientRecord; //mapping for the all the patients record
    mapping(string=>Patient)public records;
    
    // function which will invoke when patient will give permission to doctor to add his records 
    function giveCreatePermission(address _dkey, address _pkey)public{
        require(msg.sender==_pkey);
        addPermit[_pkey][_dkey]=true;
    }
    
    // Function to give view permission to doctor for seeing the records of the patient 
    function giveViewPermission(address _dkey, address _pkey)public{
        require(msg.sender==_pkey);
        viewPermit[_pkey][_dkey]=true;
    }

    // function to revoke create permission of a doctor 
    function revokeCreatePermission(address _dkey, address _pkey)public{
        require(msg.sender==_pkey);
        addPermit[_pkey][_dkey]=false;
    }
    
    // function to revoke view permission of a doctor    
    function revokeViewPermission(address _dkey, address _pkey)public{
        require(msg.sender==_pkey);
        viewPermit[_pkey][_dkey]=false;
    }

    // function to automatically revoke create permission of doctor after adding the record of the patient 
    function autoRevokeCreatePermission(address _dkey, address _pkey)public{
        addPermit[_pkey][_dkey]=false;
    }
    
    // function to add the patient records
    function addPatientRecord( address _dkey, address _pkey, string memory _dName, string memory _pName,string memory _pGender, uint _pAge, string memory _dov, string memory _pov, string memory _uk) public{
        
        require(msg.sender==_dkey);
        require(addPermit[_pkey][_dkey]==true);
        noOfRecords[_pkey]++;
        uint id= noOfRecords[_pkey];
        patientRecord[_pkey][id]= Patient(_dkey, _pkey ,_dName, _pName ,_pGender, _pAge, _dov,  _pov, _uk);

        records[_uk]=Patient(_dkey, _pkey ,_dName, _pName ,_pGender, _pAge, _dov,  _pov, _uk);
    }

    // function to view patient records for doctor
    function viewPatientRecords(address _dkey, address _pkey) public view returns(bool){
        
        if(msg.sender!=_dkey){
            return false;
        }
        if(viewPermit[_pkey][_dkey]!=true){
            return false;
        }
        return true;
    }

    // function by which patient can view his own records (no permission required)
    function viewOwnRecords(address _pkey) public view returns(bool){
        
        if(msg.sender!=_pkey){
            return false;
        }
        return true;
    }
    
    
    // function viewPatientRecords(address _dkey, address _pkey) public view returns(Patient[] memory){
        
    //     require(msg.sender==_dkey);
    //     require(viewPermit[_pkey][_dkey]==true);
    //     Patient[]memory patientRecordList=new Patient[](noOfRecords[_pkey]);
    //     for(uint i=1; i<=noOfRecords[_pkey]; i++) {
    //         patientRecordList[i-1]=patientRecord[_pkey][i];
    //     }
    //     return patientRecordList;
    // }
    

    // function viewOwnRecords(address _pkey) public view returns(Patient[] memory){
        
    //     require(msg.sender==_pkey);
    //     Patient[]memory ownRecordList=new Patient[](noOfRecords[_pkey]);
    //     for(uint i=1; i<=noOfRecords[_pkey]; i++) {
    //         ownRecordList[i-1]=patientRecord[_pkey][i];
    //     }
    //     return ownRecordList;
    // }   


}
