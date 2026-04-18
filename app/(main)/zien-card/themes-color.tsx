import { Redirect } from 'expo-router';

export default function ThemesColorRedirect() {
  return <Redirect href={{ pathname: '/(main)/zien-card', params: { s: '/(main)/zien-card/themes-color' } }} />;
}
