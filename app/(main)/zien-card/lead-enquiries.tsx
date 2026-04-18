import { Redirect } from 'expo-router';

export default function LeadEnquiriesRedirect() {
  return <Redirect href={{ pathname: '/(main)/zien-card', params: { s: '/(main)/zien-card/lead-enquiries' } }} />;
}
