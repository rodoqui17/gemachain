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
    <div className="min-h-screen bg-gray-100">
    {/* Header */}
    <header className="bg-blue-900 text-white py-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-3xl font-bold">Minerum</h1>
        <nav>
          <ul className="flex space-x-6">
            <li><a href="#features" className="hover:text-gray-300">Features</a></li>
            <li><a href="#about" className="hover:text-gray-300">About</a></li>
            <li><a href="#contact" className="hover:text-gray-300">Contact</a></li>
          </ul>
        </nav>
      </div>
    </header>
  
    {/* Hero Section */}
    <section className="bg-cover bg-center h-screen flex items-center justify-center text-center" style={{ backgroundImage: 'url("https://example.com/mining-background.jpg")' }}>
      <div className="bg-black bg-opacity-50 p-10 rounded-lg">
        <h1 className="text-5xl font-bold text-white mb-4">Transparency and Traceability in Mining</h1>
        <p className="text-xl text-gray-200 mb-6">Track every step of the minerals from the mine to their final destination.</p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg">Get Started</button>
      </div>
    </section>
  
    {/* Features Section */}
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold mb-10">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-gray-100 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold mb-4">Real-Time Traceability</h3>
            <p>Track the mineral journey from the source to the final buyer in real-time.</p>
          </div>
          <div className="p-6 bg-gray-100 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold mb-4">Secure Blockchain Data</h3>
            <p>We ensure security and transparency through blockchain technology.</p>
          </div>
          <div className="p-6 bg-gray-100 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold mb-4">Origin Certification</h3>
            <p>Get digital certificates to guarantee the legitimate origin of minerals.</p>
          </div>
        </div>
      </div>
    </section>
  
    {/* About Section */}
    <section id="about" className="py-20 bg-gray-200">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold mb-10">About Minerum</h2>
        <p className="text-xl text-gray-700">MinerTrace is the leading mining traceability platform, offering companies, regulators, and consumers the transparency they need to ensure minerals meet all regulatory and ethical standards. Our blockchain-based solution guarantees data security and integrity.</p>
      </div>
    </section>
  
    {/* CTA Section */}
    <section className="py-20 bg-blue-900 text-white">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold mb-10">Ready to enhance transparency?</h2>
        <button
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300"
        onClick={handleLogin}
      >
        Log in
      </button>
      </div>
    </section>
  
    {/* Contact Section */}
    <section id="contact" className="py-20 bg-gray-100">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold mb-10">Contact</h2>
        <p className="text-lg text-gray-700 mb-6">Do you have questions or need more information? Contact us.</p>
        <form className="max-w-lg mx-auto">
          <input className="w-full p-3 mb-4 border border-gray-300 rounded-lg" type="email" placeholder="Your email" />
          <textarea className="w-full p-3 mb-4 border border-gray-300 rounded-lg" placeholder="Your message"></textarea>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg">Send</button>
        </form>
      </div>
    </section>
  
    {/* Footer */}
    <footer className="bg-blue-900 text-white py-4">
      <div className="container mx-auto text-center">
        <p>&copy; 2024 Minerum. All rights reserved.</p>
      </div>
    </footer>
  </div>

  
  
    
  
  );
};

export default LandingPage;
