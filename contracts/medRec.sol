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
    // mapping(address=>Patient)public patientRecord;
    // mapping(address=>bool) public patient_reg;
    // mapping(address=>string)internal addr_to_str;
    
    function giveCreatePermission(address _dkey, address _pkey)public{
        require(msg.sender==_pkey);
        addPermit[_pkey][_dkey]=true;
    }
    
    function giveViewPermission(address _dkey, address _pkey)public{
        require(msg.sender==_pkey);
        viewPermit[_pkey][_dkey]=true;
    }

    function revokeCreatePermission(address _dkey, address _pkey)public{
        require(msg.sender==_pkey);
        addPermit[_pkey][_dkey]=false;
    }
    
    function revokeViewPermission(address _dkey, address _pkey)public{
        require(msg.sender==_pkey);
        viewPermit[_pkey][_dkey]=false;
    }

    function autoRevokeCreatePermission(address _dkey, address _pkey)public{
        addPermit[_pkey][_dkey]=false;
    }
    
    function addPatientRecord( address _dkey, address _pkey, string memory _dName, string memory _pName,string memory _pGender, uint _pAge, string memory _dov, string memory _pov, string memory _uk) public{
        
        require(msg.sender==_dkey);
        require(addPermit[_pkey][_dkey]==true);
        noOfRecords[_pkey]++;
        uint id= noOfRecords[_pkey];
        patientRecord[_pkey][id]= Patient(_dkey, _pkey ,_dName, _pName ,_pGender, _pAge, _dov,  _pov, _uk);

        records[_uk]=Patient(_dkey, _pkey ,_dName, _pName ,_pGender, _pAge, _dov,  _pov, _uk);
    }


    function viewPatientRecords(address _dkey, address _pkey) public view returns(bool){
        
        if(msg.sender!=_dkey){
            return false;
        }
        if(viewPermit[_pkey][_dkey]!=true){
            return false;
        }
        return true;
    }

    function viewOwnRecords(address _pkey) public view returns(bool){
        
        if(msg.sender!=_pkey){
            return false;
        }
        return true;
    }

    // function addPatientRecord(address _dkey, address _pkey, string memory doctorName, string memory patientName,string memory gender, uint age, string memory dov, string memory pv) public{
        
    //     require(msg.sender==_dkey);
    //     require(addPermit[_pkey][_dkey]==true);
    //     noOfRecords[_pkey]=1;
    //     // uint id= noOfRecords[_pkey];
    //     patientRecord[_pkey]= Patient(_dkey, _pkey ,doctorName, patientName ,gender, age, dov,  pv);
        
    // }



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

     // function encodeRecord(address _pkey, uint _id) public returns(string memory){
    //     bytes memory a1 = abi.encodePacked(_pkey);
    //     bytes memory a2 = abi.encodePacked("$");
    //     bytes memory a = abi.encodePacked(a1, a2);

    //     bytes memory b = abi.encodePacked(_id);
    //     bytes memory c = abi.encodePacked(a, b);

    //     string memory str = string(c);

    //     return str;
    // }
}