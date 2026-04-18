import { Redirect, useLocalSearchParams } from 'expo-router';

export default function BasicInformationRedirect() {
  return <Redirect href={{ pathname: '/(main)/zien-card', params: { s: '/(main)/zien-card/basic-information' } }} />;
}
