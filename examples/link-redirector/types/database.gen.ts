
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
      links: {
        Row: {
          id: number;
          slug: string;
          target_url: string;
          created_at: string | null;
        };
        Insert: {
          id?: number;
          slug: string;
          target_url: string;
          created_at?: string | null;
        };
        Update: {
          id?: number;
          slug?: string;
          target_url?: string;
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
    