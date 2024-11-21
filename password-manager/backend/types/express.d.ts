declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string; // Declaramos el ID como string
      };
    }
  }
}

export {}; // Esto es necesario para que TypeScript trate este archivo como un módulo
