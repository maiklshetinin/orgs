export interface Address {
  city: string;
  street: string;
  house: string;
}

export interface Organization {
  id: string;
  name: string;
  director: string;
  phone: string;
  address: Address;
}
