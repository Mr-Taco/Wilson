var Grams = {
  // Enforce model schema in the case of schemaless databases
  schema: true,

  attributes: {
    id:{type:'string' , index:true}
    ,caption: {
      text:{type:'string'}
    }
    ,user:{
      username:{type:'string'}
      ,profile_picture:{type:'string'}
      ,id:{type:'string'}
    }
    ,tags:[{type:'string'}]
    ,images:{type:'json'}
    ,approved:{type:'boolean', defaultsTo:false}
    ,featured:{type:'boolean', defaultsTo:false}
    ,type:{type:'string'}
    ,created_time:{type:'string'}
    ,date:{type:'date'}
  }
};

module.exports = Grams;
