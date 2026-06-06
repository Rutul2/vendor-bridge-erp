// src/components/LoadingSpinner.jsx

export default function LoadingSpinner({ text = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-10 h-10 border-4 border-border border-t-primary-500 rounded-full animate-spin" />
      <p className="text-sm text-textMuted mt-4">{text}</p>
    </div>
  );
}
