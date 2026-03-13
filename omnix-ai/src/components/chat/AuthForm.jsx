// "use client";

// import { useState } from "react";

// export default function AuthForm() {
//   const [isLogin, setIsLogin] = useState(true);

//   return (
//     <div className="relative w-full max-w-md">
//       {/* Glass Card */}
//       <div className="backdrop-blur-2xl bg-white/10 dark:bg-neutral-900/40 border border-white/20 dark:border-neutral-700 rounded-3xl shadow-2xl p-8 transition-all duration-500">

//         {/* Toggle Buttons */}
//         <div className="flex mb-8 bg-white/10 dark:bg-neutral-800 rounded-full p-1 relative">
//           <div
//             className={`absolute top-1 bottom-1 w-1/2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 ${
//               isLogin ? "left-1" : "left-1/2"
//             }`}
//           />
//           <button
//             onClick={() => setIsLogin(true)}
//             className={`relative z-10 w-1/2 py-2 text-sm font-medium ${
//               isLogin ? "text-white" : "text-gray-400"
//             }`}
//           >
//             Login
//           </button>
//           <button
//             onClick={() => setIsLogin(false)}
//             className={`relative z-10 w-1/2 py-2 text-sm font-medium ${
//               !isLogin ? "text-white" : "text-gray-400"
//             }`}
//           >
//             Sign Up
//           </button>
//         </div>

//         <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
//           {isLogin ? "Welcome Back 👋" : "Create Account 🚀"}
//         </h2>

//         <form className="space-y-5">
//           {!isLogin && (
//             <input
//               type="text"
//               placeholder="Full Name"
//               className="w-full px-4 py-3 rounded-xl bg-white/20 dark:bg-neutral-800/60 border border-white/20 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-white placeholder-gray-400"
//             />
//           )}

//           <input
//             type="email"
//             placeholder="Email Address"
//             className="w-full px-4 py-3 rounded-xl bg-white/20 dark:bg-neutral-800/60 border border-white/20 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-white placeholder-gray-400"
//           />

//           <input
//             type="password"
//             placeholder="Password"
//             className="w-full px-4 py-3 rounded-xl bg-white/20 dark:bg-neutral-800/60 border border-white/20 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800 dark:text-white placeholder-gray-400"
//           />

//           <button
//             type="submit"
//             className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:scale-105 transition-all duration-300"
//           >
//             {isLogin ? "Login" : "Sign Up"}
//           </button>
//         </form>

//         <p className="text-center text-sm text-gray-400 mt-6">
//           {isLogin ? "Don't have an account?" : "Already have an account?"}
//           <span
//             onClick={() => setIsLogin(!isLogin)}
//             className="ml-1 text-blue-500 cursor-pointer hover:underline"
//           >
//             {isLogin ? "Sign Up" : "Login"}
//           </span>
//         </p>
//       </div>
//     </div>
//   );
// }