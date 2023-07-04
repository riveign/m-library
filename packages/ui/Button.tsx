"use client";

import * as React from "react";

export const Button = () => {
  return <button onClick={() => alert("boop")}>Boop</button>;
};

// export add fucntion
export const Add = (a: number, b: number) => a + b;
