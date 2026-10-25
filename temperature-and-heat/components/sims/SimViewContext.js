"use client";

// Which simulation a SimFrame belongs to, and its optional 3D scene loader.
// Provided by SimHost from the registry; SimFrame renders without it too.
import { createContext } from "react";

export const SimViewContext = createContext(null);
