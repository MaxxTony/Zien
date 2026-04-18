import { Redirect } from 'expo-router';

export default function AnalyticsRedirect() {
  return <Redirect href={{ pathname: '/(main)/zien-card', params: { s: '/(main)/zien-card/analytics' } }} />;
}
