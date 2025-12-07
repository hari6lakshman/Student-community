import { Timestamp } from "firebase/firestore";

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Student {
  id: string;
  email: string;
  studentName: string;
}

export interface Message {
  id: string;
  studentId: string;
  message: string;
  timestamp: Timestamp;
  fileUrl?: string;
  fileName?: string;
  fileType?: string;
  student?: Student; // For UI display
}
