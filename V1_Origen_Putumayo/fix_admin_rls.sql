-- Allow ANY authenticated user to read from admin_users
-- This is temporary for debugging to confirming if RLS is the blocker.
DROP POLICY IF EXISTS "Allow users to read their own admin status" ON public.admin_users;

CREATE POLICY "Allow all authenticated users to read admin_users"
ON public.admin_users
FOR SELECT
TO authenticated
USING (true);
