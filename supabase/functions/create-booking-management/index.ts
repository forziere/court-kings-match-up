import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get user from JWT token
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Token di accesso richiesto' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Token non valido' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // GET - Recupera prenotazioni
    if (req.method === 'GET') {
      const url = new URL(req.url)
      const facilityId = url.searchParams.get('facility_id')
      const date = url.searchParams.get('date')

      if (facilityId && date) {
        // Controlla disponibilità per un campo specifico
        const { data: bookings } = await supabase
          .from('bookings')
          .select('start_time, end_time, status')
          .eq('facility_id', facilityId)
          .eq('booking_date', date)
          .neq('status', 'cancelled')
          .order('start_time')

        // Orari standard (9:00 - 22:00)
        const standardSlots = [
          { inizio: '09:00', fine: '10:30' },
          { inizio: '10:30', fine: '12:00' },
          { inizio: '12:00', fine: '13:30' },
          { inizio: '14:00', fine: '15:30' },
          { inizio: '15:30', fine: '17:00' },
          { inizio: '17:00', fine: '18:30' },
          { inizio: '18:30', fine: '20:00' },
          { inizio: '20:00', fine: '21:30' }
        ];

        const bookedTimes = bookings?.map(b => b.start_time) || []
        const availableSlots = standardSlots.filter(slot => 
          !bookedTimes.includes(slot.inizio)
        )

        return new Response(
          JSON.stringify({
            disponibili: availableSlots,
            prenotati: bookings || []
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      } else {
        // Recupera tutte le prenotazioni dell'utente
        const { data: userBookings } = await supabase
          .from('bookings')
          .select(`
            *,
            sports_facilities(name, sport, location)
          `)
          .eq('user_id', user.id)
          .gte('booking_date', new Date().toISOString().split('T')[0])
          .order('booking_date')
          .order('start_time')

        return new Response(
          JSON.stringify(userBookings || []),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // POST - Crea nuova prenotazione
    if (req.method === 'POST') {
      const { facility_id, booking_date, start_time, end_time, notes } = await req.json()

      console.log('Creating booking:', { facility_id, booking_date, start_time, end_time, user_id: user.id })

      // Validazione input
      if (!facility_id || !booking_date || !start_time || !end_time) {
        return new Response(
          JSON.stringify({ error: 'Dati prenotazione incompleti' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Verifica disponibilità
      const { data: conflicts } = await supabase
        .from('bookings')
        .select('id')
        .eq('facility_id', facility_id)
        .eq('booking_date', booking_date)
        .neq('status', 'cancelled')
        .or(`and(start_time.lte.${start_time},end_time.gt.${start_time}),and(start_time.lt.${end_time},end_time.gte.${end_time})`)

      if (conflicts && conflicts.length > 0) {
        return new Response(
          JSON.stringify({ error: 'Orario non disponibile' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Recupera info campo per calcolare prezzo
      const { data: facility } = await supabase
        .from('sports_facilities')
        .select('price_per_hour, base_price_per_30min')
        .eq('id', facility_id)
        .single()

      if (!facility) {
        return new Response(
          JSON.stringify({ error: 'Campo non trovato' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Calcola durata e prezzo (assumendo slot da 1.5 ore)
      const basePrice = facility.base_price_per_30min || 1500 // 15 euro per 30 min
      const totalAmount = basePrice * 3 // 1.5 ore = 3 slot da 30 min

      // Crea prenotazione
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          user_id: user.id,
          facility_id,
          booking_date,
          start_time,
          end_time,
          booking_time: start_time,
          amount: totalAmount,
          total_amount: totalAmount,
          status: 'pending',
          duration_minutes: 90,
          extras_selected: []
        })
        .select()
        .single()

      if (bookingError) {
        console.error('Booking creation error:', bookingError)
        return new Response(
          JSON.stringify({ error: 'Errore nella creazione prenotazione' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ 
          booking,
          message: 'Prenotazione creata con successo' 
        }),
        { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // PUT - Aggiorna prenotazione
    if (req.method === 'PUT') {
      const url = new URL(req.url)
      const bookingId = url.searchParams.get('id')
      const { status, notes } = await req.json()

      if (!bookingId) {
        return new Response(
          JSON.stringify({ error: 'ID prenotazione richiesto' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Verifica che la prenotazione appartenga all'utente
      const { data: booking } = await supabase
        .from('bookings')
        .select('user_id')
        .eq('id', bookingId)
        .single()

      if (!booking || booking.user_id !== user.id) {
        return new Response(
          JSON.stringify({ error: 'Prenotazione non trovata' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Aggiorna prenotazione
      const { data: updatedBooking, error: updateError } = await supabase
        .from('bookings')
        .update({
          status: status || booking.status,
          cancelled_reason: status === 'cancelled' ? notes : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId)
        .select()
        .single()

      if (updateError) {
        return new Response(
          JSON.stringify({ error: 'Errore aggiornamento prenotazione' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({
          booking: updatedBooking,
          message: 'Prenotazione aggiornata con successo'
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Metodo non supportato' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Booking management error:', error)
    return new Response(
      JSON.stringify({ error: 'Errore interno del server' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})