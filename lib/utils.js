import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function hasRole(user, allowedRoles) {
  if (!user || !user.role) return false;
  return Array.isArray(allowedRoles) 
    ? allowedRoles.includes(user.role) 
    : allowedRoles === user.role;
}

export async function checkRole(req, roles) {
  const { user } = req;
  if (!hasRole(user, roles)) {
    throw new Error('Unauthorized access');
  }
  return true;
}

export function checkAccess(user, resource, action) {
  if (!user) return false;

  const rolePermissions = {
    admin: ['read', 'write', 'delete'],
    staff: ['read', 'write'],
    citizen: ['read'],
  };

  const userPermissions = rolePermissions[user.role] || [];
  return userPermissions.includes(action);
}

export function validatePathAccess(pathname, role, protectedPaths, allowedPaths) {
  // Handle public routes
  if (!role) return false;

  // Special handling for citizen role
  if (role === 'citizen') {
    // Only allow exact matches or subdirectories of allowed paths
    return allowedPaths.some(path => 
      pathname === path || pathname.startsWith(`${path}/`)
    );
  }

  // For admin and staff roles
  const protectedPath = Object.keys(protectedPaths).find(path => 
    pathname.startsWith(path)
  );

  if (!protectedPath) return true;
  return protectedPaths[protectedPath].includes(role);
}

export function serialize(content) {
  if (!content || !Array.isArray(content)) return '';
  
  return content.map(node => {
    if (node.type === 'paragraph') {
      return `<p>${node.children.map(child => {
        if (child.text) {
          let text = child.text;
          if (child.bold) text = `<strong>${text}</strong>`;
          if (child.italic) text = `<em>${text}</em>`;
          if (child.underline) text = `<u>${text}</u>`;
          if (child.code) text = `<code>${text}</code>`;
          return text;
        }
        return '';
      }).join('')}</p>`;
    }
    
    if (node.type === 'heading') {
      const level = node.level || 1;
      return `<h${level}>${node.children.map(child => child.text).join('')}</h${level}>`;
    }

    if (node.type === 'list') {
      const tag = node.listType === 'ordered' ? 'ol' : 'ul';
      return `<${tag}>${node.children.map(item => 
        `<li>${item.children.map(child => child.text).join('')}</li>`
      ).join('')}</${tag}>`;
    }

    if (node.type === 'upload' && node.value?.url) {
      return `<img src="${node.value.url}" alt="${node.value.alt || ''}" />`;
    }

    if (node.type === 'link') {
      return `<a href="${node.url}" ${node.newTab ? 'target="_blank" rel="noopener noreferrer"' : ''}>${
        node.children.map(child => child.text).join('')
      }</a>`;
    }

    return '';
  }).join('\n');
}

