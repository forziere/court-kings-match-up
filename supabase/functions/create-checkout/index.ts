
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
    console.log("🚀 Creazione checkout Stripe iniziata");

    const { userData } = await req.json();
    console.log("📝 Dati utente ricevuti:", userData);

    if (!userData || !userData.email || !userData.name) {
      throw new Error("Dati utente mancanti");
    }

    // Inizializza Stripe
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("Chiave Stripe non configurata");
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    console.log("✅ Stripe inizializzato");

    // Inizializza Supabase
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Configurazione Supabase mancante");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    console.log("✅ Supabase inizializzato");

    // Controlla se il cliente Stripe esiste già
    const customers = await stripe.customers.list({
      email: userData.email,
      limit: 1,
    });

    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      console.log("👤 Cliente Stripe esistente trovato:", customerId);
    } else {
      // Crea nuovo cliente Stripe
      const customer = await stripe.customers.create({
        email: userData.email,
        name: userData.name,
        metadata: {
          sport: userData.sport,
          level: userData.level,
          city: userData.city || "",
        },
      });
      customerId = customer.id;
      console.log("🆕 Nuovo cliente Stripe creato:", customerId);
    }

    // Crea sessione checkout
    const origin = req.headers.get("origin") || "http://localhost:3000";
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "Registrazione SportConnect",
              description: "Quota di registrazione per accedere alla piattaforma",
            },
            unit_amount: 10, // €0.10 in centesimi
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/payment-canceled`,
      metadata: {
        user_email: userData.email,
        user_name: userData.name,
        sport: userData.sport,
        level: userData.level,
        city: userData.city || "",
      },
    });

    console.log("💳 Sessione checkout creata:", session.id);

    // Salva l'utente nel database con stato pending
    const { error: userError } = await supabase
      .from("users")
      .upsert({
        email: userData.email,
        name: userData.name,
        sport: userData.sport,
        level: userData.level,
        city: userData.city,
        stripe_customer_id: customerId,
        payment_status: "pending",
        registration_fee_paid: false,
      }, { onConflict: 'email' });

    if (userError) {
      console.error("❌ Errore salvataggio utente:", userError);
      throw new Error(`Errore database: ${userError.message}`);
    }

    console.log("✅ Utente salvato nel database");

    return new Response(
      JSON.stringify({ 
        url: session.url,
        sessionId: session.id
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error("❌ Errore create-checkout:", error);
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
