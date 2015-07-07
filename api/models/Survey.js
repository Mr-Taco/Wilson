/**
 * Created by Pavel on 11/16/2014.
 */


var Survey = {
    schema:true,
    attributes: {
        session: {
            type:"string"
            ,required:true
            ,unique:true
        }
        ,username: {
            type:"string"
            ,required:true
        }
        ,recruitNumber: {
            type:"string",
            required:true
        }
        /* 1. How old are you?  */
        ,age : {
            type:'string'
            ,required:true
        }
        /* 2. What is our gender?  */
        ,gender: {
            type:'string'
            ,required:true
        }
        /* 3. On a scale of 1 to 5, how would you rate the Burn racket?  */
        ,rating: {
            type:'integer'
            ,min:1
            ,max:5
            ,required:true
        }
        /* 5. On a scale of 1 to 5, rate how well the Burn racket performed in each of the following categories. */
        ,power: {
            type:'integer'
            ,min:1
            ,max:5
            ,required:true
        }
        ,control: {
            type:'integer'
            ,min:1
            ,max:5
            ,required:true
        }
        ,feel: {
            type:'integer'
            ,min:1
            ,max:5
            ,required:true
        }
        ,speed: {
            type:'integer'
            ,min:1
            ,max:5
            ,required:true
        }
        ,sound: {
            type:'integer'
            ,min:1
            ,max:5
            ,required:true
        }
        ,design: {
            type:'integer'
            ,min:1
            ,max:5
            ,required:true
        }
        ,spin: {
            type:'integer'
            ,min:1
            ,max:5
            ,required:true
        }
        ,maneuverability: {
            type:'integer'
            ,min:1
            ,max:5
            ,required:true
        }
        ,consistency: {
            type:'integer'
            ,min:1
            ,max:5
            ,required:true
        }
        /* 5.  Write a review for the Burn racket. (optional) */
        ,review : {
            type:'string'

        }
        /*6. Which brand and model of racket to you play with on a regular basis?*/
        ,racket: {
            type:'string'
            ,required:true
        }
        /*7. When you chose this racket, which of the following features mattered the MOST to you? Rank your TOP THREE with 1 being the MOST important feature.*/
        ,top_features: {
            type:'string'
            ,required: true
        }
        /*8. How do you think the Burn racket performed compared to the racket you use on a regular basis? Please explain your choice.*/
        ,comparison: {
            type:'string'
            ,required: true
        }
        ,comparison_explain : {
            type:'string'
            ,required: true
        }
        /*9. How do you usually find out about new rackets?*/
        ,discover: {
            type:'string'
            ,required: true
        }
        ,discover_other: {
            type:'string'
        }
        /*10.  Besides tennis, what other non-school related activities do you do for fun?*/
        ,hobbies: {
            type:'string'
            ,required: true
        }

    }

};
module.exports = Survey;
