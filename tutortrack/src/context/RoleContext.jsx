import { useState } from "react";
import { RoleContext } from "./RoleContextValue.js";

export function RoleProvider({ children }) {
  const [role, setRole] = useState("tutor");

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
}

