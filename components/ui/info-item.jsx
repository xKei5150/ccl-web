import {cn} from '@/lib/utils';

export const InfoItem = ({ label, value, className }) => (
    <div
      className={cn(
        "p-4 bg-white/50 backdrop-blur-sm rounded-lg transition-all duration-300 hover:bg-white/60",
        className
      )}
    >
      <dt className="text-sm font-medium text-gray-600 mb-1">{label}</dt>
      <dd className="text-base text-gray-900">{value}</dd>
    </div>
  );