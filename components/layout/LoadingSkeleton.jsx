// components/LoadingSkeleton.js (or .tsx)
import React from 'react';

const LoadingSkeleton = ({ type = 'page' }) => {
  if (type === 'page') {
    return (
      <div className="loading-skeleton">
        <div className="header-skeleton">
          <div className="line-skeleton w-1/4" />
          <div className="line-skeleton w-1/2" />
        </div>
        <div className="content-skeleton">
          <div className="line-skeleton" />
          <div className="line-skeleton" />
          <div className="line-skeleton w-3/4" />
          <div className="line-skeleton" />
          <div className="line-skeleton w-2/3" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          <div className="card-skeleton">
            <div className="image-skeleton" />
            <div className="line-skeleton" />
            <div className="line-skeleton w-3/4" />
          </div>
          <div className="card-skeleton">
            <div className="image-skeleton" />
            <div className="line-skeleton" />
            <div className="line-skeleton w-3/4" />
          </div>
          <div className="card-skeleton">
            <div className="image-skeleton" />
            <div className="line-skeleton" />
            <div className="line-skeleton w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (type === 'card') {
    return (
      <div className="card-skeleton">
        <div className="image-skeleton" />
        <div className="line-skeleton" />
        <div className="line-skeleton w-3/4" />
      </div>
    );
  }
  if (type === 'table') {
    return (
      <table className="w-full">
        <thead>
          <tr>
            <th className="line-skeleton w-1/4"></th>
            <th className="line-skeleton w-1/4"></th>
            <th className="line-skeleton w-1/4"></th>
            <th className="line-skeleton w-1/4"></th>
          </tr>
        </thead>
        <tbody>
          {[...Array(5)].map((_, index) => (
            <tr key={index}>
              <td className="line-skeleton"></td>
              <td className="line-skeleton"></td>
              <td className="line-skeleton"></td>
              <td className="line-skeleton"></td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return (
    <div className="line-skeleton" />
  );
};

export default LoadingSkeleton;