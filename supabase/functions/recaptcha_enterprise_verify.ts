import { serve } from "jsr:@supabase/functions-js";

/**
 * Nomes de ação recomendados pelo Google para o reCAPTCHA Enterprise:
 * - signup: Inscreva-se no site
 * - login: Faça login no site
 * - password_reset: Solicitação para redefinir a senha
 * - get_price: Busca o preço de um item
 * - cart_add: Adicione itens ao carrinho
 * - cart_view: Confira o conteúdo do carrinho
 * - payment_add: Adicionar ou atualizar informações de pagamento
 * - checkout: Fazer o check-out no site
 * - transaction_confirmed: Confirmação de que uma transação foi processada
 * - play_song: Tocar uma música de uma lista
 * 
 * Fonte: https://cloud.google.com/recaptcha/docs/actions-website
 */

serve(async (req) => {
  // Suporte a preflight CORS
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  try {
    const { token, expectedAction, siteKey } = await req.json();
    if (!token || !siteKey) {
      return new Response(JSON.stringify({ success: false, error: "Token ou siteKey ausente" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    }
    
    // Validar se a ação esperada é uma das recomendadas
    const recommendedActions = [
      "signup", "login", "password_reset", "get_price", 
      "cart_add", "cart_view", "payment_add", "checkout", 
      "transaction_confirmed", "play_song"
    ];
    
    const action = expectedAction || "login";
    console.log(`Ação recebida: ${action}, é recomendada: ${recommendedActions.includes(action)}`);
    
    const apiKey = Deno.env.get("RECAPTCHA_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ success: false, error: "API_KEY não configurada" }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    }
    const projectId = "farmand";
    const url = `https://recaptchaenterprise.googleapis.com/v1/projects/${projectId}/assessments?key=${apiKey}`;
    const body = {
      event: {
        token,
        expectedAction: action,
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
      return new Response(JSON.stringify({ success: false, error: googleData.error?.message || "Erro na validação Enterprise" }), {
        status: 403,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    }
    return new Response(JSON.stringify({ success: true, ...googleData }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  } catch (e) {
    return new Response(JSON.stringify({ success: false, error: e.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }
});
