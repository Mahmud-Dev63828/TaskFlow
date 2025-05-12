import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { push, ref, set } from "firebase/database";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../../../Database/FirebaseConfig";
import { db } from "../../../Database/FirebaseConfig";
import { Link, Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // error state
  const [emailError, setEmailError] = useState("");
  const [fullNameError, setFullNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleSignUp = (e) => {
    e.preventDefault();
    // Handle sign up logic
    if (!fullName) {
      setFullNameError("FullName missing");
    } else if (!email) {
      setFullNameError("");
      setEmailError("Email missing");
    } else if (!password) {
      setEmailError("");
      setFullNameError("");
      setPasswordError("Password missing");
    } else {
      setEmailError("");
      setPasswordError("");
      createUserWithEmailAndPassword(auth, email, password)
        .then((userinfo) => {
          updateProfile(auth.currentUser, {
            displayName: fullName,
            photoURL:
              "https://images.pexels.com/photos/6940512/pexels-photo-6940512.jpeg?auto=compress&cs=tinysrgb&w=600",
          });
        })
        .then(() => {
          const userRef = ref(db, `users/${auth.currentUser.uid}`);
          set(userRef, {
            userid: auth.currentUser.uid,
            username: auth.currentUser.displayName || fullName,
            email: auth.currentUser.email || email,
            profile_picture:
              auth.currentUser.photoURL ||
              `https://images.pexels.com/photos/6940512/pexels-photo-6940512.jpeg?auto=compress&cs=tinysrgb&w=600`,
          });
          // send email for autheicate user;
          return sendEmailVerification(auth.currentUser);
        })
        .then((mailData) => {
          // infoToast("🦄mail send sucessfulll Check your email");
          navigate("/");
        })
        .catch((err) => {
          // errorToast(err.code);
        })
        .finally(() => {
          setFullName("");
          setEmail("");
          setPassword("");
        });
    }
    console.log(emailError);
  };

  const handleGoogleSignUp = () => {
    // Handle Google sign up
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((userInfo) => {
        const { user } = userInfo;

        const userRef = ref(db, `users/${auth.currentUser.uid}`);
        set(userRef, {
          userid: auth.currentUser.uid,
          username: auth.currentUser.displayName || fullName,
          email: auth.currentUser.email || email,
          profile_picture:
            auth.currentUser.photoURL ||
            `https://images.pexels.com/photos/6940512/pexels-photo-6940512.jpeg?auto=compress&cs=tinysrgb&w=600`,
        });
      })
      .then(() => {
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
      });
    console.log("Google Sign Up");
  };
  console.log(emailError);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 signupbg">
      <div className="bg-[rgba(255,255,255,0.69)] p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-[#E44332] mb-8">
          Create Account
        </h2>

        <form onSubmit={handleSignUp} className="space-y-6">
          <div>
            <label htmlFor="fullName" className="block text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              className="w-full px-4 py-2 border border-accentMain rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E44332]"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            {fullNameError && (
              <span className="text-red-500 mt-1 block"> {fullNameError}</span>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 border border-accentMain rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E44332]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {emailError && (
              <span className="text-red-500 mt-1 block"> {emailError}</span>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 border border-accentMain rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E44332]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {passwordError && (
              <span className="text-red-500 mt-1 block"> {passwordError}</span>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-[#E44332] text-white py-2 rounded-lg font-semibold hover:bg-[#c43729] transition"
          >
            Sign Up
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center">
          <span className="text-black">or</span>
        </div>
        <p className="mt-5 text-center  ">
          Already Have an Account?{" "}
          <Link to={"/signin"} className="text-red-600  ">
            Sign In
          </Link>
        </p>

        <button
          onClick={handleGoogleSignUp}
          className="w-full mt-6 border border-gray-300 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition"
        >
          <span>
            <FcGoogle />
          </span>
          <span className="font-medium text-gray-700">Sign up with Google</span>
        </button>
      </div>
    </div>
  );
}
