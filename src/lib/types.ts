export interface User {
  name: string;
  email: string;
}

export interface Message {
  id: string;
  user: User;
  text: string;
  timestamp: number;
  file?: {
    name: string;
    url: string;
    type: string;
  };
}
