declare module "jsr:@supabase/functions-js" {
  export function serve(handler: (req: Request) => Promise<Response> | Response): void;
}
