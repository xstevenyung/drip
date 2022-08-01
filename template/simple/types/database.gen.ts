
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {};
    Functions: {};
  };
}


export type TableRow<
  T extends keyof Database["public"]["Tables"],
  P extends keyof Database["public"]["Tables"][T] = "Row",
> = Database["public"]["Tables"][T][P];
    