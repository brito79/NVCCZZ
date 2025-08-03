

import OrgClient from "./organizationClient";

// Server-side function to fetch users
async function getUsers(token: string) {
    'use server'
  try {
    const res = await fetch('https://nvccz-pi.vercel.app/api/users', {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      next: { tags: ['users'] }
    });
    const data = await res.json();
    console.log(data);
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

async function updateUser(
    userId: string,
    formData: {
      firstName?: string;
      lastName?: string;
      email?: string;
      roleId?: string;
    }, 
    token: string
  ) {
    'use server'
    try {
      const res = await fetch(`https://nvccz-pi.vercel.app/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      return data;
    } catch (error) {
      console.error('Error updating user:', error);
      return { success: false, error: 'Failed to update user' };
    }
  }
  
  // Server-side function to delete user
  async function deleteUser(userId: string, token: string) {
    'use server'
    try {
      const res = await fetch(`https://nvccz-pi.vercel.app/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });
      const data = await res.json();
      return data;
    } catch (error) {
      console.error('Error deleting user:', error);
      return { success: false, error: 'Failed to delete user' };
    }
  }

// Server-side function to fetch roles
async function getRoles(token: string) {
    'use server'
  try {
    const res = await fetch('https://nvccz-pi.vercel.app/api/roles', {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      next: { tags: ['roles'] }
    });
    const data = await res.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching roles:', error);
    return [];
  }
}

// Server-side function to create user
async function createUser(formData: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roleId: string;
}, token: string) {
'use server'
  try {

    const res = await fetch('https://nvccz-pi.vercel.app/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error creating user:', error);
    return { success: false, error: 'Failed to create user' };
  }
}

// Server-side function to create role
async function createRole(formData: {
  name: string;
  description: string;
  permissions: { name: string; value: boolean }[];
}, token: string) {
    'use server'
  try {
    const res = await fetch('https://nvccz-pi.vercel.app/api/roles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error creating role:', error);
    return { success: false, error: 'Failed to create role' };
  }
}

const Organization = async () => {
  // This is a server component, so we can't access sessionStorage here
  // We'll need to get the token from the client component
  return <OrgClient 
    getUsers={getUsers}
    getRoles={getRoles}
    createUserAction={createUser}
    createRoleAction={createRole}
    updateUserAction={updateUser}
    deleteUserAction={deleteUser}
  />;
}
 
export default Organization;