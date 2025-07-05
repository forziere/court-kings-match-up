import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface DashboardStats {
  ricavi?: any;
  utenti?: any;
  prenotazioni?: any;
  campi?: any;
  statistiche?: any;
  prossime_prenotazioni?: any;
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

    // Get user role
    const { data: userRoles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single()

    const userRole = userRoles?.role || 'user'

    const url = new URL(req.url)
    const dashboardType = url.searchParams.get('type') || 'user'

    console.log(`Dashboard request for user ${user.id} with role ${userRole} requesting ${dashboardType}`)

    let dashboard: DashboardStats = {}

    // ADMIN DASHBOARD
    if (dashboardType === 'admin' && userRole === 'admin') {
      // Ricavi totali
      const { data: payments } = await supabase
        .from('payments')
        .select('amount, created_at')
        .eq('status', 'succeeded')

      const ricaviTotali = payments?.reduce((sum, p) => sum + p.amount, 0) || 0
      const ricaviMese = payments?.filter(p => {
        const paymentDate = new Date(p.created_at)
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        return paymentDate >= thirtyDaysAgo
      }).reduce((sum, p) => sum + p.amount, 0) || 0

      // Utenti registrati dalla tabella users (dati reali)
      const { data: users } = await supabase
        .from('users')
        .select('created_at')

      const totaleUtenti = users?.length || 0
      const nuoviUtentiSettimana = users?.filter(u => {
        const userDate = new Date(u.created_at)
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
        return userDate >= sevenDaysAgo
      }).length || 0

      // Prenotazioni oggi
      const oggi = new Date().toISOString().split('T')[0]
      const { data: bookingsToday } = await supabase
        .from('bookings')
        .select('status')
        .eq('booking_date', oggi)

      const prenotazioniOggi = bookingsToday?.length || 0
      const confermate = bookingsToday?.filter(b => b.status === 'confirmed').length || 0

      // Campi sportivi
      const { data: facilities } = await supabase
        .from('sports_facilities')
        .select('*')

      const totaleCampi = facilities?.length || 0
      const campiAttivi = facilities?.filter(f => !f.name.includes('manutenzione')).length || 0

      dashboard = {
        ricavi: {
          ricavi_totali: ricaviTotali / 100, // Convert from cents
          ricavi_mese: ricaviMese / 100
        },
        utenti: {
          totale_utenti: totaleUtenti,
          nuovi_utenti_settimana: nuoviUtentiSettimana
        },
        prenotazioni: {
          prenotazioni_oggi: prenotazioniOggi,
          confermate_oggi: confermate
        },
        campi: {
          totale_campi: totaleCampi,
          campi_attivi: campiAttivi,
          campi_manutenzione: totaleCampi - campiAttivi
        }
      }
    }

    // GESTORE DASHBOARD
    else if (dashboardType === 'gestore' && (userRole === 'admin' || userRole === 'moderator')) {
      const oggi = new Date().toISOString().split('T')[0]
      
      const { data: todayBookings } = await supabase
        .from('bookings')
        .select(`
          *,
          sports_facilities(name, sport)
        `)
        .eq('booking_date', oggi)
        .order('start_time')

      dashboard = {
        prenotazioni: todayBookings || []
      }
    }

    // UTENTE DASHBOARD
    else {
      // Statistiche utente
      const { data: userStats } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single()

      // Prossime prenotazioni
      const { data: upcomingBookings } = await supabase
        .from('bookings')
        .select(`
          *,
          sports_facilities(name, sport)
        `)
        .eq('user_id', user.id)
        .gte('booking_date', new Date().toISOString().split('T')[0])
        .order('booking_date')
        .order('start_time')
        .limit(5)

      dashboard = {
        statistiche: userStats || {
          games_played: 0,
          wins: 0,
          losses: 0,
          draws: 0,
          elo_rating: 1200
        },
        prossime_prenotazioni: upcomingBookings || []
      }
    }

    return new Response(
      JSON.stringify(dashboard),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Dashboard error:', error)
    return new Response(
      JSON.stringify({ error: 'Errore interno del server' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})