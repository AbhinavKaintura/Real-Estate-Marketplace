import Link from "next/link";
import img from '../../../public/hero-img.jpg'

export default function Maintenance() {
  return (
    <div className="h-screen w-screen bg-cover bg-center" style={{ backgroundImage: `url(${img.src})` }}>
      {/* Dark overlay for better text readability */}
      <div className="h-screen w-full bg-black bg-opacity-40 flex flex-col">
        {/* Header */}
        <header className="px-8 py-6">
          <h1 className="text-3xl font-bold text-white">ENDURANCE ESTATES</h1>
        </header>
        
        {/* Main content */}
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <h2 className="text-5xl md:text-6xl text-white font-bold mb-4 text-center">
            PROPERTY MAINTENANCE
          </h2>
          
          <p className="text-2xl md:text-3xl text-white mb-12 text-center">
            Select your role
          </p>
          
          {/* Very large buttons */}
          <div className="w-full max-w-5xl flex flex-col md:flex-row gap-8 px-4">
            <Link href="/tenant-maintainance" className="w-full">
              <button className="w-full h-40 md:h-64 bg-white bg-opacity-90 hover:bg-opacity-100 transition-all duration-300 rounded-lg shadow-2xl transform hover:scale-105">
                <span className="text-4xl md:text-6xl font-bold text-gray-800 block mb-4">TENANT</span>
                <span className="text-xl md:text-2xl text-gray-600">Report an issue</span>
              </button>
            </Link>
            
            <Link href="/owner" className="w-full">
              <button className="w-full h-40 md:h-64 bg-gray-800 bg-opacity-90 hover:bg-opacity-100 transition-all duration-300 rounded-lg shadow-2xl transform hover:scale-105">
                <span className="text-4xl md:text-6xl font-bold text-white block mb-4">OWNER</span>
                <span className="text-xl md:text-2xl text-gray-300">Manage properties</span>
              </button>
            </Link>
          </div>
          
          {/* Footer similar to the image's tagline */}
          <p className="text-white text-xl mt-16 text-center">
            Excellence in property management. Let's get started.
          </p>
        </div>
      </div>
    </div>
  );
}
