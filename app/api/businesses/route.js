import { NextResponse } from 'next/server';

// Mock data for demonstration
const mockBusinesses = Array(50).fill(null).map((_, i) => ({
  id: `bus-${i + 1}`,
  name: `Business ${i + 1}`,
  industry: ['Technology', 'Healthcare', 'Finance', 'Retail', 'Manufacturing'][Math.floor(Math.random() * 5)],
  status: ['Active', 'Pending', 'Inactive', 'Under Review'][Math.floor(Math.random() * 4)],
  contact: `contact${i + 1}@example.com`,
  lastUpdated: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
}));

export async function GET(request) {
  try {
    // Get URL parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const industry = searchParams.get('industry') || '';
    const status = searchParams.get('status') || '';
    const search = searchParams.get('search') || '';

    // Apply filters
    let filteredData = [...mockBusinesses];
    
    if (industry) {
      filteredData = filteredData.filter(b => b.industry === industry);
    }
    
    if (status) {
      filteredData = filteredData.filter(b => b.status === status);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      filteredData = filteredData.filter(b => 
        b.name.toLowerCase().includes(searchLower) || 
        b.contact.toLowerCase().includes(searchLower)
      );
    }

    // Calculate pagination
    const total = filteredData.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const paginatedData = filteredData.slice(offset, offset + limit);

    // Return data with pagination info
    return NextResponse.json({
      data: paginatedData,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    });
  } catch (error) {
    console.error("Error fetching businesses:", error);
    return NextResponse.json(
      { error: "Failed to fetch businesses" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    
    // In a real application, this would create a new business in the database
    // For now, we just return a mock success response with the data
    return NextResponse.json({ 
      message: "Business created successfully",
      data: {
        id: `bus-${mockBusinesses.length + 1}`,
        ...data,
        lastUpdated: new Date().toISOString()
      }
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating business:", error);
    return NextResponse.json(
      { error: "Failed to create business" },
      { status: 500 }
    );
  }
} 