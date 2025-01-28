// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, setDoc, doc } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD_vJwAfd87Z5bzcJ_UEd0epOh1q1gx_Vk",
  authDomain: "foodordering-a758a.firebaseapp.com",
  projectId: "foodordering-a758a",
  storageBucket: "foodordering-a758a.appspot.com",
  messagingSenderId: "863152192284",
  appId: "1:863152192284:web:3f75f20c8ba4482783d8d9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Helper function to show messages
function showMessage(message, divId) {
  const messageDiv = document.getElementById(divId);
  messageDiv.style.display = "block";
  messageDiv.innerHTML = message;
  messageDiv.style.opacity = 1;
  setTimeout(() => {
    messageDiv.style.opacity = 0;
  }, 5000);
}

// Event listener for Sign-Up
document.getElementById("submitSignUp").addEventListener("click", async (event) => {
  event.preventDefault();
  const email = document.getElementById("rEmail").value;
  const password = document.getElementById("rPassword").value;
  const firstName = document.getElementById("fName").value;
  const lastName = document.getElementById("lName").value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userData = { email, firstName, lastName };
    await setDoc(doc(db, "users", user.uid), userData);

    showMessage("Account Created Successfully", "signUpMessage");
    window.location.href = "index.html";
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      showMessage("Email Address Already Exists!", "signUpMessage");
    } else {
      showMessage("Unable to create user. Please try again.", "signUpMessage");
    }
    console.error(error);
  }
});

// Event listener for Sign-In
document.getElementById("submitSignIn").addEventListener("click", async (event) => {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    showMessage("Login Successful", "signInMessage");
    localStorage.setItem("loggedInUserId", user.uid);
    window.location.href = "index.html";
  } catch (error) {
    if (error.code === "auth/wrong-password" || error.code === "auth/user-not-found") {
      showMessage("Incorrect Email or Password", "signInMessage");
    } else {
      showMessage("Unable to login. Please try again.", "signInMessage");
    }
    console.error(error);
  }
});
