import { auth } from "google-auth-library";

// sign up
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('sumbmi', (e) => {
    e-preventDefault();
    
    // get user info
    const email = signupForm['signup-email'].value;
    const password = signupForm['signup-password'].value;

    // sign up the user
    auth.createUserWithEmailAadPassword(email,password).then(cred => {
        console.log(cred);
    })
})