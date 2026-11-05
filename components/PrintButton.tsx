'use client';

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="btn-primary"
      aria-label="Print this meeting program"
    >
      Print Program
    </button>
  );
}
