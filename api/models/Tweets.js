var Tweets = {
  // Enforce model schema in the case of schemaless databases
  schema: true,

  attributes: {
    id:{type:'string' , index:true}
    ,id_str:{type:"string"}
    ,post_id: {type:'string'}
    ,entities:{
      hashtags:[{type:'json'}]
      ,urls:[{type:'json'}]
      ,media:[{
        media_url:{type:'string'}
        ,media_url_https:{type:'string'}
        ,indices:[{type:'number'}]
      }]
    }
    ,created_at:{type:'datetime'}
    ,text:{type:'string'}
    ,lang:{type:'string'}
    ,retweeted:{type:'boolean'}
    ,date:{type:'date'}
    ,user: {
      name:{type:'string'}
      ,id_str:{type:'string'}
      ,profile_banner_url:{type:'string'}
      ,profile_image_url:{type:'string'}
    }
    ,approved:{type:'boolean', defaultsTo:false}
    ,featured:{type:'boolean', defaultsTo:false}
  }
};

module.exports = Tweets;
