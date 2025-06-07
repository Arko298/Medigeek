// This is the Auth Layout 
import { Inter } from "next/font/google";


const inter = Inter({ subsets: ["latin"] });




export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div >
      <div className="min-h-screen w-screen flex items-center justify-center  bg-cover bg-center"
      style={{backgroundImage: "url('/AuthBg/login.jpg')"}}>
      <div className="w-full max-w-md bg-blurred p-6 rounded-md shadow-md">
      {children}
      </div>
      </div>
    </div>
  );
}
