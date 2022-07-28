export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      polls: {
        Row: {
          id: number;
          question: string;
          created_at: string | null;
        };
        Insert: {
          id?: number;
          question: string;
          created_at?: string | null;
        };
        Update: {
          id?: number;
          question?: string;
          created_at?: string | null;
        };
      };
      votes: {
        Row: {
          id: number;
          poll_id: number;
          answer: string;
          created_at: string | null;
        };
        Insert: {
          id?: number;
          poll_id: number;
          answer: string;
          created_at?: string | null;
        };
        Update: {
          id?: number;
          poll_id?: number;
          answer?: string;
          created_at?: string | null;
        };
      };
    };
    Functions: {};
  };
}

export type TableRow<
  T extends keyof Database["public"]["Tables"],
  P extends keyof Database["public"]["Tables"][T] = "Row",
> = Database["public"]["Tables"][T][P];
