
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("🔍 Verifica pagamento iniziata");

    const { sessionId } = await req.json();
    
    if (!sessionId) {
      throw new Error("Session ID mancante");
    }

    // Inizializza Stripe
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("Chiave Stripe non configurata");
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Inizializza Supabase
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Configurazione Supabase mancante");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Recupera la sessione da Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    console.log("📄 Sessione Stripe recuperata:", session.payment_status);

    if (session.payment_status === "paid") {
      // Pagamento completato con successo
      const userEmail = session.metadata?.user_email;
      
      if (!userEmail) {
        throw new Error("Email utente non trovata nei metadata");
      }

      // Aggiorna lo stato dell'utente
      const { error: userError } = await supabase
        .from("users")
        .update({
          payment_status: "completed",
          registration_fee_paid: true,
          updated_at: new Date().toISOString(),
        })
        .eq("email", userEmail);

      if (userError) {
        console.error("❌ Errore aggiornamento utente:", userError);
        throw new Error(`Errore database: ${userError.message}`);
      }

      // Registra il pagamento
      const { data: userData } = await supabase
        .from("users")
        .select("id")
        .eq("email", userEmail)
        .single();

      if (userData) {
        const { error: paymentError } = await supabase
          .from("payments")
          .insert({
            user_id: userData.id,
            stripe_payment_intent_id: session.payment_intent,
            amount: 10, // €0.10 in centesimi
            currency: "eur",
            status: "succeeded",
            description: "Quota registrazione SportConnect",
          });

        if (paymentError) {
          console.error("❌ Errore registrazione pagamento:", paymentError);
        }
      }

      console.log("✅ Pagamento verificato e registrato");

      return new Response(
        JSON.stringify({ 
          success: true,
          paymentStatus: "completed",
          message: "Pagamento completato con successo!"
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );

    } else {
      // Pagamento non completato
      return new Response(
        JSON.stringify({ 
          success: false,
          paymentStatus: session.payment_status,
          message: "Pagamento non completato"
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

  } catch (error) {
    console.error("❌ Errore verify-payment:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "Errore interno del server" 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
