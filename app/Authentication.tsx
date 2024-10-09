import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, User } from "firebase/auth";
import UserPanel from "./Dashboard"; // Asegúrate de que la ruta sea correcta

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const LandingPage = () => {
  const [user, setUser] = useState<User | null>(null); // Type user state as User | null

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user); // No more type errors
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user); // Set the user after login
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setUser(null); // Clear the user on logout
    } catch (error) {
      console.error(error);
    }
  };

  return user ? (
    <UserPanel user={user} onLogout={handleLogout} />
  ) : (
    <div className="h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white p-10 rounded-lg shadow-lg w-3/4 max-w-lg flex flex-col items-center">
        <img src="https://media.istockphoto.com/id/489814272/photo/gold-silver-rings-and-chains.jpg?b=1&s=612x612&w=0&k=20&c=0DKm2s37yb8_6LfE9S4AC7qEu1BW_iN-_Q5P90Bn0uU=" alt="Welcome" className="mb-4 w-32 h-32 object-cover rounded-full" />
        <h1>GemaChain</h1>
        <h5 className="text-3xl font-bold text-gray-900 mb-4">Trazabilidad de Joyas</h5>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleLogin}
        >
          Iniciar sesión con Google
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
