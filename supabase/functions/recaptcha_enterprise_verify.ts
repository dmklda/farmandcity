import { serve } from "jsr:@supabase/functions-js";

serve(async (req) => {
  try {
    const { token, expectedAction, siteKey } = await req.json();
    if (!token || !siteKey) {
      return new Response(JSON.stringify({ success: false, error: "Token ou siteKey ausente" }), { status: 400 });
    }
    const apiKey = Deno.env.get("RECAPTCHA_SECRET_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ success: false, error: "API_KEY não configurada" }), { status: 500 });
    }
    const projectId = "farmand";
    const url = `https://recaptchaenterprise.googleapis.com/v1/projects/${projectId}/assessments?key=${apiKey}`;
    const body = {
      event: {
        token,
        expectedAction: expectedAction || "login",
        siteKey
      }
    };
    const googleRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const googleData = await googleRes.json();
    if (!googleRes.ok) {
      return new Response(JSON.stringify({ success: false, error: googleData.error?.message || "Erro na validação Enterprise" }), { status: 403 });
    }
    return new Response(JSON.stringify({ success: true, ...googleData }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ success: false, error: e.message }), { status: 500 });
  }
});
