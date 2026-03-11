import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://byunfekhyjnbwcfriigw.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5dW5mZWtoeWpuYndjZnJpaWd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyMTc5ODksImV4cCI6MjA4ODc5Mzk4OX0.gS9-h6zviXLv1tPdNw8jeu_Re2Vap9oCmqrcilSeUoQ'

export const supabase = createClient(supabaseUrl, supabaseKey)