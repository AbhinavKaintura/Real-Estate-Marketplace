// pages/properties.tsx
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';
import Image from 'next/image';
import { FaBed, FaBath } from 'react-icons/fa';
import { BiArea } from 'react-icons/bi';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { BsHeart, BsShare, BsFacebook } from 'react-icons/bs';
import Link from 'next/link';

interface Property {
  id: string;
  image: string;
  status: string;
  price: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  beds: number;
  baths: number;
  sqft: number;
  description: string;
}

export default function PropertyListings() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const propertiesCollection = collection(db, 'properties');
        const propertiesSnapshot = await getDocs(propertiesCollection);
        const propertiesList = propertiesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Property[];
        
        setProperties(propertiesList);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching properties:', error);
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Available Properties</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {properties.map((property) => (
          <div key={property.id} className="bg-white rounded-lg overflow-hidden shadow-lg">
            <div className="relative">
              <div className="aspect-w-16 aspect-h-9 relative h-64">
                <Image 
                  src={property.image || '/placeholder-house.jpg'} 
                  alt={`${property.address}`}
                  fill
                  className="object-cover"
                />
              </div>
              
              <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-md text-sm font-semibold">
                {property.status || 'PENDING'}
              </div>
              
              <div className="absolute top-4 right-4 flex space-x-2">
                <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100">
                  <BsHeart className="text-blue-600" size={18} />
                </button>
                <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100">
                  <BsShare className="text-blue-600" size={18} />
                </button>
                <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100">
                  <BsFacebook className="text-blue-600" size={18} />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-800">${property.price.toLocaleString()}</h2>
                <div className="flex items-start mt-2 text-gray-600">
                  <HiOutlineLocationMarker className="mt-1 mr-1 flex-shrink-0" />
                  <p>{property.address}, {property.city}, {property.state} {property.zipCode}</p>
                </div>
              </div>
              
              <div className="flex justify-between border-b pb-4 mb-4">
                <div className="text-center">
                  <p className="text-xl font-semibold">{property.beds}</p>
                  <p className="text-gray-500">beds</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-semibold">{property.baths}</p>
                  <p className="text-gray-500">baths</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-semibold">{property.sqft.toLocaleString()}</p>
                  <p className="text-gray-500">sq ft</p>
                </div>
              </div>
              
              <p className="text-gray-700 line-clamp-4">{property.description}</p>
              
              <Link href={`/properties/${property.id}`}>
                <div className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 text-center cursor-pointer">
                  View Details
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      {properties.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-gray-700">No properties available at the moment</h3>
          <p className="text-gray-500 mt-2">Check back soon for new listings</p>
        </div>
      )}
    </div>
  );
}