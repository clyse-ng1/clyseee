/** Go back when the app has an in-app history entry; otherwise use a safe route.
 * Prevents deep links and refreshed tabs from navigating out of the application. */
export function goBackOr(navigate, fallback = "/dashboard") {
  const index = window.history.state?.idx;
  if (typeof index === "number" && index > 0) navigate(-1);
  else navigate(fallback, { replace: true });
}
