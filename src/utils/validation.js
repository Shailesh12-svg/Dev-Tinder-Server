const validator =  require('validator')

const validateSignUp =(req)=>{

    const {firstName,lastName,emailId,password} = req.body;

    //Checks

    if(!firstName||!lastName){
        throw new Error("Name is not valid!")
    }
    else if(firstName.length<4||firstName.length>50){
        throw new Error("First name should be in between 4-50 characters")
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("Email is not valid")
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Password is not strong enough")
    }
}

const validateEditProfile =(req)=>{
    const allowedMethods =[
        'firstName',
        'lastName',
        'photoUrl',
        'gender',
        'age',
        'about',
        'skills'
    ]

    const isEditAllowed = Object.keys(req.body).every(field=>allowedMethods.includes(field)) 

    return isEditAllowed;
}

const validateInputPassword=(req)=>{
    const ValidMethods = 'password';
 
    if(Object.keys(req.body)==ValidMethods){
        return true
    }else{
        throw new Error("Please enter valid inputs")
    }

}

module.exports ={
    validateSignUp,
    validateEditProfile,
    validateInputPassword,
}