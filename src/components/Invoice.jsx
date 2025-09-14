import React from "react";

const Invoice = ({ customerName, items }) => {
  if (!items || items.length === 0) {
    return <p>No items to display.</p>;
  }

  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="invoice-container p-4 bg-white shadow-md w-full max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Invoice</h1>
      <p><strong>Customer:</strong> {customerName}</p>

      <table className="w-full mt-4 border-collapse border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border">Item</th>
            <th className="p-2 border">Qty</th>
            <th className="p-2 border">Price</th>
            <th className="p-2 border">Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td className="p-2 border">{item.name}</td>
              <td className="p-2 border">{item.qty}</td>
              <td className="p-2 border">{item.price}</td>
              <td className="p-2 border">{item.price * item.qty}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="text-xl font-bold mt-4">Total: {total}</h2>

      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded no-print"
        onClick={() => window.print()}
      >
        Print Invoice
      </button>
    </div>
  );
};

export default Invoice;
