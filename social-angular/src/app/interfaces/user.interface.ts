export interface User {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  age: number;
  image: string;
  address: {
    city: string;
    country: string;
  };
  company: {
    name: string;
    title: string;
  };
}
