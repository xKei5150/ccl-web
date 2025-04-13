"use server";

import { fetchCollection, fetchDocument, createDocument, updateDocument, deleteDocument } from '@/lib/data-fetching';
import { notFound } from 'next/navigation';

/**
 * Fetch businesses with pagination
 * 
 * @param {object} searchParams - Query parameters
 * @returns {Promise<object>} Business records
 */
export async function getBusinesses(searchParams = {}) {
  try {
    const page = Number(searchParams?.page) || 1;
    const limit = Number(searchParams?.limit) || 10;
    const status = searchParams?.status;
    const industry = searchParams?.industry;
    const search = searchParams?.search;
    const sort = searchParams?.sort || '-createdAt';
    
    const queryParams = {
      page,
      limit,
      sort,
    };
    
    if (status) {
      queryParams.filters = { ...queryParams.filters, status };
    }
    
    if (industry) {
      queryParams.filters = { ...queryParams.filters, industry };
    }
    
    if (search) {
      queryParams.search = search;
    }
    
    return fetchCollection('business', queryParams);
  } catch (error) {
    console.error('Error fetching businesses:', error);
    throw error;
  }
}

/**
 * Fetch a single business by ID
 * 
 * @param {string} id - Business ID
 * @returns {Promise<object>} Business record
 */
export async function getBusiness(id) {
  try {
    const business = await fetchDocument('business', id);
    
    if (!business) {
      return notFound();
    }
    
    return business;
  } catch (error) {
    console.error(`Error fetching business ${id}:`, error);
    throw error;
  }
}

/**
 * Create a new business record
 * 
 * @param {FormData} formData - Form data
 * @param {string} redirectPath - Path to redirect after creation
 * @returns {Promise<object>} Created business
 */
export async function createBusiness(formData, redirectPath = '/dashboard/business') {
  const data = Object.fromEntries(formData.entries());
  
  // Convert string date to Date object if present
  if (data.registrationDate) {
    data.registrationDate = new Date(data.registrationDate);
  }
  
  return createDocument('business', data, redirectPath);
}

/**
 * Update a business record
 * 
 * @param {string} id - Business ID
 * @param {FormData} formData - Form data
 * @param {string} redirectPath - Path to redirect after update
 * @returns {Promise<object>} Updated business
 */
export async function updateBusiness(id, formData, redirectPath = '/dashboard/business') {
  const data = Object.fromEntries(formData.entries());
  
  // Convert string date to Date object if present
  if (data.registrationDate) {
    data.registrationDate = new Date(data.registrationDate);
  }
  
  return updateDocument('business', id, data, redirectPath);
}

/**
 * Delete business record(s)
 * 
 * @param {string|string[]} ids - Business ID or array of IDs
 * @returns {Promise<object>} Delete result
 */
export async function deleteBusiness(ids) {
  return deleteDocument('business', ids);
}

// Mock data for development - this would be replaced with actual API calls
const mockBusinesses = [
  {
    id: '1',
    name: 'Acme Corporation',
    industry: 'Technology',
    status: 'Active',
    contactName: 'John Doe',
    phone: '(555) 123-4567',
    email: 'john@acmecorp.com',
    createdAt: '2023-03-15',
  },
  {
    id: '2',
    name: 'Globex Industries',
    industry: 'Manufacturing',
    status: 'Active',
    contactName: 'Jane Smith',
    phone: '(555) 234-5678',
    email: 'jsmith@globex.com',
    createdAt: '2023-02-01',
  },
  {
    id: '3',
    name: 'Oceanic Airlines',
    industry: 'Transportation',
    status: 'Inactive',
    contactName: 'Frank Ocean',
    phone: '(555) 345-6789',
    email: 'f.ocean@oceanic.com',
    createdAt: '2023-01-10',
  },
  {
    id: '4',
    name: 'Stark Industries',
    industry: 'Energy',
    status: 'Pending',
    contactName: 'Tony Stark',
    phone: '(555) 456-7890',
    email: 'tony@stark.com',
    createdAt: '2023-04-20',
  },
  {
    id: '5',
    name: 'Wayne Enterprises',
    industry: 'Finance',
    status: 'Active',
    contactName: 'Bruce Wayne',
    phone: '(555) 567-8901',
    email: 'bruce@wayne.com',
    createdAt: '2023-05-05',
  },
];

/**
 * Fetch all businesses with optional filtering and pagination
 * @param {Object} searchParams - Query parameters for filtering and pagination
 * @returns {Promise<Object>} - Businesses data with pagination info
 */
// export async function getBusinesses(searchParams = {}) {
//   try {
//     // In production, this would be an API call:
//     // const response = await fetch('/api/businesses', { 
//     //   method: 'GET',
//     //   headers: { 'Content-Type': 'application/json' },
//     // });
//     // if (!response.ok) throw new Error('Failed to fetch businesses');
//     // return response.json();

//     // For development, use mock data
//     const page = Number(searchParams?.page) || 1;
//     const limit = Number(searchParams?.limit) || 10;
//     const status = searchParams?.status;
//     const industry = searchParams?.industry;
//     const search = searchParams?.search;
//     const sort = searchParams?.sort || 'createdAt';
//     const order = searchParams?.order || 'desc';
    
//     // Filter data based on parameters
//     let filteredData = [...mockBusinesses];
    
//     if (status) {
//       filteredData = filteredData.filter(
//         (business) => business.status.toLowerCase() === status.toLowerCase()
//       );
//     }
    
//     if (industry) {
//       filteredData = filteredData.filter(
//         (business) => business.industry.toLowerCase() === industry.toLowerCase()
//       );
//     }
    
//     if (search) {
//       const searchTerm = search.toLowerCase();
//       filteredData = filteredData.filter(
//         (business) => 
//           business.name.toLowerCase().includes(searchTerm) ||
//           business.contactName.toLowerCase().includes(searchTerm) ||
//           business.email.toLowerCase().includes(searchTerm)
//       );
//     }
    
//     // Sort data
//     filteredData.sort((a, b) => {
//       const valueA = a[sort];
//       const valueB = b[sort];
      
//       // If sorting by date
//       if (sort === 'createdAt') {
//         return order === 'asc' 
//           ? new Date(valueA) - new Date(valueB)
//           : new Date(valueB) - new Date(valueA);
//       }
      
//       // String comparison for other fields
//       if (order === 'asc') {
//         return valueA.localeCompare(valueB);
//       } else {
//         return valueB.localeCompare(valueA);
//       }
//     });
    
//     // Calculate pagination
//     const offset = (page - 1) * limit;
//     const paginatedData = filteredData.slice(offset, offset + limit);
//     const totalCount = filteredData.length;
//     const totalPages = Math.ceil(totalCount / limit);
    
//     return {
//       data: paginatedData,
//       pagination: {
//         page,
//         limit,
//         totalCount,
//         totalPages,
//         hasNextPage: page < totalPages,
//         hasPrevPage: page > 1,
//       },
//       filters: {
//         status,
//         industry,
//         search,
//         sort,
//         order,
//       },
//     };
//   } catch (error) {
//     console.error('Error fetching businesses:', error);
//     throw error;
//   }
// }
