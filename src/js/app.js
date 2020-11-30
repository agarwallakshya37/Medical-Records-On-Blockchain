App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  hasVoted: false,

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // TODO: refactor conditional
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("medRec.json", function(med) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.medRec = TruffleContract(med);
      // Connect provider to interact with contract
      App.contracts.medRec.setProvider(App.web3Provider);

      //App.listenForEvents();

      return App.render();
    });
  },

  // Listen for events emitted from the contract
  // listenForEvents: function() {
  //   App.contracts.medRec.deployed().then(function(instance) {
  //     // Restart Chrome if you are unable to receive this event
  //     // This is a known issue with Metamask
  //     // https://github.com/MetaMask/metamask-extension/issues/2393
  //     instance.votedEvent({}, {
  //       fromBlock: 0,
  //       toBlock: 'latest'
  //     }).watch(function(error, event) {
  //       console.log("event triggered", event)
  //       // Reload when a new vote is recorded
  //       App.render();
  //     });
  //   });
  // },

  render: function() {
    var medInstance;
    // var loader = $("#loader");
    // var content = $("#content");

    // loader.show();
    // content.hide();

    // Load account data
    web3.eth.getCoinbase(function(error, account) {
      if (error === null) {
        App.account = account;
        $("#account_addr").html("Your Account: " + account);
      }
    });
  },

  gcp: function() {
    var doc_addr = $('#doctor_addr').val();
    var pat_addr = $('#patient_addr').val();
    var recordsResults = $("#result");
    App.contracts.medRec.deployed().then(function(instance) {
      recordsResults.empty();
      App.render();
      instance.giveCreatePermission(doc_addr, pat_addr, {from:App.account}).then(function(result) {       
        var recordTemplate = result;
        recordsResults.append(recordTemplate);
        console.log(result);
      // Wait for votes to update
      // $("#content").hide();
      // $("#loader").show();
      })
    }).catch(function(error) {
      var recordTemplate = error;
      recordsResults.append(recordTemplate);
      console.error(error);
    });
  },

  gvp: function() {
    var doc_addr = $('#doctor_addr').val();
    var pat_addr = $('#patient_addr').val();
    var recordsResults = $("#result");
    App.contracts.medRec.deployed().then(function(instance) {
      recordsResults.empty();
      App.render();
      instance.giveViewPermission(doc_addr, pat_addr, {from:App.account}).then(function(result) {
        var recordTemplate = result;
        recordsResults.append(recordTemplate);
        console.log(result);
      // Wait for votes to update
      // $("#content").hide();
      // $("#loader").show();
      })
    }).catch(function(error) {
      var recordTemplate = error;
      recordsResults.append(recordTemplate);
      console.error(error);
    });
  },

   
  rcp: function() {
    var doc_addr = $('#doctor_addr').val();
    var pat_addr = $('#patient_addr').val();
    var recordsResults = $("#result");
    App.contracts.medRec.deployed().then(function(instance) {
      recordsResults.empty();
      App.render();
      instance.revokeCreatePermission(doc_addr, pat_addr,{from:App.account}).then(function(result) {      
        var recordTemplate = result;
        recordsResults.append(recordTemplate);
        console.log(result);
      // Wait for votes to update
      // $("#content").hide();
      // $("#loader").show();
    })}).catch(function(error) {
      var recordTemplate = error;
      recordsResults.append(recordTemplate);
      console.error(error);
    });
  },


  rvp: function() {
    var recordsResults = $("#result");
    
    var doc_addr = $('#doctor_addr').val();
    var pat_addr = $('#patient_addr').val();
    App.contracts.medRec.deployed().then(function(instance) {
      recordsResults.empty();
      App.render();
      instance.revokeViewPermission(doc_addr, pat_addr, {from:App.account}).then(function(result) {
        var recordTemplate = result;
        recordsResults.append(recordTemplate);
        console.log(result);
      // Wait for votes to update
      // $("#content").hide();
      // $("#loader").show();
    })}).catch(function(error) {
      var recordTemplate = error;
      recordsResults.append(recordTemplate);
      console.error(error);
    });
  },

  
  apr: function() {
    var recordsResults = $("#result");
    App.contracts.medRec.deployed().then(function(instance) {
      medInstance=instance
      recordsResults.empty();

      var doc_addr = $('#doctor_addr').val();
      var pat_addr = $('#patient_addr').val();
      var doc_name = $('#doctor_name').val();
      var pat_name = $('#patient_name').val();
      var pat_gender = $('#patient_gender').val();
      var pat_age = $('#patient_age').val();
      var dov = $('#dov').val();
      var pov = $('#pov').val();
      var key="";
      medInstance.noOfRecords(pat_addr).then(function(recordsCount) {
        var ckey=recordsCount.toNumber() +1;
        key= pat_addr+"$"+ckey;
      
        //console.log(key);
        App.render();
      medInstance.addPatientRecord(doc_addr, pat_addr, doc_name, pat_name, pat_gender, pat_age, dov, pov, key, {from:App.account}).then(function(result){
        var recordTemplate = result;
        recordsResults.append(recordTemplate);
        console.log(result);
      })

      medInstance.autoRevokeCreatePermission(doc_addr , pat_addr).then(function(ans){
        console.log("Create Permission Revoked");
      })
    })
      
    }).catch(function(error) {
      var recordTemplate = error;
      recordsResults.append(recordTemplate);
      console.log(error);
    });
    
    },
  
  vr: function(){
    var pat_addr = $('#patient_addr').val();
    var recordsResults = $("#result");
    App.contracts.medRec.deployed().then(function(instance) {
    medInstance = instance;
    recordsResults.empty();
    
    medInstance.noOfRecords(pat_addr).then(function(recordsCount) {
      console.log(recordsCount.toNumber());
      var count = recordsCount.toNumber();
      
          if(count<1){
            var recordTemplate="No Prescription Available";
            recordsResults.append(recordTemplate);
            console.log(recordTemplate);
          }
          for (var i =1; i <=count; i++) {
            //medInstance.patientRecord(pat_addr).then(function(record) {
              var key = pat_addr.concat("$",i);
              //console.log(key);
              medInstance.records(key).then(function(record) {
                //console.log(record);
              // console.log("hello1")
              //console.log(record.valueOf());

              var d_addr = record[0];
              var p_addr = record[1];
              var d_name = record[2];
              var p_name = record[3];
              var gender = record[4];
              var age = record[5];
              var dov = record[6];
              var pov = record[7];

              //console.log(d_addr)
              // console.log(p_addr)
              
              // Render candidate Result
              
              var recordTemplate = "doctor's address : " + d_addr + " <br> patient's address : "+ p_addr + " <br> doctor's name : " + d_name + " <br> patient's name : " + p_name + " <br> patient's gender : " + gender + " <br> patient's age : " + age + " <br> date of visit : "+ dov + " <br> purpose of visit : "+ pov + "<hr>"
              recordsResults.append(recordTemplate);
            })
          }
      })
  
  }).catch(function(error) {
    var recordTemplate = result;
    recordsResults.append(recordTemplate);
    console.log(error);
  });
  
  },
  
  vor: function() {
    var recordsResults = $("#result");
    var pat_addr = $('#patient_addr').val();
    App.contracts.medRec.deployed().then(function(instance) {
      medInstance = instance;
      recordsResults.empty();
      App.render();
      medInstance.viewOwnRecords(pat_addr, {from:App.account}).then(function(perm){
        console.log(perm)
        if(!perm){
          var recordTemplate = "Error: Permission Not Granted or Wrong sender's address";
          recordsResults.append(recordTemplate);
          throw "Error: Permission Not Granted or Wrong sender's address";
        }
          App.vr();
      })
      }).catch(function(error) {
      var recordTemplate = error;
      recordsResults.append(recordTemplate);
      console.warn(error);
    });
  },

  //testing
  // tor: function() {
  //   var pat_addr = $('#patient_addr').val();
  //   App.contracts.medRec.deployed().then(function(instance) {
  //     instance.noOfRecords(pat_addr, { from: pat_addr }).then(function(result){
  //       console.log(result);
  //     })
  //   }).catch(function(error) {
  //     console.warn(error);
  //   });
    
  //   },

    vpr: function() {
      var pat_addr = $('#patient_addr').val();
      var doc_addr= $('#doctor_addr').val();
      var recordsResults = $("#result");
    App.contracts.medRec.deployed().then(function(instance) {
      medInstance = instance;
      
      recordsResults.empty();
      App.render();
      medInstance.viewPatientRecords(doc_addr, pat_addr, {from:App.account}).then(function(perm){
        console.log(perm)
        if(!perm){
          var recordTemplate = "Error: Permission Not Granted / wrong sender's address";
          recordsResults.append(recordTemplate);
          throw "Error: Permission Not Granted / wrong sender's address";
        }
          App.vr();
      })
    }).catch(function(error) {
      var recordTemplate = error;
      recordsResults.append(recordTemplate);
      console.warn(error);
    });
     
    }


  //   App.contracts.medRec.deployed().then(function(instance) {
  //     return instance.viewOwnRecords(pat_addr, { from: pat_addr });
  //   }).then(function(result) {
  //     console.log(result);
  //     $("#result").html("Result: " + result);
  //     // Wait for votes to update
  //     // $("#content").hide();
  //     // $("#loader").show();
  //   }).catch(function(err) {
  //     console.error(err);
  //   });
  // }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});