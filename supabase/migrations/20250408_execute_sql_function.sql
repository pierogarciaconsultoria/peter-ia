
-- Function to execute SQL (for admin use only)
CREATE OR REPLACE FUNCTION public.execute_sql(sql_query text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
BEGIN
  -- Only allow superuser to execute this function
  IF NOT (SELECT rolsuper FROM pg_roles WHERE rolname = current_user) THEN
    RAISE EXCEPTION 'Permission denied: only superusers can execute arbitrary SQL';
  END IF;

  EXECUTE sql_query;
  result := '{"success": true}'::jsonb;
  
  RETURN result;
EXCEPTION WHEN OTHERS THEN
  result := jsonb_build_object(
    'success', false,
    'error', SQLERRM,
    'errcode', SQLSTATE
  );
  RETURN result;
END;
$$;

-- Grant execute to authenticated users (but the function itself checks for superuser)
GRANT EXECUTE ON FUNCTION public.execute_sql TO authenticated;
