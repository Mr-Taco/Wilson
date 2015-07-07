var Posts = {
  // Enforce model schema in the case of schemaless databases
  schema: true,

  attributes: {
    id:{type:'string' , index:true}
    ,caption:{type:'string'}
    ,description:{type:'string'}
    ,from:{type:'json'}
    ,approved:{type:'boolean', defaultsTo:false}
    ,featured:{type:'boolean', defaultsTo:false}
    ,icon:{type:'string'}
    ,message:{type:'string'}
    ,picture:{type:'string'}
    ,type:{type:'string'}
    ,updated_time:{type:'string'}
    ,date:{type:'date'}
  }
};

module.exports = Posts;
