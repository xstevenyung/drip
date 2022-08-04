export function redirect(url: string, status = 303) {
  return new Response(null, {
    status,
    headers: { "Location": url },
  });
}

export function json(data: object | null) {
  return new Response(data ? JSON.stringify(data) : null, {
    headers: { "Content-Type": "application/json" },
  });
}

export type RedirectBackOptions = {
  fallback: string;
};

export function redirectBack(req: Request, options: RedirectBackOptions) {
  return redirect(req.headers.get("Referer") ?? options.fallback);
}
