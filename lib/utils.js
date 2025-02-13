import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function hasRole(user, requiredRoles) {
  if (!user) return false;
  if (typeof requiredRoles === 'string') {
    return user.role === requiredRoles;
  }
  return requiredRoles.includes(user.role);
}

export async function checkRole(req, roles) {
  const { user } = req;
  if (!hasRole(user, roles)) {
    throw new Error('Unauthorized access');
  }
  return true;
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

