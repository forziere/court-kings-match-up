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
    console.log("🚀 Creazione pagamento prenotazione iniziata");

    const { bookingData } = await req.json();
    console.log("📝 Dati prenotazione ricevuti:", bookingData);

    if (!bookingData || !bookingData.facilityId || !bookingData.date || !bookingData.time) {
      throw new Error("Dati prenotazione mancanti");
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

    // Recupera i dati del campo sportivo
    const { data: facility, error: facilityError } = await supabase
      .from('sports_facilities')
      .select('*')
      .eq('id', bookingData.facilityId)
      .single();

    if (facilityError || !facility) {
      throw new Error("Campo sportivo non trovato");
    }

    // Recupera i dati dell'utente
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', bookingData.userEmail)
      .single();

    if (userError || !user) {
      throw new Error("Utente non trovato");
    }

    // Controlla se il cliente Stripe esiste già
    const customers = await stripe.customers.list({
      email: user.email,
      limit: 1,
    });

    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      console.log("👤 Cliente Stripe esistente trovato:", customerId);
    } else {
      // Crea nuovo cliente Stripe
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
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
              name: `Prenotazione ${facility.name}`,
              description: `${facility.sport} - ${bookingData.date} alle ${bookingData.time}`,
            },
            unit_amount: 50, // 50 centesimi
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/booking-canceled`,
      metadata: {
        facility_id: bookingData.facilityId,
        booking_date: bookingData.date,
        booking_time: bookingData.time,
        user_id: user.id,
      },
    });

    console.log("💳 Sessione checkout creata:", session.id);

    // Crea la prenotazione nel database con stato pending
    const { error: bookingError } = await supabase
      .from("bookings")
      .insert({
        user_id: user.id,
        facility_id: bookingData.facilityId,
        booking_date: bookingData.date,
        booking_time: bookingData.time,
        status: "pending",
        amount: 50,
        stripe_payment_intent_id: session.payment_intent,
      });

    if (bookingError) {
      console.error("❌ Errore creazione prenotazione:", bookingError);
      throw new Error(`Errore database: ${bookingError.message}`);
    }

    console.log("✅ Prenotazione creata nel database");

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
    console.error("❌ Errore create-booking-payment:", error);
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