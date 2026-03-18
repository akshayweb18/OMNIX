// import AuthForm from "@/components/chat/AuthForm";

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-linear-to-br from-blue-600 via-purple-600 to-pink-500">
      {/* Animated Background Blobs */}
      <div className="absolute w-125 h-125 bg-blue-400 opacity-30 rounded-full blur-3xl animate-pulse -top-40 -left-40" />
      <div className="absolute w-125 h-125 bg-pink-400 opacity-30 rounded-full blur-3xl animate-pulse -bottom-40 -right-40" />
      {/* Uncomment the line below if AuthForm is ready */}
      {/* <AuthForm /> */}
    </div>
  );
}
