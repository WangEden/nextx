"use client"
import { useState } from "react";

export default function DashboardTemplate({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [count, setCount] = useState(0)

  return (
    <div>
      <div className="border-2 border-dashed border-black p-4 mx-auto mt-10">
        <h2>Dashboard Template {count}</h2>
        <button className="bg-black text-white p-2 my-4 rounded-md" onClick={() => setCount(count + 1)}>Increment</button>
        {children}  
      </div>      
    </div>
  )
}
