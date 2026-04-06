export type Usuario = {
  id: number;
  nombre: string;
  activo: boolean;
  edad: number;
};

export const usuarios: Usuario[] = [
  { id: 1, nombre: "Ana", activo: true, edad: 21 },
  { id: 2, nombre: "Luis", activo: false, edad: 16 },
  { id: 3, nombre: "Marta", activo: true, edad: 34 },
  { id: 4, nombre: "Diego", activo: true, edad: 27 },
];
