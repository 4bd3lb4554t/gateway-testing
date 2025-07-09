
const loginSchema = {
    type : "object" ,
    properties : {
        email : {type: "string" , format : 'email'},
        password : {type: "string" ,  minLength : 2 },
    },
    required : ['email' , 'password'],
    additionalProperties: false

    
}


const signupSchema = {
    type : "object" ,
    properties : {
        username : {type: "string"},
        email : {type: "string" , format : 'email'},
        password : {type: "string"  ,  minLength : 2},
    },
    required : ['email' , 'username' , 'password'],
    additionalProperties: false

}


const detailsSchema = {
    type : "object" ,
    properties : {
        fullname : {type: "string"},
        bio      : {type: "string"},
        location : {type: "string"},
        phone    : {type: "string" , format : 'email'},
    },
    required : ['fname' , 'lname' , 'username' , 'email' , 'password'],
    additionalProperties: false

}



const verifyEmailSchema = {
    type : "object" ,
    properties : {
        email : {type: "string" , format : 'email'},
        code : {type: "string" ,  minLength : 2 },
    },
    required : ['email' , 'code'],
    additionalProperties: false

    
}

export { loginSchema  , verifyEmailSchema , signupSchema, detailsSchema };
